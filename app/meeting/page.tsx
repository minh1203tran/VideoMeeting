"use client"

import { useState } from "react"
// import { MeetingHeader } from "@/components/meeting/header"
// import { VideoGrid } from "@/components/meeting/video-grid"
// import { MeetingControls } from "@/components/meeting/controls"
// import { ParticipantsSidebar } from "@/components/meeting/participants-sidebar"
// import { ChatSidebar } from "@/components/meeting/chat-sidebar"
import { MeetingHeader } from "../../components/meeting/header"
import { VideoGrid } from "../../components/meeting/video-grid"
import { MeetingControls } from "../../components/meeting/controls"
import { ParticipantsSidebar } from "../../components/meeting/participants-sidebar"
import { ChatSidebar } from "../../components/meeting/chat-sidebar"

export default function MeetingPage() {
  const [showParticipants, setShowParticipants] = useState(true)
  const [showChat, setShowChat] = useState(true)

  return (
    <div className="meeting-container">
      <MeetingHeader />

      <div className="meeting-content">
        {/* Main Meeting Area */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
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
