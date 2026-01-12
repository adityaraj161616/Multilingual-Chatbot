import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClassTimetable } from "@/lib/models/campus.model"

/**
 * Force re-seed class timetables API
 * This is useful when the auto-seeding didn't work correctly
 * Call: GET /api/force-seed-timetables
 */
export async function GET() {
  try {
    await connectToDatabase()

    // Clear existing timetables
    const deletedCount = await ClassTimetable.deleteMany({})
    console.log("[v0] Deleted", deletedCount.deletedCount, "existing timetables")

    // Import and run the seeding function
    const { seedCampusDataIfEmpty } = await import("@/lib/utils/seed-campus-data")
    await seedCampusDataIfEmpty()

    // Verify seeding worked
    const newCount = await ClassTimetable.countDocuments()

    // Get a sample to verify structure
    const sample = await ClassTimetable.findOne({ programCode: "BTECH", semester: 1 }).lean()

    return NextResponse.json({
      success: true,
      message: `Successfully re-seeded ${newCount} class timetables`,
      deletedCount: deletedCount.deletedCount,
      newCount,
      sampleProgram: sample
        ? {
            programCode: sample.programCode,
            semester: sample.semester,
            academicYear: sample.academicYear,
            hasTimetable: !!sample.timetable,
            mondayClasses: sample.timetable?.MONDAY?.length || 0,
          }
        : null,
    })
  } catch (error) {
    console.error("[v0] Force seed error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
