import { GoogleGenerativeAI } from "@google/generative-ai"
import type { Language } from "@/lib/types"
import { logger } from "@/lib/utils/logger"
import { glossaryTranslate } from "@/lib/utils/glossary-translator"

/**
 * MULTILINGUAL TIMETABLE TRANSLATION
 * ===================================
 * This module translates timetable content (subjects, faculty, venues)
 * from English to the user's selected UI language.
 *
 * DESIGN PRINCIPLES:
 * - Database stores timetables in English (language-agnostic)
 * - Translation happens AFTER data fetch, BEFORE UI render
 * - Uses Gemini ONLY for text translation, never for logic
 * - Falls back to glossary translation if Gemini fails
 * - Preserves structure, times, formatting, and emojis
 */

const generationConfig = {
  temperature: 0.2,
  topK: 20,
  topP: 0.8,
  maxOutputTokens: 1000,
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const languageMap: Record<Language, string> = {
  en: "English",
  hi: "Hindi (Devanagari script, Indian academic context)",
  ta: "Tamil (Indian academic context)",
  te: "Telugu (Indian academic context)",
  bn: "Bengali (Indian academic context)",
  mr: "Marathi (Devanagari script, Indian academic context)",
}

interface TimetableEntry {
  time: string
  subject: string
  faculty?: string
  venue?: string
}

interface Timetable {
  [day: string]: TimetableEntry[]
}

/**
 * Translate entire timetable structure from English to target language
 * This is the main entry point for timetable translation
 */
export async function translateTimetable(timetable: Timetable, targetLanguage: Language): Promise<Timetable> {
  if (targetLanguage === "en") {
    return timetable
  }

  try {
    console.log("[v0] [Timetable Translator] Starting translation to", targetLanguage)

    const translatedTimetable: Timetable = {}

    for (const [day, entries] of Object.entries(timetable)) {
      if (!Array.isArray(entries)) continue

      const translatedEntries: TimetableEntry[] = []

      for (const entry of entries) {
        const translatedEntry = await translateTimetableEntry(entry, targetLanguage)
        translatedEntries.push(translatedEntry)
      }

      translatedTimetable[day] = translatedEntries
    }

    console.log("[v0] [Timetable Translator] Translation complete for", targetLanguage)
    return translatedTimetable
  } catch (error) {
    console.error("[v0] [Timetable Translator] Error during translation:", error)
    logger.error("[Timetable Translator] Translation failed, using glossary fallback", error)
    // Glossary fallback for entire timetable
    return applyGlossaryToTimetable(timetable, targetLanguage)
  }
}

/**
 * Apply glossary translation to entire timetable structure
 */
function applyGlossaryToTimetable(timetable: Timetable, targetLanguage: Language): Timetable {
  const result: Timetable = {}

  for (const [day, entries] of Object.entries(timetable)) {
    if (!Array.isArray(entries)) continue

    result[day] = entries.map((entry) => ({
      time: entry.time, // Time stays the same
      subject: glossaryTranslate(entry.subject || "", targetLanguage),
      faculty: entry.faculty ? glossaryTranslate(entry.faculty, targetLanguage) : entry.faculty,
      venue: entry.venue ? glossaryTranslate(entry.venue, targetLanguage) : entry.venue,
    }))
  }

  return result
}

/**
 * Translate a single timetable entry (subject, faculty, venue)
 */
async function translateTimetableEntry(entry: TimetableEntry, targetLanguage: Language): Promise<TimetableEntry> {
  try {
    const textsToTranslate = {
      subject: entry.subject || "",
      faculty: entry.faculty || "",
      venue: entry.venue || "",
    }

    if (!textsToTranslate.subject && !textsToTranslate.faculty && !textsToTranslate.venue) {
      return entry
    }

    const prompt = `Translate the following academic timetable information from English to ${languageMap[targetLanguage]}.

IMPORTANT RULES:
1. Translate ALL subject names completely (e.g., "Basic Mechanical Engg" → full translation, not partial)
2. Translate venue types fully (e.g., "Engineering Graphics" → complete translation)
3. Keep room codes and building abbreviations (e.g., "LH-6", "TB-04", "CS-101") AS-IS
4. Faculty names stay as-is, only translate titles
5. Return response in EXACT format: subject|faculty|venue
6. Each field must have a translation (use original if cannot translate)

Fields to translate:
Subject: ${textsToTranslate.subject}
Faculty: ${textsToTranslate.faculty}
Venue: ${textsToTranslate.venue}

Response (ONLY the format "subject|faculty|venue", no explanations):`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
    })

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    })

    const responseText = result.response.text().trim()
    const parts = responseText.split("|").map((p) => p.trim())

    const translatedSubject = parts[0]?.trim() || glossaryTranslate(entry.subject || "", entry.subject ? "en" : "en")
    const translatedFaculty = parts[1]?.trim() || entry.faculty
    const translatedVenue = parts[2]?.trim() || glossaryTranslate(entry.venue || "", entry.venue ? "en" : "en")

    return {
      time: entry.time,
      subject: translatedSubject || entry.subject,
      faculty: translatedFaculty || entry.faculty,
      venue: translatedVenue || entry.venue,
    }
  } catch (error) {
    console.error("[v0] [Timetable Translator] Error translating entry, using glossary:", error)
    return {
      time: entry.time,
      subject: glossaryTranslate(entry.subject || "", targetLanguage),
      faculty: entry.faculty ? glossaryTranslate(entry.faculty, targetLanguage) : entry.faculty,
      venue: entry.venue ? glossaryTranslate(entry.venue, targetLanguage) : entry.venue,
    }
  }
}

/**
 * Translate response headings and labels
 */
export async function translateTimetableLabels(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === "en" || !process.env.GEMINI_API_KEY) {
    return text
  }

  try {
    const prompt = `Translate this academic timetable heading/label to ${languageMap[targetLanguage]}.
Preserve the program names and semester numbers exactly.

Text: "${text}"

Translated text (ONLY the translation, no explanations):`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { ...generationConfig, maxOutputTokens: 100 },
    })

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    })

    const translated = result.response.text().trim()
    return translated || glossaryTranslate(text, targetLanguage)
  } catch (error) {
    console.error("[v0] [Timetable Translator] Error translating labels, using glossary:", error)
    return glossaryTranslate(text, targetLanguage)
  }
}
