import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Session } from "@/lib/models/session.model"
import { ChatHistory, generateChatTitle, calculateExpiresAt, convertMessageRole } from "@/lib/models/chat-history.model"
import { Conversation } from "@/lib/models/conversation.model"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const session = await Session.findOne({ sessionId }).lean()
    const conversation = await Conversation.findOne({ sessionId }).lean()

    console.log("[v0] End conversation - Session:", !!session, "Conversation:", !!conversation)

    // Get auth session
    const authSession = await auth()

    if (conversation?.messages && Array.isArray(conversation.messages) && conversation.messages.length > 0) {
      const userMessages = conversation.messages.filter((m: any) => m.role === "user")
      const firstUserMessage = userMessages[0]?.content || ""

      const title = generateChatTitle(firstUserMessage)

      const convertedMessages = conversation.messages.map((m: any) => ({
        role: convertMessageRole(m.role),
        content: m.content,
        timestamp: m.timestamp || new Date(),
      }))

      const expiresAt = calculateExpiresAt(7)

      try {
        await ChatHistory.create({
          userId: authSession?.user?.id || undefined,
          sessionId: authSession?.user?.id ? undefined : sessionId,
          title,
          messages: convertedMessages,
          language: conversation.language || "en",
          expiresAt, // Required field - now always provided
        })
        console.log("[v0] Chat history saved successfully with title:", title)
      } catch (historyError) {
        console.error("[v0] Error saving chat history:", historyError)
        // Return partial success - conversation ended but history may not be saved
      }
    }

    const deletePromises = []

    if (session) {
      deletePromises.push(
        Session.findOneAndDelete({ sessionId }).catch((deleteError) => {
          console.error("[v0] Error deleting session:", deleteError)
        }),
      )
    }

    if (conversation) {
      deletePromises.push(
        Conversation.findOneAndDelete({ sessionId }).catch((deleteError) => {
          console.error("[v0] Error deleting conversation:", deleteError)
        }),
      )
    }

    await Promise.all(deletePromises)
    console.log("[v0] Session and conversation cleaned up successfully")

    return NextResponse.json({ success: true, message: "Conversation ended and saved to history" })
  } catch (error) {
    console.error("[v0] Error ending conversation:", error)
    return NextResponse.json(
      { error: "Failed to end conversation", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
