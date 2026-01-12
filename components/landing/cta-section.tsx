"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Zap, Shield, Clock } from "lucide-react"
import { motion, useInView } from "framer-motion"

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const features = [
    { icon: Zap, text: "Instant Responses" },
    { icon: Shield, text: "Secure & Private" },
    { icon: Clock, text: "24/7 Available" },
  ]

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="relative rounded-[2.5rem] overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02]" />

            {/* Border glow effect */}
            <div className="absolute inset-[1px] rounded-[2.5rem] border border-white/10" />
            <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-0">
              {/* Left Content */}
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 self-start mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-sm font-medium text-white/90">Ready to assist you</span>
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Start a
                  <span className="block bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
                    Conversation
                  </span>
                  Today
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-lg sm:text-xl text-white/60 mb-8 max-w-md leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Experience the future of campus assistance. Get instant, accurate answers to all your questions.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  className="flex flex-wrap gap-3 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-white/80">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Link href="/chat">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="gap-3 h-14 px-8 text-base font-semibold rounded-2xl bg-white text-slate-900 hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
                      >
                        <MessageSquare className="h-5 w-5" />
                        Start Chatting Now
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/login">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 h-14 px-8 text-base font-semibold rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Right - Visual Element */}
              <div className="relative hidden lg:flex items-center justify-center p-12">
                {/* Decorative circle rings */}
                <motion.div
                  className="absolute w-[400px] h-[400px] rounded-full border border-white/5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-[300px] h-[300px] rounded-full border border-white/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-[200px] h-[200px] rounded-full border border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* Center glass card with chat preview */}
                <motion.div
                  className="relative z-10 w-72 rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                  <div className="absolute inset-[1px] rounded-3xl border border-white/20" />

                  <div className="relative p-6">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">CampusAI</p>
                        <p className="text-xs text-white/50">Online now</p>
                      </div>
                    </div>

                    {/* Chat messages */}
                    <div className="space-y-4">
                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <div className="bg-primary/80 backdrop-blur-sm rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                          <p className="text-sm text-white">What are the library hours?</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                          <p className="text-sm text-white/90">
                            The library is open Mon-Fri 8AM-10PM, and weekends 10AM-6PM!
                          </p>
                        </div>
                      </motion.div>

                      {/* Typing indicator */}
                      <motion.div
                        className="flex gap-1 px-4 py-3"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1.4 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-white/40"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-20 right-16 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Zap className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute bottom-24 left-8 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Shield className="w-6 h-6 text-green-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
