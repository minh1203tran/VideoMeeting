
import { useState } from 'react';
import { Calendar, Users, Globe, Lock, AlignLeft, Type } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../i18n';
import { useDarkMode } from '../../context/DarkModeContext';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'instant' | 'schedule';
  onSubmit: (data: any, roomId: string) => void;
}

const getDefaultFormData = (initialType: 'instant' | 'schedule') => {
  const now = new Date();
  
  // For instant meetings: use current time
  // For scheduled meetings: use now + 30 min (rounded to hour/half hour)
  const startTime = initialType === 'instant' 
    ? new Date(now) 
    : (() => {
        const future = new Date(now);
        future.setMinutes(future.getMinutes() + 30);
        future.setMinutes(0, 0, 0); // Round to hour/half hour
        return future;
      })();
  
  const oneHourLater = new Date(startTime.getTime() + 60 * 60 * 1000);

  // Helper to format Date inputs (YYYY-MM-DD) and Time inputs (HH:mm)
  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
  };
  
  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5); // HH:mm
  };

  return {
    name: initialType === 'instant' ? `Instant Meeting - ${new Date().toLocaleTimeString()}` : '',
    description: '',
    max_participants: 10,
    type: 'public' as 'public' | 'private',
    startDate: formatDate(startTime),
    startTime: formatTime(startTime),
    endDate: formatDate(oneHourLater),
    endTime: formatTime(oneHourLater),
  };
};

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  initialType,
  onSubmit
}) => {
  const [formData, setFormData] = useState(() => getDefaultFormData('instant'));
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate max_participants
    const maxParticipants = Number(formData.max_participants);
    if (isNaN(maxParticipants) || maxParticipants < 2 || maxParticipants > 10) {
      alert('Max participants must be between 2 and 10');
      return;
    }
    
    // Combine Date and Time components into ISO strings
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    // Construct the payload exactly as requested
    const payload = {
      name: formData.name || 'Instant Meeting',
      description: formData.description,
      max_participants: maxParticipants,
      type: formData.type,
      settings: {
        additionalProp1: {}
      },
      scheduled_start_time: startDateTime.toISOString(),
      scheduled_end_time: endDateTime.toISOString(),
    };

    // Generate a random room ID for demo purposes
    const randomRoomId = Math.random().toString(36).substring(2, 12); // e.g., "x8k29a1b0"

    // Pass data AND roomId back to parent to handle navigation
    // We do NOT use window.open here to avoid blob/popup blocker issues
    onSubmit(payload, randomRoomId);
    
    onClose();
  };

  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      // Modern browsers support showPicker()
      if ('showPicker' in e.currentTarget) {
        (e.currentTarget as any).showPicker();
      }
    } catch (error) {
      // Fallback or ignore if not supported/allowed in context
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialType === 'instant' ? t.createMeeting.instantTitle : t.createMeeting.scheduleTitle}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Room Name */}
        <div className="space-y-1.5">
          <label style={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type className="w-4 h-4 text-primary-500" /> {t.createMeeting.roomName} <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder={t.createMeeting.roomNamePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: '0.75rem',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
              color: isDarkMode ? '#e5e7eb' : '#111827',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${isDarkMode ? '#1f2937' : '#f0f2f5'}, 0 0 0 4px #10b981`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label style={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlignLeft className="w-4 h-4 text-primary-500" /> {t.createMeeting.description}
          </label>
          <textarea
            rows={3}
            placeholder={t.createMeeting.descriptionPlaceholder}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: '0.75rem',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
              color: isDarkMode ? '#e5e7eb' : '#111827',
              outline: 'none',
              transition: 'all 0.3s ease',
              resize: 'none',
              fontSize: '1rem'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${isDarkMode ? '#1f2937' : '#f0f2f5'}, 0 0 0 4px #10b981`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
           {/* Room Type */}
           <div className="space-y-1.5">
            <label style={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {formData.type === 'public' ? <Globe className="w-4 h-4 text-primary-500" /> : <Lock className="w-4 h-4 text-primary-500" /> }
              {t.createMeeting.accessType}
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const value = e.target.value as 'public' | 'private';
                setFormData({...formData, type: value});
              }}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                borderRadius: '0.75rem',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                color: isDarkMode ? '#e5e7eb' : '#111827',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                colorScheme: isDarkMode ? 'dark' : 'light'
              }}
            >
              <option value="public" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', color: isDarkMode ? '#e5e7eb' : '#111827' }}>{t.createMeeting.public}</option>
              <option value="private" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', color: isDarkMode ? '#e5e7eb' : '#111827' }}>{t.createMeeting.private}</option>
            </select>
          </div>

          {/* Max Participants - Hidden */}
          <div className="space-y-1.5 hidden">
            <label style={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users className="w-4 h-4 text-primary-500" /> {t.createMeeting.maxParticipants}
            </label>
            <input
              type="number"
              min={2}
              max={10}
              value={formData.max_participants}
              onChange={(e) => setFormData({...formData, max_participants: Number(e.target.value)})}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                borderRadius: '0.75rem',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                color: isDarkMode ? '#e5e7eb' : '#111827',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Date Time Selection - Split for better UX */}
        {initialType === 'schedule' && (
        <div style={{
          padding: '1rem',
          backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f9fafb',
          borderRadius: '1.5rem',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
        } as React.CSSProperties}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: isDarkMode ? '#60a5fa' : '#10b981', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Calendar className="w-4 h-4" /> {t.createMeeting.schedule}
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {/* Start Row */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>{t.createMeeting.startDate}</label>
                     <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      onClick={openPicker}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                        color: isDarkMode ? '#e5e7eb' : '#111827',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                     <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>{t.createMeeting.startTime}</label>
                     <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        onClick={openPicker}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                          color: isDarkMode ? '#e5e7eb' : '#111827',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                     />
                  </div>
              </div>

              {/* End Row */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>{t.createMeeting.endDate}</label>
                     <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        onClick={openPicker}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                          color: isDarkMode ? '#e5e7eb' : '#111827',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      />
                  </div>
                  <div className="space-y-1">
                     <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>{t.createMeeting.endTime}</label>
                     <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        onClick={openPicker}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                          color: isDarkMode ? '#e5e7eb' : '#111827',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      />
                  </div>
              </div>
           </div>
        </div>
        )}

        <div className="pt-4 flex gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1" 
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(159, 18, 57, 0.2)' : '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#4b5563';
              e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f3f4f6';
            }}
          >
            {t.common.cancel}
          </Button>
          <Button type="submit" className="flex-1 shadow-xl shadow-primary-500/20">
            {initialType === 'instant' ? t.createMeeting.startMeetingNow : t.createMeeting.scheduleMeetingBtn}
          </Button>
        </div>

      </form>
      
      {/* Dark mode styling for selects and options */}
      {isDarkMode && (
        <style>{`
          select {
            color-scheme: dark;
          }
          select option {
            background-color: #1f2937;
            color: #e5e7eb;
          }
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
          }
        `}</style>
      )}
    </Modal>
  );
};
