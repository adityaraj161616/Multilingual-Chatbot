"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, MessageSquare, Trash2, Loader2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface ChatSession {
  _id: string
  title?: string
  language: string
  messages: Array<{
    role: string
    content: string
    timestamp: string
  }>
  createdAt: string
  updatedAt: string
}

export function ChatHistorySidebar() {
  const { data: session } = useSession()
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem("sessionId")
      setSessionId(storedSessionId)
    }
  }, [])

  useEffect(() => {
    if ((session || sessionId) && isOpen) {
      loadChatHistory()
    }
  }, [session, sessionId, isOpen])

  const loadChatHistory = async () => {
    setIsLoading(true)
    try {
      const url = session?.user?.id ? "/api/chat-history" : `/api/chat-history?sessionId=${sessionId}`
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.history || [])
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat-history/${chatId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId))
        toast.success("Chat deleted")
      } else {
        toast.error("Failed to delete chat")
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
      toast.error("Failed to delete chat")
    }
  }

  const getDisplayTitle = (chat: ChatSession): string => {
    if (chat.title && chat.title.trim().length > 0) {
      return chat.title
    }
    const firstUserMsg = chat.messages.find((m) => m.role === "user")
    if (firstUserMsg?.content) {
      const content = firstUserMsg.content.trim()
      return content.length > 40 ? content.substring(0, 40) + "..." : content
    }
    return "Campus Assistant Chat"
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div
          className="fixed left-4 top-4 z-50 sm:left-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
          >
            <History className="h-5 w-5" />
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 sm:w-80 md:w-96 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-white/20 p-3 sm:p-6"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
              <History className="h-4 w-4 text-white" />
            </div>
            <span className="truncate">Chat History</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Loading history...</p>
            </div>
          ) : chatHistory.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary/50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No chat history yet</p>
              <p className="text-xs text-muted-foreground">End a conversation to save it here</p>
            </motion.div>
          ) : (
            <ScrollArea className="h-[calc(100vh-160px)]">
              <AnimatePresence>
                <div className="space-y-2 pr-2">
                  {chatHistory.map((chat, index) => (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate mb-1.5">{getDisplayTitle(chat)}</p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                              </span>
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <MessageSquare className="h-3 w-3 shrink-0" />
                              {chat.messages.length}
                            </span>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 transition-opacity bg-red-500/10 hover:bg-red-500/20 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteChat(chat._id)
                            }}
                            title="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
