import { GoogleGenerativeAI } from "@google/generative-ai"
import type { Language } from "@/lib/types"
import { logger } from "@/lib/utils/logger"

/**
 * AI Service using Google Gemini API
 *
 * STRICT USAGE CONSTRAINTS (SIH 25104 Compliance):
 * ================================================
 *
 * Gemini is used ONLY for:
 * 1. Language translation (input & output)
 * 2. Intent classification on English text only
 * 3. Multi-turn context interpretation
 * 4. Rephrasing responses
 *
 * Gemini is NEVER used for:
 * - Answering user questions directly
 * - Inventing policies or academic information
 * - Bypassing the database
 *
 * MANDATORY MULTILINGUAL FLOW:
 * ===========================
 * 1. User Input (any language)
 *    ↓
 * 2. Translate to English (Gemini API) - IF not English
 *    ↓
 * 3. Analyze Intent on English translation (Gemini API)
 *    ↓
 * 4. Database Lookup (FAQ / Campus Data) using English text
 *    ↓
 * 5. Generate Response in English
 *    ↓
 * 6. Translate Response to User Language (Gemini API) - IF not English
 *    ↓
 * 7. Return to User
 *
 * All factual answers MUST come from MongoDB, sourced from:
 * - FAQs (admin-verified)
 * - Circulars (official documents)
 * - Admin-verified content
 */

// Configure Gemini with strict safety and behavior settings
const generationConfig = {
  temperature: 0.3, // Low temperature for consistent, predictable outputs
  topK: 20,
  topP: 0.8,
  maxOutputTokens: 500,
}

// Safety settings to prevent inappropriate content
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
]

interface IntentAnalysis {
  intent: string
  category: "fees" | "timetable" | "scholarships" | "circulars" | "general"
  keywords: string[]
  translatedQuery: string // Query in English (for FAQ matching)
  confidence: number // Confidence score for intent classification
}

interface ContextAnalysis {
  mainTopic: string
  referencedEntities: string[] // Previous topics mentioned in conversation
  requiresClarification: boolean
  suggestedFollowUps: string[]
}

if (!process.env.GEMINI_API_KEY) {
  logger.warn("GEMINI_API_KEY is not set. AI features will not work.")
}

const geminiApiKey = process.env.GEMINI_API_KEY || ""
if (!geminiApiKey) {
  console.error("[AI Service] CRITICAL: GEMINI_API_KEY is undefined - translation will fail!")
} else {
  console.log("[AI Service] GEMINI_API_KEY is loaded (length: " + geminiApiKey.length + ")")
}

const genAI = new GoogleGenerativeAI(geminiApiKey)

/**
 * STEP 0: Translate user input to English (IF not already English)
 * ================================================================
 * This is the FIRST step in the pipeline.
 * Non-English queries MUST be translated to English before any processing.
 *
 * Purpose: Convert user input to English for:
 * - Intent detection
 * - FAQ matching
 * - Database queries
 */
export async function translateInputToEnglish(text: string, sourceLanguage: Language): Promise<string> {
  // If already English, no translation needed
  if (sourceLanguage === "en") return text

  const hasApiKey = !!process.env.GEMINI_API_KEY
  console.log(`[v0] translateInputToEnglish called: language=${sourceLanguage}, hasApiKey=${hasApiKey}`)

  if (!process.env.GEMINI_API_KEY) {
    console.error("[v0] GEMINI_API_KEY is missing! Translation cannot proceed.")
    logger.warn("Cannot translate input without Gemini API key, using original text")
    return text
  }

  const languageNames: Record<Language, string> = {
    en: "English",
    hi: "Hindi (Devanagari script)",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
    mr: "Marathi (Devanagari script)",
  }

  try {
    const prompt = `Translate this user query from ${languageNames[sourceLanguage]} to English.

User query in ${languageNames[sourceLanguage]}:
"${text}"

CRITICAL RULES:
1. Preserve the exact meaning and intent
2. Do NOT add explanations or interpretations
3. Translate idioms to their English equivalents
4. Keep technical terms as they are (e.g., "semester", "fee")
5. Provide ONLY the English translation, nothing else

English translation:`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        ...generationConfig,
        temperature: 0.2,
      },
      safetySettings,
    })

    console.log("[v0] Calling Gemini API for input translation...")
    const result = await model.generateContent(prompt)
    const translation = result.response.text().trim()

    console.log("[v0] Gemini translation received:", {
      original: text.substring(0, 30),
      translated: translation.substring(0, 30),
    })

    if (translation && translation.length > 0) {
      logger.debug("[v0] Input translated", {
        sourceLanguage,
        original: text.substring(0, 50),
        translated: translation.substring(0, 50),
      })
      return translation
    }

    logger.warn("[v0] Translation returned empty, using original text")
    return text
  } catch (error) {
    console.error("[v0] Translation error:", error)
    logger.error("[AI Service] Input translation failed:", error)
    return text
  }
}

/**
 * STEP 1: Analyze user query to understand intent and extract keywords
 * ====================================================================
 * This step MUST work on English text only (from Step 0 translation)
 *
 * Purpose: Extract structured information from English query to enable
 * accurate FAQ matching. Does NOT generate answers.
 */
export async function analyzeIntent(
  query: string, // MUST be English (already translated if needed)
  language: Language,
  conversationHistory?: Array<{ role: string; content: string }>,
): Promise<IntentAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    logger.warn("Gemini API key missing, using fallback intent")
    return createFallbackIntent(query)
  }

  try {
    const contextText =
      conversationHistory
        ?.slice(-3) // Last 3 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n") || ""

    const prompt = `You are an intent classifier for a college chatbot. Your job is ONLY to analyze the query structure, NOT to answer it.

${contextText ? `Previous conversation:\n${contextText}\n\n` : ""}Current Query (in English): "${query}"

STRICT CATEGORY RULES - Follow these EXACTLY:

1. "fees" category - ONLY when query is about:
   - semester fees, tuition fees, course fees, program fees
   - "how much is the fee", "what is the cost", "fee structure"
   - DO NOT confuse with scholarship fees
   
2. "timetable" category - ONLY when query is about:
   - exam timetable, exam schedule, class schedule
   - "when are exams", "exam dates", "timetable"
   
3. "circulars" category - ONLY when query is about:
   - notices, circulars, announcements, notifications
   - "latest circular", "new notices"
   
4. "scholarships" category - ONLY when query is about:
   - scholarship information, eligibility, application
   - "available scholarships", "how to apply for scholarship"
   - DO NOT use this for fee-related queries
   
5. "general" category - everything else

EXAMPLES:
- "What are the semester fees?" → fees
- "Show me exam timetable" → timetable  
- "Latest circulars" → circulars
- "Available scholarships?" → scholarships
- "How to apply for scholarship" → scholarships

Respond with JSON only:
{
  "intent": "brief description of what user wants to know",
  "category": "one of: fees, timetable, scholarships, circulars, general",
  "keywords": ["3-5 relevant keywords for matching"],
  "confidence": 0.85
}

Remember: Be STRICT with categories. Use the examples above as reference.`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    })

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    logger.debug("[v0] Gemini raw response:", { content: response.substring(0, 100) })

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      logger.debug("[v0] Parsed intent analysis:", analysis)

      return {
        intent: analysis.intent || "general query",
        category: analysis.category || "general",
        keywords: analysis.keywords || query.toLowerCase().split(" ").slice(0, 5),
        translatedQuery: query, // This is already English from Step 0
        confidence: analysis.confidence || 0.5,
      }
    }

    return createFallbackIntent(query)
  } catch (error) {
    logger.error("[AI Service] Intent analysis failed:", error)
    return createFallbackIntent(query)
  }
}

/**
 * STEP 2: Analyze conversation context for multi-turn understanding
 * ==================================================================
 * Purpose: Understand references to previous messages to improve FAQ matching
 * Example: "What about the deadline?" requires knowing what was discussed before
 */
export async function analyzeContext(
  conversationHistory: Array<{ role: string; content: string; language: string }>,
): Promise<ContextAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    return createFallbackContext()
  }

  try {
    const contextText = conversationHistory
      .slice(-5) // Last 5 messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const prompt = `Analyze this conversation context to help with FAQ matching. Do NOT answer questions.

Conversation:
${contextText}

Provide JSON only:
{
  "mainTopic": "primary topic being discussed",
  "referencedEntities": ["fees", "deadlines", "etc"],
  "requiresClarification": false,
  "suggestedFollowUps": ["related question 1", "related question 2"]
}

Focus on identifying topics and entities, NOT on providing answers.`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    })

    const result = await model.generateContent(prompt)
    const content = result.response.text()

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return createFallbackContext()
  } catch (error) {
    logger.error("[AI Service] Context analysis failed:", error)
    return createFallbackContext()
  }
}

/**
 * STEP 3: Translate FAQ answer to user's preferred language
 * ===========================================================
 * This happens AFTER database lookup, using verified data only
 *
 * Purpose: Make verified English answers accessible in user's language
 */
export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  // No translation needed for English
  if (targetLanguage === "en") return text

  if (!process.env.GEMINI_API_KEY) {
    logger.warn("Cannot translate without Gemini API key")
    return text
  }

  const languageNames: Record<Language, string> = {
    en: "English",
    hi: "Hindi (Devanagari script)",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
    mr: "Marathi (Devanagari script)",
  }

  try {
    const prompt = `Translate this verified college information to ${languageNames[targetLanguage]}.

IMPORTANT: This is official college information. Translate accurately without adding or removing information.

English text:
${text}

CRITICAL RULES:
1. Preserve exact meaning and all details
2. Do NOT add explanations or new information
3. Use professional terminology appropriate for college information
4. Maintain the structure and formatting of the original
5. Provide ONLY the translation, no explanations

${languageNames[targetLanguage]} translation:`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        ...generationConfig,
        temperature: 0.2,
      },
      safetySettings,
    })

    const result = await model.generateContent(prompt)
    const translation = result.response.text().trim()

    // Basic validation - ensure translation isn't empty
    if (translation && translation.length > 0) {
      logger.debug("[v0] Output translated", { targetLanguage })
      return translation
    }

    logger.warn("[v0] Translation returned empty, using original text")
    return text // Return original if translation fails
  } catch (error) {
    logger.error("[AI Service] Translation failed:", error)
    return text // Return original text on error
  }
}

/**
 * STEP 4: Rephrase response for natural conversation flow
 * ========================================================
 * This happens AFTER FAQ answer is retrieved, to make it conversational
 *
 * Purpose: Make verified answers sound natural without changing facts
 */
export async function rephraseResponse(answer: string, query: string, language: Language): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return answer
  }

  try {
    const prompt = `Rephrase this verified college information to sound natural and conversational.

User asked: "${query}"
Verified answer: "${answer}"
Language: ${language}

CRITICAL RULES:
1. Keep ALL factual information EXACTLY as provided
2. Do NOT add new information
3. Do NOT remove any details
4. Only improve conversational flow and tone
5. Maintain professional, helpful tone

Provide ONLY the rephrased answer, nothing else.`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        ...generationConfig,
        temperature: 0.4,
      },
      safetySettings,
    })

    const result = await model.generateContent(prompt)
    const rephrased = result.response.text().trim()

    // Validation: ensure rephrased version isn't too different in length
    const lengthRatio = rephrased.length / answer.length
    if (lengthRatio > 0.5 && lengthRatio < 2.0) {
      return rephrased
    }

    return answer // Return original if rephrasing seems off
  } catch (error) {
    logger.error("[AI Service] Rephrasing failed:", error)
    return answer // Return original answer on error
  }
}

/**
 * Detect language of user query
 * Helps identify if input is in a supported language
 */
export async function detectLanguage(text: string): Promise<Language> {
  if (!process.env.GEMINI_API_KEY) {
    return "en"
  }

  try {
    const prompt = `Detect the language of this text. Respond with ONLY the language code.

Text: "${text}"

Respond with one of: en, hi, ta, te, bn, mr

If you cannot identify, respond with: en

Just the code, nothing else.`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 10,
      },
      safetySettings,
    })

    const result = await model.generateContent(prompt)
    const detected = result.response.text().trim().toLowerCase()

    const validLanguages: Language[] = ["en", "hi", "ta", "te", "bn", "mr"]
    if (validLanguages.includes(detected as Language)) {
      return detected as Language
    }

    return "en" // Default to English
  } catch (error) {
    logger.error("[AI Service] Language detection failed:", error)
    return "en"
  }
}

// Helper functions for fallback scenarios

const CATEGORY_KEYWORDS_MULTILINGUAL = {
  fees: {
    en: ["semester fee", "tuition", "course fee", "program fee", "fee", "how much", "cost", "fees"],
    hi: ["सेमेस्टर फीस", "शुल्क", "फीस", "कितना", "ट्यूशन", "फीस क्या है", "कितनी फीस", "फीस कितनी"],
    ta: ["கட்டணம்", "செமஸ்டர் கட்டணம்", "பணம்", "எவ்வளவு"],
    te: ["ఫీజు", "సెమిస్టర్ ఫీజు", "ఎంత", "ఖర్చు"],
    bn: ["ফি", "সেমিস্টার ফি", "কত", "খরচ"],
    mr: ["फी", "सेमेस्टर फी", "किती", "शुल्क"],
  },
  timetable: {
    en: ["exam timetable", "exam schedule", "timetable", "schedule", "exam date", "when are exams", "exam"],
    hi: ["परीक्षा", "समय सारणी", "टाइमटेबल", "परीक्षा कब", "एग्जाम", "परीक्षा की तारीख"],
    ta: ["தேர்வு", "நேர அட்டவணை", "தேர்வு அட்டவணை", "எப்போது"],
    te: ["పరీక్ష", "టైమ్‌టేబుల్", "షెడ్యూల్", "ఎప్పుడు"],
    bn: ["পরীক্ষা", "সময়সূচী", "টাইমটেবিল", "কবে"],
    mr: ["परीक्षा", "वेळापत्रक", "टाइमटेबल", "कधी"],
  },
  circulars: {
    en: ["circular", "notice", "announcement", "notification", "latest circular"],
    hi: ["परिपत्र", "नोटिस", "घोषणा", "सूचना", "सर्कुलर"],
    ta: ["சுற்றறிக்கை", "அறிவிப்பு", "நோட்டீஸ்"],
    te: ["సర్కులర్", "నోటీసు", "ప్రకటన"],
    bn: ["সার্কুলার", "নোটিশ", "ঘোষণা"],
    mr: ["परिपत्रक", "नोटीस", "घोषणा"],
  },
  scholarships: {
    en: ["scholarship", "financial aid", "merit", "post-matric", "minority scholarship"],
    hi: ["छात्रवृत्ति", "स्कॉलरशिप", "वित्तीय सहायता", "मेरिट", "पोस्ट मैट्रिक"],
    ta: ["உதவித்தொகை", "ஸ்காலர்ஷிப்", "நிதி உதவி"],
    te: ["స్కాలర్‌షిప్", "ఉపకార వేతనం", "ఆర్థిక సహాయం"],
    bn: ["বৃত্তি", "স্কলারশিপ", "ర্থিক সাহায্য"],
    mr: ["शिष्यवृत्ती", "स्कॉलरशिप", "ర్థిక మదత"],
  },
}

/**
 * Detect category from query in ANY supported language
 * This is crucial for proper intent routing when translation fails
 */
function detectCategoryFromMultilingualQuery(query: string): {
  category: "fees" | "timetable" | "scholarships" | "circulars" | "general"
  confidence: number
} {
  const queryLower = query.toLowerCase().trim()

  // Check fees keywords first (highest priority)
  for (const keywords of Object.values(CATEGORY_KEYWORDS_MULTILINGUAL.fees)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        return { category: "fees", confidence: 0.9 }
      }
    }
  }

  // Check timetable keywords
  for (const keywords of Object.values(CATEGORY_KEYWORDS_MULTILINGUAL.timetable)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        return { category: "timetable", confidence: 0.9 }
      }
    }
  }

  // Check circulars keywords
  for (const keywords of Object.values(CATEGORY_KEYWORDS_MULTILINGUAL.circulars)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        return { category: "circulars", confidence: 0.9 }
      }
    }
  }

  // Check scholarships keywords (lowest priority among specific categories)
  for (const keywords of Object.values(CATEGORY_KEYWORDS_MULTILINGUAL.scholarships)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        return { category: "scholarships", confidence: 0.9 }
      }
    }
  }

  return { category: "general", confidence: 0.3 }
}

function createFallbackIntent(query: string): IntentAnalysis {
  const queryLower = query.toLowerCase().trim()

  const multilingualResult = detectCategoryFromMultilingualQuery(query)
  if (multilingualResult.category !== "general") {
    logger.debug("[v0] Fallback intent using multilingual detection", {
      category: multilingualResult.category,
      confidence: multilingualResult.confidence,
    })
    return {
      intent: `${multilingualResult.category} query`,
      category: multilingualResult.category,
      keywords: query
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 2)
        .slice(0, 5),
      translatedQuery: query,
      confidence: multilingualResult.confidence,
    }
  }

  // Local keyword-based detection as fallback (English only - kept for backward compatibility)
  let category: "fees" | "timetable" | "scholarships" | "circulars" | "general" = "general"

  if (queryLower.includes("fee") && !queryLower.includes("scholarship")) {
    category = "fees"
  } else if (queryLower.includes("timetable") || queryLower.includes("exam") || queryLower.includes("schedule")) {
    category = "timetable"
  } else if (queryLower.includes("circular") || queryLower.includes("notice") || queryLower.includes("announcement")) {
    category = "circulars"
  } else if (queryLower.includes("scholarship") || queryLower.includes("financial aid")) {
    category = "scholarships"
  }

  return {
    intent: "general query",
    category: category,
    keywords: query
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2)
      .slice(0, 5),
    translatedQuery: query, // Already English from Step 0
    confidence: multilingualResult.confidence,
  }
}

function createFallbackContext(): ContextAnalysis {
  return {
    mainTopic: "general",
    referencedEntities: [],
    requiresClarification: false,
    suggestedFollowUps: [],
  }
}

/**
 * Health check for AI service
 * Tests if Gemini API key is configured and working
 */
export async function testAIConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent("Test connection. Reply with: OK")
    return result.response.text().includes("OK")
  } catch (error) {
    console.error("[AI Service] Connection test failed:", error)
    return false
  }
}
