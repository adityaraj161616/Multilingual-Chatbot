import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Conversation } from "@/lib/models/conversation.model"
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
    const conversations = await Conversation.find().sort({ lastMessageAt: -1 }).limit(50)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
