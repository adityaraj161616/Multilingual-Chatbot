import { FAQ, type IFAQ } from "@/lib/models/faq.model"
import type { Language } from "@/lib/types"
import { logger } from "@/lib/utils/logger"

/**
 * Match user query to FAQ using keywords and semantic matching
 * Returns best matching FAQ or null if no good match found
 */
export async function findMatchingFAQ(
  query: string,
  language: Language,
  category?: string,
  keywords?: string[],
): Promise<IFAQ | null> {
  try {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      logger.warn("Invalid query provided to FAQ matcher")
      return null
    }

    // Build search query
    const searchFilter: any = { isActive: true }
    if (category && category !== "general") {
      searchFilter.category = category
    }

    // Try keyword matching first
    if (keywords && keywords.length > 0) {
      searchFilter.keywords = { $in: keywords }
    }

    let faqs = await FAQ.find(searchFilter).sort({ priority: -1 }).limit(5).lean()

    // If no match with keywords, try text search
    if (faqs.length === 0) {
      const searchQuery = query.toLowerCase()
      faqs = await FAQ.find({
        isActive: true,
        $or: [
          { [`question.${language}`]: { $regex: searchQuery, $options: "i" } },
          { keywords: { $in: searchQuery.split(" ").filter((word) => word.length > 2) } },
        ],
      })
        .sort({ priority: -1 })
        .limit(5)
        .lean()
    }

    // Return highest priority match
    return faqs.length > 0 ? (faqs[0] as IFAQ) : null
  } catch (error) {
    logger.error("FAQ matching error:", error)
    return null
  }
}

/**
 * Get suggested FAQs for a category
 */
export async function getSuggestedFAQs(category: string, language: Language, limit = 3): Promise<IFAQ[]> {
  try {
    return await FAQ.find({ category, isActive: true }).sort({ priority: -1 }).limit(limit).lean()
  } catch (error) {
    logger.error("Error getting suggested FAQs:", error)
    return []
  }
}
