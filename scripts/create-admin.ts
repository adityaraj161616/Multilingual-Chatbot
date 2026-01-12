/**
 * Script to create an admin user
 * Usage: Modify the email, password, and name below, then run this script
 */

import { connectToDatabase } from "../lib/mongodb"
import { Admin } from "../lib/models/admin.model"

async function createAdmin() {
  try {
    await connectToDatabase()

    // Modify these values
    const adminData = {
      email: "admin@college.edu",
      password: "admin123", // This will be hashed automatically
      name: "System Admin",
      role: "superadmin" as const,
    }

    const existingAdmin = await Admin.findOne({ email: adminData.email })

    if (existingAdmin) {
      console.log("❌ Admin with this email already exists!")
      process.exit(1)
    }

    const admin = await Admin.create(adminData)

    console.log("✅ Admin user created successfully!")
    console.log("Email:", admin.email)
    console.log("Name:", admin.name)
    console.log("Role:", admin.role)
    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
