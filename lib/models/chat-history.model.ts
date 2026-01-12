import mongoose, { Schema, type Model } from "mongoose"

/**
 * ChatHistory Schema - Stores chat conversations for both logged-in and anonymous users
 * Auto-deletes after 30 days using MongoDB TTL index
 * Privacy-focused: users can only access their own history
 */

interface IMessage {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export interface IChatHistory {
  _id: string
  userId?: mongoose.Types.ObjectId
  sessionId?: string
  title: string
  messages: IMessage[]
  language: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date // TTL index field for auto-deletion after 30 days
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "bot"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
)

const chatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
    sessionId: { type: String, required: false, index: true },
    title: { type: String, required: true, default: "Campus Assistant Chat" },
    messages: [messageSchema],
    language: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
)

// TTL index: automatically delete documents after expiresAt date
chatHistorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export function generateChatTitle(firstUserMessage: string): string {
  if (!firstUserMessage || firstUserMessage.trim().length === 0) {
    return "Campus Assistant Chat"
  }

  // Clean and truncate the message
  const cleaned = firstUserMessage
    .trim()
    .replace(/[^\w\s\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0980-\u09FF]/g, " ") // Keep letters, numbers, spaces, and Indian scripts
    .replace(/\s+/g, " ")
    .trim()

  // Check if it's just numbers
  if (/^\d+$/.test(cleaned)) {
    return "Campus Assistant Chat"
  }

  // Truncate to 40 chars max
  if (cleaned.length <= 40) {
    return cleaned
  }

  // Find a good breaking point
  const truncated = cleaned.substring(0, 40)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > 20) {
    return truncated.substring(0, lastSpace) + "..."
  }

  return truncated + "..."
}

export function calculateExpiresAt(daysFromNow = 7): Date {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysFromNow)
  return expiresAt
}

export function convertMessageRole(role: string): "user" | "bot" {
  if (role === "user") return "user"
  return "bot" // Convert "assistant" or any other role to "bot"
}

export const ChatHistory: Model<IChatHistory> =
  mongoose.models.ChatHistory || mongoose.model<IChatHistory>("ChatHistory", chatHistorySchema)
