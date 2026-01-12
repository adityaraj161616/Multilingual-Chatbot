import mongoose, { Schema, type Model } from "mongoose"
import bcrypt from "bcryptjs"

/**
 * User Schema - Stores normal user (student) credentials
 * Supports both email/password and OAuth authentication
 * Separate from Admin model for security isolation
 */
export interface IUser {
  _id: string
  email: string
  password?: string // Optional for OAuth users
  name: string
  provider: "credentials" | "google"
  googleId?: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword?(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false }, // Not required for OAuth
    name: { type: String, required: true },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    googleId: { type: String, sparse: true, unique: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error: any) {
    throw error
  }
})

// Method to compare passwords (only for credentials provider)
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
