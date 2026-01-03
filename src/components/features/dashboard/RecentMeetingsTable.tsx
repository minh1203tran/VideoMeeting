import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Video, PlayCircle, FileText, Download, ArrowRight } from 'lucide-react';
import { Card } from '../../common/Card';
import { useLanguage } from '../../../i18n';
import { useDarkMode } from '../../../context/DarkModeContext';

interface RecentMeeting {
  id: string;
  name: string;
  host: {
    name: string;
  };
  scheduled_start_time: string;
  status: string;
  current_participants?: number;
}

export const RecentMeetingsTable: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [meetings, setMeetings] = useState<RecentMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        if (!token || !apiBase) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${apiBase}/v1/rooms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const rooms = data.data?.rooms || data.data || data || [];
          
          // Transform API data to match component expectations
          const transformedMeetings = rooms.map((room: any) => ({
            id: room.id,
            name: room.name || room.title || 'Untitled Meeting',
            host: {
              name: room.host?.name || 'Unknown Host'
            },
            scheduled_start_time: room.scheduled_start_time || room.created_at || new Date().toISOString(),
            status: room.status || 'completed',
            current_participants: room.current_participants || room.participant_count || 0
          }));
          
          // Group meetings by date and get top 5 most recent dates
          const meetingsByDate = new Map<string, any[]>();
          
          transformedMeetings.forEach((meeting: any) => {
            const dateKey = format(new Date(meeting.scheduled_start_time), 'yyyy-MM-dd');
            if (!meetingsByDate.has(dateKey)) {
              meetingsByDate.set(dateKey, []);
            }
            meetingsByDate.get(dateKey)!.push(meeting);
          });
          
          // Get top 5 most recent dates
          const sortedDates = Array.from(meetingsByDate.keys())
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .slice(0, 5);
          
          // Flatten meetings from top 5 dates
          const topMeetings = sortedDates.flatMap(date => meetingsByDate.get(date) || []);
          
          setMeetings(topMeetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);
  return (
  <Card noPadding>
    <div style={{
      padding: '1.5rem',
      borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#111827' }}>{t.dashboard.recentMeetings}</h2>
      <div className="flex gap-2">
        <select style={{
          fontSize: '0.875rem',
          border: 'none',
          backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
          borderRadius: '0.5rem',
          padding: '0.375rem 0.75rem',
          color: isDarkMode ? '#d1d5db' : '#4b5563',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}>
          <option>{t.dashboard.allMeetings}</option>
          <option>{t.dashboard.recorded}</option>
          <option>{t.dashboard.summarized}</option>
        </select>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead style={{
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : '#f3f4f6',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          fontWeight: '600'
        }}>
          <tr>
            <th className="px-6 py-4">{t.dashboard.meetingTitle}</th>
            <th className="px-6 py-4">{t.dashboard.dateTime}</th>
            <th className="px-6 py-4">{t.dashboard.status}</th>
            <th className="px-6 py-4">{t.dashboard.participantCount}</th>
            <th className="px-6 py-4 text-right">{t.dashboard.actions}</th>
          </tr>
        </thead>
        <tbody style={{
          borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
        }}>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                Loading meetings...
              </td>
            </tr>
          ) : meetings.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                No meetings found
              </td>
            </tr>
          ) : (
            (showAll ? meetings : meetings.slice(0, 3)).map((meeting) => (
              <tr key={meeting.id} style={{
                borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                transition: 'all 0.2s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#111827' : '#ffffff';
              }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '0.25rem',
                      backgroundColor: '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#dc2626'
                    }}>
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', color: isDarkMode ? '#ffffff' : '#111827', fontSize: '0.875rem' }}>{meeting.name}</p>
                      <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{t.dashboard.host}: {meeting.host.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#d1d5db' : '#374151' }}>
                    {format(new Date(meeting.scheduled_start_time), 'MMM d, yyyy', { locale: language === 'vi' ? vi : undefined })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                    {format(new Date(meeting.scheduled_start_time), 'h:mm a', { locale: language === 'vi' ? vi : undefined })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: meeting.status === 'completed' ? '#dcfce7' : '#fef3c7',
                    color: meeting.status === 'completed' ? '#15803d' : '#b45309'
                  }}>
                    <span style={{ 
                      width: '0.375rem', 
                      height: '0.375rem', 
                      borderRadius: '50%', 
                      backgroundColor: meeting.status === 'completed' ? '#16a34a' : '#eab308'
                    }}></span>
                    {meeting.status === 'completed' ? t.dashboard.done : t.dashboard.processing}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#d1d5db' : '#374151', fontWeight: '500' }}>
                    {meeting.current_participants || 0} {t.dashboard.people}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button style={{
                      padding: '0.375rem',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                      borderRadius: '0.5rem',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} title="Play Recording" onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#10b981';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                    }}>
                      <PlayCircle className="w-4 h-4" />
                    </button>
                    <button style={{
                      padding: '0.375rem',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                      borderRadius: '0.5rem',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} title="Read Summary" onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#10b981';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                    }}>
                      <FileText className="w-4 h-4" />
                    </button>
                    <button style={{
                      padding: '0.375rem',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                      borderRadius: '0.5rem',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} title="Download" onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#10b981';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                    }}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    
    {/* View All / Collapse Button */}
    {meetings.length > 3 && (
      <div style={{
        padding: '1.5rem',
        borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        textAlign: 'center'
      }}>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            width: '100%',
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDarkMode ? '#10b981' : '#10b981';
            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff';
            e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#4b5563';
            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          {showAll ? `${t.dashboard.viewRecentMeetings} ↑` : `${t.dashboard.viewRecentMeetings} →`} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )}
  </Card>
);
};
