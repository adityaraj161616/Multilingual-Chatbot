import mongoose, { Schema, type Model } from "mongoose"

/**
 * FAQ Schema - Stores multilingual questions and answers
 * Each FAQ has questions and answers in multiple languages
 * Categories help organize FAQs (fees, timetable, scholarships, circulars)
 */
export interface IFAQ {
  _id: string
  category: "fees" | "timetable" | "scholarships" | "circulars" | "general"
  question: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  answer: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  keywords: string[] // For better matching
  priority: number // Higher priority FAQs shown first in suggestions
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const faqSchema = new Schema<IFAQ>(
  {
    category: {
      type: String,
      enum: ["fees", "timetable", "scholarships", "circulars", "general"],
      required: true,
      index: true,
    },
    question: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    answer: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    keywords: [{ type: String }],
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

// Text indexes for search functionality
faqSchema.index({
  "question.en": "text",
  "question.hi": "text",
  "question.ta": "text",
  "question.te": "text",
  "question.bn": "text",
  "question.mr": "text",
  keywords: "text",
})

export const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", faqSchema)
