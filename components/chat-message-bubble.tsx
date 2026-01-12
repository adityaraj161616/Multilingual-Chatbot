"use client"

import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertCircle, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { AnimatePresence, motion } from "framer-motion"

interface ChatMessageBubbleProps {
  message: ChatMessage
  onOptionSelect?: (value: string) => void
}

export function ChatMessageBubble({ message, onOptionSelect }: ChatMessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      className={cn("flex gap-3 w-full max-w-2xl", isUser ? "justify-end ml-auto" : "justify-start")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex flex-col gap-3 max-w-[85%] sm:max-w-[70%]">
        <div
          className={cn(
            "rounded-xl px-5 py-3.5 text-sm leading-relaxed font-medium",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
              : "bg-muted text-foreground rounded-tl-none border border-border/50 shadow-sm",
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={message.content} />
          </div>

          {!isUser && message.wasAnswered === false && (
            <motion.div
              className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="font-medium">
                This topic may need further clarification. Please ask a follow-up question.
              </span>
            </motion.div>
          )}
        </div>

        {!isUser && message.options && message.options.length > 0 && onOptionSelect && (
          <motion.div
            className="flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence>
              {message.options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2.5 px-4 text-xs whitespace-normal hover:bg-primary/5 hover:border-primary/30 bg-transparent border-border/50 font-medium transition-all rounded-lg"
                    onClick={() => onOptionSelect(option.value)}
                  >
                    {option.label}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center ring-1 ring-border">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  )
}
