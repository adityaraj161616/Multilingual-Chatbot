import type { Language } from "@/lib/types"

/**
 * GLOSSARY-BASED FALLBACK TRANSLATOR
 * ===================================
 * Used when Gemini API fails or is unavailable
 * Provides production-safe translation with comprehensive academic vocabulary
 * Preserves structure, emojis, numbers, formatting
 */

// Academic and campus vocabulary for all 6 languages
const GLOSSARY: Record<string, Record<Language, string>> = {
  // Days of week
  Monday: { en: "Monday", hi: "सोमवार", ta: "திங்கட்கிழமை", te: "సోమవారం", bn: "সোমবার", mr: "सोमवार" },
  Tuesday: { en: "Tuesday", hi: "मंगलवार", ta: "செவ்வாய்கிழமை", te: "మంగళవారం", bn: "মঙ্গলবার", mr: "मंगळवार" },
  Wednesday: { en: "Wednesday", hi: "बुधवार", ta: "புதன்கிழமை", te: "బుధవారం", bn: "বুধবার", mr: "बुधवार" },
  Thursday: { en: "Thursday", hi: "गुरुवार", ta: "வியாழக்கிழமை", te: "గురువారం", bn: "বৃহস্পতিবার", mr: "गुरुवार" },
  Friday: { en: "Friday", hi: "शुक्रवार", ta: "வெள்ளிக்கிழமை", te: "శుక్రవారం", bn: "শুক্রবার", mr: "शुक्रवार" },
  Saturday: { en: "Saturday", hi: "शनिवार", ta: "சனிக்கிழமை", te: "శనివారం", bn: "শনিবার", mr: "शनिवार" },
  Sunday: { en: "Sunday", hi: "रविवार", ta: "ஞாயிற்றுக்கிழமை", te: "ఆదివారం", bn: "রবিবার", mr: "रविवार" },

  "Mathematics-I": { en: "Mathematics-I", hi: "गणित-I", ta: "கணிதம்-I", te: "గణితం-I", bn: "গণিত-I", mr: "गणित-I" },
  "Mathematics-II": {
    en: "Mathematics-II",
    hi: "गणित-II",
    ta: "கணிதம்-II",
    te: "గణితం-II",
    bn: "গণিত-II",
    mr: "गणित-II",
  },
  "Mathematics-III": {
    en: "Mathematics-III",
    hi: "गणित-III",
    ta: "கணிதம்-III",
    te: "గణితం-III",
    bn: "গণিত-III",
    mr: "गणित-III",
  },
  "Basic Mechanical Engg": {
    en: "Basic Mechanical Engg",
    hi: "बेसिक मैकेनिकल इंजीनियरिंग",
    ta: "அடிப்படை இயந்திர பொறியியல்",
    te: "ప్రాథమిక యాంత్రిక ఇంజనీరింగ్",
    bn: "মৌলिক যান্ত্রिক প্রকৌশल",
    mr: "मूलभूत यांत्रिक अभियांत्रिकी",
  },
  "Basic Electrical Engg": {
    en: "Basic Electrical Engg",
    hi: "बेसिक विद्युत इंजीनियरिंग",
    ta: "அடிப்படை மின்சாரம் பொறியியல்",
    te: "ప్రాథమిక ఎలక్ట్రికల్ ఇంజనీరింగ్",
    bn: "মৌलिक বৈদ্যুতিক প্রকৌশল",
    mr: "मूलभूत विद्युत अभियांत्रिकी",
  },
  "Engineering Graphics": {
    en: "Engineering Graphics",
    hi: "इंजीनियरिंग ड्राइंग",
    ta: "பொறியியல் வரைகலை",
    te: "ఇంజనీరింగ్ గ్రాఫిక్‌లు",
    bn: "প্রকৌশল গ্রাফিক्स",
    mr: "अभियांत्रिकी ड्राइंग",
  },
  "C Programming": {
    en: "C Programming",
    hi: "सी प्रोग्रामिंग",
    ta: "சி நிரலாக்கம்",
    te: "సి ప్రోగ్రామింగ్",
    bn: "সি প্রোগ্রামিং",
    mr: "सी प्रोग्रामिंग",
  },
  "Data Structures": {
    en: "Data Structures",
    hi: "डेटा संरचनाएं",
    ta: "தரவு கட்டமைப்புகள்",
    te: "డేటా స్ట్రక్చర్‌లు",
    bn: "ডেটা স्ट्রাक्चার",
    mr: "डेटा संरचना",
  },
  "Digital Logic Design": {
    en: "Digital Logic Design",
    hi: "डिजिटल लॉजिक डिजाइन",
    ta: "டிஜிட்டல் தர்க்கம் வடிவமைப்பு",
    te: "డిజిటల్ లాజిక్ డిజైన్",
    bn: "ডিজিটাল লজিক ডিজাইন",
    mr: "डिजिटल लॉजिक डिজाइन",
  },
  Economics: { en: "Economics", hi: "अर्थशास्त्र", ta: "பொருளாதாரம்", te: "ఆర్థికశాస్త్రం", bn: "অর্থনীতি", mr: "अर्थशास्त्र" },
  Physics: { en: "Physics", hi: "भौतिकी", ta: "இயற்பியல்", te: "భౌతికశాస్త్రం", bn: "পদার্থবিজ্ঞान", mr: "भौतिकशास्त्र" },
  Chemistry: {
    en: "Chemistry",
    hi: "रसायन विज्ञान",
    ta: "வேதியியல்",
    te: "రసాయన శాస్త్రం",
    bn: "রসায়ন বিজ্ঞান",
    mr: "रसायन शास्त्र",
  },
  "Chemistry-I": {
    en: "Chemistry-I",
    hi: "रसायन विज्ञान-I",
    ta: "வேதியியல்-I",
    te: "రసాయన శాస్త్రం-I",
    bn: "রসায়ন বিজ্ঞান-I",
    mr: "रसायन शास्त्र-I",
  },
  "Chemistry-II": {
    en: "Chemistry-II",
    hi: "रसायन विज्ञान-II",
    ta: "வேதியியல்-II",
    te: "రసాయన శాస్త్రం-II",
    bn: "রসায়ন বিজ্ঞান-II",
    mr: "रसायन शास्त्र-II",
  },
  "Organic Chemistry": {
    en: "Organic Chemistry",
    hi: "जैव रसायन विज्ञान",
    ta: "கரிம வேதியியல்",
    te: "సేంద్రీయ రసాయన శాస్త్రం",
    bn: "জৈব রসায়ন বিজ্ঞান",
    mr: "जैव रसायन शास्त्र",
  },
  "Inorganic Chemistry": {
    en: "Inorganic Chemistry",
    hi: "अकार्बनिक रसायन विज्ञान",
    ta: "கனிம வேதியியல்",
    te: "అకర్బన రసాయన శాస్త్రం",
    bn: "অজৈব রসায়ন বিজ্ঞান",
    mr: "अकार्बनिक रसायन शास्त्र",
  },
  "Physical Chemistry": {
    en: "Physical Chemistry",
    hi: "भौतिक रसायन विज्ञान",
    ta: "உடல் வேதியியல்",
    te: "భౌతిక రసాయన శాస్త్రం",
    bn: "ফিজিক্যাল রসায়ন বিজ্ঞান",
    mr: "भौतिक रसायन शास्त्र",
  },
  "Chemistry Lab": {
    en: "Chemistry Lab",
    hi: "रसायन प्रयोगशाला",
    ta: "வேதியியல் ஆய்வுக்கூடம்",
    te: "రసాయన ల్యాబ్",
    bn: "রসায়ন ল্যাব",
    mr: "रसायन प्रयोगशाळा",
  },
  "C Programming Lab": {
    en: "C Programming Lab",
    hi: "सी प्रोग्रामिंग प्रयोगशाला",
    ta: "சி நிரலாக்கம் ஆய்வுக்கூடம்",
    te: "సి ప్రోగ్రామింగ్ ల్యాబ్",
    bn: "সি প্রোগ্রামিং ল্যাব",
    mr: "सी प्रोग्रामिंग प्रयोगशाळा",
  },
  "Physics Lab": {
    en: "Physics Lab",
    hi: "भौतिकी प्रयोगशाला",
    ta: "இயற்பியல் ஆய்வுக்கூடம்",
    te: "ఫిజిక్స్ ల్యాబ్",
    bn: "পদার্থবিজ্ঞান ল্যাব",
    mr: "भौतिकी प्रयोगशाळा",
  },
  "Electrical Lab": {
    en: "Electrical Lab",
    hi: "विद्युत प्रयोगशाला",
    ta: "மின்சாரம் ஆய்வுக்கூடம்",
    te: "ఎలక్ట్రికల్ ల్యాబ్",
    bn: "বৈদ্যুতিক ল্যাব",
    mr: "विद्युत प्रयोगशाळा",
  },
  "DS Lab": {
    en: "DS Lab",
    hi: "डेटा संरचना प्रयोगशाला",
    ta: "டிএस ஆய்வுக்கூடம்",
    te: "డీఎస్ ల్యాబ్",
    bn: "ডিএস ল্যাব",
    mr: "डेटा संरचना प्रयोगशाळा",
  },
  "DLD Lab": {
    en: "DLD Lab",
    hi: "डিजिटल लॉजिक डिजाइन प्रयोगशाला",
    ta: "டிএलडி ஆய்வுக்கூடம்",
    te: "డిఎల్డి ల్యాబ్",
    bn: "ডিএলডি ল্যাব",
    mr: "डिजिटल लॉजिक डिजाइन प्रयोगशाळा",
  },
  English: { en: "English", hi: "अंग्रेजी", ta: "ஆங்கிலம்", te: "ఆంగ్లం", bn: "ইংরেজি", mr: "इंग्रजी" },
  "Workshop Practice": {
    en: "Workshop Practice",
    hi: "कार्यशाला प्रशिक्षण",
    ta: "பணிப்பாட்டை பயிற்சி",
    te: "వర్క్‌షాప్ ప్రాక్టీస్",
    bn: "ওয়ার্কশপ প्র্যাকটিস",
    mr: "कार्यशाळा प्रशिक्षण",
  },
  Workshop: { en: "Workshop", hi: "कार्यशाला", ta: "பணிப்பாட்டை", te: "వర్క్‌షాప్", bn: "ওয়ার্কশপ", mr: "कार्यशाळा" },
  PDP: {
    en: "PDP",
    hi: "पीडीपी",
    ta: "பிடிபி",
    te: "పిడిపి",
    bn: "পিডিপি",
    mr: "पीडीपी",
  },
  Library: { en: "Library", hi: "पुस्तकालय", ta: "நூலகம்", te: "లైబ్రరీ", bn: "লাইব্রেরি", mr: "ग्रंथालय" },

  // Venue types
  Lab: { en: "Lab", hi: "प्रयोगशाला", ta: "ஆய்வுக்கூடம்", te: "ల్యాబ్", bn: "ল্যাব", mr: "प्रयोगशाळा" },
  "Drawing Hall": {
    en: "Drawing Hall",
    hi: "ड्राइंग हॉल",
    ta: "வரைதல் அரங்கம்",
    te: "డ్రాయింగ్ హల్",
    bn: "ড్রয়িং হল",
    mr: "रेखाचित्र हॉल",
  },
  "Seminar Hall": {
    en: "Seminar Hall",
    hi: "सेमिनार हॉल",
    ta: "செமிநார் அரங்கம்",
    te: "సెమినార్ హల్",
    bn: "সেমিনার হল",
    mr: "सेमिनार हॉल",
  },
  "Lecture Hall": {
    en: "Lecture Hall",
    hi: "व्याख्यान हॉल",
    ta: "விரிவுரை அரங்கம்",
    te: "లెక్చర్ హల్",
    bn: "লেকচার হল",
    mr: "व्याख्यान हॉल",
  },

  // Academic headings
  "Class Timetable": {
    en: "Class Timetable",
    hi: "कक्षा समय सारणी",
    ta: "வகுப்பு நேர அட்டவணை",
    te: "తరగతి టైమ్‌టేబుల్",
    bn: "ক्लাস টাইমটেবল",
    mr: "वर्गाचे वेळापत्रक",
  },
  "Exam Timetable": {
    en: "Exam Timetable",
    hi: "परीक्षा समय सारणी",
    ta: "தேர்வு நேர அட்டவணை",
    te: "పరీక్ష టైమ్‌టేబుల్",
    bn: "পরীক্षा টাইমটেবल",
    mr: "परीक्षा वेळापत्रक",
  },
  "Semester Fees": {
    en: "Semester Fees",
    hi: "सेमेस्टर फीस",
    ta: "செமிஸ்டர் கட்டணம்",
    te: "సెమిస్టర్ ఫీజు",
    bn: "সেমিস্টर ফি",
    mr: "सेमेस्टर फी",
  },
  "Available Scholarships": {
    en: "Available Scholarships",
    hi: "उपलब्ध छात्रवृत्तियाँ",
    ta: "கிடைக்கும் உதவித்தொகைகள்",
    te: "అందుబాటులో ఉన్న స్కాలర్‌షిప్‌లు",
    bn: "উপলব্ধ বৃত্তিসমূহ",
    mr: "उपलब्ध शिष्यवृत्ती",
  },
  "Latest Circulars": {
    en: "Latest Circulars",
    hi: "नवीनतम परिपत्र",
    ta: "சமீபத்திய சுற்றறிக்கைகள்",
    te: "తాజా సర్క్యులర్‌లు",
    bn: "সর্বশেষ সার্কুলারসমূহ",
    mr: "नवीनतम परिपत्रके",
  },

  // Common labels
  Time: { en: "Time", hi: "समय", ta: "நேரம்", te: "సమయం", bn: "সময়", mr: "वेळ" },
  Subject: { en: "Subject", hi: "विषय", ta: "பாடம்", te: "విషయం", bn: "বিষয়", mr: "विषय" },
  Faculty: { en: "Faculty", hi: "संकाय", ta: "преподавателский состав", te: "ఫ్యాకల్టీ", bn: "শিক্ষক", mr: "संकाय" },
  Venue: { en: "Venue", hi: "स्थान", ta: "இடம்", te: "సంస్థ", bn: "স্থান", mr: "स्थान" },
  Room: { en: "Room", hi: "कक्ष", ta: "அறை", te: "గది", bn: "कक्ष", mr: "खोली" },
  Semester: { en: "Semester", hi: "सेमेस्टर", ta: "செமிஸ்டர்", te: "సెమిస్టర్", bn: "সেমিস্টার", mr: "सेमेस्टर" },
  Program: { en: "Program", hi: "कार्यक्रम", ta: "திட்டம்", te: "ప్రోగ్రామ్", bn: "প्রোগ্রাম", mr: "कार्यक्रम" },
  Branch: { en: "Branch", hi: "शाखा", ta: "கிளை", te: "శాఖ", bn: "শাখা", mr: "शाखा" },
}

/**
 * Translate using glossary with improved matching algorithm
 * Handles compound terms, hyphens, and multi-word subjects
 * Preserves formatting, emojis, numbers, structure
 */
export function glossaryTranslate(text: string, targetLanguage: Language): string {
  if (targetLanguage === "en") return text
  if (!text || text.trim().length === 0) return text

  let result = text

  // Sort glossary entries by length (longest first) to avoid partial replacements
  // This ensures "C Programming Lab" is matched before "C Programming"
  const sortedEntries = Object.entries(GLOSSARY).sort((a, b) => b[0].length - a[0].length)

  for (const [englishTerm, translations] of sortedEntries) {
    const targetTranslation = translations[targetLanguage]
    if (targetTranslation && targetTranslation !== englishTerm) {
      // Matches whole words/phrases but not partial substrings
      const escapedTerm = englishTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`(?<!\\w)${escapedTerm}(?!\\w)`, "gi")
      result = result.replace(regex, targetTranslation)
    }
  }

  return result
}

/**
 * Validate translation quality
 * Returns false if translation seems invalid
 */
function isValidTranslation(original: string, translated: string, targetLanguage: Language): boolean {
  if (!translated || translated.trim().length === 0) return false
  if (translated === original && targetLanguage !== "en") return false
  if (translated.length < original.length * 0.3) return false
  if (translated.length > original.length * 3) return false

  return true
}

export { isValidTranslation }
