import mongoose, { Schema, type Model } from "mongoose"

/**
 * Program Schema - Stores academic programs offered by the college
 */
export interface IProgram {
  _id: string
  code: string // "BTECH", "BSC", "BBA", "BCOM", "MBA"
  name: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  duration: number // Duration in semesters
  isActive: boolean
}

const programSchema = new Schema<IProgram>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    duration: { type: Number, required: true }, // in semesters
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>("Program", programSchema)

/**
 * Branch Schema - Stores branches/specializations for each program with fees
 */
export interface IBranch {
  _id: string
  programCode: string // Reference to Program
  code: string // "CSE", "MECH", "MATH", etc.
  name: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  semesterFee: number // Fee per semester in INR
  isActive: boolean
}

const branchSchema = new Schema<IBranch>(
  {
    programCode: { type: String, required: true, index: true },
    code: { type: String, required: true, uppercase: true },
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    semesterFee: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Compound index for program + branch lookup
branchSchema.index({ programCode: 1, code: 1 }, { unique: true })

export const Branch: Model<IBranch> = mongoose.models.Branch || mongoose.model<IBranch>("Branch", branchSchema)

/**
 * Timetable Schema - Stores exam schedules for program and semester
 */
export interface IExamEntry {
  subject: string
  date: string // Format: "DD MMM" e.g., "10 Sept"
}

export interface ITimetable {
  _id: string
  programCode: string
  semester: number
  examEntries: IExamEntry[]
  academicYear: string // e.g., "2025-2026"
  isActive: boolean
}

const timetableSchema = new Schema<ITimetable>(
  {
    programCode: { type: String, required: true, index: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    examEntries: [
      {
        subject: { type: String, required: true },
        date: { type: String, required: true },
      },
    ],
    academicYear: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Compound index for quick lookup
timetableSchema.index({ programCode: 1, semester: 1, academicYear: 1 })

export const Timetable: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>("Timetable", timetableSchema)

/**
 * ClassTimetable Schema - Stores weekly class schedules for program and semester
 * This is different from exam timetables - it's the regular class schedule
 */
export interface IClassEntry {
  time: string // e.g., "10:20-11:10"
  subject: string
  faculty?: string
  venue?: string
}

export interface IClassTimetable {
  _id: string
  programCode: string
  semester: number
  timetable: {
    MONDAY: IClassEntry[]
    TUESDAY: IClassEntry[]
    WEDNESDAY: IClassEntry[]
    THURSDAY: IClassEntry[]
    FRIDAY: IClassEntry[]
    SATURDAY?: IClassEntry[]
  }
  academicYear: string
  isActive: boolean
}

const classEntrySchema = new Schema<IClassEntry>(
  {
    time: { type: String, required: true },
    subject: { type: String, required: true },
    faculty: { type: String },
    venue: { type: String },
  },
  { _id: false },
)

const classTimetableSchema = new Schema<IClassTimetable>(
  {
    programCode: { type: String, required: true, index: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    timetable: {
      MONDAY: [classEntrySchema],
      TUESDAY: [classEntrySchema],
      WEDNESDAY: [classEntrySchema],
      THURSDAY: [classEntrySchema],
      FRIDAY: [classEntrySchema],
      SATURDAY: [classEntrySchema],
    },
    academicYear: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Compound index for quick lookup
classTimetableSchema.index({ programCode: 1, semester: 1, academicYear: 1 })

export const ClassTimetable: Model<IClassTimetable> =
  mongoose.models.ClassTimetable || mongoose.model<IClassTimetable>("ClassTimetable", classTimetableSchema)

/**
 * Circular Schema - Stores official announcements and notices
 */
export interface ICircular {
  _id: string
  title: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  content: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  category: "exam" | "scholarship" | "fees" | "general" | "holiday" | "event"
  priority: number // Higher = more important
  publishedDate: Date
  lastDate?: Date // Deadline if applicable
  isActive: boolean
}

const circularSchema = new Schema<ICircular>(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ["exam", "scholarship", "fees", "general", "holiday", "event"],
      required: true,
      index: true,
    },
    priority: { type: Number, default: 5 },
    publishedDate: { type: Date, default: Date.now, index: true },
    lastDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Circular: Model<ICircular> =
  mongoose.models.Circular || mongoose.model<ICircular>("Circular", circularSchema)

/**
 * Scholarship Schema - Stores scholarship information
 */
export interface IScholarship {
  _id: string
  name: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  description: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  eligibility: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  amount: string // e.g., "Up to 50% fee waiver" or "Rs 50,000"
  deadline?: Date
  applicationProcess: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    mr: string
  }
  isActive: boolean
}

const scholarshipSchema = new Schema<IScholarship>(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    eligibility: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    amount: { type: String, required: true },
    deadline: { type: Date },
    applicationProcess: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      ta: { type: String, required: true },
      te: { type: String, required: true },
      bn: { type: String, required: true },
      mr: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Scholarship: Model<IScholarship> =
  mongoose.models.Scholarship || mongoose.model<IScholarship>("Scholarship", scholarshipSchema)
