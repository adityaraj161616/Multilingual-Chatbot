"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Loader2, ArrowLeft, XCircle, Globe } from "lucide-react"
import Link from "next/link"
import { type Language, SUPPORTED_LANGUAGES, type ChatMessage } from "@/lib/types"
import { getSessionId } from "@/lib/utils/session"
import { ChatMessageBubble } from "@/components/chat-message-bubble"
import { QuickReplies } from "@/components/quick-replies"
import { TypingIndicator } from "@/components/typing-indicator"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, UserIcon } from "lucide-react"
import { AnimatePresence } from "framer-motion"

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const id = getSessionId()
    setSessionId(id)

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage("en"),
        timestamp: new Date(),
        wasAnswered: true,
      },
    ])

    return () => {}
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading])

  const updateWelcomeMessage = useCallback(() => {
    setMessages((prevMessages) => {
      if (prevMessages.length > 0 && prevMessages[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "assistant",
            content: getWelcomeMessage(language),
            timestamp: new Date(),
            wasAnswered: true,
          },
          ...prevMessages.slice(1),
        ]
      }
      return prevMessages
    })
  }, [language])

  useEffect(() => {
    updateWelcomeMessage()
  }, [updateWelcomeMessage])

  const isChatActive = messages.some((msg) => msg.role === "user")

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading || !sessionId) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language,
          sessionId,
          conversationHistory: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
            language,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        wasAnswered: data.wasAnswered,
        options: data.options || [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getErrorMessage(language),
        timestamp: new Date(),
        wasAnswered: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleOptionSelect = (value: string) => {
    handleSend(value)
  }

  const handleQuickReply = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEndConversation = async () => {
    try {
      const response = await fetch("/api/chat/end-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: getWelcomeMessage(language),
            timestamp: new Date(),
            wasAnswered: true,
          },
        ])
        const newId = getSessionId()
        setSessionId(newId)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to end conversation: ${errorData?.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error ending conversation:", error)
      alert("Error ending conversation. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 flex flex-col">
      <ChatHistorySidebar />

      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Header - Redesigned for clarity and spacing */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-border bg-card shrink-0 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-0">
              <Link href="/">
                <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 hover:bg-muted">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-sm sm:text-base truncate">Campus Assistant</h1>
                  <p className="text-xs text-muted-foreground font-medium leading-tight">Educational Support</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
              <Select value={language} onValueChange={(val) => setLanguage(val as Language)} disabled={isChatActive}>
                <SelectTrigger
                  className="text-xs sm:text-sm border border-border hover:bg-muted transition-colors h-9 sm:h-10 px-2 sm:px-3 w-auto"
                  disabled={isChatActive}
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <AnimatePresence>
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEndConversation}
                    className="text-xs h-9 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 px-2"
                  >
                    <XCircle className="h-4 w-4 mr-0 sm:mr-1.5" />
                    <span className="hidden sm:inline">New Chat</span>
                  </Button>
                )}
              </AnimatePresence>

              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 hover:bg-muted">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                          {session.user.name?.[0] || <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="shrink-0 bg-transparent h-9 text-xs sm:text-sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </header>

          <ScrollArea className="flex-1 overflow-hidden" ref={scrollRef}>
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-10">
                {messages.length <= 1 ? (
                  // Welcome state - centered
                  <div className="max-w-2xl mx-auto w-full flex flex-col">
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <div key={message.id} className="flex justify-center">
                          <ChatMessageBubble message={message} onOptionSelect={handleOptionSelect} />
                        </div>
                      ))}
                    </AnimatePresence>
                    {!isLoading && <QuickReplies onSelect={handleQuickReply} language={language} />}
                  </div>
                ) : (
                  // Active chat - full conversation
                  <div className="space-y-4 flex flex-col justify-end h-full">
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <ChatMessageBubble key={message.id} message={message} onOptionSelect={handleOptionSelect} />
                      ))}
                    </AnimatePresence>
                    {isLoading && <TypingIndicator />}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="p-5 sm:p-6 border-t border-border bg-card shrink-0">
            <div className="max-w-2xl mx-auto w-full">
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder(language)}
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[48px] max-h-[120px] text-sm font-medium placeholder:text-muted-foreground/60 transition-all"
                  style={{ height: "48px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "48px"
                    target.style.height = Math.min(target.scrollHeight, 120) + "px"
                  }}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading || !sessionId}
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getWelcomeMessage(language: Language): string {
  const messages: Record<Language, string> = {
    en: "Welcome to Campus Assistant! Ask me anything about campus life, academics, or student services.",
    hi: "Campus Assistant में आपका स्वागत है! मुझसे कैंपस जीवन, शिक्षा या छात्र सेवाओं के बारे में कुछ भी पूछें।",
    te: "Campus Assistant కు స్వాగతం! ক్యాంపస్ జీవనం, విద్యాభ్యాసం లేదా విద్యార్థుల సేవల గురించి నన్నూ ఏదైనా అడగండి.",
    ta: "Campus Assistantக்கு வரவேற்கிறோம்! கேம்பஸ் வாழ்க்கை, கல்வி அல்லது மாணவர் சேவைகள் பற்றி என்னிடம் கேளுங்கள்.",
    bn: "Campus Assistantে আপনাকে স্বাগতম! ক্যাম্পস জীবন, শিক্ষা বা শিক্ষার্থী সেবা সম্পর্কে আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।",
    gu: "Campus Assistantમાં તમારું સ્વાગત છે! ક્યાંપસ જીવન, શિક્ષા અથવા શિક્ષાર્થી સેવાઓ વિશે મને કંઈ પણ પૂછો.",
    kn: "Campus Assistantಗೆ ಸ್ವಾಗತ! ಕ್ಯಾಂಪಸ್ ಜೀವನ, ಶಿಕ್ಷೆ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಏನು ಪ್ರಶ್ನಿಸಲೇ ಬಹುದು.",
    ml: "Campus Assistantലിലേക്ക് സ്വാഗതം! ക്യാംപസ് ജീവനം, വിദ്യാഭ്യാസം അല്ലെങ്കിൽ വിദ്യാർത്ഥി സേവനങ്ങൾ സംബന്ധിച്ച് എന്നോട് എന്തും ചോദിക്കുക.",
    mr: "Campus Assistant मध्ये आपल्याचा स्वागत आहे! कॅम्पस जीवन, शिक्षा किंवा विद्यार्थी सेवा बद्दल मला काहीही विचारा.",
  }
  return messages[language] || messages.en
}

function getErrorMessage(language: Language): string {
  const messages: Record<Language, string> = {
    en: "I encountered an issue processing your request. Please try again.",
    hi: "आपके अनुरोध को संसाधित करने में समस्या हुई। कृपया पुनः प्रयास करें।",
    te: "మీ అభ్యర్థనను సంసాధించడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    ta: "உங்கள் கோரிக்கையை செயல்படுத்த சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சி செய்யவும்.",
    bn: "আপনার অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    gu: "તમારી વિનંતી પ્રક્રિયા કરવામાં સમસ્યા આવી. કૃપયા ફરી પ્રયાસ કરો.",
    kn: "ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡುವಲ್ಲಿ ಸಮಸ್ಯೆ ಎದುರಾಯಿತು. ದಯವಾಯಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    ml: "നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ് ചെയ്യുന്നതിൽ ഒരു പ്രശ്നം ഉണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    mr: "आपल्या विनंतीवर प्रक्रिया करताना समस्या आली. कृपया पुन्हा प्रयत्न करा.",
  }
  return messages[language] || messages.en
}

function getPlaceholder(language: Language): string {
  const messages: Record<Language, string> = {
    en: "Type your question here...",
    hi: "अपना सवाल यहाँ टाइप करें...",
    te: "ఇక్కడ మీ ప్రశ్నను టైప్ చేయండి...",
    ta: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
    bn: "এখানে আপনার প্রশ্ন টাইপ করুন...",
    gu: "તમારો પ્રશ્ન અહીં ટાઈપ કરો...",
    kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    ml: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
    mr: "आपल्या प्रश्नाचे लेखन येथे करा...",
  }
  return messages[language] || messages.en
}
