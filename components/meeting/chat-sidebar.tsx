"use client"

import { X, Send } from "lucide-react"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: string
  isAI?: boolean
}

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", sender: "Alex Johnson", content: "Hey everyone! Ready to start?", timestamp: "10:30 AM", isAI: false },
  { id: "2", sender: "Sarah Chen", content: "Yes, let's begin the discussion", timestamp: "10:31 AM", isAI: false },
  {
    id: "3",
    sender: "AI Assistant",
    content: "Meeting started. I'm transcribing now.",
    timestamp: "10:32 AM",
    isAI: true,
  },
]

export function ChatSidebar() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: String(messages.length + 1),
        sender: "You",
        content: inputValue,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Chat</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${message.isAI ? "text-primary" : "text-foreground"}`}>
                {message.sender}
              </p>
              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground bg-background/50 rounded px-3 py-2">{message.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
