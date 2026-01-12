export const SUPPORTED_LANGUAGES = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  bn: "বাংলা",
  mr: "मराठी",
} as const

export type Language = keyof typeof SUPPORTED_LANGUAGES

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  wasAnswered?: boolean
  options?: Array<{
    id: string
    label: string
    value: string
  }>
}

export interface QuickReply {
  id: string
  text: string
  category: string
}

export interface AnalyticsData {
  totalConversations: number
  totalMessages: number
  resolvedQueries: number
  unresolvedQueries: number
  languageBreakdown: Record<Language, number>
  categoryBreakdown: Record<string, number>
  topQuestions: Array<{ question: string; count: number }>
}
