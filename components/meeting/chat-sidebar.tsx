"use client"

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
    <div className="sidebar">
      <div className="sidebar-header">Chat</div>

      <div className="sidebar-content">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <div className="chat-sender">{message.sender}</div>
            <div className="chat-text">{message.content}</div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="chat-input"
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "0.5rem 0.75rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            title="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}