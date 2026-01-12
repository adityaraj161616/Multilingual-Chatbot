import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Conversation } from "@/lib/models/conversation.model"
import { Session } from "@/lib/models/session.model"
import { verifyToken, extractToken } from "@/lib/utils/auth"

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("Authorization")
  const token = extractToken(authHeader)
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get total conversations and messages
    const conversations = await Conversation.find()
    const sessions = await Session.find()

    const totalConversations = conversations.length
    let totalMessages = 0
    let resolvedQueries = 0
    let unresolvedQueries = 0
    const languageBreakdown: Record<string, number> = {}
    const categoryBreakdown: Record<string, number> = {}
    const questionCounts: Record<string, number> = {}

    // Aggregate stats from sessions
    sessions.forEach((session) => {
      totalMessages += session.totalMessages
      resolvedQueries += session.resolvedQueries
      unresolvedQueries += session.unresolvedQueries
      languageBreakdown[session.language] = (languageBreakdown[session.language] || 0) + session.totalMessages
    })

    // Aggregate questions from conversations
    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        if (msg.role === "user") {
          const question = msg.content.toLowerCase().trim()
          questionCounts[question] = (questionCounts[question] || 0) + 1
        }
      })
    })

    // Get top questions
    const topQuestions = Object.entries(questionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }))

    // Mock category breakdown (you can enhance this with better categorization)
    categoryBreakdown.general = Math.floor(totalMessages * 0.3)
    categoryBreakdown.fees = Math.floor(totalMessages * 0.25)
    categoryBreakdown.timetable = Math.floor(totalMessages * 0.2)
    categoryBreakdown.scholarships = Math.floor(totalMessages * 0.15)
    categoryBreakdown.circulars = Math.floor(totalMessages * 0.1)

    return NextResponse.json({
      totalConversations,
      totalMessages,
      resolvedQueries,
      unresolvedQueries,
      languageBreakdown,
      categoryBreakdown,
      topQuestions,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
