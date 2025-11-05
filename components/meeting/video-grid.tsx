"use client"

interface Participant {
  id: string
  name: string
  isMuted: boolean
  isVideoOn: boolean
  isActive: boolean
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: "1", name: "You", isMuted: false, isVideoOn: true, isActive: true },
  { id: "2", name: "Alex Johnson", isMuted: false, isVideoOn: true, isActive: true },
  { id: "3", name: "Sarah Chen", isMuted: true, isVideoOn: true, isActive: false },
  { id: "4", name: "Mike Davis", isMuted: false, isVideoOn: false, isActive: false },
]

export function VideoGrid() {
  return (
    <div className="video-area">
      <div className="video-grid">
        {MOCK_PARTICIPANTS.map((participant) => (
          <div
            key={participant.id}
            className={`video-item ${participant.isActive ? "active" : ""}`}
            style={participant.isActive ? { gridColumn: "span 2", gridRow: "span 2" } : {}}
          >
            <div className="video-placeholder">
              {participant.isVideoOn ? (
                <>
                  <div className="video-avatar">{participant.name.charAt(0)}</div>
                  <div className="video-name">{participant.name}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎥</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Camera off</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
