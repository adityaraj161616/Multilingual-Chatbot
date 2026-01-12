import { logger } from "@/lib/utils/logger"
import { Program, Branch, Timetable, Circular, Scholarship, ClassTimetable } from "@/lib/models/campus.model"
import type { IClassEntry } from "@/lib/models/campus.model"

/**
 * Automatic Database Seeding Utility
 *
 * This utility automatically seeds the database with demo campus data
 * on first run. It checks if data already exists to avoid re-seeding.
 *
 * This ensures the chatbot has complete demo data available immediately
 * after download and npm run dev.
 */

interface ClassTimetableData {
  programCode: string
  semester: number
  academicYear: string
  timetable: {
    MONDAY: IClassEntry[]
    TUESDAY: IClassEntry[]
    WEDNESDAY: IClassEntry[]
    THURSDAY: IClassEntry[]
    FRIDAY: IClassEntry[]
    SATURDAY?: IClassEntry[]
  }
}

function generateClassTimetables(): ClassTimetableData[] {
  const allTimetables: ClassTimetableData[] = []
  const academicYear = "2025-2026"

  // ==========================================
  // B.Tech Timetables (8 Semesters)
  // ==========================================

  // B.Tech Semester 1
  allTimetables.push({
    programCode: "BTECH",
    semester: 1,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Mathematics-I", faculty: "Dr. R.S.", venue: "LH-6" },
        { time: "10:20-11:10", subject: "Chemistry", faculty: "Dr. K.M.", venue: "LH-6" },
        { time: "11:10-12:00", subject: "Basic Mechanical Engg", faculty: "S.R.", venue: "TB-04" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. K.M.", venue: "Chem Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Basic Mechanical Engg", faculty: "S.R.", venue: "TB-04" },
        { time: "10:20-11:10", subject: "Mathematics-I", faculty: "Dr. R.S.", venue: "LH-6" },
        { time: "11:10-12:00", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "02:00-02:50", subject: "Chemistry", faculty: "Dr. K.M.", venue: "LH-6" },
        { time: "02:50-03:40", subject: "Engineering Graphics", faculty: "P.S.", venue: "Drawing Hall" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "10:20-11:10", subject: "Basic Mechanical Engg", faculty: "S.R.", venue: "TB-04" },
        { time: "11:10-12:00", subject: "Mathematics-I", faculty: "Dr. R.S.", venue: "LH-6" },
        { time: "02:00-03:40", subject: "Workshop Practice", venue: "Workshop" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Chemistry", faculty: "Dr. K.M.", venue: "LH-6" },
        { time: "10:20-11:10", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "11:10-12:00", subject: "Engineering Graphics", faculty: "P.S.", venue: "Drawing Hall" },
        { time: "02:00-02:50", subject: "Mathematics-I", faculty: "Dr. R.S.", venue: "LH-6" },
        { time: "02:50-03:40", subject: "PDP", venue: "Seminar Hall" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Engineering Graphics", faculty: "P.S.", venue: "Drawing Hall" },
        { time: "10:20-11:10", subject: "Chemistry", faculty: "Dr. K.M.", venue: "LH-6" },
        { time: "11:10-12:00", subject: "Basic Mechanical Engg", faculty: "S.R.", venue: "TB-04" },
        { time: "02:00-02:50", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 2
  allTimetables.push({
    programCode: "BTECH",
    semester: 2,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Mathematics-II", faculty: "Dr. A.K.", venue: "LH-5" },
        { time: "10:20-11:10", subject: "Physics", faculty: "Dr. S.N.", venue: "LH-5" },
        { time: "11:10-12:00", subject: "C Programming", faculty: "M.K.", venue: "TB-03" },
        { time: "02:00-03:40", subject: "C Programming Lab", faculty: "M.K.", venue: "Lab-1" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "C Programming", faculty: "M.K.", venue: "TB-03" },
        { time: "10:20-11:10", subject: "Mathematics-II", faculty: "Dr. A.K.", venue: "LH-5" },
        { time: "11:10-12:00", subject: "Basic Electrical Engg", faculty: "J.P.", venue: "TB-03" },
        { time: "02:00-02:50", subject: "Physics", faculty: "Dr. S.N.", venue: "LH-5" },
        { time: "02:50-03:40", subject: "Physics Lab", faculty: "Dr. S.N.", venue: "Physics Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Basic Electrical Engg", faculty: "J.P.", venue: "TB-03" },
        { time: "10:20-11:10", subject: "C Programming", faculty: "M.K.", venue: "TB-03" },
        { time: "11:10-12:00", subject: "Mathematics-II", faculty: "Dr. A.K.", venue: "LH-5" },
        { time: "02:00-03:40", subject: "Electrical Lab", faculty: "J.P.", venue: "EE Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Physics", faculty: "Dr. S.N.", venue: "LH-5" },
        { time: "10:20-11:10", subject: "Basic Electrical Engg", faculty: "J.P.", venue: "TB-03" },
        { time: "11:10-12:00", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "02:00-02:50", subject: "Mathematics-II", faculty: "Dr. A.K.", venue: "LH-5" },
        { time: "02:50-03:40", subject: "Workshop", venue: "Workshop" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "English", faculty: "L.M.", venue: "LH-6" },
        { time: "10:20-11:10", subject: "Physics", faculty: "Dr. S.N.", venue: "LH-5" },
        { time: "11:10-12:00", subject: "C Programming", faculty: "M.K.", venue: "TB-03" },
        { time: "02:00-02:50", subject: "Basic Electrical Engg", faculty: "J.P.", venue: "TB-03" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 3
  allTimetables.push({
    programCode: "BTECH",
    semester: 3,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Data Structures", faculty: "Dr. M. Singh", venue: "LH-1" },
        { time: "10:20-11:10", subject: "Digital Logic Design", faculty: "K.S.", venue: "TB-01" },
        { time: "11:10-12:00", subject: "Mathematics-III", faculty: "Dr. P.K.", venue: "LH-1" },
        { time: "02:00-03:40", subject: "DS Lab", faculty: "Dr. M. Singh", venue: "Lab-1" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Mathematics-III", faculty: "Dr. P.K.", venue: "LH-1" },
        { time: "10:20-11:10", subject: "Data Structures", faculty: "Dr. M. Singh", venue: "LH-1" },
        { time: "11:10-12:00", subject: "Economics", faculty: "R.K.", venue: "TB-01" },
        { time: "02:00-02:50", subject: "Digital Logic Design", faculty: "K.S.", venue: "TB-01" },
        { time: "02:50-03:40", subject: "DLD Lab", faculty: "K.S.", venue: "Lab-5" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Economics", faculty: "R.K.", venue: "TB-01" },
        { time: "10:20-11:10", subject: "Mathematics-III", faculty: "Dr. P.K.", venue: "LH-1" },
        { time: "11:10-12:00", subject: "Data Structures", faculty: "Dr. M. Singh", venue: "LH-1" },
        { time: "02:00-03:40", subject: "Python Lab", faculty: "T.R.", venue: "Lab-1" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Digital Logic Design", faculty: "K.S.", venue: "TB-01" },
        { time: "10:20-11:10", subject: "Economics", faculty: "R.K.", venue: "TB-01" },
        { time: "11:10-12:00", subject: "Python Programming", faculty: "T.R.", venue: "LH-2" },
        { time: "02:00-02:50", subject: "Mathematics-III", faculty: "Dr. P.K.", venue: "LH-1" },
        { time: "02:50-03:40", subject: "Soft Skills", venue: "Seminar Hall" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Python Programming", faculty: "T.R.", venue: "LH-2" },
        { time: "10:20-11:10", subject: "Digital Logic Design", faculty: "K.S.", venue: "TB-01" },
        { time: "11:10-12:00", subject: "Data Structures", faculty: "Dr. M. Singh", venue: "LH-1" },
        { time: "02:00-02:50", subject: "Economics", faculty: "R.K.", venue: "TB-01" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 4
  allTimetables.push({
    programCode: "BTECH",
    semester: 4,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Discrete Mathematics", faculty: "Dr. N. Jain", venue: "LH-4" },
        { time: "10:20-11:10", subject: "Digital Electronics", faculty: "A.K.", venue: "TB-02" },
        { time: "11:10-12:00", subject: "OOP with Java", faculty: "R.M.", venue: "LH-4" },
        { time: "02:00-03:40", subject: "Java Lab", faculty: "R.M.", venue: "Lab-1" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "OOP with Java", faculty: "R.M.", venue: "LH-4" },
        { time: "10:20-11:10", subject: "Discrete Mathematics", faculty: "Dr. N. Jain", venue: "LH-4" },
        { time: "11:10-12:00", subject: "COA", faculty: "S.P.", venue: "TB-02" },
        { time: "02:00-02:50", subject: "Digital Electronics", faculty: "A.K.", venue: "TB-02" },
        { time: "02:50-03:40", subject: "DE Lab", faculty: "A.K.", venue: "Lab-5" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "COA", faculty: "S.P.", venue: "TB-02" },
        { time: "10:20-11:10", subject: "OOP with Java", faculty: "R.M.", venue: "LH-4" },
        { time: "11:10-12:00", subject: "Discrete Mathematics", faculty: "Dr. N. Jain", venue: "LH-4" },
        { time: "02:00-03:40", subject: "COA Lab", faculty: "S.P.", venue: "Lab-2" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Digital Electronics", faculty: "A.K.", venue: "TB-02" },
        { time: "10:20-11:10", subject: "COA", faculty: "S.P.", venue: "TB-02" },
        { time: "11:10-12:00", subject: "Environmental Science", faculty: "Dr. L.S.", venue: "LH-5" },
        { time: "02:00-02:50", subject: "OOP with Java", faculty: "R.M.", venue: "LH-4" },
        { time: "02:50-03:40", subject: "Soft Skills", venue: "Seminar Hall" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Discrete Mathematics", faculty: "Dr. N. Jain", venue: "LH-4" },
        { time: "10:20-11:10", subject: "Environmental Science", faculty: "Dr. L.S.", venue: "LH-5" },
        { time: "11:10-12:00", subject: "COA", faculty: "S.P.", venue: "TB-02" },
        { time: "02:00-02:50", subject: "Digital Electronics", faculty: "A.K.", venue: "TB-02" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 5
  allTimetables.push({
    programCode: "BTECH",
    semester: 5,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Data Structures Adv", faculty: "Dr. M. Singh", venue: "LH-3" },
        { time: "10:20-11:10", subject: "Operating Systems", faculty: "K.R.", venue: "TB-07" },
        { time: "11:10-12:00", subject: "Computer Networks", faculty: "Dr. R. Gupta", venue: "LH-3" },
        { time: "02:00-03:40", subject: "DS Lab", faculty: "Dr. M. Singh", venue: "Lab-1" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Operating Systems", faculty: "K.R.", venue: "TB-07" },
        { time: "10:20-11:10", subject: "Database Management", faculty: "S.K.", venue: "TB-07" },
        { time: "11:10-12:00", subject: "Data Structures Adv", faculty: "Dr. M. Singh", venue: "LH-3" },
        { time: "02:00-02:50", subject: "Computer Networks", faculty: "Dr. R. Gupta", venue: "LH-3" },
        { time: "02:50-03:40", subject: "CN Lab", faculty: "Dr. R. Gupta", venue: "Lab-4" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Computer Networks", faculty: "Dr. R. Gupta", venue: "LH-3" },
        { time: "10:20-11:10", subject: "Data Structures Adv", faculty: "Dr. M. Singh", venue: "LH-3" },
        { time: "11:10-12:00", subject: "Database Management", faculty: "S.K.", venue: "TB-07" },
        { time: "02:00-03:40", subject: "OS Lab", faculty: "K.R.", venue: "Lab-2" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Database Management", faculty: "S.K.", venue: "TB-07" },
        { time: "10:20-11:10", subject: "Operating Systems", faculty: "K.R.", venue: "TB-07" },
        { time: "11:10-12:00", subject: "Software Engineering", faculty: "P.M.", venue: "TB-09" },
        { time: "02:00-03:40", subject: "DBMS Lab", faculty: "S.K.", venue: "Lab-1" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Software Engineering", faculty: "P.M.", venue: "TB-09" },
        { time: "10:20-11:10", subject: "Computer Networks", faculty: "Dr. R. Gupta", venue: "LH-3" },
        { time: "11:10-12:00", subject: "Operating Systems", faculty: "K.R.", venue: "TB-07" },
        { time: "02:00-02:50", subject: "Database Management", faculty: "S.K.", venue: "TB-07" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 6
  allTimetables.push({
    programCode: "BTECH",
    semester: 6,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Compiler Design", faculty: "Dr. A. Sharma", venue: "LH-2" },
        { time: "10:20-11:10", subject: "Computer Graphics", faculty: "N.K.", venue: "TB-06" },
        { time: "11:10-12:00", subject: "Web Technologies", faculty: "S.R.", venue: "TB-06" },
        { time: "02:00-03:40", subject: "Web Tech Lab", faculty: "S.R.", venue: "Lab-1" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Web Technologies", faculty: "S.R.", venue: "TB-06" },
        { time: "10:20-11:10", subject: "Compiler Design", faculty: "Dr. A. Sharma", venue: "LH-2" },
        { time: "11:10-12:00", subject: "Artificial Intelligence", faculty: "Dr. P. Roy", venue: "LH-2" },
        { time: "02:00-02:50", subject: "Computer Graphics", faculty: "N.K.", venue: "TB-06" },
        { time: "02:50-03:40", subject: "CG Lab", faculty: "N.K.", venue: "Lab-2" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Artificial Intelligence", faculty: "Dr. P. Roy", venue: "LH-2" },
        { time: "10:20-11:10", subject: "Web Technologies", faculty: "S.R.", venue: "TB-06" },
        { time: "11:10-12:00", subject: "Compiler Design", faculty: "Dr. A. Sharma", venue: "LH-2" },
        { time: "02:00-03:40", subject: "Compiler Lab", faculty: "Dr. A. Sharma", venue: "Lab-3" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Computer Graphics", faculty: "N.K.", venue: "TB-06" },
        { time: "10:20-11:10", subject: "Artificial Intelligence", faculty: "Dr. P. Roy", venue: "LH-2" },
        { time: "11:10-12:00", subject: "Elective - Mobile Computing", faculty: "V.S.", venue: "TB-04" },
        { time: "02:00-03:40", subject: "AI Lab", faculty: "Dr. P. Roy", venue: "Lab-3" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Compiler Design", faculty: "Dr. A. Sharma", venue: "LH-2" },
        { time: "10:20-11:10", subject: "Elective - Mobile Computing", faculty: "V.S.", venue: "TB-04" },
        { time: "11:10-12:00", subject: "Artificial Intelligence", faculty: "Dr. P. Roy", venue: "LH-2" },
        { time: "02:00-02:50", subject: "Computer Graphics", faculty: "N.K.", venue: "TB-06" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Tech Semester 7
  allTimetables.push({
    programCode: "BTECH",
    semester: 7,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Machine Learning", faculty: "Dr. S. Kumar", venue: "LH-1" },
        { time: "10:20-11:10", subject: "Cloud Computing", faculty: "P.K.", venue: "LH-1" },
        { time: "11:10-12:00", subject: "Information Security", faculty: "R.S.", venue: "TB-05" },
        { time: "02:00-03:40", subject: "ML Lab", faculty: "Dr. S. Kumar", venue: "Lab-3" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Cloud Computing", faculty: "P.K.", venue: "LH-1" },
        { time: "10:20-11:10", subject: "Machine Learning", faculty: "Dr. S. Kumar", venue: "LH-1" },
        { time: "11:10-12:00", subject: "Big Data Analytics", faculty: "M.R.", venue: "TB-05" },
        { time: "02:00-02:50", subject: "Information Security", faculty: "R.S.", venue: "TB-05" },
        { time: "02:50-03:40", subject: "Cyber Security Lab", faculty: "R.S.", venue: "Lab-5" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Information Security", faculty: "R.S.", venue: "TB-05" },
        { time: "10:20-11:10", subject: "Big Data Analytics", faculty: "M.R.", venue: "TB-05" },
        { time: "11:10-12:00", subject: "Machine Learning", faculty: "Dr. S. Kumar", venue: "LH-1" },
        { time: "02:00-03:40", subject: "Cloud Lab", faculty: "P.K.", venue: "Lab-4" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Big Data Analytics", faculty: "M.R.", venue: "TB-05" },
        { time: "10:20-11:10", subject: "Cloud Computing", faculty: "P.K.", venue: "LH-1" },
        { time: "11:10-12:00", subject: "Elective - IoT", faculty: "K.P.", venue: "TB-03" },
        { time: "02:00-02:50", subject: "Machine Learning", faculty: "Dr. S. Kumar", venue: "LH-1" },
        { time: "02:50-03:40", subject: "Mini Project", venue: "Project Lab" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Information Security", faculty: "R.S.", venue: "TB-05" },
        { time: "10:20-11:10", subject: "Big Data Analytics", faculty: "M.R.", venue: "TB-05" },
        { time: "11:10-12:00", subject: "Elective - IoT", faculty: "K.P.", venue: "TB-03" },
        { time: "02:00-03:40", subject: "Big Data Lab", faculty: "M.R.", venue: "Lab-3" },
      ],
    },
  })

  // B.Tech Semester 8
  allTimetables.push({
    programCode: "BTECH",
    semester: 8,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "10:20-11:10", subject: "Minor Project", faculty: "Dr. R.N. Shukla", venue: "TB-10" },
        { time: "11:10-12:00", subject: "Library" },
        { time: "12:00-12:50", subject: "SPM", faculty: "J.R.", venue: "LH-3" },
        { time: "02:00-02:50", subject: "BI & Analytics", faculty: "AKD", venue: "TB-10" },
        { time: "02:50-03:40", subject: "BI & Analytics Lab", faculty: "AKD", venue: "Lab-4" },
      ],
      TUESDAY: [
        { time: "10:20-11:10", subject: "Minor Project", faculty: "Dr. R.N. Shukla", venue: "TB-10" },
        { time: "11:10-12:00", subject: "BI & Analytics", faculty: "AKD", venue: "LH-3" },
        { time: "12:00-12:50", subject: "SPM", faculty: "J.R.", venue: "LH-3" },
        { time: "02:00-02:50", subject: "Distributed Computing", faculty: "A.P.", venue: "TB-08" },
        { time: "02:50-03:40", subject: "DC Lab", faculty: "A.P.", venue: "Lab-2" },
      ],
      WEDNESDAY: [
        { time: "10:20-11:10", subject: "Minor Project", faculty: "Dr. R.N. Shukla", venue: "TB-10" },
        { time: "11:10-12:00", subject: "SPM", faculty: "J.R.", venue: "LH-3" },
        { time: "12:00-12:50", subject: "Distributed Computing", faculty: "A.P.", venue: "TB-08" },
        { time: "02:00-03:40", subject: "Project Work", venue: "Project Lab" },
      ],
      THURSDAY: [
        { time: "10:20-11:10", subject: "Minor Project", faculty: "Dr. R.N. Shukla", venue: "TB-10" },
        { time: "11:10-12:00", subject: "BI & Analytics", faculty: "AKD", venue: "LH-3" },
        { time: "12:00-12:50", subject: "Distributed Computing", faculty: "A.P.", venue: "TB-08" },
        { time: "02:00-02:50", subject: "SPM", faculty: "J.R.", venue: "LH-3" },
        { time: "02:50-03:40", subject: "Seminar", venue: "Seminar Hall" },
      ],
      FRIDAY: [
        { time: "10:20-11:10", subject: "Minor Project", faculty: "Dr. R.N. Shukla", venue: "TB-10" },
        { time: "11:10-12:00", subject: "BI & Analytics", faculty: "AKD", venue: "LH-3" },
        { time: "12:00-12:50", subject: "Distributed Computing", faculty: "A.P.", venue: "TB-08" },
        { time: "02:00-03:40", subject: "Project Review", venue: "TB-10" },
      ],
    },
  })

  // ==========================================
  // B.Sc Timetables (6 Semesters)
  // ==========================================

  // B.Sc Semester 1
  allTimetables.push({
    programCode: "BSC",
    semester: 1,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Physics-I", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "10:20-11:10", subject: "Mathematics-I", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Chemistry-I", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "02:00-03:40", subject: "Physics Lab", faculty: "Dr. A. Roy", venue: "Physics Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Chemistry-I", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "10:20-11:10", subject: "Physics-I", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "11:10-12:00", subject: "English", faculty: "Prof. D. Sharma", venue: "SC-103" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. C. Sen", venue: "Chem Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Mathematics-I", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "10:20-11:10", subject: "Chemistry-I", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "11:10-12:00", subject: "Physics-I", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "02:00-02:50", subject: "English", faculty: "Prof. D. Sharma", venue: "SC-103" },
        { time: "02:50-03:40", subject: "Tutorial" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "English", faculty: "Prof. D. Sharma", venue: "SC-103" },
        { time: "10:20-11:10", subject: "Mathematics-I", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "11:10-12:00", subject: "EVS", faculty: "Dr. E. Gupta", venue: "SC-104" },
        { time: "02:00-03:40", subject: "Math Tutorial", faculty: "Dr. B. Das", venue: "SC-101" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "EVS", faculty: "Dr. E. Gupta", venue: "SC-104" },
        { time: "10:20-11:10", subject: "Physics-I", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Mathematics-I", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "02:00-02:50", subject: "Chemistry-I", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Sc Semester 2
  allTimetables.push({
    programCode: "BSC",
    semester: 2,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Physics-II", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "10:20-11:10", subject: "Mathematics-II", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Chemistry-II", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "02:00-03:40", subject: "Physics Lab", faculty: "Dr. A. Roy", venue: "Physics Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Chemistry-II", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "10:20-11:10", subject: "Physics-II", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Computer Basics", faculty: "Prof. F. Kumar", venue: "SC-105" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. C. Sen", venue: "Chem Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Mathematics-II", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "10:20-11:10", subject: "Chemistry-II", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "11:10-12:00", subject: "Physics-II", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "02:00-03:40", subject: "Computer Lab", faculty: "Prof. F. Kumar", venue: "Comp Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Computer Basics", faculty: "Prof. F. Kumar", venue: "SC-105" },
        { time: "10:20-11:10", subject: "Mathematics-II", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Hindi/Regional Lang", faculty: "Prof. G. Rao", venue: "SC-103" },
        { time: "02:00-03:40", subject: "Math Tutorial", faculty: "Dr. B. Das", venue: "SC-101" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Hindi/Regional Lang", faculty: "Prof. G. Rao", venue: "SC-103" },
        { time: "10:20-11:10", subject: "Physics-II", faculty: "Dr. A. Roy", venue: "SC-101" },
        { time: "11:10-12:00", subject: "Mathematics-II", faculty: "Dr. B. Das", venue: "SC-101" },
        { time: "02:00-02:50", subject: "Chemistry-II", faculty: "Dr. C. Sen", venue: "SC-102" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Sc Semester 3
  allTimetables.push({
    programCode: "BSC",
    semester: 3,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Mechanics", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "10:20-11:10", subject: "Algebra", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Organic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "02:00-03:40", subject: "Physics Lab", faculty: "Dr. A. Roy", venue: "Physics Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Organic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "10:20-11:10", subject: "Mechanics", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Statistics", faculty: "Dr. H. Patel", venue: "SC-203" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. C. Sen", venue: "Chem Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Algebra", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "10:20-11:10", subject: "Organic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "11:10-12:00", subject: "Mechanics", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "02:00-02:50", subject: "Statistics", faculty: "Dr. H. Patel", venue: "SC-203" },
        { time: "02:50-03:40", subject: "Tutorial" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Statistics", faculty: "Dr. H. Patel", venue: "SC-203" },
        { time: "10:20-11:10", subject: "Algebra", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Elective", faculty: "TBA", venue: "SC-204" },
        { time: "02:00-03:40", subject: "Math Lab", faculty: "Dr. B. Das", venue: "Comp Lab" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Elective", faculty: "TBA", venue: "SC-204" },
        { time: "10:20-11:10", subject: "Mechanics", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Algebra", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "02:00-02:50", subject: "Organic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Sc Semester 4
  allTimetables.push({
    programCode: "BSC",
    semester: 4,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Electromagnetism", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "10:20-11:10", subject: "Real Analysis", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Inorganic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "02:00-03:40", subject: "Physics Lab", faculty: "Dr. A. Roy", venue: "Physics Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Inorganic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "10:20-11:10", subject: "Electromagnetism", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Numerical Methods", faculty: "Dr. H. Patel", venue: "SC-203" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. C. Sen", venue: "Chem Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Real Analysis", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "10:20-11:10", subject: "Inorganic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "11:10-12:00", subject: "Electromagnetism", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "02:00-03:40", subject: "Numerical Lab", faculty: "Dr. H. Patel", venue: "Comp Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Numerical Methods", faculty: "Dr. H. Patel", venue: "SC-203" },
        { time: "10:20-11:10", subject: "Real Analysis", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Elective", faculty: "TBA", venue: "SC-204" },
        { time: "02:00-03:40", subject: "Project Work", venue: "SC-Lab" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Elective", faculty: "TBA", venue: "SC-204" },
        { time: "10:20-11:10", subject: "Electromagnetism", faculty: "Dr. A. Roy", venue: "SC-201" },
        { time: "11:10-12:00", subject: "Real Analysis", faculty: "Dr. B. Das", venue: "SC-201" },
        { time: "02:00-02:50", subject: "Inorganic Chemistry", faculty: "Dr. C. Sen", venue: "SC-202" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Sc Semester 5
  allTimetables.push({
    programCode: "BSC",
    semester: 5,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Quantum Mechanics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "10:20-11:10", subject: "Complex Analysis", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Physical Chemistry", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "02:00-03:40", subject: "Advanced Physics Lab", faculty: "Dr. A. Roy", venue: "Physics Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Physical Chemistry", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "10:20-11:10", subject: "Quantum Mechanics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Specialization-I", faculty: "TBA", venue: "SC-303" },
        { time: "02:00-03:40", subject: "Chemistry Lab", faculty: "Dr. C. Sen", venue: "Chem Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Complex Analysis", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "10:20-11:10", subject: "Physical Chemistry", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "11:10-12:00", subject: "Quantum Mechanics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "02:00-03:40", subject: "Specialization Lab", venue: "SC-Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Specialization-I", faculty: "TBA", venue: "SC-303" },
        { time: "10:20-11:10", subject: "Complex Analysis", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Seminar", venue: "Seminar Hall" },
        { time: "02:00-03:40", subject: "Project Work", venue: "SC-Lab" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Seminar Presentation", venue: "Seminar Hall" },
        { time: "10:20-11:10", subject: "Quantum Mechanics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Complex Analysis", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "02:00-02:50", subject: "Physical Chemistry", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Sc Semester 6
  allTimetables.push({
    programCode: "BSC",
    semester: 6,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Solid State Physics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "10:20-11:10", subject: "Differential Equations", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Advanced Organic Chem", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "02:00-03:40", subject: "Project Work", venue: "SC-Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Advanced Organic Chem", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "10:20-11:10", subject: "Solid State Physics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Specialization-II", faculty: "TBA", venue: "SC-303" },
        { time: "02:00-03:40", subject: "Project Work", venue: "SC-Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Differential Equations", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "10:20-11:10", subject: "Advanced Organic Chem", faculty: "Dr. C. Sen", venue: "SC-302" },
        { time: "11:10-12:00", subject: "Solid State Physics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "02:00-03:40", subject: "Project Work", venue: "SC-Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Specialization-II", faculty: "TBA", venue: "SC-303" },
        { time: "10:20-11:10", subject: "Differential Equations", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Viva Preparation", venue: "SC-301" },
        { time: "02:00-03:40", subject: "Project Presentation", venue: "Seminar Hall" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Project Review", venue: "SC-301" },
        { time: "10:20-11:10", subject: "Solid State Physics", faculty: "Dr. A. Roy", venue: "SC-301" },
        { time: "11:10-12:00", subject: "Differential Equations", faculty: "Dr. B. Das", venue: "SC-301" },
        { time: "02:00-03:40", subject: "Final Year Project", venue: "SC-Lab" },
      ],
    },
  })

  // ==========================================
  // BBA Timetables (6 Semesters)
  // ==========================================

  // BBA Semester 1
  allTimetables.push({
    programCode: "BBA",
    semester: 1,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Principles of Management", faculty: "Dr. R. Mehta", venue: "MB-101" },
        { time: "10:20-11:10", subject: "Business Economics", faculty: "Prof. S. Jain", venue: "MB-101" },
        { time: "11:10-12:00", subject: "Business Communication", faculty: "Dr. T. Verma", venue: "MB-102" },
        { time: "02:00-03:40", subject: "Computer Applications Lab", venue: "Comp Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Business Communication", faculty: "Dr. T. Verma", venue: "MB-102" },
        { time: "10:20-11:10", subject: "Principles of Management", faculty: "Dr. R. Mehta", venue: "MB-101" },
        { time: "11:10-12:00", subject: "Financial Accounting", faculty: "Prof. U. Sharma", venue: "MB-103" },
        { time: "02:00-02:50", subject: "Business Economics", faculty: "Prof. S. Jain", venue: "MB-101" },
        { time: "02:50-03:40", subject: "Tutorial" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Financial Accounting", faculty: "Prof. U. Sharma", venue: "MB-103" },
        { time: "10:20-11:10", subject: "Business Communication", faculty: "Dr. T. Verma", venue: "MB-102" },
        { time: "11:10-12:00", subject: "Principles of Management", faculty: "Dr. R. Mehta", venue: "MB-101" },
        { time: "02:00-03:40", subject: "Case Study Discussion", venue: "MB-101" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Business Economics", faculty: "Prof. S. Jain", venue: "MB-101" },
        { time: "10:20-11:10", subject: "Financial Accounting", faculty: "Prof. U. Sharma", venue: "MB-103" },
        { time: "11:10-12:00", subject: "Business Mathematics", faculty: "Dr. V. Gupta", venue: "MB-104" },
        { time: "02:00-02:50", subject: "Principles of Management", faculty: "Dr. R. Mehta", venue: "MB-101" },
        { time: "02:50-03:40", subject: "Soft Skills" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Business Mathematics", faculty: "Dr. V. Gupta", venue: "MB-104" },
        { time: "10:20-11:10", subject: "Business Economics", faculty: "Prof. S. Jain", venue: "MB-101" },
        { time: "11:10-12:00", subject: "Financial Accounting", faculty: "Prof. U. Sharma", venue: "MB-103" },
        { time: "02:00-02:50", subject: "Business Communication", faculty: "Dr. T. Verma", venue: "MB-102" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // BBA Semester 2-6 (similar structure)
  for (let sem = 2; sem <= 6; sem++) {
    const subjects = {
      2: ["Business Law", "Organizational Behavior", "Cost Accounting", "Marketing Management", "Business Statistics"],
      3: [
        "Human Resource Mgmt",
        "Production Management",
        "Financial Management",
        "Business Research",
        "Indian Economy",
      ],
      4: ["Strategic Management", "Entrepreneurship", "Consumer Behavior", "Operations Research", "Taxation"],
      5: ["International Business", "Project Management", "Supply Chain Mgmt", "Corporate Governance", "Elective-I"],
      6: ["Business Ethics", "Summer Internship", "Project Work", "Elective-II", "Comprehensive Viva"],
    }

    allTimetables.push({
      programCode: "BBA",
      semester: sem,
      academicYear,
      timetable: {
        MONDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "MB-201",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "MB-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "MB-202",
          },
          {
            time: "02:00-03:40",
            subject: sem <= 4 ? "Lab/Tutorial" : "Project Work",
            venue: sem <= 4 ? "Lab" : "Project Room",
          },
        ],
        TUESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "MB-202",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "MB-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "MB-203",
          },
          { time: "02:00-03:40", subject: "Case Studies", venue: "MB-201" },
        ],
        WEDNESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "MB-203",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "MB-204",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "MB-201",
          },
          { time: "02:00-03:40", subject: "Group Discussion", venue: "Seminar Hall" },
        ],
        THURSDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "MB-201",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "MB-203",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "MB-204",
          },
          { time: "02:00-03:40", subject: "Industry Visit/Guest Lecture", venue: "Auditorium" },
        ],
        FRIDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "MB-204",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "MB-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "MB-202",
          },
          { time: "02:00-03:40", subject: "Library/Self Study" },
        ],
      },
    })
  }

  // ==========================================
  // B.Com Timetables (6 Semesters)
  // ==========================================

  // B.Com Semester 1
  allTimetables.push({
    programCode: "BCOM",
    semester: 1,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Financial Accounting-I", faculty: "Prof. A. Agarwal", venue: "COM-101" },
        { time: "10:20-11:10", subject: "Business Economics", faculty: "Dr. B. Bansal", venue: "COM-101" },
        { time: "11:10-12:00", subject: "Business Organization", faculty: "Prof. C. Choudhary", venue: "COM-102" },
        { time: "02:00-03:40", subject: "Computer Applications Lab", venue: "Comp Lab" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Business Organization", faculty: "Prof. C. Choudhary", venue: "COM-102" },
        { time: "10:20-11:10", subject: "Financial Accounting-I", faculty: "Prof. A. Agarwal", venue: "COM-101" },
        { time: "11:10-12:00", subject: "Business Law", faculty: "Dr. D. Dubey", venue: "COM-103" },
        { time: "02:00-02:50", subject: "Business Economics", faculty: "Dr. B. Bansal", venue: "COM-101" },
        { time: "02:50-03:40", subject: "Tutorial" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Business Law", faculty: "Dr. D. Dubey", venue: "COM-103" },
        { time: "10:20-11:10", subject: "Business Organization", faculty: "Prof. C. Choudhary", venue: "COM-102" },
        { time: "11:10-12:00", subject: "Financial Accounting-I", faculty: "Prof. A. Agarwal", venue: "COM-101" },
        { time: "02:00-03:40", subject: "Tally Practical", venue: "Comp Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Business Economics", faculty: "Dr. B. Bansal", venue: "COM-101" },
        { time: "10:20-11:10", subject: "Business Law", faculty: "Dr. D. Dubey", venue: "COM-103" },
        { time: "11:10-12:00", subject: "English/Hindi", faculty: "Prof. E. Singh", venue: "COM-104" },
        { time: "02:00-02:50", subject: "Financial Accounting-I", faculty: "Prof. A. Agarwal", venue: "COM-101" },
        { time: "02:50-03:40", subject: "Soft Skills" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "English/Hindi", faculty: "Prof. E. Singh", venue: "COM-104" },
        { time: "10:20-11:10", subject: "Business Economics", faculty: "Dr. B. Bansal", venue: "COM-101" },
        { time: "11:10-12:00", subject: "Business Law", faculty: "Dr. D. Dubey", venue: "COM-103" },
        { time: "02:00-02:50", subject: "Business Organization", faculty: "Prof. C. Choudhary", venue: "COM-102" },
        { time: "02:50-03:40", subject: "Library" },
      ],
    },
  })

  // B.Com Semester 2-6
  for (let sem = 2; sem <= 6; sem++) {
    const subjects = {
      2: [
        "Financial Accounting-II",
        "Cost Accounting",
        "Company Law",
        "Business Statistics",
        "Commercial Correspondence",
      ],
      3: ["Corporate Accounting", "Income Tax", "Management Accounting", "Marketing", "Banking Operations"],
      4: ["Advanced Accounting", "GST & Customs", "Auditing", "Financial Markets", "E-Commerce"],
      5: ["Advanced Cost Accounting", "Investment Management", "Strategic Management", "Tax Planning", "Elective-I"],
      6: ["Corporate Tax", "Financial Analysis", "Project Report", "Elective-II", "Comprehensive Viva"],
    }

    allTimetables.push({
      programCode: "BCOM",
      semester: sem,
      academicYear,
      timetable: {
        MONDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "COM-201",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "COM-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "COM-202",
          },
          { time: "02:00-03:40", subject: "Practical/Tutorial", venue: "COM-Lab" },
        ],
        TUESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "COM-202",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "COM-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "COM-203",
          },
          { time: "02:00-03:40", subject: "Tally/Excel Lab", venue: "Comp Lab" },
        ],
        WEDNESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "COM-203",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "COM-204",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Faculty",
            venue: "COM-201",
          },
          { time: "02:00-03:40", subject: "Case Study", venue: "COM-201" },
        ],
        THURSDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "COM-201",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Faculty",
            venue: "COM-203",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "COM-204",
          },
          { time: "02:00-03:40", subject: "Guest Lecture/Seminar", venue: "Auditorium" },
        ],
        FRIDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Faculty",
            venue: "COM-204",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Faculty",
            venue: "COM-201",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Faculty",
            venue: "COM-202",
          },
          { time: "02:00-03:40", subject: "Library/Self Study" },
        ],
      },
    })
  }

  // ==========================================
  // M.Sc Timetables (4 Semesters)
  // ==========================================

  for (let sem = 1; sem <= 4; sem++) {
    const subjects = {
      1: [
        "Advanced Mathematics-I",
        "Research Methodology",
        "Specialization Core-I",
        "Specialization Core-II",
        "Lab/Seminar",
      ],
      2: [
        "Advanced Mathematics-II",
        "Statistical Methods",
        "Specialization Core-III",
        "Specialization Core-IV",
        "Lab/Seminar",
      ],
      3: ["Advanced Topics-I", "Advanced Topics-II", "Elective-I", "Research Project", "Seminar"],
      4: ["Dissertation", "Viva Voce", "Comprehensive Exam", "Research Presentation", "Final Review"],
    }

    allTimetables.push({
      programCode: "MSC",
      semester: sem,
      academicYear,
      timetable: {
        MONDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Dr. Faculty",
            venue: "PG-102",
          },
          {
            time: "02:00-03:40",
            subject: sem <= 2 ? "Lab Work" : "Research Work",
            venue: sem <= 2 ? "PG Lab" : "Research Lab",
          },
        ],
        TUESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Dr. Faculty",
            venue: "PG-102",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Dr. Faculty",
            venue: "PG-103",
          },
          { time: "02:00-03:40", subject: "Seminar/Presentation", venue: "Seminar Hall" },
        ],
        WEDNESDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Dr. Faculty",
            venue: "PG-103",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Dr. Faculty",
            venue: "PG-104",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][0],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          { time: "02:00-03:40", subject: "Literature Review", venue: "Library" },
        ],
        THURSDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][3],
            faculty: "Dr. Faculty",
            venue: "PG-103",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Dr. Faculty",
            venue: "PG-104",
          },
          { time: "02:00-03:40", subject: "Thesis Work", venue: "Research Lab" },
        ],
        FRIDAY: [
          {
            time: "09:30-10:20",
            subject: subjects[sem as keyof typeof subjects][4],
            faculty: "Dr. Faculty",
            venue: "PG-104",
          },
          {
            time: "10:20-11:10",
            subject: subjects[sem as keyof typeof subjects][1],
            faculty: "Dr. Faculty",
            venue: "PG-101",
          },
          {
            time: "11:10-12:00",
            subject: subjects[sem as keyof typeof subjects][2],
            faculty: "Dr. Faculty",
            venue: "PG-102",
          },
          { time: "02:00-03:40", subject: "Group Discussion/Viva Prep" },
        ],
      },
    })
  }

  // ==========================================
  // MBA Timetables (4 Semesters)
  // ==========================================

  // MBA Semester 1
  allTimetables.push({
    programCode: "MBA",
    semester: 1,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Organizational Behavior", faculty: "Dr. K. Sharma", venue: "MBA-101" },
        { time: "10:20-11:10", subject: "Managerial Economics", faculty: "Prof. L. Mehta", venue: "MBA-101" },
        { time: "11:10-12:00", subject: "Financial Accounting", faculty: "Dr. M. Gupta", venue: "MBA-102" },
        { time: "02:00-03:40", subject: "Case Analysis", venue: "MBA-101" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Financial Accounting", faculty: "Dr. M. Gupta", venue: "MBA-102" },
        { time: "10:20-11:10", subject: "Organizational Behavior", faculty: "Dr. K. Sharma", venue: "MBA-101" },
        { time: "11:10-12:00", subject: "Marketing Management", faculty: "Prof. N. Singh", venue: "MBA-103" },
        { time: "02:00-03:40", subject: "Business Communication Lab", venue: "MBA Lab" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Marketing Management", faculty: "Prof. N. Singh", venue: "MBA-103" },
        { time: "10:20-11:10", subject: "Quantitative Techniques", faculty: "Dr. O. Patel", venue: "MBA-104" },
        { time: "11:10-12:00", subject: "Organizational Behavior", faculty: "Dr. K. Sharma", venue: "MBA-101" },
        { time: "02:00-03:40", subject: "Excel/SPSS Lab", venue: "Comp Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Managerial Economics", faculty: "Prof. L. Mehta", venue: "MBA-101" },
        { time: "10:20-11:10", subject: "Marketing Management", faculty: "Prof. N. Singh", venue: "MBA-103" },
        { time: "11:10-12:00", subject: "Quantitative Techniques", faculty: "Dr. O. Patel", venue: "MBA-104" },
        { time: "02:00-03:40", subject: "Industry Interaction", venue: "Auditorium" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Quantitative Techniques", faculty: "Dr. O. Patel", venue: "MBA-104" },
        { time: "10:20-11:10", subject: "Managerial Economics", faculty: "Prof. L. Mehta", venue: "MBA-101" },
        { time: "11:10-12:00", subject: "Financial Accounting", faculty: "Dr. M. Gupta", venue: "MBA-102" },
        { time: "02:00-03:40", subject: "Library/Group Project" },
      ],
      SATURDAY: [
        { time: "09:30-11:10", subject: "Guest Lecture Series", venue: "Auditorium" },
        { time: "11:10-12:50", subject: "Group Discussion Practice", venue: "MBA-101" },
      ],
    },
  })

  // MBA Semester 2
  allTimetables.push({
    programCode: "MBA",
    semester: 2,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Financial Management", faculty: "Dr. P. Kumar", venue: "MBA-201" },
        { time: "10:20-11:10", subject: "Human Resource Mgmt", faculty: "Prof. Q. Rao", venue: "MBA-201" },
        { time: "11:10-12:00", subject: "Operations Management", faculty: "Dr. R. Sinha", venue: "MBA-202" },
        { time: "02:00-03:40", subject: "Case Analysis", venue: "MBA-201" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Operations Management", faculty: "Dr. R. Sinha", venue: "MBA-202" },
        { time: "10:20-11:10", subject: "Financial Management", faculty: "Dr. P. Kumar", venue: "MBA-201" },
        { time: "11:10-12:00", subject: "Research Methodology", faculty: "Prof. S. Joshi", venue: "MBA-203" },
        { time: "02:00-03:40", subject: "Research Project Work", venue: "Library" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Research Methodology", faculty: "Prof. S. Joshi", venue: "MBA-203" },
        { time: "10:20-11:10", subject: "Business Law & Ethics", faculty: "Dr. T. Verma", venue: "MBA-204" },
        { time: "11:10-12:00", subject: "Financial Management", faculty: "Dr. P. Kumar", venue: "MBA-201" },
        { time: "02:00-03:40", subject: "SPSS/SAS Lab", venue: "Comp Lab" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Human Resource Mgmt", faculty: "Prof. Q. Rao", venue: "MBA-201" },
        { time: "10:20-11:10", subject: "Research Methodology", faculty: "Prof. S. Joshi", venue: "MBA-203" },
        { time: "11:10-12:00", subject: "Business Law & Ethics", faculty: "Dr. T. Verma", venue: "MBA-204" },
        { time: "02:00-03:40", subject: "Summer Internship Prep", venue: "MBA-201" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Business Law & Ethics", faculty: "Dr. T. Verma", venue: "MBA-204" },
        { time: "10:20-11:10", subject: "Human Resource Mgmt", faculty: "Prof. Q. Rao", venue: "MBA-201" },
        { time: "11:10-12:00", subject: "Operations Management", faculty: "Dr. R. Sinha", venue: "MBA-202" },
        { time: "02:00-03:40", subject: "Mock Interview/GD" },
      ],
      SATURDAY: [
        { time: "09:30-11:10", subject: "Industry Expert Session", venue: "Auditorium" },
        { time: "11:10-12:50", subject: "Placement Preparation", venue: "MBA-201" },
      ],
    },
  })

  // MBA Semester 3
  allTimetables.push({
    programCode: "MBA",
    semester: 3,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "Strategic Management", faculty: "Dr. U. Kapoor", venue: "MBA-301" },
        { time: "10:20-11:10", subject: "Specialization-I", faculty: "Faculty", venue: "MBA-301" },
        { time: "11:10-12:00", subject: "Specialization-II", faculty: "Faculty", venue: "MBA-302" },
        { time: "02:00-03:40", subject: "Live Project Work", venue: "Project Room" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Specialization-II", faculty: "Faculty", venue: "MBA-302" },
        { time: "10:20-11:10", subject: "Strategic Management", faculty: "Dr. U. Kapoor", venue: "MBA-301" },
        { time: "11:10-12:00", subject: "Elective-I", faculty: "Faculty", venue: "MBA-303" },
        { time: "02:00-03:40", subject: "Industry Visit", venue: "External" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Elective-I", faculty: "Faculty", venue: "MBA-303" },
        { time: "10:20-11:10", subject: "Elective-II", faculty: "Faculty", venue: "MBA-304" },
        { time: "11:10-12:00", subject: "Strategic Management", faculty: "Dr. U. Kapoor", venue: "MBA-301" },
        { time: "02:00-03:40", subject: "Dissertation Work", venue: "Library" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Specialization-I", faculty: "Faculty", venue: "MBA-301" },
        { time: "10:20-11:10", subject: "Elective-I", faculty: "Faculty", venue: "MBA-303" },
        { time: "11:10-12:00", subject: "Elective-II", faculty: "Faculty", venue: "MBA-304" },
        { time: "02:00-03:40", subject: "Case Competition Prep", venue: "MBA-301" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Elective-II", faculty: "Faculty", venue: "MBA-304" },
        { time: "10:20-11:10", subject: "Specialization-I", faculty: "Faculty", venue: "MBA-301" },
        { time: "11:10-12:00", subject: "Specialization-II", faculty: "Faculty", venue: "MBA-302" },
        { time: "02:00-03:40", subject: "Placement Activities" },
      ],
      SATURDAY: [
        { time: "09:30-11:10", subject: "Corporate Mentor Session", venue: "Auditorium" },
        { time: "11:10-12:50", subject: "Leadership Workshop", venue: "MBA-301" },
      ],
    },
  })

  // MBA Semester 4
  allTimetables.push({
    programCode: "MBA",
    semester: 4,
    academicYear,
    timetable: {
      MONDAY: [
        { time: "09:30-10:20", subject: "International Business", faculty: "Dr. V. Sharma", venue: "MBA-401" },
        { time: "10:20-11:10", subject: "Specialization-III", faculty: "Faculty", venue: "MBA-401" },
        { time: "11:10-12:00", subject: "Specialization-IV", faculty: "Faculty", venue: "MBA-402" },
        { time: "02:00-03:40", subject: "Dissertation Work", venue: "Project Room" },
      ],
      TUESDAY: [
        { time: "09:30-10:20", subject: "Specialization-IV", faculty: "Faculty", venue: "MBA-402" },
        { time: "10:20-11:10", subject: "International Business", faculty: "Dr. V. Sharma", venue: "MBA-401" },
        { time: "11:10-12:00", subject: "Comprehensive Review", faculty: "All Faculty", venue: "MBA-403" },
        { time: "02:00-03:40", subject: "Dissertation Review", venue: "Conference Room" },
      ],
      WEDNESDAY: [
        { time: "09:30-10:20", subject: "Comprehensive Review", faculty: "All Faculty", venue: "MBA-403" },
        { time: "10:20-11:10", subject: "Entrepreneurship", faculty: "Prof. W. Mishra", venue: "MBA-404" },
        { time: "11:10-12:00", subject: "International Business", faculty: "Dr. V. Sharma", venue: "MBA-401" },
        { time: "02:00-03:40", subject: "Final Project Submission", venue: "Project Room" },
      ],
      THURSDAY: [
        { time: "09:30-10:20", subject: "Specialization-III", faculty: "Faculty", venue: "MBA-401" },
        { time: "10:20-11:10", subject: "Comprehensive Review", faculty: "All Faculty", venue: "MBA-403" },
        { time: "11:10-12:00", subject: "Entrepreneurship", faculty: "Prof. W. Mishra", venue: "MBA-404" },
        { time: "02:00-03:40", subject: "Viva Preparation", venue: "MBA-401" },
      ],
      FRIDAY: [
        { time: "09:30-10:20", subject: "Entrepreneurship", faculty: "Prof. W. Mishra", venue: "MBA-404" },
        { time: "10:20-11:10", subject: "Specialization-III", faculty: "Faculty", venue: "MBA-401" },
        { time: "11:10-12:00", subject: "Specialization-IV", faculty: "Faculty", venue: "MBA-402" },
        { time: "02:00-03:40", subject: "Final Presentations" },
      ],
      SATURDAY: [
        { time: "09:30-11:10", subject: "Alumni Interaction", venue: "Auditorium" },
        { time: "11:10-12:50", subject: "Convocation Preparation", venue: "Main Hall" },
      ],
    },
  })

  return allTimetables
}

export async function seedCampusDataIfEmpty() {
  try {
    // Check if data already exists
    const programCount = await Program.countDocuments()

    if (programCount > 0) {
      logger.info("Campus data already exists. Skipping seeding.")
      await seedClassTimetablesIfEmpty()
      return
    }

    logger.info("No campus data found. Starting automatic seeding...")

    const programs = [
      {
        code: "BTECH",
        name: {
          en: "B.Tech",
          hi: "बी.टेक",
          ta: "பி.டெக்",
          te: "బి.టెక్",
          bn: "বি.টেক",
          mr: "बी.टेक",
        },
        duration: 8,
        isActive: true,
      },
      {
        code: "BSC",
        name: {
          en: "B.Sc",
          hi: "बी.एससी",
          ta: "பி.எஸ்சி",
          te: "బి.ఎస్సీ",
          bn: "বি.এসসি",
          mr: "बी.एससी",
        },
        duration: 6,
        isActive: true,
      },
      {
        code: "BBA",
        name: {
          en: "BBA",
          hi: "बीबीए",
          ta: "பிபிஏ",
          te: "బిబిఎ",
          bn: "বিবিএ",
          mr: "बीबीए",
        },
        duration: 6,
        isActive: true,
      },
      {
        code: "BCOM",
        name: {
          en: "B.Com",
          hi: "बी.कॉम",
          ta: "பி.காம்",
          te: "బి.కామ్",
          bn: "বি.কম",
          mr: "बी.कॉम",
        },
        duration: 6,
        isActive: true,
      },
      {
        code: "MSC",
        name: {
          en: "M.Sc",
          hi: "एम.एससी",
          ta: "எம்.எஸ்சி",
          te: "ఎం.ఎస్సీ",
          bn: "এম.এসসি",
          mr: "एम.एससी",
        },
        duration: 4,
        isActive: true,
      },
      {
        code: "MBA",
        name: {
          en: "MBA",
          hi: "एमबीए",
          ta: "எம்பிஏ",
          te: "ఎంబిఎ",
          bn: "এমবিএ",
          mr: "एमबीए",
        },
        duration: 4,
        isActive: true,
      },
    ]
    await Program.insertMany(programs)
    logger.info(`Seeded ${programs.length} programs`)

    const branches = [
      // B.Tech Branches
      {
        programCode: "BTECH",
        code: "CSE",
        name: {
          en: "Computer Science Engineering",
          hi: "कंप्यूटर विज्ञान इंजीनियरिंग",
          ta: "கணினி அறிவியல் பொறியியல்",
          te: "కంప్యూటర్ సైన్స్ ఇంజనీరింగ్",
          bn: "কম্পিউটার বিজ্ঞান প্রকৌশল",
          mr: "संगणक विज्ञान अभियांत्रिकी",
        },
        semesterFee: 75000,
        isActive: true,
      },
      {
        programCode: "BTECH",
        code: "MECH",
        name: {
          en: "Mechanical Engineering",
          hi: "मैकेनिकल इंजीनियरिंग",
          ta: "இயந்திர பொறியியல்",
          te: "మెకానికల్ ఇంజనీరింగ్",
          bn: "যান্ত্রিক প্রকৌশল",
          mr: "यांत्रिक अभियांत्रिकी",
        },
        semesterFee: 72000,
        isActive: true,
      },
      {
        programCode: "BTECH",
        code: "ECE",
        name: {
          en: "Electrical Engineering",
          hi: "इलेक्ट्रिकल इंजीनियरिंग",
          ta: "மின் பொறியியல்",
          te: "ఎలక్ట్రికల్ ఇంజనీరింగ్",
          bn: "বৈদ্যুতিক প্রকৌশল",
          mr: "विद्युत अभियांत्रिकी",
        },
        semesterFee: 71000,
        isActive: true,
      },
      {
        programCode: "BTECH",
        code: "CIVIL",
        name: {
          en: "Civil Engineering",
          hi: "सिविल इंजीनियरिंग",
          ta: "சிவில் பொறியியல்",
          te: "సివిల్ ఇంజనీరింగ్",
          bn: "পুরকৌশল",
          mr: "नागरी अभियांत्रिकी",
        },
        semesterFee: 70000,
        isActive: true,
      },
      {
        programCode: "BTECH",
        code: "MECHATRONICS",
        name: {
          en: "Mechatronics Engineering",
          hi: "मेक्ट्रोनिक्स इंजीनियरिंग",
          ta: "மெக்கட்ரானிக்ஸ் பொறியியல்",
          te: "మెకాట్రానిక్స్ ఇంజనీరింగ్",
          bn: "মেকাট্রনিক্স প্রকৌশল",
          mr: "मेकॅट्रॉनिक्स अभियांत्रिकी",
        },
        semesterFee: 73000,
        isActive: true,
      },

      // B.Sc Branches
      {
        programCode: "BSC",
        code: "MATH",
        name: { en: "Mathematics", hi: "गणित", ta: "கணிதம்", te: "గణితం", bn: "গণিত", mr: "गणित" },
        semesterFee: 40000,
        isActive: true,
      },
      {
        programCode: "BSC",
        code: "PHYSICS",
        name: { en: "Physics", hi: "भौतिकी", ta: "இயற்பியல்", te: "భౌతిక శాస్త్రం", bn: "পদার্থবিজ্ঞান", mr: "भौतिकशास्त्र" },
        semesterFee: 43000,
        isActive: true,
      },
      {
        programCode: "BSC",
        code: "CHEMISTRY",
        name: { en: "Chemistry", hi: "रसायन विज्ञान", ta: "வேதியியல்", te: "రసాయన శాస్త్రం", bn: "রসায়ন", mr: "रसायनशास्त्र" },
        semesterFee: 42000,
        isActive: true,
      },
      {
        programCode: "BSC",
        code: "BIOTECH",
        name: {
          en: "Biotechnology",
          hi: "जैव प्रौद्योगिकी",
          ta: "உயிரி தொழில்நுட்பம்",
          te: "బయోటెక్నాలజీ",
          bn: "জৈবপ্রযুক্তি",
          mr: "जैवतंत्रज्ञान",
        },
        semesterFee: 45000,
        isActive: true,
      },

      // BBA & B.Com
      {
        programCode: "BBA",
        code: "GENERAL",
        name: { en: "General", hi: "सामान्य", ta: "பொது", te: "సాధారణ", bn: "সাধারণ", mr: "सामान्य" },
        semesterFee: 50000,
        isActive: true,
      },
      {
        programCode: "BCOM",
        code: "GENERAL",
        name: { en: "General", hi: "सामान्य", ta: "பொது", te: "సాధారణ", bn: "সাধারণ", mr: "सामान्य" },
        semesterFee: 35000,
        isActive: true,
      },

      // M.Sc Branches
      {
        programCode: "MSC",
        code: "MATH",
        name: { en: "Mathematics", hi: "गणित", ta: "கணிதம்", te: "గణితం", bn: "গণিত", mr: "गणित" },
        semesterFee: 55000,
        isActive: true,
      },
      {
        programCode: "MSC",
        code: "PHYSICS",
        name: { en: "Physics", hi: "भौतिकी", ta: "இயற்பியல்", te: "భౌతిక శాస్త్రం", bn: "পদার্থবিজ্ঞান", mr: "भौतिकशास्त्र" },
        semesterFee: 58000,
        isActive: true,
      },

      // MBA Branches
      {
        programCode: "MBA",
        code: "FINANCE",
        name: { en: "Finance", hi: "वित्त", ta: "நிதி", te: "ఫైనాన్స్", bn: "অর্থায়ন", mr: "वित्त" },
        semesterFee: 90000,
        isActive: true,
      },
      {
        programCode: "MBA",
        code: "MARKETING",
        name: { en: "Marketing", hi: "विपणन", ta: "சந்தைப்படுத்தல்", te: "మార్కెటింగ్", bn: "বিপণন", mr: "विपणन" },
        semesterFee: 88000,
        isActive: true,
      },
      {
        programCode: "MBA",
        code: "HR",
        name: {
          en: "Human Resources",
          hi: "मानव संसाधन",
          ta: "மனித வளங்கள்",
          te: "మానవ వనరులు",
          bn: "মানব সম্পদ",
          mr: "मानव संसाधन",
        },
        semesterFee: 85000,
        isActive: true,
      },
      {
        programCode: "MBA",
        code: "OPERATIONS",
        name: {
          en: "Operations Management",
          hi: "संचालन प्रबंधन",
          ta: "செயல்பாட்டு மேலாண்மை",
          te: "కార్యకలాపాల నిర్వహణ",
          bn: "অপারেশন ম্যানেজমেন্ট",
          mr: "ऑपरेशन्स मॅनेजमेंट",
        },
        semesterFee: 87000,
        isActive: true,
      },
    ]
    await Branch.insertMany(branches)
    logger.info(`Seeded ${branches.length} branches with fees`)

    const timetables = [
      {
        programCode: "BTECH",
        semester: 5,
        examEntries: [
          { subject: "Data Structures", date: "10 Sept" },
          { subject: "Operating Systems", date: "13 Sept" },
          { subject: "Database Management Systems", date: "16 Sept" },
          { subject: "Computer Networks", date: "19 Sept" },
          { subject: "Software Engineering", date: "22 Sept" },
        ],
        academicYear: "2025-2026",
        isActive: true,
      },
      {
        programCode: "BSC",
        semester: 3,
        examEntries: [
          { subject: "Physics", date: "11 Sept" },
          { subject: "Mathematics", date: "14 Sept" },
          { subject: "Chemistry", date: "17 Sept" },
          { subject: "Biology", date: "20 Sept" },
        ],
        academicYear: "2025-2026",
        isActive: true,
      },
      {
        programCode: "MBA",
        semester: 2,
        examEntries: [
          { subject: "Financial Management", date: "12 Sept" },
          { subject: "Marketing Management", date: "15 Sept" },
          { subject: "Human Resource Management", date: "18 Sept" },
          { subject: "Operations Management", date: "21 Sept" },
        ],
        academicYear: "2025-2026",
        isActive: true,
      },
    ]
    await Timetable.insertMany(timetables)
    logger.info(`Seeded ${timetables.length} exam timetables`)

    const scholarships = [
      {
        name: {
          en: "Post-Matric Scholarship",
          hi: "पोस्ट-मैट्रिक छात्रवृत्ति",
          ta: "பிந்தைய மெட்ரிக் உதவித்தொகை",
          te: "పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్",
          bn: "পোস্ট-ম্যাট্রিক বৃত্তি",
          mr: "पोस्ट-मॅट्रिक शिष्यवृत्ती",
        },
        description: {
          en: "Government scholarship for SC/ST/OBC students pursuing higher education",
          hi: "उच्च शिक्षा प्राप्त करने वाले एससी/एसटी/ओबीसी छात्रों के लिए सरकारी छात्रवृत्ति",
          ta: "உயர் கல்வி பயிலும் எஸ்சி/எஸ்டி/ஓபிசி மாணவர்களுக்கு அரசு உதவித்தொகை",
          te: "ఉన్నత విద్యను అభ్యసిస్తున్న SC/ST/OBC విద్యార్థులకు ప్రభుత్వ స్కాలర్‌షిప్",
          bn: "উচ্চশিক্ষা গ্রহণকারী SC/ST/OBC শিক্ষার্থীদের জন্য সরকারি বৃত্তি",
          mr: "उच्च शिक्षण घेणाऱ्या SC/ST/OBC विद्यार्थ्यांसाठी सरकारी शिष्यवृत्ती",
        },
        eligibility: {
          en: "Student must belong to SC/ST/OBC category with family income below ₹2,50,000",
          hi: "छात्र को एससी/एसटी/ओबीसी श्रेणी से होना चाहिए और परिवार की वार्षिक आय ₹2,50,000 से कम होनी चाहिए",
          ta: "மாணவர் எஸ்சி/எஸ்டி/ஓபிசி வகையைச் சேர்ந்தவராக இருக்க வேண்டும் மற்றும் குடும்ப வருமானம் ₹2,50,000க்கு கீழ் இருக்க வேண்டும்",
          te: "విద్యార్థి SC/ST/OBC వర్గానికి చెందినవారై ఉండాలి మరియు కుటుంబ ఆదాయం ₹2,50,000 కంటే తక్కువగా ఉండాలి",
          bn: "শিক্ষার্থীকে SC/ST/OBC শ্রেণীর অন্তর্গত হতে হবে এবং পারিবারিক আয় ₹2,50,000-এর নিচে হতে হবে",
          mr: "विद्यार्थी SC/ST/OBC श्रेणीचा असावा आणि कौटुंबिक उत्पन्न ₹2,50,000 पेक्षा कमी असावे",
        },
        amount: "Up to ₹50,000 per year",
        applicationProcess: {
          en: "Apply online through National Scholarship Portal (NSP)",
          hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) के माध्यम से ऑनलाइन आवेदन करें",
          ta: "தேசிய உதவித்தொகை போர்டல் (NSP) மூலம் ஆன்லைனில் விண்ணப்பிக்கவும்",
          te: "నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP) ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేయండి",
          bn: "ন্যাশনাল স্কলারশিপ পোর্টাল (NSP) এর মাধ্যমে অনলাইনে আবেদন করুন",
          mr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) द्वारे ऑनलाइन अर्ज करा",
        },
        deadline: new Date("2025-08-25"),
        isActive: true,
      },
      {
        name: {
          en: "Merit-Cum-Means Scholarship",
          hi: "मेरिट-कम-मीन्स छात्रवृत्ति",
          ta: "தகுதி-கம்-வழிமுறைகள் உதவித்தொகை",
          te: "మెరిట్-కమ్-మీన్స్ స్కాలర్‌షిప్",
          bn: "মেধা-কাম-মাধ্যম বৃত্তি",
          mr: "मेरिट-कम-मीन्स शिष्यवृत्ती",
        },
        description: {
          en: "For minority community students with excellent academic records",
          hi: "उत्कृष्ट शैक्षणिक रिकॉर्ड वाले अल्पसंख्यक समुदाय के छात्रों के लिए",
          ta: "சிறந்த கல்வி சாதனைகளுடன் சிறுபான்மை சமூக மாணவர்களுக்கு",
          te: "అద్భుతమైన విద్యా రికార్డులతో మైనారిటీ కమ్యూనిటీ విద్యార్థులకు",
          bn: "উৎকৃষ্ট শিক্ষাগত রেকর্ড সহ সংখ্যালঘু সম্প্রদায়ের শিক্ষার্থীদের জন্য",
          mr: "उत्कृष्ट शैक्षणिक रेकॉર्ड असलेल्या अल्पसंख्याक समुदायाच्या विद्यार्थ्यांसाठी",
        },
        eligibility: {
          en: "Student must belong to minority community with minimum 60% marks",
          hi: "छात्र अल्पसंख्यक समुदाय से होना चाहिए और न्यूनतम 60% अंक होने चाहिए",
          ta: "மாணவர் சிறுபான்மை சமூகத்தைச் சேர்ந்தவராக இருக்க வேண்டும் மற்றும் குறைந்தது 60% மதிப்பெண்கள் இருக்க வேண்டும்",
          te: "విద్యార్థి మైనారిటీ కమ్యూనిటీకి చెందినవారై ఉండాలి మరియు కనీసం 60% మార్కులు ఉండాలి",
          bn: "শিক্ষার্থীকে সংখ্যালঘু সম্প্রদায়ের অন্তর্গত হতে হবে এবং ন্যূনতম 60% নম্বর থাকতে হবে",
          mr: "विद्यार्थी अল्पसंख्याक समुदायाचा असावा आणि किमान 60% गुण असावेत",
        },
        amount: "Up to 50% fee waiver",
        applicationProcess: {
          en: "Online application via National Scholarship Portal (NSP)",
          hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) के माध्यम से ऑनलाइन आवेदन",
          ta: "தேசிய உதவித்தொகை போர்டல் (NSP) மூலம் ஆன்லைன் விண்ணப்பம்",
          te: "నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP) ద్వారా ఆన్‌లైన్ దరఖాస్తు",
          bn: "ন্যাশনাল স্কলারশিপ পোর্টাল (NSP) এর মাধ্যমে অনলাইনে আবেদন করুন",
          mr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) द्वारे ऑनলाइன अर्ज करा",
        },
        isActive: true,
      },
    ]
    await Scholarship.insertMany(scholarships)
    logger.info(`Seeded ${scholarships.length} scholarships`)

    const circulars = [
      {
        title: {
          en: "Semester Exam Notification",
          hi: "सेमेस्टर परीक्षा अधिसूचना",
          ta: "செமஸ்டர் தேர்வு அறிவிப்பு",
          te: "సెమిస్టర్ పరీక్ష నోటిఫికేషన్",
          bn: "সেমিস্টার পরীক্ষা বিজ্ঞপ্তি",
          mr: "सेमिस्टर परीक्षा अधिसूचना",
        },
        content: {
          en: "End semester examinations for all programs will commence from 10th September 2025.",
          hi: "सभी कार्यक्रमों के लिए अंतिम सेमेस्टर परीक्षा 10 सितंबर 2025 से शुरू होगी।",
          ta: "அனைத்து திட்டங்களுக்கும் இறுதி செமஸ்டர் தேர்வுகள் 10 செப்டம்பர் 2025 முதல் தொடங்கும்।",
          te: "అన్ని ప్రోగ్రామ్‌లకు చివరి సెమిస్టర్ పరీక్షలు 10 సెప్టెంబర్ 2025 నుండి ప్రారంభమవుతాయి.",
          bn: "সমস্ত প্রোগ্রামের জন্য চূড়ান্ত সেমিস্টার পরীক্ষা 10 সেপ্টেম্বর 2025 থেকে শুরু হবে।",
          mr: "सर्व कार्यक्रमांसाठी अंतिम सेमिस्टर परीक्षा 10 सप्टेंबर 2025 पासून सुरू होईल.",
        },
        category: "exam",
        priority: 10,
        publishedDate: new Date("2025-08-01"),
        lastDate: new Date("2025-09-10"),
        isActive: true,
      },
      {
        title: {
          en: "Fee Payment Reminder",
          hi: "शुल्क भुगतान अनुस्मारक",
          ta: "கட்டண செலுத்துதல் நினைவூட்டல்",
          te: "ఫీజు చెల్లింపు రిమైండర్",
          bn: "ফি পেমেন্ট অনুস্মারক",
          mr: "फी पेमेंट स्मरणपत्र",
        },
        content: {
          en: "Last date for payment of semester fees without late fine is 15th August 2025.",
          hi: "बिना विलंब शुल्क के सेमेस्टर शुल्क भुगतान की अंतिम तिथि 15 अगस्त 2025 है।",
          ta: "தாமத அபராதம் இல்லாமல் செமஸ்டர் கட்டணம் செலுத்துவதற்கான கடைசி தேதி 15 ஆகஸ்ட் 2025.",
          te: "ఆలస్య జరిమానా లేకుండా సెమిస్టర్ ఫీజు చెల్లింపు చివరి తేదీ 15 ఆగస్టు 2025.",
          bn: "বিলম্ব জরিমানা ছাড়াই সেমিস্টার ফি প্রদানের শেষ তারিখ 15 আগস্ট 2025।",
          mr: "उशीरा दंड न लावता सेमिस्टर फी भरण्याची अंतिम तारीख 15 ऑगस्ट 2025 आहे.",
        },
        category: "fees",
        priority: 8,
        publishedDate: new Date("2025-07-20"),
        lastDate: new Date("2025-08-15"),
        isActive: true,
      },
    ]
    await Circular.insertMany(circulars)
    logger.info(`Seeded ${circulars.length} circulars`)

    await seedClassTimetablesIfEmpty()

    logger.info("Campus data seeding completed successfully!")
  } catch (error) {
    logger.error("Error seeding campus data:", error)
  }
}

async function seedClassTimetablesIfEmpty() {
  try {
    const classTimetableCount = await ClassTimetable.countDocuments()

    console.log("[v0] ClassTimetable count check:", classTimetableCount)

    if (classTimetableCount >= 32) {
      logger.info("Class timetables already exist. Skipping seeding.")
      console.log("[v0] Skipping class timetable seeding - already have", classTimetableCount, "entries")
      return
    }

    // Clear any incomplete data and re-seed
    if (classTimetableCount > 0 && classTimetableCount < 32) {
      console.log("[v0] Incomplete timetable data detected. Clearing and re-seeding...")
      await ClassTimetable.deleteMany({})
    }

    logger.info("Seeding class timetables for ALL programs and semesters...")
    console.log("[v0] Starting class timetable seeding...")

    const allTimetables = generateClassTimetables()

    console.log("[v0] Generated", allTimetables.length, "timetables to seed")

    const timetablesToInsert = allTimetables.map((tt) => ({
      ...tt,
      isActive: true,
    }))

    await ClassTimetable.insertMany(timetablesToInsert)
    logger.info(`Seeded ${timetablesToInsert.length} class timetables for all programs`)
    console.log("[v0] Successfully seeded", timetablesToInsert.length, "class timetables")
  } catch (error) {
    logger.error("Error seeding class timetables:", error)
    console.error("[v0] Error seeding class timetables:", error)
  }
}
