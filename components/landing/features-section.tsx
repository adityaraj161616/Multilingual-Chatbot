"use client"

import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, Calendar, Award, FileText, BookOpen, MessageSquare } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: DollarSign,
    title: "Fee Information",
    description: "Semester fees, payment deadlines, payment methods, and fee waivers",
    gradient: "from-emerald-500/10 to-green-500/10",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    title: "Timetables",
    description: "Class schedules, exam dates, academic calendar, and event timings",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Award,
    title: "Scholarships",
    description: "Available scholarships, eligibility criteria, and application process",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: FileText,
    title: "Circulars & Notices",
    description: "Latest announcements, important notices, and administrative updates",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
  },
  {
    icon: BookOpen,
    title: "Academic Support",
    description: "Course information, registration help, and academic policies",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: MessageSquare,
    title: "General Queries",
    description: "Campus facilities, contact information, and general assistance",
    gradient: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <section ref={sectionRef} id="features" className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Everything You Need, One Chat Away
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Get instant answers to all your campus-related questions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}>
                <Card className="group relative p-6 sm:p-8 bg-card hover:bg-muted/50 border transition-all duration-500 hover:shadow-xl overflow-hidden h-full">
                  {/* Gradient Background */}
                  <motion.div
                    className={cn("absolute inset-0 bg-gradient-to-br opacity-0 -z-10", feature.gradient)}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon */}
                  <motion.div
                    className={cn(
                      "inline-flex p-3 rounded-xl transition-colors duration-300 mb-4",
                      feature.iconBg,
                      feature.iconColor,
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
