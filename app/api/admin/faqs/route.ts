import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { FAQ } from "@/lib/models/faq.model"
import { verifyToken, extractToken } from "@/lib/utils/auth"

// Middleware to verify admin authentication
function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("Authorization")
  const token = extractToken(authHeader)

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function GET(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const faqs = await FAQ.find().sort({ priority: -1, createdAt: -1 })

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error("Get FAQs error:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await connectToDatabase()
    const faq = await FAQ.create(data)

    return NextResponse.json({ faq }, { status: 201 })
  } catch (error) {
    console.error("Create FAQ error:", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}
