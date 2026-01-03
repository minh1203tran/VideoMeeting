import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Users, Video, MoreHorizontal, MapPin } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UPCOMING_MEETINGS } from '../utils/mockData';
import { useLanguage } from '../i18n';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuthContext } from '../context/useAuthContext';
import { useState, useEffect } from 'react';

export default function MyMeetings() {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuthContext();
  const [pastMeetings, setPastMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ totalWeek: 0, hoursSpent: 0, uniquePeople: 0 });
  const itemsPerPage = 20;

  console.log('🔵 MyMeetings RENDER: user =', user);

  useEffect(() => {
    console.log('🔵 MyMeetings useEffect triggered!');
    
    const fetchPastMeetings = async () => {
      try {
        // First, check if there's a newly created room in localStorage
        const newlyCreatedRoomStr = localStorage.getItem('newlyCreatedRoom');
        
        if (newlyCreatedRoomStr) {
          console.log('🟢 Found newly created room in localStorage');
          const newRoom = JSON.parse(newlyCreatedRoomStr);
          
          const formattedMeeting = {
            id: newRoom.id,
            title: newRoom.name,
            date: newRoom.created_at,
            duration: newRoom.duration || 60,
            host: newRoom.host?.name || 'Unknown',
            status: newRoom.status,
            participant_count: newRoom.current_participants || 0
          };
          
          setPastMeetings([formattedMeeting]);
          setStats({ totalWeek: 1, hoursSpent: 1, uniquePeople: 0 });
          setIsLoading(false);
          
          // Clear localStorage after using it
          localStorage.removeItem('newlyCreatedRoom');
          return;
        }
        
        // If no newly created room, fetch user's meetings
        const token = localStorage.getItem('authToken');
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        console.log('🔵 MyMeetings - Fetching user meetings...');
        
        // If user not loaded yet, don't fetch
        if (!user?.id) {
          console.log('🔴 User not loaded yet, skipping fetch');
          setIsLoading(false);
          return;
        }
        
        if (!token || !apiBase) {
          console.log('🔴 Missing token or apiBase');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${apiBase}/v1/rooms?page=1&page_size=1000`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Handle different possible response structures
          let roomsArray: any[] = [];
          
          if (data.data) {
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
          
          // Filter for MY meetings - only rooms where host_id matches current user
          const myMeetingsList = roomsArray
            .filter((room: any) => room.host_id === user?.id)
            .map((room: any) => ({
              id: room.id,
              title: room.name,
              date: room.created_at,
              duration: room.duration || 60,
              host: room.host?.name || 'Unknown',
              status: room.status,
              participant_count: room.participant_count || 0
            }))
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          console.log('🟢 MyMeetings - My meetings count:', myMeetingsList.length);
          
          // Calculate stats
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const meetingsThisWeek = myMeetingsList.filter((meeting: any) => {
            const meetingDate = new Date(meeting.date);
            return meetingDate >= weekAgo && meetingDate <= now;
          });
          
          const totalWeek = meetingsThisWeek.length;
          const hoursSpent = meetingsThisWeek.reduce((sum: number, m: any) => sum + (m.duration || 0), 0) / 60;
          
          const uniquePeople = Math.max(
            ...roomsArray
              .filter((r: any) => r.host_id === user?.id)
              .map((r: any) => r.current_participants || r.participant_count || 0),
            0
          );
          
          setStats({
            totalWeek,
            hoursSpent: parseFloat(hoursSpent.toFixed(1)),
            uniquePeople
          });
          
          setPastMeetings(myMeetingsList);
        } else {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          setPastMeetings([]);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setPastMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastMeetings();
  }, [user?.id]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>{t.myMeetings.title}</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">{t.myMeetings.subtitle}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
           {/* Date Headers simulated by grouping (simplified for demo) */}
           <div 
             className="text-sm font-bold uppercase tracking-wider mb-2"
             style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}
           >
             {t.myMeetings.today}
           </div>
           
           {UPCOMING_MEETINGS.map((meeting) => (
             <Card key={meeting.id} className="group hover:border-primary-500/50 transition-colors" noPadding>
               <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                 <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#eff6ff', color: isDarkMode ? '#10b981' : '#0369a1' }}>
                    <span className="text-xs font-bold uppercase">{format(new Date(meeting.date), 'MMM')}</span>
                    <span className="text-2xl font-bold">{format(new Date(meeting.date), 'd')}</span>
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 
                         className="text-lg font-bold truncate"
                         style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
                       >
                         {meeting.title}
                       </h3>
                       <p 
                         className="text-sm mt-1 flex items-center gap-2"
                         style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                       >
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                         {format(new Date(meeting.date), 'h:mm a')} - {format(new Date(new Date(meeting.date).getTime() + meeting.duration*60000), 'h:mm a')}
                       </p>
                     </div>
                     <button 
                       className="transition-colors"
                       style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}
                     >
                       <MoreHorizontal className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="flex items-center gap-4 mt-3">
                     <div 
                       className="flex items-center text-xs font-medium px-2 py-1 rounded-lg"
                       style={{ color: isDarkMode ? '#ffffff' : '#4b5563', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                     >
                       <Clock className="w-3.5 h-3.5 mr-1" /> {meeting.duration} min
                     </div>
                     <div 
                       className="flex items-center text-xs font-medium px-2 py-1 rounded-lg"
                       style={{ color: isDarkMode ? '#ffffff' : '#4b5563', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                     >
                        <MapPin className="w-3.5 h-3.5 mr-1" /> Google Meet
                     </div>
                     <div className="flex -space-x-2">
                        {meeting.participants.map((p, i) => (
                          <img key={i} src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" title={p.name} />
                        ))}
                     </div>
                   </div>
                 </div>

                 <Button size="sm" className="hidden sm:flex shrink-0">{t.common.join}</Button>
               </div>
             </Card>
           ))}

           <div 
             className="text-sm font-bold uppercase tracking-wider mb-2 mt-8"
             style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}
           >
             {t.myMeetings.pastMeetings}
           </div>
           {isLoading ? (
             <div className="text-center py-8">
               <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Loading past meetings...</p>
             </div>
           ) : pastMeetings.length === 0 ? (
             <div className="text-center py-8">
               <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{t.myMeetings.noMeetings}</p>
             </div>
           ) : (
             <>
               {pastMeetings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((meeting) => (
                 <Card key={meeting.id} className="opacity-80 hover:opacity-100 transition-opacity" noPadding>
                    <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                     <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0" style={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                        <span className="text-[10px] font-bold uppercase">{format(new Date(meeting.date), 'MMM', { locale: language === 'vi' ? vi : undefined })}</span>
                        <span className="text-xl font-bold">{format(new Date(meeting.date), 'd')}</span>
                     </div>
                     <div className="flex-1">
                        <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>{meeting.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                          <span>{format(new Date(meeting.date), 'h:mm a', { locale: language === 'vi' ? vi : undefined })}</span>
                          <span>•</span>
                          <span>{meeting.duration} min</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                       <Button size="sm" variant="outline" icon={Video}>{t.common.watch}</Button>
                     </div>
                   </div>
                 </Card>
               ))}
               
               {/* Pagination Controls */}
               {Math.ceil(pastMeetings.length / itemsPerPage) > 1 && (
                 <div className="flex justify-center items-center gap-2 mt-8">
                   <button
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                     style={{
                       padding: '0.5rem 1rem',
                       borderRadius: '0.5rem',
                       border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                       backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6',
                       color: isDarkMode ? '#d1d5db' : '#6b7280',
                       cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                       opacity: currentPage === 1 ? 0.5 : 1,
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       if (currentPage > 1) {
                         e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff';
                         e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#d1d5db';
                       }
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6';
                       e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
                     }}
                   >
                     ← Trước
                   </button>
                   
                   {(() => {
                     const totalPages = Math.ceil(pastMeetings.length / itemsPerPage);
                     const pagesToShow = new Set<number>();
                     
                     // Always show first 3 pages
                     [1, 2, 3].forEach(p => {
                       if (p <= totalPages) pagesToShow.add(p);
                     });
                     
                     // Always show last 3 pages
                     [totalPages - 2, totalPages - 1, totalPages].forEach(p => {
                       if (p >= 1) pagesToShow.add(p);
                     });
                     
                     // Show current page and neighbors
                     [currentPage - 1, currentPage, currentPage + 1].forEach(p => {
                       if (p >= 1 && p <= totalPages) pagesToShow.add(p);
                     });
                     
                     const pages = Array.from(pagesToShow).sort((a, b) => a - b);
                     
                     return pages.map((page, idx) => (
                       <div key={page}>
                         {idx > 0 && pages[idx - 1] !== page - 1 && (
                           <span style={{ padding: '0.5rem 0.25rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>...</span>
                         )}
                         <button
                           onClick={() => setCurrentPage(page)}
                           style={{
                             padding: '0.5rem 0.75rem',
                             borderRadius: '0.5rem',
                             border: `1px solid ${currentPage === page ? '#10b981' : isDarkMode ? '#374151' : '#e5e7eb'}`,
                             backgroundColor: currentPage === page ? '#10b981' : isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6',
                             color: currentPage === page ? '#ffffff' : isDarkMode ? '#d1d5db' : '#6b7280',
                             cursor: 'pointer',
                             fontWeight: currentPage === page ? 'bold' : 'normal',
                             transition: 'all 0.2s ease'
                           }}
                           onMouseEnter={(e) => {
                             if (currentPage !== page) {
                               e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff';
                             }
                           }}
                           onMouseLeave={(e) => {
                             if (currentPage !== page) {
                               e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6';
                             }
                           }}
                         >
                           {page}
                         </button>
                       </div>
                     ));
                   })()}
                   
                   <button
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(pastMeetings.length / itemsPerPage)))}
                     disabled={currentPage === Math.ceil(pastMeetings.length / itemsPerPage)}
                     style={{
                       padding: '0.5rem 1rem',
                       borderRadius: '0.5rem',
                       border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                       backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6',
                       color: isDarkMode ? '#d1d5db' : '#6b7280',
                       cursor: currentPage === Math.ceil(pastMeetings.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                       opacity: currentPage === Math.ceil(pastMeetings.length / itemsPerPage) ? 0.5 : 1,
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       if (currentPage < Math.ceil(pastMeetings.length / itemsPerPage)) {
                         e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff';
                         e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#d1d5db';
                       }
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f3f4f6';
                       e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
                     }}
                   >
                     Tiếp →
                   </button>
                 </div>
               )}
             </>
           )}
        </div>

        {/* Sidebar Mini Calendar & Stats */}
        <div className="space-y-6">
          <Card>
            <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '1rem' }}>{t.myMeetings.stats}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#eff6ff' }}>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300"><CalendarIcon className="w-4 h-4" /></div>
                   <span className="text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>{t.myMeetings.totalWeek}</span>
                 </div>
                 <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalWeek}</span>
              </div>
               <div className="flex justify-between items-center p-3 rounded-xl" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#faf5ff' }}>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg text-purple-600 dark:text-purple-300"><Clock className="w-4 h-4" /></div>
                   <span className="text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>{t.myMeetings.hoursSpent}</span>
                 </div>
                 <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.hoursSpent}h</span>
              </div>
               <div className="flex justify-between items-center p-3 rounded-xl" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff7ed' }}>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg text-orange-600 dark:text-orange-300"><Users className="w-4 h-4" /></div>
                   <span className="text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>{t.myMeetings.uniquePeople}</span>
                 </div>
                 <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{stats.uniquePeople}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
             <h3 className="font-bold mb-2">{t.common.proTip}</h3>
             <p className="text-sm text-gray-300 mb-4">{t.myMeetings.calendarTip}</p>
             <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-200 border-none">{t.common.connectCalendar}</Button>
          </Card>
        </div>
      </div>
    </>
  );
}
