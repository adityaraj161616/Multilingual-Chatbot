import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ChatHistory } from "@/lib/models/chat-history.model"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const session = await auth()

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    await connectToDatabase()

    let result
    if (session?.user?.id) {
      // Logged-in user: delete by userId
      result = await ChatHistory.deleteOne({
        _id: id,
        userId: session.user.id,
      })
    } else if (sessionId) {
      // Anonymous user: delete by sessionId
      result = await ChatHistory.deleteOne({
        _id: id,
        sessionId: sessionId,
      })
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Chat deleted successfully" })
  } catch (error) {
    console.error("[v0] Failed to delete chat:", error)
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
  }
}
