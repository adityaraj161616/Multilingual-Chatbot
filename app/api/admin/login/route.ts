import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Admin } from "@/lib/models/admin.model"
import { generateToken } from "@/lib/utils/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await connectToDatabase()

    // Find admin with password field
    const admin = await Admin.findOne({ email, isActive: true }).select("+password")

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isValidPassword = await admin.comparePassword(password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(admin._id.toString())

    return NextResponse.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
