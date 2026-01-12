"use client"

import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/types"
import { DollarSign, Calendar, Award, FileText, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface QuickRepliesProps {
  onSelect: (text: string) => void
  language: Language
}

export function QuickReplies({ onSelect, language }: QuickRepliesProps) {
  const quickReplies = getQuickReplies(language)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div className="w-full space-y-6 mt-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex items-center justify-center gap-2" variants={itemVariants}>
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground font-semibold">Quick questions to get started</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickReplies.map((reply, index) => (
          <motion.div key={reply.id} variants={itemVariants}>
            <Button
              variant="outline"
              className="w-full h-auto py-5 px-5 flex flex-col items-start gap-3 text-left bg-card border-border/50 hover:border-primary/30 hover:bg-muted/50 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md shadow-sm group"
              onClick={() => onSelect(reply.text)}
            >
              <motion.div
                className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors ring-1 ring-primary/10"
                whileHover={{ rotate: 8, scale: 1.1 }}
              >
                <span className="text-primary text-lg">{reply.icon}</span>
              </motion.div>
              <span className="text-sm leading-relaxed font-semibold text-foreground">{reply.text}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function getQuickReplies(lang: Language) {
  const replies = {
    en: [
      { id: "1", text: "What are the semester fees?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "Show me the exam timetable", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "Available scholarships?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "Latest circulars", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
    hi: [
      { id: "1", text: "सेमेस्टर की फीस क्या है?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "परीक्षा समय सारणी दिखाएं", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "उपलब्ध छात्रवृत्तियाँ?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "नवीनतम परिपत्र", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
    ta: [
      { id: "1", text: "செமஸ்டர் கட்டணம் என்ன?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "தேர்வு நேர அட்டவணையைக் காட்டு", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "கிடைக்கும் உதவித்தொகை?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "சமீபத்திய சுற்றறிக்கைகள்", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
    te: [
      { id: "1", text: "సెమిస్టర్ ఫీలు ఎంత?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "పరీక్ష టైమ్‌టేబుల్ చూపించు", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "అందుబాటులో ఉన్న స్కాలర్‌షిప్స్?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "తాజా సర్క్యులర్లు", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
    bn: [
      { id: "1", text: "সেমিস্টার ফি কত?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "পরীক্ষার সময়সূচী দেখান", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "উপলব্ধ বৃত্তি?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "সর্বশেষ সার্কুলার", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
    mr: [
      { id: "1", text: "सेमिस्टर फी किती आहे?", icon: <DollarSign className="h-5 w-5" />, category: "fees" },
      { id: "2", text: "परीक्षा वेळापत्रक दाखवा", icon: <Calendar className="h-5 w-5" />, category: "timetable" },
      { id: "3", text: "उपलब्ध शिष्यवृत्ती?", icon: <Award className="h-5 w-5" />, category: "scholarships" },
      { id: "4", text: "नवीनतम परिपत्रके", icon: <FileText className="h-5 w-5" />, category: "circulars" },
    ],
  }
  return replies[lang]
}
