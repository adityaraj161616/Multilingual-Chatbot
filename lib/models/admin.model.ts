import mongoose, { Schema, type Model } from "mongoose"
import bcrypt from "bcryptjs"

/**
 * Admin User Schema - Stores admin credentials
 * Passwords are hashed using bcrypt
 * Role-based access control can be extended
 */
export interface IAdmin {
  _id: string
  email: string
  password: string
  name: string
  role: "admin" | "superadmin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error: any) {
    throw error
  }
})

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema)
