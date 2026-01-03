import { format } from 'date-fns';
import { Search, Filter, MoreVertical, Share2, Download } from 'lucide-react';
import { RECENT_MEETINGS } from '../utils/mockData';
import { useLanguage } from '../i18n';
import { useDarkMode } from '../context/DarkModeContext';

export default function Recordings() {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>{t.recordings.title}</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">{t.recordings.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }} />
            <input 
              type="text" 
              placeholder={t.recordings.searchPlaceholder} 
              style={{ backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#000000' }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button style={{ backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#9ca3af' : '#9ca3af' }} className="p-2 border rounded-xl hover:opacity-80">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {RECENT_MEETINGS.map((meeting) => (
          <div key={meeting.id} className="group relative rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: isDarkMode ? '#1a2332' : '#ffffff', borderColor: isDarkMode ? '#374151' : '#f3f4f6' }}>
            {/* Video Thumbnail Placeholder */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 w-full overflow-hidden">
               <img 
                 src={`https://picsum.photos/seed/${meeting.id}/600/400`} 
                 alt="Thumbnail" 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 transform scale-90 group-hover:scale-100 transition-all hover:bg-primary-500 hover:border-primary-500">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                 </button>
               </div>
               <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-bold text-white">
                 {meeting.duration}:00
               </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', fontSize: '1.125rem' }} className="line-clamp-1">{meeting.title}</h3>
                <button style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }} className="hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              
              <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                <span>{format(new Date(meeting.date), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>{meeting.host.name}</span>
              </div>

              {/* Tags / Keywords */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Product', 'Q3', 'Strategy'].map(tag => (
                   <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium" style={{ color: isDarkMode ? '#ffffff' : '#4b5563', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}>#{tag}</span>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center" style={{ borderTopColor: isDarkMode ? '#374151' : '#f3f4f6', borderTopWidth: '1px' }}>
                 <div className="flex items-center gap-1">
                   {meeting.recordingStatus === 'Ready' ? (
                     <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Processed
                     </span>
                   ) : (
                     <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Analyzing
                     </span>
                   )}
                 </div>

                 <div className="flex gap-1">
                   <button className="p-2 rounded-lg" style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }} title="Share"><Share2 className="w-4 h-4" /></button>
                   <button className="p-2 rounded-lg" style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }} title="Download"><Download className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <button className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-[2rem] transition-all group" style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db', backgroundColor: isDarkMode ? '#1a2332' : '#ffffff' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#faf3ff'; e.currentTarget.style.borderColor = '#10b981'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDarkMode ? '#1a2332' : '#ffffff'; e.currentTarget.style.borderColor = isDarkMode ? '#4b5563' : '#d1d5db'; }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', color: isDarkMode ? '#9ca3af' : '#9ca3af' }}>
               <span className="text-3xl font-light" style={{ color: isDarkMode ? '#10b981' : '#10b981' }}>+</span>
            </div>
            <p className="mt-4 font-bold" style={{ color: isDarkMode ? '#ffffff' : '#4b5563' }}>{t.recordings.upload}</p>
            <p className="text-sm" style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}>{t.recordings.fileTypes}</p>
        </button>
      </div>
    </>
  );
}
