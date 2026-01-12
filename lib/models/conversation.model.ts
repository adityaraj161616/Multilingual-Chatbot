import mongoose, { Schema, type Model } from "mongoose"

/**
 * Conversation Schema - Stores chat sessions and messages
 * Each conversation has a unique sessionId (anonymous)
 * Messages include user queries and bot responses
 */
export interface IMessage {
  role: "user" | "assistant"
  content: string
  language: string
  timestamp: Date
  faqId?: string // Reference to FAQ if answer came from FAQ
  wasAnswered: boolean // Track if bot could answer
}

export interface IConversation {
  _id: string
  sessionId: string
  language: string
  messages: IMessage[]
  context: Record<string, any> // Store conversation context
  startedAt: Date
  lastMessageAt: Date
  isActive: boolean
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    language: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    faqId: { type: String },
    wasAnswered: { type: Boolean, default: false },
  },
  { _id: false },
)

const conversationSchema = new Schema<IConversation>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    language: { type: String, required: true },
    messages: [messageSchema],
    context: { type: Schema.Types.Mixed, default: {} },
    startedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", conversationSchema)
