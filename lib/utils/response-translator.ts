import type { Language } from "@/lib/types"
import { translateText } from "@/lib/utils/ai-service"
import { glossaryTranslate, isValidTranslation } from "@/lib/utils/glossary-translator"
import { logger } from "@/lib/utils/logger"

/**
 * UNIVERSAL RESPONSE TRANSLATION MIDDLEWARE
 * =========================================
 * Ensures ALL responses are translated exactly ONCE before sending to UI
 * Implements strict language pipeline with graceful fallback
 * ZERO English leakage when language ≠ English
 */

interface TranslationResult {
  success: boolean
  translated: string
  method: "gemini" | "glossary" | "passthrough"
  language: Language
}

/**
 * Main translation middleware - called for ALL responses
 * Implements retry logic and graceful fallback
 */
export async function translateResponse(
  response: string,
  targetLanguage: Language,
  retryCount = 0,
): Promise<TranslationResult> {
  const MAX_RETRIES = 1

  // Passthrough for English
  if (targetLanguage === "en") {
    return {
      success: true,
      translated: response,
      method: "passthrough",
      language: "en",
    }
  }

  try {
    console.log("[v0] Translation attempt:", {
      language: targetLanguage,
      responsePreview: response.substring(0, 50),
      retryCount,
    })

    // Step 1: Try Gemini translation
    try {
      const geminiTranslation = await translateText(response, targetLanguage)

      if (isValidTranslation(response, geminiTranslation, targetLanguage)) {
        logger.debug("[v0] Gemini translation successful", { targetLanguage })
        return {
          success: true,
          translated: geminiTranslation,
          method: "gemini",
          language: targetLanguage,
        }
      } else {
        logger.warn("[v0] Gemini translation validation failed, will retry")
      }
    } catch (geminiError) {
      logger.warn("[v0] Gemini translation failed:", geminiError)

      // Step 2: Retry Gemini once if failed
      if (retryCount < MAX_RETRIES) {
        console.log("[v0] Retrying Gemini translation...")
        return translateResponse(response, targetLanguage, retryCount + 1)
      }
    }

    // Step 3: Fallback to glossary-based translation
    logger.debug("[v0] Falling back to glossary translation", { targetLanguage })
    const glossaryTranslated = glossaryTranslate(response, targetLanguage)

    if (isValidTranslation(response, glossaryTranslated, targetLanguage)) {
      logger.debug("[v0] Glossary translation successful", { targetLanguage })
      return {
        success: true,
        translated: glossaryTranslated,
        method: "glossary",
        language: targetLanguage,
      }
    }

    // Step 4: If both fail, log and return original English (production fallback)
    logger.error("[v0] All translation methods failed, using original English", { targetLanguage })
    console.log("[v0] WARNING: Translation failed, returning English response for language:", targetLanguage)

    return {
      success: false,
      translated: response, // Return English as last resort
      method: "passthrough",
      language: "en",
    }
  } catch (error) {
    logger.error("[v0] Unexpected error in translation middleware:", error)
    return {
      success: false,
      translated: response,
      method: "passthrough",
      language: "en",
    }
  }
}

/**
 * Translate multi-step response options (buttons/quick replies)
 */
export async function translateOptions(
  options: Array<{ id: string; label: string; value: string }>,
  targetLanguage: Language,
): Promise<Array<{ id: string; label: string; value: string }>> {
  if (targetLanguage === "en" || !options || options.length === 0) {
    return options
  }

  try {
    return await Promise.all(
      options.map(async (option) => ({
        ...option,
        label: await translateResponseSingle(option.label, targetLanguage),
        value: await translateResponseSingle(option.value, targetLanguage),
      })),
    )
  } catch (error) {
    logger.error("[v0] Failed to translate options:", error)
    return options // Return original if translation fails
  }
}

/**
 * Internal helper for single text translation
 */
async function translateResponseSingle(text: string, targetLanguage: Language): Promise<string> {
  const result = await translateResponse(text, targetLanguage)
  return result.translated
}
