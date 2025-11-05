"use client"

import { Button } from "@/components/button"
import { Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, Users, Hand, Settings, PhoneOff } from "lucide-react"
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
    <div className="border-t border-border bg-card px-6 py-4">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* Mic Control */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsMuted(!isMuted)}
          className={`rounded-full border-border hover:bg-card ${
            isMuted ? "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30" : ""
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Video Control */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`rounded-full border-border hover:bg-card ${
            isVideoOff ? "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30" : ""
          }`}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>

        {/* Screen Share */}
        <Button variant="outline" size="lg" className="rounded-full border-border hover:bg-card bg-transparent">
          <Monitor className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline text-sm">Share</span>
        </Button>

        {/* Raise Hand */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsHandRaised(!isHandRaised)}
          className={`rounded-full border-border hover:bg-card ${
            isHandRaised ? "bg-accent/20 border-accent text-accent" : ""
          }`}
        >
          <Hand className="w-5 h-5" />
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Chat */}
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleChat}
          className="rounded-full border-border hover:bg-card bg-transparent"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline text-sm">Chat</span>
        </Button>

        {/* Participants */}
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleParticipants}
          className="rounded-full border-border hover:bg-card bg-transparent"
        >
          <Users className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline text-sm">
            People <span className="ml-1 text-muted-foreground">(4)</span>
          </span>
        </Button>

        {/* Settings */}
        <Button variant="outline" size="lg" className="rounded-full border-border hover:bg-card bg-transparent">
          <Settings className="w-5 h-5" />
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* End Call */}
        <Button size="lg" className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <PhoneOff className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline text-sm">End</span>
        </Button>
      </div>
    </div>
  )
}
