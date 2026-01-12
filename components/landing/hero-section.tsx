"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, MessageSquare, Zap } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

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

  const itemVariants = {
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

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
    >
      {/* Background Image Container */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY, scale: backgroundScale }}>
        <Image
          src="/images/chat-background.jpg"
          alt="Chat messages background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background/90" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 sm:mb-8">
            <Badge
              variant="secondary"
              className="px-5 py-2 text-sm font-semibold bg-white/20 backdrop-blur-xl text-white border border-white/30 shadow-lg"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              </motion.span>
              AI-Powered Assistant
            </Badge>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-12 mb-8"
          >
            {/* Glow effect behind glass */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-3xl blur-2xl -z-10" />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1] mb-6 text-white drop-shadow-lg">
              Your{" "}
              <span className="relative inline-block">
                <motion.span
                  className="relative z-10 text-white bg-primary px-3 py-1 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.6)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  24/7
                </motion.span>
              </span>{" "}
              College Information Assistant
            </h1>

            <p className="text-lg sm:text-xl text-white/90 text-balance max-w-2xl mx-auto leading-relaxed font-medium">
              Get instant answers to your queries about fees, timetables, scholarships, and circulars in your preferred
              language. Fast, accurate, and always available.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <Link href="/chat">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="gap-2 h-14 px-10 text-base font-semibold shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  Start Chatting
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            <Link href="#features">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-14 px-10 text-base font-semibold bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white border border-white/30 shadow-xl"
                >
                  <Zap className="h-5 w-5" />
                  See Features
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-8 py-6 shadow-2xl max-w-lg mx-auto"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl" />

            <div className="relative grid grid-cols-3 gap-6 sm:gap-12">
              {[
                { value: "6+", label: "Languages" },
                { value: "24/7", label: "Available" },
                { value: "<1s", label: "Response" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <motion.div
                    className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Chat Preview */}
        <motion.div
          className="relative max-w-2xl mx-auto mt-12 sm:mt-16"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="relative bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-5 sm:p-8"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-purple-500/20 to-primary/30 rounded-3xl blur-2xl -z-10" />

            {/* Inner shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl" />

            {/* Chat Messages Preview */}
            <div className="relative space-y-4">
              <motion.div
                className="flex gap-3 items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center shrink-0 shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-xl text-gray-900 rounded-2xl rounded-tl-none px-5 py-3 text-sm font-semibold shadow-lg border border-white/50">
                  Hello! How can I help you today?
                </div>
              </motion.div>

              <motion.div
                className="flex gap-3 items-start justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="bg-primary text-white rounded-2xl rounded-tr-none px-5 py-3 text-sm font-semibold shadow-lg">
                  What are the semester fees?
                </div>
              </motion.div>

              <motion.div
                className="flex gap-3 items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center shrink-0 shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-xl text-gray-900 rounded-2xl rounded-tl-none px-5 py-3 text-sm font-semibold shadow-lg border border-white/50">
                  The semester fees vary by program. For B.Tech, it's ₹75,000 per semester...
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/40 backdrop-blur-sm rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  )
}
