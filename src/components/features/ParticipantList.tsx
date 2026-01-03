import { User, Mic, MicOff, Video, VideoOff, Crown, MoreVertical } from 'lucide-react';
import { Card } from '../common/Card';
import { useState } from 'react';

interface Participant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'host' | 'participant';
  status: 'joined' | 'waiting' | 'left';
  isMuted?: boolean;
  isVideoOff?: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
  currentUserId?: string;
  onMuteToggle?: (participantId: string) => void;
  onRemove?: (participantId: string) => void;
  onMakeHost?: (participantId: string) => void;
}

export const ParticipantList = ({
  participants,
  currentUserId,
  onMuteToggle,
  onRemove,
  onMakeHost,
}: ParticipantListProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading font-semibold text-text">
            Participants ({participants.length})
          </h3>
        </div>

        <div className="space-y-2">
          {participants.map((participant) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              isCurrentUser={participant.userId === currentUserId}
              onMuteToggle={() => onMuteToggle?.(participant.id)}
              onRemove={() => onRemove?.(participant.id)}
              onMakeHost={() => onMakeHost?.(participant.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

const ParticipantItem = ({
  participant,
  isCurrentUser,
  onMuteToggle,
  onRemove,
  onMakeHost,
}: {
  participant: Participant;
  isCurrentUser: boolean;
  onMuteToggle?: () => void;
  onRemove?: () => void;
  onMakeHost?: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 rounded-clay bg-gradient-to-br from-white to-clay-blue/10 border-[2px] border-clay-blue/40 hover:border-primary-300 transition-all duration-200">
      {/* User Info */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          {participant.userAvatar ? (
            <img
              src={participant.userAvatar}
              alt={participant.userName}
              className="w-10 h-10 rounded-full border-2 border-primary-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-2 border-primary-300">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          
          {participant.role === 'host' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-accent-orange to-yellow-500 flex items-center justify-center shadow-clay-sm">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium text-text">
            {participant.userName}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-primary-600">(You)</span>
            )}
          </p>
          <p className="text-xs text-text-muted capitalize">{participant.role}</p>
        </div>
      </div>

      {/* Status Icons */}
      <div className="flex items-center gap-2">
        {participant.isMuted ? (
          <div className="p-2 rounded-clay-sm bg-red-100 border-[2px] border-red-200">
            <MicOff className="w-4 h-4 text-red-600" />
          </div>
        ) : (
          <div className="p-2 rounded-clay-sm bg-green-100 border-[2px] border-green-200">
            <Mic className="w-4 h-4 text-green-600" />
          </div>
        )}

        {participant.isVideoOff ? (
          <div className="p-2 rounded-clay-sm bg-red-100 border-[2px] border-red-200">
            <VideoOff className="w-4 h-4 text-red-600" />
          </div>
        ) : (
          <div className="p-2 rounded-clay-sm bg-green-100 border-[2px] border-green-200">
            <Video className="w-4 h-4 text-green-600" />
          </div>
        )}

        {/* Actions Menu */}
        {!isCurrentUser && (onMuteToggle || onRemove || onMakeHost) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-clay-sm border-[2px] border-clay-blue/40 bg-white hover:bg-clay-blue/20 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4 text-text-muted" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 card-clay bg-white border-white/80 p-2 animate-slide-up z-10">
                {onMuteToggle && (
                  <button
                    onClick={() => {
                      onMuteToggle();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-clay-sm text-sm text-text hover:bg-clay-blue/20 transition-colors cursor-pointer"
                  >
                    {participant.isMuted ? 'Unmute' : 'Mute'}
                  </button>
                )}
                {onMakeHost && participant.role !== 'host' && (
                  <button
                    onClick={() => {
                      onMakeHost();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-clay-sm text-sm text-text hover:bg-clay-blue/20 transition-colors cursor-pointer"
                  >
                    Make Host
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => {
                      onRemove();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-clay-sm text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
