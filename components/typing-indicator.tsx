"use client"

import { Bot } from "lucide-react"
import { motion } from "framer-motion"

export function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3 justify-start w-full max-w-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Bot className="h-5 w-5 text-primary" />
      </motion.div>
      <div className="bg-muted text-foreground border border-border/50 rounded-xl rounded-tl-none px-5 py-3.5 shadow-sm">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-primary rounded-full"
              animate={{
                y: [-2, 2, -2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
