import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { FAQ } from "@/lib/models/faq.model"
import { verifyToken, extractToken } from "@/lib/utils/auth"

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("Authorization")
  const token = extractToken(authHeader)
  if (!token) return null
  return verifyToken(token)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    await connectToDatabase()
    const faq = await FAQ.findByIdAndUpdate(id, data, { new: true })

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }

    return NextResponse.json({ faq })
  } catch (error) {
    console.error("Update FAQ error:", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectToDatabase()
    const faq = await FAQ.findByIdAndDelete(id)

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete FAQ error:", error)
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}
