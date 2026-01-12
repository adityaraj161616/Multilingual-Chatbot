/**
 * API Route to seed class timetables
 * Call this endpoint to ensure timetable data exists in the database
 * GET /api/seed-timetables
 */

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClassTimetable } from "@/lib/models/campus.model"
import { classTimetables } from "@/lib/data/class-timetables"

export async function GET() {
  try {
    await connectToDatabase()

    // Check current count
    const existingCount = await ClassTimetable.countDocuments()

    if (existingCount > 0) {
      // Verify BTECH Semester 8 exists
      const btechSem8 = await ClassTimetable.findOne({ programCode: "BTECH", semester: 8 })

      return NextResponse.json({
        status: "exists",
        message: `Class timetables already exist (${existingCount} records)`,
        btechSem8Exists: !!btechSem8,
        count: existingCount,
      })
    }

    // Seed the data
    const timetablesToInsert = classTimetables.map((tt) => ({
      ...tt,
      isActive: true,
    }))

    await ClassTimetable.insertMany(timetablesToInsert)

    return NextResponse.json({
      status: "seeded",
      message: `Successfully seeded ${timetablesToInsert.length} class timetables`,
      count: timetablesToInsert.length,
      seeded: timetablesToInsert.map((tt) => `${tt.programCode} Semester ${tt.semester}`),
    })
  } catch (error) {
    console.error("Error seeding timetables:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  // Force re-seed (delete and recreate)
  try {
    await connectToDatabase()

    // Delete existing timetables
    await ClassTimetable.deleteMany({})

    // Seed fresh data
    const timetablesToInsert = classTimetables.map((tt) => ({
      ...tt,
      isActive: true,
    }))

    await ClassTimetable.insertMany(timetablesToInsert)

    return NextResponse.json({
      status: "reseeded",
      message: `Deleted old data and seeded ${timetablesToInsert.length} class timetables`,
      count: timetablesToInsert.length,
    })
  } catch (error) {
    console.error("Error reseeding timetables:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
