import type { Language } from "@/lib/types"
import { Program, Branch, Circular, Scholarship, ClassTimetable } from "@/lib/models/campus.model"
import { Session, type ISession } from "@/lib/models/session.model"
import { logger } from "@/lib/utils/logger"
import { translateTimetable } from "@/lib/utils/timetable-translator"

/**
 * Multi-Step Conversation Handler - FIXED VERSION
 * Implements strict intent routing and state management
 */

export type MultiStepIntent = "SEMESTER_FEES" | "EXAM_TIMETABLE" | "SCHOLARSHIPS" | "CIRCULARS"
export type AwaitingStep = "program" | "branch" | "semester" | "scholarship_followup"

const INTENT_PRIORITY: MultiStepIntent[] = ["SEMESTER_FEES", "EXAM_TIMETABLE", "CIRCULARS", "SCHOLARSHIPS"]

interface MultiStepResponse {
  message: string
  options?: Array<{ id: string; label: string; value: string }>
  requiresNextStep: boolean
  currentStep?: AwaitingStep
  finalAnswer?: string
}

interface MultiStepResult {
  message: string
  options?: Array<{ id: string; label: string; value: string }>
  requiresNextStep: boolean
  currentStep?: AwaitingStep
  finalAnswer?: string
}

// This allows intent detection to work even if translation fails
const MULTILINGUAL_KEYWORDS = {
  fees: {
    en: ["semester fee", "tuition", "course fee", "program fee", "fee", "how much", "cost", "fees"],
    hi: ["सेमेस्टर फीस", "शुल्क", "फीस", "कितना", "ट्यूशन", "फीस क्या है", "कितनी फीस", "फीस कितनी"],
    ta: ["கட்டணம்", "செமஸ்டர் கட்டணம்", "பணம்", "எவ்வளவு"],
    te: ["ఫీజు", "సెమిస్టర్ ఫీజు", "ఎంత", "ఖర్చు"],
    bn: ["ফি", "সেমিস্টার ফি", "কত", "খরচ"],
    mr: ["फी", "सेमिस्टर फी", "किती", "शुल्क"],
  },
  timetable: {
    en: ["exam timetable", "exam schedule", "timetable", "schedule", "exam date", "when are exams", "exam"],
    hi: ["परीक्षा", "समय सारणी", "टाइमटेबल", "परीक्षा कब", "एग्जाम", "परीक्षा की तारीख"],
    ta: ["தேர்வு", "நேர அட்டவணை", "தேர்வு அட்டவணை", "எப்போது"],
    te: ["పరీక్ష", "టైమ్‌టేబుల్", "షెడ్యూల్", "ఎప్పుడు"],
    bn: ["পরীক্ষা", "সময়সূচী", "টাইমটেবিল", "কবে"],
    mr: ["परीक्षा", "वेळापत्रक", "टाइमटेबल", "कधी"],
  },
  circulars: {
    en: ["circular", "notice", "announcement", "notification", "latest circular"],
    hi: ["परिपत्र", "नोटिस", "घोषणा", "सूचना", "सर्कुलर"],
    ta: ["சுற்றறிக்கை", "அறிவிப்பு", "நோட்டீஸ்"],
    te: ["సర్కులర్", "నోటీసు", "ప్రకటన"],
    bn: ["সার্কুলার", "নোটিশ", "ঘোষণা"],
    mr: ["परिपत्रक", "नोटीस", "घोষণा"],
  },
  scholarships: {
    en: [
      "scholarship",
      "available scholarship",
      "list scholarship",
      "financial aid",
      "merit-cum-means",
      "post-matric",
      "post matric",
      "minority scholarship",
      "sc/st scholarship",
    ],
    hi: ["छात्रवृत्ति", "स्कॉलरशिप", "वित्तीय सहायता", "मेरिट", "पोस्ट मैट्रिक"],
    ta: ["உதவித்தொகை", "ஸ்காலர்ஷிப்", "நிதி உதவி"],
    te: ["స్కాలర్‌షిప్", "ఉపకార వేతనం", "ఆర్థిక సహాయం"],
    bn: ["বৃত্তি", "স্কলারশিপ", "আর্থিক সাহায্য"],
    mr: ["शिष्यवृत्ती", "स्कॉलरशिप", "आर्थिक मदत"],
  },
}

/**
 * Detect intent from query in ANY supported language
 * This is the key fix - intent detection now works regardless of translation success
 */
function detectIntentFromMultilingualQuery(query: string): {
  intent: MultiStepIntent | null
  matchedKeyword: string | null
} {
  const queryLower = query.toLowerCase().trim()

  // Check fees keywords first (highest priority)
  for (const [lang, keywords] of Object.entries(MULTILINGUAL_KEYWORDS.fees)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        logger.debug("[v0] Multilingual match found for FEES", { language: lang, keyword })
        return { intent: "SEMESTER_FEES", matchedKeyword: keyword }
      }
    }
  }

  // Check timetable keywords
  for (const [lang, keywords] of Object.entries(MULTILINGUAL_KEYWORDS.timetable)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        logger.debug("[v0] Multilingual match found for TIMETABLE", { language: lang, keyword })
        return { intent: "EXAM_TIMETABLE", matchedKeyword: keyword }
      }
    }
  }

  // Check circulars keywords
  for (const [lang, keywords] of Object.entries(MULTILINGUAL_KEYWORDS.circulars)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        logger.debug("[v0] Multilingual match found for CIRCULARS", { language: lang, keyword })
        return { intent: "CIRCULARS", matchedKeyword: keyword }
      }
    }
  }

  // Check scholarships keywords (lowest priority)
  for (const [lang, keywords] of Object.entries(MULTILINGUAL_KEYWORDS.scholarships)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        logger.debug("[v0] Multilingual match found for SCHOLARSHIPS", { language: lang, keyword })
        return { intent: "SCHOLARSHIPS", matchedKeyword: keyword }
      }
    }
  }

  return { intent: null, matchedKeyword: null }
}

/**
 * Detect if a query requires multi-step clarification
 * Now checks BOTH English patterns AND multilingual patterns
 */
export function detectMultiStepIntent(query: string, category: string): MultiStepIntent | null {
  const queryLower = query.toLowerCase().trim()

  logger.debug("[v0] detectMultiStepIntent called", { query: queryLower, category })

  const multilingualResult = detectIntentFromMultilingualQuery(query)
  if (multilingualResult.intent) {
    logger.debug("[v0] Intent detected via multilingual patterns", {
      intent: multilingualResult.intent,
      matchedKeyword: multilingualResult.matchedKeyword,
    })
    return multilingualResult.intent
  }

  // PRIORITY 1: FEES - must come first (English fallback)
  if (
    category === "fees" ||
    queryLower.includes("semester fee") ||
    queryLower.includes("tuition") ||
    queryLower.includes("course fee") ||
    queryLower.includes("program fee") ||
    (queryLower.includes("fee") && !queryLower.includes("scholarship")) ||
    (queryLower.includes("how much") && (queryLower.includes("fee") || queryLower.includes("cost")))
  ) {
    logger.debug("[v0] Intent detected: SEMESTER_FEES (English patterns)")
    return "SEMESTER_FEES"
  }

  // PRIORITY 2: TIMETABLE
  if (
    category === "timetable" ||
    queryLower.includes("exam timetable") ||
    queryLower.includes("exam schedule") ||
    queryLower.includes("timetable") ||
    queryLower.includes("schedule") ||
    queryLower.includes("exam date") ||
    queryLower.includes("when are exams") ||
    (queryLower.includes("show") && queryLower.includes("exam"))
  ) {
    logger.debug("[v0] Intent detected: EXAM_TIMETABLE (English patterns)")
    return "EXAM_TIMETABLE"
  }

  // PRIORITY 3: CIRCULARS
  if (
    category === "circulars" ||
    queryLower.includes("circular") ||
    queryLower.includes("notice") ||
    queryLower.includes("announcement") ||
    queryLower.includes("notification") ||
    queryLower.includes("latest circular")
  ) {
    logger.debug("[v0] Intent detected: CIRCULARS (English patterns)")
    return "CIRCULARS"
  }

  // PRIORITY 4: SCHOLARSHIPS (last priority)
  if (
    category === "scholarships" ||
    queryLower.includes("scholarship") ||
    queryLower.includes("available scholarship") ||
    queryLower.includes("list scholarship") ||
    queryLower.includes("financial aid") ||
    queryLower.includes("merit-cum-means") ||
    queryLower.includes("post-matric") ||
    queryLower.includes("post matric") ||
    queryLower.includes("minority scholarship") ||
    queryLower.includes("sc/st scholarship")
  ) {
    logger.debug("[v0] Intent detected: SCHOLARSHIPS (English patterns)")
    return "SCHOLARSHIPS"
  }

  logger.debug("[v0] No multi-step intent detected")
  return null
}

/**
 * Handle multi-step conversation flow
 * FIXED: Detect topic changes and reset flow when user switches topics
 */
export async function handleMultiStepFlow(
  sessionId: string,
  userMessage: string,
  language: Language,
  detectedIntent: MultiStepIntent | null,
): Promise<MultiStepResult> {
  try {
    logger.debug("[v0] Handling multi-step flow", { sessionId, userMessage, detectedIntent })

    const session = await Session.findOne({ sessionId })

    if (!session) {
      logger.error("Session not found for multi-step flow")
      return {
        message: getFallbackMessage(language),
        requiresNextStep: false,
      }
    }

    const currentState = session.multiStepState

    if (currentState?.currentIntent && detectedIntent && detectedIntent !== currentState.currentIntent) {
      logger.debug("[v0] Topic change detected, resetting flow", {
        oldIntent: currentState.currentIntent,
        newIntent: detectedIntent,
      })

      // Clear the old state
      await Session.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            "multiStepState.currentIntent": null,
            "multiStepState.awaitingStep": null,
            "multiStepState.selectedProgram": null,
            "multiStepState.selectedBranch": null,
            "multiStepState.selectedSemester": null,
            "multiStepState.lastScholarshipDiscussed": null,
          },
        },
      )

      // Start the new flow with the detected intent
      logger.debug("[v0] Starting new flow after topic change", { intent: detectedIntent })

      switch (detectedIntent) {
        case "SEMESTER_FEES":
          return await handleSemesterFeesFlow(session, userMessage, language, true)

        case "EXAM_TIMETABLE":
          return await handleExamTimetableFlow(session, userMessage, language, true)

        case "SCHOLARSHIPS":
          return await handleScholarshipsFlow(sessionId, userMessage, language, null)

        case "CIRCULARS":
          return await handleCircularsFlow(session, language)

        default:
          return {
            message: getFallbackMessage(language),
            requiresNextStep: false,
          }
      }
    }

    if (currentState?.currentIntent && currentState?.awaitingStep) {
      const activeIntent = currentState.currentIntent
      logger.debug("[v0] Continuing active flow", { activeIntent, step: currentState.awaitingStep })

      // Route to the active intent handler
      switch (activeIntent) {
        case "SEMESTER_FEES":
          return await handleSemesterFeesFlow(session, userMessage, language, false)

        case "EXAM_TIMETABLE":
          return await handleExamTimetableFlow(session, userMessage, language, false)

        case "SCHOLARSHIPS":
          return await handleScholarshipsFlow(sessionId, userMessage, language, currentState)

        case "CIRCULARS":
          return await handleCircularsFlow(session, language)
      }
    }

    if (!detectedIntent) {
      return {
        message: getFallbackMessage(language),
        requiresNextStep: false,
      }
    }

    logger.debug("[v0] Starting new flow", { intent: detectedIntent })

    switch (detectedIntent) {
      case "SEMESTER_FEES":
        return await handleSemesterFeesFlow(session, userMessage, language, true)

      case "EXAM_TIMETABLE":
        return await handleExamTimetableFlow(session, userMessage, language, true)

      case "SCHOLARSHIPS":
        return await handleScholarshipsFlow(sessionId, userMessage, language, null)

      case "CIRCULARS":
        return await handleCircularsFlow(session, language)

      default:
        return {
          message: getFallbackMessage(language),
          requiresNextStep: false,
        }
    }
  } catch (error) {
    logger.error("Multi-step flow error:", error)
    return {
      message: getFallbackMessage(language),
      requiresNextStep: false,
    }
  }
}

/**
 * SEMESTER FEES FLOW
 * Step 1: Ask Program → Step 2: Ask Branch → Step 3: Return Fee
 */
async function handleSemesterFeesFlow(
  session: ISession,
  userMessage: string,
  language: Language,
  isNewIntent: boolean,
): Promise<MultiStepResponse> {
  const state = session.multiStepState

  // STEP 1: Start flow - ask for program
  if (isNewIntent || !state?.awaitingStep) {
    const programs = await Program.find({ isActive: true }).lean()

    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.currentIntent": "SEMESTER_FEES",
          "multiStepState.awaitingStep": "program",
          "multiStepState.selectedProgram": null,
          "multiStepState.selectedBranch": null,
          "multiStepState.stepStartedAt": new Date(),
        },
      },
    )

    return {
      message: getTranslation("selectProgram", language),
      options: programs.map((p) => ({
        id: p.code,
        label: p.name[language],
        value: p.code,
      })),
      requiresNextStep: true,
      currentStep: "program",
    }
  }

  // STEP 2: User selected program - ask for branch
  if (state?.awaitingStep === "program") {
    const selectedProgram = userMessage.trim().toUpperCase()
    logger.debug("[v0] Validating program selection", { selectedProgram })

    // Validate program
    const program = await Program.findOne({ code: selectedProgram, isActive: true })
    if (!program) {
      logger.debug("[v0] Invalid program selection", { selectedProgram })
      return {
        message: getTranslation("invalidSelection", language),
        requiresNextStep: true,
        currentStep: "program",
        options: (await Program.find({ isActive: true }).lean()).map((p) => ({
          id: p.code,
          label: p.name[language],
          value: p.code,
        })),
      }
    }

    // Get branches for this program
    const branches = await Branch.find({ programCode: selectedProgram, isActive: true }).lean()

    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.selectedProgram": selectedProgram,
          "multiStepState.awaitingStep": "branch",
        },
      },
    )

    return {
      message: getTranslation("selectBranch", language),
      options: branches.map((b) => ({
        id: b.code,
        label: b.name[language],
        value: b.code,
      })),
      requiresNextStep: true,
      currentStep: "branch",
    }
  }

  // STEP 3: User selected branch - return final fee
  if (state?.awaitingStep === "branch" && state?.selectedProgram) {
    console.log("[v0] handleSemesterFeesFlow called", {
      isNewIntent,
      awaitingStep: state?.awaitingStep,
      selectedProgram: state?.selectedProgram,
      userMessage,
    })

    const selectedBranch = userMessage.trim().toUpperCase().replace(/\s+/g, "_")
    logger.debug("[v0] Validating branch selection", { selectedBranch, program: state.selectedProgram })

    const availableBranches = await Branch.find({
      programCode: state.selectedProgram,
      isActive: true,
    }).lean()

    console.log(
      "[v0] Available branches:",
      availableBranches.map((b) => ({ code: b.code, name: b.name })),
    )
    console.log("[v0] Looking for branch code:", selectedBranch)

    let branch = await Branch.findOne({
      programCode: state.selectedProgram,
      code: selectedBranch,
      isActive: true,
    }).lean()

    if (!branch) {
      const lowerMessage = userMessage.toLowerCase()
      branch = availableBranches.find(
        (b) =>
          b.name.en?.toLowerCase().includes(lowerMessage) ||
          b.name.hi?.toLowerCase().includes(lowerMessage) ||
          b.name.te?.toLowerCase().includes(lowerMessage) ||
          b.code.toLowerCase() === lowerMessage,
      )

      if (branch) {
        console.log("[v0] Found branch by name match:", branch.code)
      }
    }

    if (!branch) {
      logger.debug("[v0] Invalid branch selection", { selectedBranch })
      return {
        message: getTranslation("invalidSelection", language),
        requiresNextStep: true,
        currentStep: "branch",
        options: availableBranches.map((b) => ({
          id: b.code,
          label: b.name[language],
          value: b.code,
        })),
      }
    }

    const program = await Program.findOne({ code: state.selectedProgram }).lean()

    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.currentIntent": null,
          "multiStepState.awaitingStep": null,
          "multiStepState.selectedProgram": null,
          "multiStepState.selectedBranch": null,
        },
      },
    )

    const finalMessage = getFeesResponseMessage(
      language,
      program?.name[language] || state.selectedProgram,
      branch.name[language],
      branch.semesterFee || 0,
    )

    return {
      message: finalMessage,
      requiresNextStep: false,
    }
  }

  return {
    message: getFallbackMessage(language),
    requiresNextStep: false,
  }
}

/**
 * EXAM TIMETABLE FLOW
 * Step 1: Ask Program → Step 2: Ask Semester → Step 3: Return Timetable
 * Now uses ClassTimetable for weekly class schedules
 */
async function handleExamTimetableFlow(
  session: ISession,
  userMessage: string,
  language: Language,
  isNewIntent: boolean,
): Promise<MultiStepResponse> {
  const state = session.multiStepState

  // STEP 1: Start flow - ask for program
  if (isNewIntent || !state?.awaitingStep) {
    const programs = await Program.find({ isActive: true }).lean()

    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.currentIntent": "EXAM_TIMETABLE",
          "multiStepState.awaitingStep": "program",
          "multiStepState.selectedProgram": null,
          "multiStepState.selectedSemester": null,
          "multiStepState.stepStartedAt": new Date(),
        },
      },
    )

    return {
      message: getTranslation("selectProgramTimetable", language),
      options: programs.map((p) => ({
        id: p.code,
        label: p.name[language],
        value: p.code,
      })),
      requiresNextStep: true,
      currentStep: "program",
    }
  }

  // STEP 2: User selected program - ask for semester
  if (state?.awaitingStep === "program") {
    const selectedProgram = userMessage.trim().toUpperCase()

    const program = await Program.findOne({ code: selectedProgram, isActive: true })
    if (!program) {
      return {
        message: getTranslation("invalidSelection", language),
        requiresNextStep: true,
        currentStep: "program",
        options: (await Program.find({ isActive: true }).lean()).map((p) => ({
          id: p.code,
          label: p.name[language],
          value: p.code,
        })),
      }
    }

    // Generate semester options based on program duration
    const semesters = Array.from({ length: program.duration }, (_, i) => i + 1)

    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.selectedProgram": selectedProgram,
          "multiStepState.awaitingStep": "semester",
        },
      },
    )

    return {
      message: getTranslation("selectSemester", language),
      options: semesters.map((sem) => ({
        id: `SEM${sem}`,
        label: `${getTranslation("semester", language)} ${sem}`,
        value: sem.toString(),
      })),
      requiresNextStep: true,
      currentStep: "semester",
    }
  }

  // STEP 3: User selected semester - return timetable
  if (state?.awaitingStep === "semester" && state?.selectedProgram) {
    let selectedSemester: number
    const cleanedInput = userMessage.trim()

    // Try to extract number from various formats: "8", "SEM8", "Semester 8", etc.
    const numMatch = cleanedInput.match(/\d+/)
    if (numMatch) {
      selectedSemester = Number.parseInt(numMatch[0], 10)
    } else {
      selectedSemester = Number.NaN
    }

    console.log("[v0] Timetable lookup debug:", {
      program: state.selectedProgram,
      rawInput: userMessage,
      cleanedInput,
      parsedSemester: selectedSemester,
    })

    logger.debug("[v0] Timetable lookup", {
      program: state.selectedProgram,
      semester: selectedSemester,
      rawInput: userMessage,
      cleanedInput,
    })

    const program = await Program.findOne({ code: state.selectedProgram, isActive: true })
    const maxSemester = program?.duration || 8

    if (isNaN(selectedSemester) || selectedSemester < 1 || selectedSemester > maxSemester) {
      console.log("[v0] Invalid semester selection:", { selectedSemester, maxSemester })
      return {
        message: getTranslation("invalidSelection", language),
        requiresNextStep: true,
        currentStep: "semester",
        options: Array.from({ length: maxSemester }, (_, i) => i + 1).map((sem) => ({
          id: `SEM${sem}`,
          label: `${getTranslation("semester", language)} ${sem}`,
          value: sem.toString(),
        })),
      }
    }

    let classTimetable = null
    try {
      console.log("[v0] Querying ClassTimetable:", {
        programCode: state.selectedProgram,
        semester: selectedSemester,
      })

      classTimetable = await ClassTimetable.findOne({
        programCode: state.selectedProgram,
        semester: selectedSemester,
        isActive: true,
      }).lean()

      console.log("[v0] ClassTimetable query result:", {
        found: !!classTimetable,
        programCode: state.selectedProgram,
        semester: selectedSemester,
        hasTimetableData: classTimetable?.timetable ? "yes" : "no",
      })

      if (!classTimetable) {
        const totalCount = await ClassTimetable.countDocuments()
        const allForProgram = await ClassTimetable.find({ programCode: state.selectedProgram }).lean()
        console.log("[v0] Debug - total timetables in DB:", totalCount)
        console.log(
          "[v0] Debug - timetables for",
          state.selectedProgram,
          ":",
          allForProgram.map((t) => t.semester),
        )
      }
    } catch (dbError) {
      console.error("[v0] ClassTimetable database error:", dbError)
      logger.error("ClassTimetable database error:", dbError)
    }

    // Clear session state regardless of result
    await Session.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          "multiStepState.currentIntent": null,
          "multiStepState.awaitingStep": null,
          "multiStepState.selectedProgram": null,
          "multiStepState.selectedSemester": null,
        },
      },
    )

    if (!classTimetable) {
      logger.debug("[v0] No class timetable found", {
        program: state.selectedProgram,
        semester: selectedSemester,
      })
      console.log("[v0] No timetable found for:", { program: state.selectedProgram, semester: selectedSemester })
      return {
        message: getTranslation("noTimetablePublished", language),
        requiresNextStep: false,
      }
    }

    if (!classTimetable.timetable || typeof classTimetable.timetable !== "object") {
      console.error("[v0] Invalid timetable structure:", classTimetable)
      return {
        message: getTranslation("noTimetablePublished", language),
        requiresNextStep: false,
      }
    }

    const responseMessage = getClassTimetableResponseMessage(
      language,
      program?.name[language] || state.selectedProgram,
      selectedSemester,
      classTimetable.timetable,
    )

    let finalMessage = responseMessage
    if (language !== "en") {
      console.log("[v0] Translating timetable to", language)

      // Translate the timetable structure itself
      const translatedTimetable = await translateTimetable(classTimetable.timetable, language)

      // Regenerate the response with translated timetable
      finalMessage = getClassTimetableResponseMessage(
        language,
        program?.name[language] || state.selectedProgram,
        selectedSemester,
        translatedTimetable, // Use translated version
      )
    }

    return {
      message: finalMessage,
      requiresNextStep: false,
      finalAnswer: finalMessage,
    }
  }

  return {
    message: getFallbackMessage(language),
    requiresNextStep: false,
  }
}

/**
 * SCHOLARSHIPS FLOW - FIXED VERSION
 * Shows list once, then handles follow-ups for specific scholarships
 */
async function handleScholarshipsFlow(
  sessionId: string,
  userMessage: string,
  language: Language,
  currentState: any,
): Promise<MultiStepResponse> {
  const scholarships = await Scholarship.find({ isActive: true }).lean()

  if (scholarships.length === 0) {
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          "multiStepState.currentIntent": null,
          "multiStepState.awaitingStep": null,
          "multiStepState.lastScholarshipDiscussed": null,
        },
      },
    )
    return {
      message: getTranslation("noScholarships", language),
      requiresNextStep: false,
    }
  }

  const queryLower = userMessage.toLowerCase().trim()

  const isAskingForList =
    queryLower.includes("available") ||
    queryLower.includes("list") ||
    queryLower.includes("what scholarships") ||
    queryLower.includes("which scholarships") ||
    queryLower.includes("show scholarships") ||
    queryLower.includes("all scholarships") ||
    queryLower === "scholarships"

  const isAskingEligibility =
    queryLower.includes("eligibility") ||
    queryLower.includes("eligible") ||
    queryLower.includes("who can apply") ||
    queryLower.includes("criteria") ||
    queryLower.includes("qualify")

  const isAskingApplication =
    queryLower.includes("application") ||
    queryLower.includes("how to apply") ||
    queryLower.includes("process") ||
    queryLower.includes("procedure")

  if (isAskingForList && !currentState?.lastScholarshipDiscussed) {
    const message = getAllScholarshipsMessage(language, scholarships)

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          "multiStepState.currentIntent": "SCHOLARSHIPS",
          "multiStepState.awaitingStep": "scholarship_followup",
          "multiStepState.lastScholarshipDiscussed": null,
        },
      },
    )

    return {
      message,
      requiresNextStep: true,
      currentStep: "scholarship_followup",
    }
  }

  let specificScholarship: any = null

  for (const scholarship of scholarships) {
    const scholarshipNameEn = scholarship.name.en.toLowerCase()
    const scholarshipNameLocal = scholarship.name[language].toLowerCase()

    if (
      queryLower.includes(scholarshipNameEn) ||
      queryLower.includes(scholarshipNameLocal) ||
      ((queryLower.includes("post-matric") || queryLower.includes("post matric")) &&
        scholarshipNameEn.includes("post-matric")) ||
      (queryLower.includes("merit") && queryLower.includes("means") && scholarshipNameEn.includes("merit-cum-means")) ||
      (queryLower.includes("minority") && scholarshipNameEn.includes("minority")) ||
      ((queryLower.includes("sc/st") || queryLower.includes("sc st")) && scholarshipNameEn.includes("sc/st"))
    ) {
      specificScholarship = scholarship
      break
    }
  }

  // If no specific scholarship in query, use the last discussed one
  if (!specificScholarship && currentState?.lastScholarshipDiscussed) {
    specificScholarship = scholarships.find((s) => s.name.en === currentState?.lastScholarshipDiscussed)
  }

  if (specificScholarship && !isAskingEligibility && !isAskingApplication) {
    const message = getSingleScholarshipMessage(language, specificScholarship)

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          "multiStepState.currentIntent": "SCHOLARSHIPS",
          "multiStepState.awaitingStep": "scholarship_followup",
          "multiStepState.lastScholarshipDiscussed": specificScholarship.name.en,
        },
      },
    )

    return {
      message,
      requiresNextStep: true,
      currentStep: "scholarship_followup",
    }
  }

  if (isAskingEligibility && specificScholarship) {
    const message = getScholarshipEligibilityMessage(language, specificScholarship)

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          "multiStepState.currentIntent": "SCHOLARSHIPS",
          "multiStepState.awaitingStep": "scholarship_followup",
          "multiStepState.lastScholarshipDiscussed": specificScholarship.name.en,
        },
      },
    )

    return {
      message: message + "\n\n" + getTranslation("anythingElse", language),
      requiresNextStep: true,
      currentStep: "scholarship_followup",
    }
  }

  if (isAskingApplication && specificScholarship) {
    const message = getScholarshipApplicationMessage(language, specificScholarship)

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          "multiStepState.currentIntent": null,
          "multiStepState.awaitingStep": null,
          "multiStepState.lastScholarshipDiscussed": null,
        },
      },
    )

    return {
      message,
      requiresNextStep: false,
      finalAnswer: message,
    }
  }

  const message = getAllScholarshipsMessage(language, scholarships)

  await Session.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        "multiStepState.currentIntent": "SCHOLARSHIPS",
        "multiStepState.awaitingStep": "scholarship_followup",
        "multiStepState.lastScholarshipDiscussed": null,
      },
    },
  )

  return {
    message,
    requiresNextStep: true,
    currentStep: "scholarship_followup",
  }
}

/**
 * CIRCULARS FLOW - Single step, returns latest circulars
 */
async function handleCircularsFlow(session: ISession, language: Language): Promise<MultiStepResponse> {
  const circulars = await Circular.find({ isActive: true }).sort({ priority: -1, publishedDate: -1 }).limit(5).lean()

  await Session.findOneAndUpdate(
    { sessionId: session.sessionId },
    {
      $set: {
        "multiStepState.currentIntent": null,
        "multiStepState.awaitingStep": null,
      },
    },
  )

  if (circulars.length === 0) {
    return {
      message: getTranslation("noCirculars", language),
      requiresNextStep: false,
    }
  }

  const finalMessage = getCircularsResponseMessage(language, circulars)

  return {
    message: finalMessage,
    requiresNextStep: false,
    finalAnswer: finalMessage,
  }
}

function getAllScholarshipsMessage(language: Language, scholarships: any[]): string {
  const intro = getTranslation("availableScholarships", language)
  const scholarshipList = scholarships.map((s) => `• ${s.name[language]}\n  ${s.description[language]}`).join("\n\n")
  const followUp = getTranslation("selectScholarshipForDetails", language)

  return `${intro}\n\n${scholarshipList}\n\n${followUp}`
}

function getSingleScholarshipMessage(language: Language, scholarship: any): string {
  return `${getTranslation("scholarshipInfo", language)}: ${scholarship.name[language]}\n\n${scholarship.description[language]}\n\n${getTranslation("askEligibilityOrApplication", language)}`
}

function getScholarshipEligibilityMessage(language: Language, scholarship: any): string {
  const eligibility = scholarship.eligibility[language]
  return `${getTranslation("eligibilityCriteria", language)} - ${scholarship.name[language]}:\n\n${eligibility}`
}

function getScholarshipApplicationMessage(language: Language, scholarship: any): string {
  const application = scholarship.applicationProcess[language]
  return `${getTranslation("applicationProcess", language)} - ${scholarship.name[language]}:\n\n${application}`
}

function getFeesResponseMessage(language: Language, programName: string, branchName: string, fee: number): string {
  return getTranslation("feesResponse", language)
    .replace("{program}", programName)
    .replace("{branch}", branchName)
    .replace("{fee}", `₹${fee.toLocaleString("en-IN")}`)
}

function getClassTimetableResponseMessage(
  language: Language,
  programName: string,
  semester: number,
  timetable: {
    MONDAY?: any[]
    TUESDAY?: any[]
    WEDNESDAY?: any[]
    THURSDAY?: any[]
    FRIDAY?: any[]
    SATURDAY?: any[]
  },
): string {
  if (!timetable || typeof timetable !== "object") {
    return "Timetable data is not available."
  }

  const dayNames: Record<string, Record<Language, string>> = {
    MONDAY: { en: "Monday", hi: "सोमवार", ta: "திங்கள்", te: "సోమవారం", bn: "সোমবার", mr: "सोमवार" },
    TUESDAY: { en: "Tuesday", hi: "मंगलवार", ta: "செவ்வாய்", te: "మంగళవారం", bn: "মঙ্গলবার", mr: "मंगळवार" },
    WEDNESDAY: { en: "Wednesday", hi: "बुधवार", ta: "புதன்", te: "బుధవారం", bn: "বুধবার", mr: "बुधवार" },
    THURSDAY: { en: "Thursday", hi: "गुरुवार", ta: "வியாழன்", te: "గురువారం", bn: "বৃহস্পতিবার", mr: "గुరुवार" },
    FRIDAY: { en: "Friday", hi: "शुक्रवार", ta: "வெள்ளி", te: "శుక్రవారం", bn: "শুক্রবার", mr: "शुक्रवार" },
    SATURDAY: { en: "Saturday", hi: "शनिवार", ta: "சனி", te: "శనివారం", bn: "শনিবার", mr: "शनिवार" },
  }

  const intro = getTranslation("classTimetableResponse", language)
    .replace("{program}", String(programName || ""))
    .replace("{semester}", String(semester || ""))

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const

  let scheduleText = ""

  try {
    for (const day of days) {
      const entries = timetable[day as keyof typeof timetable]
      if (Array.isArray(entries) && entries.length > 0) {
        scheduleText += `\n\n📅 **${dayNames[day][language]}**\n`
        for (const entry of entries) {
          if (!entry || typeof entry !== "object") continue
          let line = `• ${String(entry.time || "")} - ${String(entry.subject || "")}`
          if (entry.faculty) line += ` (${String(entry.faculty)})`
          if (entry.venue) line += ` [${String(entry.venue)}]`
          scheduleText += line + "\n"
        }
      }
    }

    // Add Saturday if it exists
    const saturdayEntries = timetable.SATURDAY
    if (Array.isArray(saturdayEntries) && saturdayEntries.length > 0) {
      scheduleText += `\n\n📅 **${dayNames.SATURDAY[language]}**\n`
      for (const entry of saturdayEntries) {
        if (!entry || typeof entry !== "object") continue
        let line = `• ${String(entry.time || "")} - ${String(entry.subject || "")}`
        if (entry.faculty) line += ` (${String(entry.faculty)})`
        if (entry.venue) line += ` [${String(entry.venue)}]`
        scheduleText += line + "\n"
      }
    }
  } catch (error) {
    console.error("[v0] Error formatting timetable:", error)
    return intro
  }

  return `${intro}${scheduleText}`
}

// Keep the old function for backward compatibility with exam timetables
function getTimetableResponseMessage(
  language: Language,
  programName: string,
  semester: number,
  examEntries: any[],
): string {
  const intro = getTranslation("timetableResponse", language)
    .replace("{program}", programName)
    .replace("{semester}", semester.toString())

  const exams = examEntries.map((e) => `• ${e.subject} - ${e.date}`).join("\n")

  return `${intro}\n\n${exams}`
}

function getCircularsResponseMessage(language: Language, circulars: any[]): string {
  const intro = getTranslation("latestCirculars", language)
  const circularList = circulars.map((c, i) => `${i + 1}. ${c.title[language]}\n   ${c.content[language]}`).join("\n\n")

  return `${intro}\n\n${circularList}`
}

function getFallbackMessage(language: Language): string {
  return getTranslation("fallback", language)
}

function getTranslation(key: string, language: Language): string {
  const translations: Record<string, Record<Language, string>> = {
    selectProgram: {
      en: "Please select your program:",
      hi: "कृपया अपना कार्यक्रम चुनें:",
      ta: "தயவுசெய்து உங்கள் திட்டத்தை தேர்ந்தெடுக்கவும்:",
      te: "దయచేసి మీ ప్రోగ్రామ్‌ను ఎంచుకోండి:",
      bn: "অনুগ্রহ করে আপনার প্রোগ্রাম নির্বাচন করুন:",
      mr: "कृपया तुमचा कार्यक्रम निवडा:",
    },
    selectBranch: {
      en: "Please select your branch:",
      hi: "कृपया अपनी शाखा चुनें:",
      ta: "தயவுசெய்து உங்கள் கிளையை தேர்ந்தெடுக்கவும்:",
      te: "దయచేసి మీ శాఖను ఎంచుకోండి:",
      bn: "অনুগ্রহ করে আপনার শাখা নির্বাচন করুন:",
      mr: "कृपया तुमची शाखा निवडा:",
    },
    selectProgramTimetable: {
      en: "Please select your program to view the class timetable:",
      hi: "कक्षा समय सारणी देखने के लिए कृपया अपना कार्यक्रम चुनें:",
      ta: "வகுப்பு நேர அட்டவணையைப் பார்க்க தயவுசெய்து உங்கள் திட்டத்தை தேர்ந்தெடுக்கவும்:",
      te: "క్లాస్ టైమ్‌టేబుల్‌ను చూడటానికి దయచేసి మీ ప్రోగ్రామ్‌ను ఎంచుకోండి:",
      bn: "ক্লাস টাইমটেবিল দেখতে অনুগ্রহ করে আপনার প্রোগ্রাম নির্বাচন করুন:",
      mr: "वर्ग वेळापत्रक पाहण्यासाठी कृपया तुमचा कार्यक्रम निवडा:",
    },
    selectSemester: {
      en: "Please select the semester:",
      hi: "कृपया सेमेस्टर चुनें:",
      ta: "தயவுசெய்து செமஸ்டரைத் தேர்ந்தெடுக்கவும்:",
      te: "దయచేసి సెమిస్టర్‌ను ఎంచుకోండి:",
      bn: "অনুগ্রহ করে সেমিস্টার নির্বাচন করুন:",
      mr: "कृपया सेमिस्टर निवडा:",
    },
    semester: {
      en: "Semester",
      hi: "सेमेस्टर",
      ta: "செமஸ்டர்",
      te: "సెమిస్టర్",
      bn: "সেমিস্টার",
      mr: "सेमिस्टर",
    },
    invalidSelection: {
      en: "Invalid selection. Please try again.",
      hi: "अमान्य चयन। कृपया पुनः प्रयास करें।",
      ta: "தவறான தேர்வு. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      te: "చెల్లని ఎంపిక. దయచేసి మళ్లీ ప్రయత్నించండి.",
      bn: "অবৈধ নির্বাচন। অনুগ্রহ করে আবার চেষ্টা করুন।",
      mr: "अवैध निवड. कृपया पुन्हा प्रयत्न करा.",
    },
    noTimetable: {
      en: "No timetable available for the selected program and semester.",
      hi: "चयनित कार्यक्रम और सेमेस्टर के लिए कोई समय सारणी उपलब्ध नहीं है।",
      ta: "தேர்ந்தெடுக்கப்பட்ட திட்டம் மற்றும் செமஸ்டருக்கு நேர அட்டவணை இல்லை.",
      te: "ఎంచుకున్న ప్రోగ్రామ్ మరియు సెమిస్టర్ కోసం టైమ్‌టేబుల్స్ అందుబాటులో లేదు.",
      bn: "নির্বাচিত প্রোগ্রাম এবং সেমিস্টারের জন্য কোন সময়সূচী উপলব্ধ নেই।",
      mr: "निवडलेल्या कार्यक्रम आणि सेमिस्टरसाठी कोणतीही वेळापत्रक उपलब्ध नाही.",
    },
    noTimetablePublished: {
      en: "The timetable for this program and semester has not been published yet. Please check back later or contact the administration office.",
      hi: "इस कार्यक्रम और सेमेस्टर की समय सारणी अभी प्रकाशित नहीं हुई है। कृपया बाद में जांचें या प्रशासन कार्यालय से संपर्क करें।",
      ta: "இந்த திட்டம் மற்றும் செமஸ்டருக்கான நேர அட்டவணை இன்னும் வெளியிடப்படவில்லை. பின்னர் சரிபார்க்கவும் அல்லது நிர்வாக அலுவலகத்தை தொடர்பு கொள்ளவும்.",
      te: "ఈ ప్రోగ్రామ్ మరియు సెమిస్టర్ కోసం టైమ్‌టేబుల్ ఇంకా ప్రచురించబడలేదు. దయచేసి తర్వాత తనిఖీ చేయండి లేదా అడ్మినిస్ట్రేషన్ ఆఫీస్‌ని సంప్రదించండి.",
      bn: "এই প্রোগ্রাম এবং সেমিস্টারের জন্য পরীক্ষার সময়সূচী এখনও প্রকাশিত হয়নি। অনুগ্রহ করে পরে চেক করুন বা প্রশাসন অফিসে যোগাযোগ করুন।",
      mr: "या कार्यक्रम आणि सेमिस्टरसाठी परीक्षा वेळापत्रक अद्याप प्रकाशित झालेले नाही. कृपया नंतर तपासा किंवा प्रशासन कार्यालयाशी संपर्क साधा.",
    },
    classTimetableResponse: {
      en: "📚 Class Timetable for {program} - Semester {semester}",
      hi: "📚 {program} - सेमेस्टर {semester} के लिए कक्षा समय सारणी",
      ta: "📚 {program} - செமஸ்டர் {semester} க்கான வகுப்பு நேர அட்டவணை",
      te: "📚 {program} - సెమిస్టర్ {semester} కోసం క్లాస్ టైమ్‌టేబుల్",
      bn: "📚 {program} - সেমিস্টার {semester}-এর জন্য ক্লাস টাইমটেবিল",
      mr: "📚 {program} - सेमिस्टर {semester} साठी वर्ग वेळापत्रक",
    },
    noScholarships: {
      en: "No scholarships available at the moment.",
      hi: "इस समय कोई छात्रवृत्ति उपलब्ध नहीं है।",
      ta: "தற்போது எந்த உதவித்தொகையும் இல்லை.",
      te: "ప్రస్తుతం స్కాలర్‌షిప్‌లు అందుబాటులో లేవు.",
      bn: "বর্তমানে কোন বৃত্তি উপলব্ধ নেই।",
      mr: "सध्या कोणतीही शिष्यवृत्ती उपलब्ध नाही.",
    },
    noCirculars: {
      en: "No circulars available at the moment.",
      hi: "इस समय कोई परिपत्र उपलब्ध नहीं है।",
      ta: "தற்போது எந்த சுற்றறிக்கையும் இல்லை.",
      te: "ప్రస్తుతం సర్కులర్లు అందుబాటులో లేవు.",
      bn: "বর্তমানে কোন সার্কুলার উপলব্ধ নেই।",
      mr: "सध्या कोণतेही परিপत्रक उपलब्ध नाही.",
    },
    availableScholarships: {
      en: "The following scholarships are available:",
      hi: "निम्नलिखित छात्रवृत्तियां उपलब्ध हैं:",
      ta: "பின்வரும் உதவித்தொகைகள் கிடைக்கின்றன:",
      te: "ఈ క్రింది స్కాలర్‌షిప్‌లు అందుబాటులో ఉన్నాయి:",
      bn: "নিম্নলিখিত বৃত্তিগুলি উপলব্ধ:",
      mr: "खाली शिष्यवृत्त्या उपलब्ध आहेत:",
    },
    selectScholarshipForDetails: {
      en: "Please select a scholarship to learn more about it.",
      hi: "कृपया इसके बारे में अधिक जानने के लिए एक छात्रवृत्ति चुनें।",
      ta: "மேலும் அறிய தயவுசெய்து ஒரு உதவித்தொகையைத் தேர்ந்தெடுக்கவும்:",
      te: "దాని గురించి మరింత తెలుసుకోవడానికి దయచేసి స్కాలర్‌షిప్‌ను ఎంచుకోండి.",
      bn: "এটি সম্পর্কে আরও জানতে অনুগ্রহ করে একটি বৃত্তি নির্বাচন করুন।",
      mr: "याबद्दल अधिक जाणून घेण्यासाठी कृपया शिष्यवृत्ती निवडा.",
    },
    scholarshipInfo: {
      en: "Here is information about",
      hi: "यहाँ इसके बारे में जानकारी है",
      ta: "இதோ தகவல்",
      te: "ఇక్కడ సమాచారం ఉంది",
      bn: "এখানে তথ্য আছে",
      mr: "येथे माहिती आहे",
    },
    askEligibilityOrApplication: {
      en: "Would you like to know the eligibility criteria or application process?",
      hi: "क्या आप पात्रता मानदंड या आवेदन प्रक्रिया जानना चाहेंगे?",
      ta: "தகுதி விதிகள் அல்லது விண்ணப்ப செயல்முறையை அறிய விரும்புகிறீர்களா?",
      te: "మీరు అర్హత ప్రమాణాలు లేదా దరఖాస్తు ప్రక్రియను తెలుసుకోవడానికి దయచేసి మాట్లాడండి.",
      bn: "আপনি কি যোগ্যতার মানদণ্ড বা আবেদন প্রক্রিয়া জানতে চান?",
      mr: "तुम्हाला पात्रता निकष किंवा अर्ज प्रक्रिया जाणून घ्यायची आहे का?",
    },
    eligibilityCriteria: {
      en: "Eligibility Criteria",
      hi: "पात्रता मानदंడ",
      ta: "தகுதி விதிகள்",
      te: "అర్హత ప్రమాణాలు",
      bn: "যোগ্যতার মানদণ্ড",
      mr: "पात्रता निकष",
    },
    applicationProcess: {
      en: "Application Process",
      hi: "आवेदन प्रक्रिया",
      ta: "விண்ணப்ப செயல்முறை",
      te: "దరఖాస్తు ప్రక్రియ",
      bn: "আবেদন প্রক্রিয়া",
      mr: "अर्ज प्रक्रिया",
    },
    anythingElse: {
      en: "Would you like to know anything else?",
      hi: "क्या आप कुछ और जानना चाहेंगे?",
      ta: "வேறு ஏதாவது தெரிந்து கொள்ள விரும்புகிறீர்களா?",
      te: "మీరు మరేదైనా తెలుసుకోవాలనుకుంటున్నారా?",
      bn: "আপনি কি অন্য কিছু জানতে চান?",
      mr: "तुम्हाला काही अधिक माहिती हवी आहे का?",
    },
    feesResponse: {
      en: "The semester fee for {program} - {branch} is {fee} per semester.",
      hi: "{program} - {branch} का सेमेस्टर शुल्क प्रति सेमेस्टर {fee} है।",
      ta: "{program} - {branch}க்கான செமஸ்டர் கட்டணம் ஒரு செமஸ்டருக்கு {fee} ஆகும்.",
      te: "{program} - {branch} కోసం సెమిస్టర్ ఫీజు ప్రతి సెమిస్టర్‌కు {fee}.",
      bn: "{program} - {branch}-এর জন্য সেমিস్టার ফি প্রতি সেমিস్టার {fee}।",
      mr: "{program} - {branch} साठी सेमিস्टర फी प्रति सेमिस्टర {fee} आहे.",
    },
    timetableResponse: {
      en: "Exam timetable for {program} - Semester {semester}:",
      hi: "{program} - सेमेस्टर {semester} के लिए परीक्षा समय सारणी:",
      ta: "{program} - செமஸ்டர் {semester} க்கான தேர்வு நேர அட்டவணை:",
      te: "{program} - సెమిస్టర్ {semester} కోసం పరీక్ష టైమ్‌టేబుల్:",
      bn: "{program} - সেমিস্টার {semester}-এর জন্য পরীক্ষার সময়সূচী:",
      mr: "{program} - सेमिस्टर {semester} साठी परीक्षा वेळापत्रक:",
    },
    latestCirculars: {
      en: "Latest Circulars:",
      hi: "नवीनतम परिपत्र:",
      ta: "சமீபத்திய சுற்றறிக்கைகள்:",
      te: "తాజా సర్క్యులర్లు:",
      bn: "সর্বশেষ সার্কুলার:",
      mr: "नवीनतम परिपत्रके:",
    },
    fallback: {
      en: "I couldn't understand your request. Please try asking about fees, timetables, scholarships, or circulars.",
      hi: "मैं आपके अनुरोध को समझ नहीं सका। कृपया शुल्क, समय सारणी, छात्रवृत्ति या परिपत्र के बारे में पूछने का प्रयास करें।",
      ta: "உங்கள் கோரிக்கையை என்னால் புரிந்து கொள்ள முடியவில்லை. கட்டணங்கள், நேர அட்டவணைகள், உதவித்தொகைகள் அல்லது சுற்றறிக்கைகள் பற்றி கேட்க முயற்சிக்கவும்.",
      te: "మీ అభ్యర్థనను నేను అర్థం చేసుకోలేకపోయాను. దయచేసి ఫీజులు, టైమ్‌టేబుల్స్, స్కాలర్‌షిప్‌లు లేదా సర్కులర్ల గురించి అడగడానికి ప్రయత్నించండి.",
      bn: "আমি আপনার অনুরোধ বুঝতে পারিনি। অনুগ্রহ করে ফি, সময়সূচী, বৃত্তি বা সার্কুলার সম্পর্কে জিজ্ঞাসা করার চেষ্টা করুন।",
      mr: "मला तुमची विनंती समजू शकली नाही. कृपया फी, वेळापत्रक, शिष्यवृत्ती किंवा परिपत्रकांबद्दल विचारण्याचा प्रयत्न करा.",
    },
  }

  return translations[key]?.[language] || translations[key]?.en || key
}
