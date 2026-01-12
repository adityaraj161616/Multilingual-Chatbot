/**
 * Script to seed class timetables into the database
 * Run with: npx ts-node scripts/seed-class-timetables.ts
 * Or execute from the v0 interface
 */

import mongoose from "mongoose"
import { ClassTimetable } from "@/lib/models/campus.model"


async function seedClassTimetables() {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.log("MONGODB_URI not found. Please set it in environment variables.")
      return
    }

    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    // Clear existing class timetables
    await ClassTimetable.deleteMany({})
    console.log("Cleared existing class timetables")

    // Insert new timetables
    const timetablesToInsert = classTimetables.map((tt) => ({
      ...tt,
      isActive: true,
    }))

    await ClassTimetable.insertMany(timetablesToInsert)
    console.log(`Successfully seeded ${timetablesToInsert.length} class timetables`)

    // Log what was seeded
    for (const tt of timetablesToInsert) {
      console.log(`  - ${tt.programCode} Semester ${tt.semester}`)
    }

    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  } catch (error) {
    console.error("Error seeding class timetables:", error)
    process.exit(1)
  }
}

seedClassTimetables()
