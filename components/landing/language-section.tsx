"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"
import { motion, useInView } from "framer-motion"

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
]

export function LanguageSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.4 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <section ref={sectionRef} id="languages" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative bg-card rounded-3xl border p-8 sm:p-12 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Icon */}
              <motion.div
                className="shrink-0"
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="relative p-4 bg-primary/10 rounded-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">Speak Your Language</h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Chat comfortably in your preferred language. Our AI assistant understands and responds in multiple
                    Indian languages, making campus information accessible to everyone.
                  </p>
                </motion.div>

                {/* Language Badges */}
                <div className="flex flex-wrap gap-3">
                  {languages.map((lang, index) => (
                    <motion.div
                      key={lang.code}
                      custom={index}
                      variants={badgeVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant="secondary"
                        className="px-4 py-2 text-sm font-medium bg-background hover:bg-muted transition-all duration-300 cursor-default"
                      >
                        <span className="text-primary mr-1.5">{lang.native}</span>
                        <span className="text-muted-foreground">({lang.name})</span>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
