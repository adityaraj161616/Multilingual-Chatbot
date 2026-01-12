"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { format } from "date-fns"
import type { IConversation } from "@/lib/models/conversation.model"

export function ConversationLogs() {
  const [conversations, setConversations] = useState<IConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      toast.error("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading conversations...</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>Recent chat sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No conversations yet</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConversation?._id === conv._id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary">{conv.language}</Badge>
                      <span className="text-xs text-muted-foreground">{conv.messages.length} msgs</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(conv.lastMessageAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Conversation Detail */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Conversation Details</CardTitle>
          <CardDescription>
            {selectedConversation
              ? `Session ${selectedConversation.sessionId.substring(0, 8)}...`
              : "Select a conversation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedConversation ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {selectedConversation.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{format(new Date(msg.timestamp), "h:mm a")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Select a conversation to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
