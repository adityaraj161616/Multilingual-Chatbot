"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageSquare, LogOut, BarChart3, MessageCircle, FileEdit } from "lucide-react"
import { FAQManager } from "@/components/admin/faq-manager"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { ConversationLogs } from "@/components/admin/conversation-logs"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <span className="font-semibold text-sm sm:text-base lg:text-lg truncate">Campus Assistant - Admin</span>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 bg-transparent text-xs sm:text-sm"
            size="sm"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage FAQs, view analytics, and monitor conversations
          </p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-full sm:max-w-[600px] grid-cols-3 h-auto">
            <TabsTrigger value="analytics" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <FileEdit className="h-3 w-3 sm:h-4 sm:w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="conversations" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Conversations</span>
              <span className="sm:hidden">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQManager />
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationLogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
