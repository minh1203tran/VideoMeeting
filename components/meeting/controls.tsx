"use client"

import { useState } from "react"

interface MeetingControlsProps {
  onToggleParticipants: () => void
  onToggleChat: () => void
}

export function MeetingControls({ onToggleParticipants, onToggleChat }: MeetingControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)

  return (
    <div className="controls-bar">
      {/* Mic Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`control-btn ${isMuted ? "danger" : ""}`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🎤"}
      </button>

      {/* Video Control */}
      <button
        onClick={() => setIsVideoOff(!isVideoOff)}
        className={`control-btn ${isVideoOff ? "danger" : ""}`}
        title={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? "📹" : "🎥"}
      </button>

      {/* Screen Share */}
      <button className="control-btn" title="Share screen">
        🖥️
      </button>

      {/* Raise Hand */}
      <button
        onClick={() => setIsHandRaised(!isHandRaised)}
        className={`control-btn ${isHandRaised ? "active" : ""}`}
        title={isHandRaised ? "Lower hand" : "Raise hand"}
      >
        ✋
      </button>

      {/* Divider */}
      <div style={{ height: "24px", width: "1px", backgroundColor: "#3a3a3a" }} />

      {/* Chat */}
      <button onClick={onToggleChat} className="control-btn" title="Toggle chat">
        💬 Chat
      </button>

      {/* Participants */}
      <button onClick={onToggleParticipants} className="control-btn" title="Toggle participants">
        👥 People
      </button>

      {/* Settings */}
      <button className="control-btn" title="Settings">
        ⚙️
      </button>

      {/* Divider */}
      <div style={{ height: "24px", width: "1px", backgroundColor: "#3a3a3a" }} />

      {/* End Call */}
      <button className="control-btn danger" title="End meeting">
        ☎️ End
      </button>
    </div>
  )
}
