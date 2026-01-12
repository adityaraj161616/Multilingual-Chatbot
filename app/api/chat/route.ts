import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Conversation } from "@/lib/models/conversation.model"
import { Session } from "@/lib/models/session.model"
import {
  analyzeIntent,
  analyzeContext,
  translateText,
  translateInputToEnglish,
  rephraseResponse,
} from "@/lib/utils/ai-service"
import { findMatchingFAQ } from "@/lib/utils/faq-matcher"
import { detectMultiStepIntent, handleMultiStepFlow } from "@/lib/utils/multi-step-handler"
import { logger } from "@/lib/utils/logger"
import type { Language } from "@/lib/types"
import { auth } from "@/lib/auth"
import { ChatHistory, generateChatTitle, calculateExpiresAt } from "@/lib/models/chat-history.model"
import { translateResponse, translateOptions } from "@/lib/utils/response-translator"

/**
 * Chat API Route - MULTILINGUAL TRANSLATION PIPELINE
 *
 * Flow:
 * 1. User sends message in ANY language + UI language
 * 2. Translate input to English (if not English)
 * 3. Analyze intent on English translation
 * 4. Fetch from database using English translation
 * 5. Generate response in English
 * 6. Translate FULL response to user's UI language (if not English) - CRITICAL STEP
 * 7. Return translated response to UI with ZERO English leakage
 */

export async function POST(request: Request) {
  try {
    const { message, language, sessionId, conversationHistory } = await request.json()

    if (!message || !language || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 })
    }

    await connectToDatabase()

    const sessionAuth = await auth()
    const userId = sessionAuth?.user?.id

    // This is the CRITICAL first step for multilingual support
    logger.debug("[v0] Input translation step", { language, messagePreview: message.substring(0, 50) })

    console.log("[v0] BEFORE translateInputToEnglish:", {
      inputMessage: message.substring(0, 50),
      language,
      isEnglish: language === "en",
    })

    const englishMessage = await translateInputToEnglish(message, language as Language)

    console.log("[v0] AFTER translateInputToEnglish:", {
      inputMessage: message.substring(0, 50),
      englishMessage: englishMessage.substring(0, 50),
      didTranslate: englishMessage !== message,
    })

    if (englishMessage !== message) {
      logger.debug("[v0] Input translated to English", {
        original: message.substring(0, 50),
        translated: englishMessage.substring(0, 50),
      })
    }

    // Update session activity
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: { language, lastVisit: new Date() },
        $inc: { totalMessages: 1 },
        $setOnInsert: { firstVisit: new Date(), userAgent: request.headers.get("user-agent") },
      },
      { upsert: true },
    )

    const session = await Session.findOne({ sessionId })

    logger.debug("[v0] Starting intent analysis on English translation...")

    const messageLower = englishMessage.toLowerCase().trim()
    const originalMessageLower = message.toLowerCase().trim()
    let forcedCategory: string | null = null

    const checkForKeywords = (text: string) => {
      const textLower = text.toLowerCase()
      if (
        textLower.includes("semester fee") ||
        textLower.includes("tuition") ||
        textLower.includes("course fee") ||
        textLower.includes("program fee") ||
        (textLower.includes("fee") && !textLower.includes("scholarship")) ||
        textLower.includes("how much") ||
        // Hindi keywords
        textLower.includes("फीस") ||
        textLower.includes("शुल्क") ||
        textLower.includes("सेमेस्टर") ||
        textLower.includes("कितना") ||
        textLower.includes("कितनी")
      ) {
        return "fees"
      } else if (
        textLower.includes("timetable") ||
        textLower.includes("exam schedule") ||
        textLower.includes("exam date") ||
        textLower.includes("schedule") ||
        // Hindi keywords
        textLower.includes("परीक्षा") ||
        textLower.includes("समय सारणी") ||
        textLower.includes("टाइमटेबल")
      ) {
        return "timetable"
      } else if (
        textLower.includes("circular") ||
        textLower.includes("notice") ||
        textLower.includes("announcement") ||
        // Hindi keywords
        textLower.includes("परिपत्र") ||
        textLower.includes("नोटिस") ||
        textLower.includes("सूचना")
      ) {
        return "circulars"
      }
      return null
    }

    forcedCategory = checkForKeywords(messageLower) || checkForKeywords(originalMessageLower)

    if (forcedCategory) {
      logger.debug("[v0] FORCED category based on multilingual keywords", { forcedCategory })
    }

    const [intent, contextAnalysis] = await Promise.all([
      analyzeIntent(englishMessage, language as Language, conversationHistory),
      conversationHistory && conversationHistory.length > 0
        ? analyzeContext(conversationHistory)
        : Promise.resolve(null),
    ])

    if (forcedCategory) {
      intent.category = forcedCategory as any
      logger.debug("[v0] Overrode AI category with forced category", { forcedCategory })
    }

    logger.debug("[v0] Intent analyzed", {
      category: intent.category,
      confidence: intent.confidence,
      intent: intent.intent,
    })

    const multiStepIntent =
      detectMultiStepIntent(message, intent.category) || detectMultiStepIntent(englishMessage, intent.category)

    console.log("[v0] ===== MULTILINGUAL INTENT DETECTION DEBUG =====")
    console.log("[v0] Original user message:", message)
    console.log("[v0] UI language:", language)
    console.log("[v0] English translation:", englishMessage)
    console.log("[v0] AI category:", intent.category)
    console.log("[v0] Forced category:", forcedCategory)
    console.log("[v0] Final category used:", intent.category)
    console.log("[v0] Multi-step intent detected:", multiStepIntent)
    console.log("[v0] Has active flow:", !!session?.multiStepState?.currentIntent)
    console.log("[v0] Active intent:", session?.multiStepState?.currentIntent)
    console.log("[v0] ==================================================")

    if (session?.multiStepState?.currentIntent && session?.multiStepState?.awaitingStep) {
      logger.debug("[v0] Active multi-step flow exists", {
        intent: session.multiStepState.currentIntent,
        step: session.multiStepState.awaitingStep,
        newIntentDetected: multiStepIntent,
      })

      const multiStepResult = await handleMultiStepFlow(
        sessionId,
        englishMessage,
        language as Language,
        multiStepIntent,
      )

      const translationResult = await translateResponse(multiStepResult.message, language as Language)
      const finalResponse = translationResult.translated

      let translatedOptions = multiStepResult.options || []
      if (translatedOptions.length > 0 && language !== "en") {
        translatedOptions = await translateOptions(translatedOptions, language as Language)
      }

      logger.debug("[v0] Multi-step response translated", {
        targetLanguage: language,
        method: translationResult.method,
      })

      // Store conversation
      await Conversation.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: [
              {
                role: "user",
                content: message,
                language,
                timestamp: new Date(),
                wasAnswered: false,
              },
              {
                role: "assistant",
                content: finalResponse,
                language,
                timestamp: new Date(),
                wasAnswered: !multiStepResult.requiresNextStep,
              },
            ],
          },
          $set: { lastMessageAt: new Date() },
          $setOnInsert: { language, startedAt: new Date(), isActive: true },
        },
        { upsert: true },
      )

      if (multiStepResult.finalAnswer) {
        try {
          const expiresAt = calculateExpiresAt(7)
          const title = generateChatTitle(message)

          await ChatHistory.create({
            userId: userId || undefined,
            sessionId: userId ? undefined : sessionId,
            title,
            messages: [
              { role: "user", content: message, timestamp: new Date() },
              { role: "bot", content: finalResponse, timestamp: new Date() },
            ],
            language: language || "en",
            expiresAt,
          })
        } catch (historyError) {
          console.error("[v0] Error saving chat history:", historyError)
          // Don't fail the request if history save fails
        }
      }

      await Session.findOneAndUpdate(
        { sessionId },
        {
          $inc: multiStepResult.requiresNextStep ? {} : { resolvedQueries: 1 },
        },
      )

      return NextResponse.json({
        response: finalResponse,
        options: translatedOptions,
        wasAnswered: !multiStepResult.requiresNextStep,
        requiresNextStep: multiStepResult.requiresNextStep,
        currentStep: multiStepResult.currentStep,
        metadata: {
          category: session.multiStepState.currentIntent?.toLowerCase() || "general",
          multiStep: true,
        },
      })
    }

    logger.debug("[v0] Multi-step intent check", {
      detected: multiStepIntent,
      originalCategory: intent.category,
    })

    if (multiStepIntent) {
      logger.debug("[v0] Multi-step intent detected, starting flow", { intent: multiStepIntent })

      const multiStepResult = await handleMultiStepFlow(
        sessionId,
        englishMessage,
        language as Language,
        multiStepIntent,
      )

      console.log("[v0] Multi-step result:", {
        hasMessage: !!multiStepResult.message,
        messagePreview: multiStepResult.message?.substring(0, 100),
        requiresNextStep: multiStepResult.requiresNextStep,
      })

      const translationResult = await translateResponse(multiStepResult.message, language as Language)
      const finalResponse = translationResult.translated

      let translatedOptions = multiStepResult.options || []
      if (translatedOptions.length > 0 && language !== "en") {
        translatedOptions = await translateOptions(translatedOptions, language as Language)
      }

      logger.debug("[v0] Multi-step response translated", {
        targetLanguage: language,
        method: translationResult.method,
      })

      await Conversation.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: [
              {
                role: "user",
                content: message,
                language,
                timestamp: new Date(),
                wasAnswered: false,
              },
              {
                role: "assistant",
                content: finalResponse,
                language,
                timestamp: new Date(),
                wasAnswered: !multiStepResult.requiresNextStep,
              },
            ],
          },
          $set: { lastMessageAt: new Date() },
          $setOnInsert: { language, startedAt: new Date(), isActive: true },
        },
        { upsert: true },
      )

      if (multiStepResult.finalAnswer) {
        try {
          const expiresAt = calculateExpiresAt(7)
          const title = generateChatTitle(message)

          await ChatHistory.create({
            userId: userId || undefined,
            sessionId: userId ? undefined : sessionId,
            title,
            messages: [
              { role: "user", content: message, timestamp: new Date() },
              { role: "bot", content: finalResponse, timestamp: new Date() },
            ],
            language: language || "en",
            expiresAt,
          })
        } catch (historyError) {
          console.error("[v0] Error saving chat history:", historyError)
        }
      }

      return NextResponse.json({
        response: finalResponse,
        options: translatedOptions,
        wasAnswered: !multiStepResult.requiresNextStep,
        requiresNextStep: multiStepResult.requiresNextStep,
        currentStep: multiStepResult.currentStep,
        metadata: {
          category: intent.category,
          confidence: intent.confidence,
          multiStep: true,
        },
      })
    }

    logger.debug("[v0] Using FAQ matching on English translation...")

    const matchedFAQ = await findMatchingFAQ(
      englishMessage,
      "en", // Always search in English database
      intent.category,
      intent.keywords,
    )

    let response: string
    let wasAnswered = false

    if (matchedFAQ) {
      // Get answer in English first (database contains English answers)
      let answer = matchedFAQ.answer.en

      if (!answer || answer.trim() === "") {
        // Fallback if English answer not available
        answer = await translateText(matchedFAQ.answer[language as Language] || "", language as Language)
      }

      if (conversationHistory && conversationHistory.length > 2) {
        answer = await rephraseResponse(answer, englishMessage, "en")
      }

      const translationResult = await translateResponse(answer, language as Language)
      response = translationResult.translated

      logger.debug("[v0] FAQ answer translated", {
        targetLanguage: language,
        method: translationResult.method,
      })

      wasAnswered = true
    } else {
      // NEW: FALLBACK MESSAGES: Ensure non-English languages get proper text
      const fallbackMessages: Record<Language, string> = {
        en: "I couldn't find an exact answer to your question. Please contact support or visit the administration office.",
        hi: "मुझे आपके प्रश्न का सटीक उत्तर नहीं मिल सका। कृपया समर्थन से संपर्क करें या प्रशासन कार्यालय में जाएं।",
        ta: "உங்கள் கேள்விக்கான சரியான பதிலை என்னால் கண்டுபிடிக்க முடியவில்லை. ஆதரவைத் தொடர்பு கொள்ளவும்.",
        te: "మీ ప్రశ్నకు సరైన సమాధానం నేను కనుగొనలేకపోయాను. దయచేసి మద్దతును సంప్రదించండి.",
        bn: "আমি আপনার প্রশ্নের সঠিক উত্তর খুঁজে পাইনি। অনুগ্রহ করে সমর্থন যোগাযোগ করুন।",
        mr: "मला तुमच्या प्रश्नाचे अचूक उत्तर सापडले नाही. कृपया समर्थनाशी संपर्क साधा.",
      }
      response = fallbackMessages[language as Language] || fallbackMessages.en
    }

    await Conversation.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: [
            {
              role: "user",
              content: message,
              language,
              timestamp: new Date(),
              wasAnswered: false,
            },
            {
              role: "assistant",
              content: response,
              language,
              timestamp: new Date(),
              faqId: matchedFAQ?._id,
              wasAnswered,
            },
          ],
        },
        $set: { lastMessageAt: new Date() },
        $setOnInsert: { language, startedAt: new Date(), isActive: true },
      },
      { upsert: true },
    )

    if (wasAnswered) {
      try {
        const expiresAt = calculateExpiresAt(7)
        const title = generateChatTitle(message)

        await ChatHistory.create({
          userId: userId || undefined,
          sessionId: userId ? undefined : sessionId,
          title,
          messages: [
            { role: "user", content: message, timestamp: new Date() },
            { role: "bot", content: response, timestamp: new Date() },
          ],
          language: language || "en",
          expiresAt,
        })
      } catch (historyError) {
        console.error("[v0] Error saving chat history:", historyError)
      }
    }

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $inc: wasAnswered ? { resolvedQueries: 1 } : { unresolvedQueries: 1 },
      },
    )

    return NextResponse.json({
      response,
      wasAnswered,
      options: [],
      requiresNextStep: false,
      metadata: {
        category: intent.category,
        confidence: intent.confidence,
        faqMatched: !!matchedFAQ,
        requiresHumanAssistance: !wasAnswered,
        multiStep: false,
      },
    })
  } catch (error) {
    logger.error("Chat API Error", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const statusCode = errorMessage.includes("MONGODB") || errorMessage.includes("GEMINI") ? 503 : 500

    // NEW: TRANSLATE ERROR MESSAGES based on UI language
    const fallbackErrorMessages: Record<Language, string> = {
      en: "Sorry, I'm having technical difficulties. Please try again or contact support.",
      hi: "माफ़ी चाहता हूँ, मुझे तकनीकी कठिनाई हो रही है। कृपया पुनः प्रयास करें या समर्थन से संपर्क करें।",
      ta: "மன்னிக்கவும், நான் தொழில்நுட்ப சிக்கல்களை சந்திக்கிறேன். மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவைத் தொடர்பு கொள்ளவும்.",
      te: "క్షమించండి, నేను సాంకేతిక సమస్యలను ఎదుర్కొంటున్నాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా సమర్థన సంపర్కించండి.",
      bn: "দুঃখিত, আমি প্রযুক্তিগত অসুবিধার সম্মুখীন হচ্ছি। অনুগ্রহ করে পুনরায় চেষ্টা করুন বা সমর্থন যোগাযোগ করুন।",
      mr: "माफ करा, मला तांत्रिक समस्या येत आहे. कृपया पुन्हा प्रयत्न करा किंवा समर్థनाशी संपर्क साधा.",
    }

    const userLanguage = (request.headers.get("x-language") || "en") as Language

    return NextResponse.json(
      {
        error: "Failed to process message",
        fallback: fallbackErrorMessages[userLanguage] || fallbackErrorMessages.en,
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: statusCode },
    )
  }
}
