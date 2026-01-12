"use client"

import { useRef } from "react"
import Image from "next/image"
import { Clock, Languages, Shield } from "lucide-react"
import { motion, useInView } from "framer-motion"

const benefits = [
  {
    icon: Clock,
    title: "Instant Responses",
    description: "Get answers immediately without waiting in queues or office hours",
  },
  {
    icon: Languages,
    title: "Your Language",
    description: "Communicate in the language you're most comfortable with",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations are private and no personal data is collected",
  },
]

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const benefitVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <section ref={sectionRef} id="benefits" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              Why Students Love CampusAI
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">Built for the modern student experience</p>
          </motion.div>

          {/* Robot Image */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [-8, 8, -8],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {/* Glow effect behind the image */}
              <motion.div
                className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-75"
                animate={{
                  scale: [0.75, 0.9, 0.75],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image src="/images/ai-robot.jpg" alt="AI Robot Assistant" fill className="object-cover" />
              </motion.div>
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                Your AI Assistant
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 sm:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {benefits.map((benefit, index) => (
              <motion.div key={benefit.title} className="text-center group" variants={benefitVariants}>
                {/* Icon Container */}
                <motion.div
                  className="relative inline-flex mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  />
                  <motion.div
                    className="relative p-5 sm:p-6 bg-primary/10 rounded-full group-hover:bg-primary/15 transition-colors duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.h3
                  className="text-xl sm:text-2xl font-semibold mb-3"
                  whileHover={{ color: "var(--primary)" }}
                  transition={{ duration: 0.2 }}
                >
                  {benefit.title}
                </motion.h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xs mx-auto">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
