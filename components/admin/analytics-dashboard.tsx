"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, TrendingUp, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { toast } from "sonner"

interface AnalyticsData {
  totalConversations: number
  totalMessages: number
  resolvedQueries: number
  unresolvedQueries: number
  languageBreakdown: Record<string, number>
  categoryBreakdown: Record<string, number>
  topQuestions: Array<{ question: string; count: number }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      toast.error("Failed to load analytics")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8">No data available</div>
  }

  const languageData = Object.entries(analytics.languageBreakdown).map(([lang, count]) => ({
    language: lang,
    count,
  }))

  const categoryData = Object.entries(analytics.categoryBreakdown).map(([category, count]) => ({
    category,
    count,
  }))

  const resolutionRate =
    analytics.totalMessages > 0 ? Math.round((analytics.resolvedQueries / analytics.totalMessages) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Conversations</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalConversations}</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Messages</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalMessages}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolution Rate</CardDescription>
            <CardTitle className="text-3xl">{resolutionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unresolved Queries</CardDescription>
            <CardTitle className="text-3xl">{analytics.unresolvedQueries}</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Usage</CardTitle>
            <CardDescription>Messages by language</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Messages",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="language" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Queries by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Queries",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Most Asked Questions</CardTitle>
          <CardDescription>Top queries from users</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topQuestions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No questions yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.topQuestions.map((q, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <p className="flex-1">{q.question}</p>
                  <span className="text-sm font-semibold text-muted-foreground ml-4">{q.count}x</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
