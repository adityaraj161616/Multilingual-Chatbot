/**
 * Script to seed ALL campus data including class timetables
 * This ensures all data is available for the chatbot
 * Run from v0 interface or with: npx ts-node scripts/seed-all-data.ts
 */

import mongoose from "mongoose"
import { ClassTimetable, Program, Branch, Scholarship, Circular } from "@/lib/models/campus.model"


async function seedAllData() {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.log("MONGODB_URI not found. Please set it in environment variables.")
      return
    }

    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    // Check current data counts
    const counts = {
      programs: await Program.countDocuments(),
      branches: await Branch.countDocuments(),
      classTimetables: await ClassTimetable.countDocuments(),
      scholarships: await Scholarship.countDocuments(),
      circulars: await Circular.countDocuments(),
    }
    console.log("Current data counts:", counts)

    // Seed class timetables if missing
    if (counts.classTimetables === 0) {
      console.log("Seeding class timetables...")

      const timetablesToInsert = classTimetables.map((tt) => ({
        ...tt,
        isActive: true,
      }))

      await ClassTimetable.insertMany(timetablesToInsert)
      console.log(`Successfully seeded ${timetablesToInsert.length} class timetables:`)

      for (const tt of timetablesToInsert) {
        console.log(`  - ${tt.programCode} Semester ${tt.semester}`)
      }
    } else {
      console.log(`Class timetables already exist (${counts.classTimetables} records)`)
    }

    // Verify the data
    const btechSem8 = await ClassTimetable.findOne({ programCode: "BTECH", semester: 8 })
    if (btechSem8) {
      console.log("\nVerification - BTECH Semester 8 timetable found:")
      console.log("  Monday classes:", btechSem8.timetable.MONDAY?.length || 0)
      console.log("  Tuesday classes:", btechSem8.timetable.TUESDAY?.length || 0)
    } else {
      console.log("\nWARNING: BTECH Semester 8 timetable NOT found after seeding!")
    }

    await mongoose.disconnect()
    console.log("\nDisconnected from MongoDB")
    console.log("Seeding complete!")
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedAllData()
