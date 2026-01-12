import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ChatHistory } from "@/lib/models/chat-history.model"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    const session = await auth()

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const query = session?.user?.id ? { userId: session.user.id } : { sessionId }

    const history = await ChatHistory.find(query).sort({ updatedAt: -1 }).limit(50).lean()

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 })
  }
}
