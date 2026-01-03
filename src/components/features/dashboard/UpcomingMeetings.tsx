import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Video, MoreHorizontal, ArrowRight, Calendar, Copy, Check } from 'lucide-react';
import { Card } from '../../common/Card';
import { useLanguage } from '../../../i18n';
import { useDarkMode } from '../../../context/DarkModeContext';

interface Room {
  id: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  max_participants?: number;
  type?: string;
  livekit_url?: string;
  livekit_token?: string;
}

export const UpcomingMeetings: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [meetings, setMeetings] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debug log
  useEffect(() => {
    console.log('UpcomingMeetings rendered. Meetings:', meetings);
    meetings.forEach(m => {
      console.log(`Meeting: ${m.name}, Has livekit_url: ${!!m.livekit_url}, Has livekit_token: ${!!m.livekit_token}`);
    });
  }, [meetings]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        if (!token || !apiBase) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${apiBase}/v1/rooms?page=1&page_size=100`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('🟢 API Response:', data);
          console.log('🟢 Data keys:', Object.keys(data));
          console.log('🟢 Full response JSON:', JSON.stringify(data, null, 2));
          
          // Get today's date range (entire day in local timezone)
          const today = new Date();
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
          const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

          console.log('🟢 Today range:', {
            start: todayStart.toISOString(),
            end: todayEnd.toISOString(),
            localStart: todayStart.toLocaleString(),
            localEnd: todayEnd.toLocaleString()
          });

          // Handle different possible response structures
          let roomsArray: Room[] = [];
          
          if (data.data) {
            console.log('🟢 data.data type:', typeof data.data, 'is array:', Array.isArray(data.data));
            if (Array.isArray(data.data)) {
              roomsArray = data.data;
            } else if (data.data.rooms && Array.isArray(data.data.rooms)) {
              roomsArray = data.data.rooms;
            }
          } else if (data.rooms && Array.isArray(data.rooms)) {
            roomsArray = data.rooms;
          } else if (Array.isArray(data)) {
            roomsArray = data;
          }
          
          console.log('🟢 Rooms array:', roomsArray);
          console.log('🟢 Total rooms fetched:', roomsArray.length);

          // Filter meetings for today
          const todayMeetings = roomsArray
            .filter((room: Room) => {
              if (!room.scheduled_start_time) {
                console.log('🔴 Room has no scheduled_start_time:', room.name);
                return false;
              }
              
              const startTime = new Date(room.scheduled_start_time);
              const isToday = startTime >= todayStart && startTime <= todayEnd;
              
              console.log('🔵 Room:', room.name);
              console.log('   Raw time:', room.scheduled_start_time);
              console.log('   Parsed:', startTime.toISOString());
              console.log('   Local:', startTime.toLocaleString());
              console.log('   Is today:', isToday);
              console.log('   Start >= todayStart:', startTime >= todayStart);
              console.log('   Start <= todayEnd:', startTime <= todayEnd);
              
              return isToday;
            })
            .sort((a: Room, b: Room) => 
              new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime()
            );
          
          console.log('🟢 Filtered today meetings:', todayMeetings);
          console.log('🟢 Total today meetings:', todayMeetings.length);
          setMeetings(todayMeetings);
        } else {
          console.log('🔴 Response not ok, status:', response.status);
          const errorText = await response.text();
          console.log('🔴 Error response:', errorText);
          setMeetings([]);
        }
      } catch (error) {
        console.error('🔴 Error fetching meetings:', error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);
  return (
  <Card className="relative overflow-hidden">
    <div className="flex justify-between items-center mb-6 relative z-10">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600">
           <Calendar className="w-5 h-5" />
        </span>
        {t.dashboard.upcomingToday}
      </h2>
      <button className="text-gray-400 hover:text-gray-600 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
    
    {/* Decorative background element to reduce visual emptiness */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-50/50 to-transparent dark:from-primary-900/10 pointer-events-none rounded-tr-[2rem]"></div>

    <div className="space-y-3 relative z-10">
      {loading ? (
        <div className="text-center py-10">
          <p style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}>Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
          <div className="text-center py-10">
              <p style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}>No meetings today!</p>
          </div>
      ) : (
        meetings.slice(0, showAll ? meetings.length : 3).map((meeting) => {
          const startTime = new Date(meeting.scheduled_start_time);
          const endTime = new Date(meeting.scheduled_end_time);
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
          
          const handleCopyId = async () => {
            try {
              await navigator.clipboard.writeText(meeting.id);
              setCopiedId(meeting.id);
              setTimeout(() => setCopiedId(null), 2000);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          };
          
          return (
        <div key={meeting.id} className="relative group">
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            borderRadius: '1rem',
            transform: 'scale(1)',
            transition: 'all 0.2s ease',
            pointerEvents: 'none'
          } as React.CSSProperties}></div>
          
          <div className="relative flex items-center p-4 cursor-pointer">
            {/* Date Box */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
              borderRadius: '0.75rem',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              flexShrink: 0,
              zIndex: 10,
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              transition: 'all 0.2s ease'
            } as React.CSSProperties} className="group-hover:border-primary-200 dark:group-hover:border-primary-800">
              <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', color: isDarkMode ? '#9ca3af' : '#9ca3af' }}>{format(startTime, 'MMM')}</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '900', color: isDarkMode ? '#ffffff' : '#111827' }}>{format(startTime, 'd')}</span>
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 style={{ fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', fontSize: '1rem' }} className="group-hover:text-primary-600 transition-colors">{meeting.name}</h3>
                {/* Time Badge */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
                }}>
                  {format(startTime, 'h:mm a')}
                </span>
              </div>
              
              <div className="flex items-center mt-2 justify-between">
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: '500', color: isDarkMode ? '#d1d5db' : '#6b7280', gap: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
                  }}>
                     <Clock className="w-3 h-3 mr-1" />
                     <span>{duration}m</span>
                  </div>
                  <span style={{ color: isDarkMode ? '#6b7280' : '#d1d5db' }}>|</span>
                  <button
                    onClick={handleCopyId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.75rem',
                      color: copiedId === meeting.id ? '#10b981' : (isDarkMode ? '#d1d5db' : '#6b7280')
                    }}
                    onMouseEnter={(e) => {
                      if (copiedId !== meeting.id) {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#111827' : '#e5e7eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedId !== meeting.id) {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f3f4f6';
                      }
                    }}
                  >
                    {copiedId === meeting.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        <span>ID: {meeting.id.substring(0, 8)}</span>
                      </>
                    )}
                  </button>
                   <div className="flex -space-x-2">
                    <span style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>{t.dashboard.maxParticipantsLabel} {meeting.max_participants || 10} {t.dashboard.people}</span>
                    </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Opening meeting in new tab:', meeting.id);
                    if (meeting.livekit_url && meeting.livekit_token) {
                      const livekitUrl = `https://meet.livekit.io/custom?liveKitUrl=${meeting.livekit_url}&token=${meeting.livekit_token}`;
                      console.log('LiveKit URL:', livekitUrl);
                      window.open(livekitUrl, '_blank');
                    } else {
                      console.warn('Missing livekit_url or livekit_token');
                      alert('Không thể mở cuộc họp. Vui lòng thử lại.');
                    }
                  }}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999px',
                    backgroundColor: '#fef3c7',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: '1',
                    cursor: 'pointer',
                    border: 'none',
                    zIndex: 20,
                    position: 'relative',
                    pointerEvents: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fca5a5';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
        }))}
    </div>
    
    <button style={{
      width: '100%',
      marginTop: '1.5rem',
      padding: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: isDarkMode ? '#9ca3af' : '#4b5563',
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6',
      border: '1px solid transparent',
      borderRadius: '0.75rem',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }} onClick={() => setShowAll(!showAll)} onMouseEnter={(e) => {
      e.currentTarget.style.color = isDarkMode ? '#10b981' : '#10b981';
      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff';
      e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
    }} onMouseLeave={(e) => {
      e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#4b5563';
      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6';
      e.currentTarget.style.borderColor = 'transparent';
    }}>
      {showAll ? `${t.dashboard.viewMeetingsToday} ↑` : `${t.dashboard.viewMeetingsToday} →`} <ArrowRight className="w-4 h-4" />
    </button>
  </Card>
  );
};
