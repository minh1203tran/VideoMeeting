"use client"

import { useState } from "react"
import { MeetingHeader } from "@/components/meeting/header"
import { VideoGrid } from "@/components/meeting/video-grid"
import { MeetingControls } from "@/components/meeting/controls"
import { ParticipantsSidebar } from "@/components/meeting/participants-sidebar"
import { ChatSidebar } from "@/components/meeting/chat-sidebar"

export default function MeetingPage() {
  const [showParticipants, setShowParticipants] = useState(true)
  const [showChat, setShowChat] = useState(true)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Meeting Area */}
        <div className="flex-1 flex flex-col">
          <VideoGrid />
          <MeetingControls
            onToggleParticipants={() => setShowParticipants(!showParticipants)}
            onToggleChat={() => setShowChat(!showChat)}
          />
        </div>

        {/* Sidebars */}
        {showParticipants && <ParticipantsSidebar />}
        {showChat && <ChatSidebar />}
      </div>
    </div>
  )
}
