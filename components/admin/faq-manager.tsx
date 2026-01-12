"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { type Language, SUPPORTED_LANGUAGES } from "@/lib/types"
import type { IFAQ } from "@/lib/models/faq.model"

export function FAQManager() {
  const [faqs, setFaqs] = useState<IFAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    category: "general" as IFAQ["category"],
    question: {
      en: "",
      hi: "",
      ta: "",
      te: "",
      bn: "",
      mr: "",
    },
    answer: {
      en: "",
      hi: "",
      ta: "",
      te: "",
      bn: "",
      mr: "",
    },
    keywords: "",
    priority: 0,
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/faqs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setFaqs(data.faqs || [])
    } catch (error) {
      toast.error("Failed to load FAQs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(",").map((k) => k.trim()),
        }),
      })

      if (!response.ok) throw new Error("Failed to create FAQ")

      toast.success("FAQ created successfully")
      resetForm()
      setIsCreating(false)
      fetchFAQs()
    } catch (error) {
      toast.error("Failed to create FAQ")
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return

    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`/api/admin/faqs/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(",").map((k) => k.trim()),
        }),
      })

      if (!response.ok) throw new Error("Failed to update FAQ")

      toast.success("FAQ updated successfully")
      resetForm()
      setEditingId(null)
      fetchFAQs()
    } catch (error) {
      toast.error("Failed to update FAQ")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to delete FAQ")

      toast.success("FAQ deleted successfully")
      fetchFAQs()
    } catch (error) {
      toast.error("Failed to delete FAQ")
    }
  }

  const startEdit = (faq: IFAQ) => {
    setEditingId(faq._id)
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords.join(", "),
      priority: faq.priority,
    })
    setIsCreating(false)
  }

  const resetForm = () => {
    setFormData({
      category: "general",
      question: { en: "", hi: "", ta: "", te: "", bn: "", mr: "" },
      answer: { en: "", hi: "", ta: "", te: "", bn: "", mr: "" },
      keywords: "",
      priority: 0,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading FAQs...</div>
  }

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit FAQ" : "Create New FAQ"}</CardTitle>
            <CardDescription>Fill in all language translations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val as IFAQ["category"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="fees">Fees</SelectItem>
                    <SelectItem value="timetable">Timetable</SelectItem>
                    <SelectItem value="scholarships">Scholarships</SelectItem>
                    <SelectItem value="circulars">Circulars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority (higher = more important)</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Keywords (comma-separated)</Label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="fee, payment, semester"
              />
            </div>

            {/* Language-specific fields */}
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <div key={code} className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-semibold">{name}</h4>
                <div>
                  <Label>Question</Label>
                  <Input
                    value={formData.question[code as Language]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question: { ...formData.question, [code]: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea
                    value={formData.answer[code as Language]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answer: { ...formData.answer, [code]: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleCreate} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={cancelEdit} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      {!isCreating && !editingId && (
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New FAQ
        </Button>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No FAQs created yet. Click "Create New FAQ" to get started.
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card key={faq._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{faq.category}</Badge>
                      <Badge variant="outline">Priority: {faq.priority}</Badge>
                    </div>
                    <CardTitle className="text-lg">{faq.question.en}</CardTitle>
                    <CardDescription className="mt-1">{faq.answer.en.substring(0, 100)}...</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(faq)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(faq._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
