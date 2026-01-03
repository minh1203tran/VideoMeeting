import { Video, Clock, Users, Calendar, MoreVertical } from 'lucide-react';
import { Card } from '../common/Card';
import { useState } from 'react';

interface MeetingRoomCardProps {
  id: string;
  name: string;
  description?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  status: 'scheduled' | 'active' | 'ended';
  currentParticipants: number;
  maxParticipants: number;
  hostName: string;
  onJoin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MeetingRoomCard = ({
  name,
  description,
  scheduledStartTime,
  status,
  currentParticipants,
  maxParticipants,
  hostName,
  onJoin,
  onEdit,
  onDelete,
}: MeetingRoomCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusConfig = {
    scheduled: {
      color: 'from-clay-blue to-primary-200',
      text: 'Scheduled',
      textColor: 'text-primary-700',
    },
    active: {
      color: 'from-accent-green/40 to-clay-mint',
      text: 'Live Now',
      textColor: 'text-green-700',
    },
    ended: {
      color: 'from-gray-200 to-gray-300',
      text: 'Ended',
      textColor: 'text-gray-700',
    },
  };

  return (
    <Card variant="default" className="p-6 relative hover:shadow-lg hover:-translate-y-1">
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig[status].color} border-[2px] border-white/60 shadow-clay-sm`}>
        <span className={`text-xs font-medium ${statusConfig[status].textColor}`}>
          {statusConfig[status].text}
        </span>
      </div>

      {/* Menu Button */}
      <div className="absolute top-4 right-28">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-clay-sm border-[2px] border-clay-blue/40 bg-white hover:bg-clay-blue/20 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4 text-text-muted" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 card-clay bg-white border-white/80 p-2 animate-slide-up z-10">
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-full text-left px-4 py-2 rounded-clay-sm text-sm text-text hover:bg-clay-blue/20 transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="w-full text-left px-4 py-2 rounded-clay-sm text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 pr-24">
        {/* Header */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-text mb-1">{name}</h3>
          {description && <p className="text-sm text-text-muted">{description}</p>}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {scheduledStartTime && (
            <div className="flex items-center gap-2 text-text-muted">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(scheduledStartTime).toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-text-muted">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {currentParticipants}/{maxParticipants} participants
            </span>
          </div>

          <div className="flex items-center gap-2 text-text-muted">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Host: {hostName}</span>
          </div>
        </div>

        {/* Action Button */}
        {status === 'active' && onJoin && (
          <button
            onClick={onJoin}
            className="w-full btn-clay btn-clay-primary flex items-center justify-center gap-2"
          >
            <Video className="w-5 h-5" />
            Join Meeting
          </button>
        )}

        {status === 'scheduled' && (
          <button className="w-full btn-clay bg-white border-primary-300 text-primary-700">
            View Details
          </button>
        )}

        {status === 'ended' && (
          <button className="w-full btn-clay bg-white border-clay-blue/60 text-text">
            View Summary
          </button>
        )}
      </div>
    </Card>
  );
};
