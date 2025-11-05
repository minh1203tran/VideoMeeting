"use client"

interface ParticipantInfo {
  id: string
  name: string
  isMuted: boolean
  isVideoOn: boolean
  isHandRaised: boolean
}

const PARTICIPANTS: ParticipantInfo[] = [
  { id: "1", name: "You", isMuted: false, isVideoOn: true, isHandRaised: false },
  { id: "2", name: "Alex Johnson", isMuted: false, isVideoOn: true, isHandRaised: true },
  { id: "3", name: "Sarah Chen", isMuted: true, isVideoOn: true, isHandRaised: false },
  { id: "4", name: "Mike Davis", isMuted: false, isVideoOn: false, isHandRaised: false },
]

export function ParticipantsSidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">People ({PARTICIPANTS.length})</div>

      <div className="sidebar-content">
        {PARTICIPANTS.map((participant) => (
          <div key={participant.id} className="participant-item">
            <div className="participant-avatar">{participant.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e5e7eb", fontSize: "0.875rem", fontWeight: 500 }}>{participant.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                {participant.isMuted ? (
                  <span style={{ fontSize: "0.75rem" }}>🔇</span>
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>🎤</span>
                )}
                {!participant.isVideoOn && <span style={{ fontSize: "0.75rem" }}>📹</span>}
                {participant.isHandRaised && (
                  <span style={{ fontSize: "0.75rem", color: "#eab308", marginLeft: "auto" }}>✋</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
