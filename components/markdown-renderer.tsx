"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown rendering for bold (**text**), lists (•), and newlines
  const parts: React.ReactNode[] = []
  const lines = content.split("\n")

  lines.forEach((line, lineIndex) => {
    const lineParts: React.ReactNode[] = []
    let lastIndex = 0

    // Handle bold text (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g
    let match

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        lineParts.push(line.substring(lastIndex, match.index))
      }
      lineParts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>,
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < line.length) {
      lineParts.push(line.substring(lastIndex))
    }

    // If line is empty, use a space for proper spacing
    if (lineParts.length === 0) {
      lineParts.push(" ")
    }

    parts.push(<div key={`line-${lineIndex}`}>{lineParts.length > 0 ? lineParts : line}</div>)
  })

  return <div className="whitespace-pre-wrap break-words space-y-0">{parts}</div>
}
