import mongoose, { Schema, type Model } from "mongoose"

/**
 * Session Schema - Stores anonymous user sessions with multi-step state
 * Used for tracking and analytics without collecting personal data
 */
export interface ISession {
  _id: string
  sessionId: string
  language: string
  userAgent?: string
  firstVisit: Date
  lastVisit: Date
  totalMessages: number
  resolvedQueries: number
  unresolvedQueries: number
  multiStepState?: {
    currentIntent?: "SEMESTER_FEES" | "EXAM_TIMETABLE" | "SCHOLARSHIPS" | "CIRCULARS" | null
    awaitingStep?: "program" | "branch" | "semester" | "scholarship_followup" | null
    selectedProgram?: string
    selectedBranch?: string
    selectedSemester?: number
    selectedScholarship?: string
    stepStartedAt?: Date
    lastScholarshipDiscussed?: string
  }
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    language: { type: String, required: true },
    userAgent: { type: String },
    firstVisit: { type: Date, default: Date.now },
    lastVisit: { type: Date, default: Date.now },
    totalMessages: { type: Number, default: 0 },
    resolvedQueries: { type: Number, default: 0 },
    unresolvedQueries: { type: Number, default: 0 },
    multiStepState: {
      currentIntent: {
        type: String,
        enum: ["SEMESTER_FEES", "EXAM_TIMETABLE", "SCHOLARSHIPS", "CIRCULARS", null],
        default: null,
      },
      awaitingStep: {
        type: String,
        enum: ["program", "branch", "semester", "scholarship_followup", null],
        default: null,
      },
      selectedProgram: { type: String },
      selectedBranch: { type: String },
      selectedSemester: { type: Number },
      selectedScholarship: { type: String },
      stepStartedAt: { type: Date },
      lastScholarshipDiscussed: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema)
