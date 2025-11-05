import { MoreVertical, MicOff, VideoOff } from "lucide-react"

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
    <div className="flex-1 p-6 overflow-auto bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {MOCK_PARTICIPANTS.map((participant) => (
          <div
            key={participant.id}
            className={`relative aspect-video bg-gradient-to-br from-card to-background rounded-lg border overflow-hidden group transition-all ${
              participant.isActive ? "border-primary lg:col-span-2 lg:row-span-2" : "border-border"
            }`}
          >
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
              {participant.isVideoOn ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/30 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Camera off</p>
                </div>
              )}
            </div>

            {/* Participant Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">{participant.name}</h3>
                {participant.isMuted && <MicOff className="w-4 h-4 text-destructive" />}
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-card/50 rounded">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Corner Badges */}
            {participant.id === "1" && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 rounded text-xs text-primary font-medium">
                You
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
