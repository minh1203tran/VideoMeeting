import { X, Hand, Mic, MicOff, VideoOff, MoreVertical } from "lucide-react"

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
    <div className="w-72 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">People ({PARTICIPANTS.length})</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {PARTICIPANTS.map((participant) => (
          <div
            key={participant.id}
            className="px-4 py-3 hover:bg-background/50 border-b border-border/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-primary/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{participant.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {participant.isMuted ? (
                    <MicOff className="w-3 h-3 text-destructive" />
                  ) : (
                    <Mic className="w-3 h-3 text-muted-foreground" />
                  )}
                  {!participant.isVideoOn && <VideoOff className="w-3 h-3 text-destructive" />}
                  {participant.isHandRaised && <Hand className="w-3 h-3 text-accent ml-auto" />}
                </div>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-background rounded">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
