import { Download, Calendar, ArrowUp, FileText, Video, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SpeakingTimeChart, TrendChart, ScoreChart } from '../components/features/dashboard/Charts';
import { RECENT_MEETINGS } from '../utils/mockData';
import { useLanguage } from '../i18n';
import { useDarkMode } from '../context/DarkModeContext';

export default function Reports() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>{t.reports.title}</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">{t.reports.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button style={{ backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#000000' }} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium hover:opacity-80">
             <Calendar className="w-4 h-4" /> {t.reports.last30Days}
          </button>
          <Button variant="outline" icon={Download}>{t.reports.exportPDF}</Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Recent Meetings List for Reports */}
        <Card noPadding>
          <div className="p-6" style={{ borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px' }}>
            <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold' }}>{t.reports.recentReports}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ backgroundColor: isDarkMode ? '#1a2332' : '#f9fafb' }}>
                <tr>
                  <th className="px-6 py-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{t.reports.date}</th>
                  <th className="px-6 py-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{t.reports.meetingTitle}</th>
                  <th className="px-6 py-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{t.reports.participants}</th>
                  <th className="px-6 py-4 text-right" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{t.reports.actions}</th>
                </tr>
              </thead>
              <tbody style={{ borderTopColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderTopWidth: '1px' }}>
                {RECENT_MEETINGS.map((meeting) => (
                  <tr key={meeting.id} style={{ borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px', backgroundColor: isDarkMode ? 'transparent' : 'transparent' }} className="hover:opacity-80 transition-colors">
                    <td className="px-6 py-4">
                      <div style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: '500' }}>{format(new Date(meeting.date), 'MMM d, yyyy')}</div>
                      <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem' }}>{format(new Date(meeting.date), 'h:mm a')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>{meeting.title}</div>
                      <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }} className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {meeting.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {meeting.participants.map((p, i) => (
                          <img key={i} src={p.avatar} alt={p.name} style={{ borderColor: isDarkMode ? '#1a2332' : '#ffffff' }} className="w-8 h-8 rounded-full border-2" title={p.name} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <Button 
                           size="sm" 
                           variant="outline" 
                           onClick={() => navigate('/recordings')}
                           className="flex items-center gap-2"
                         >
                            <Video className="w-4 h-4" /> {t.reports.viewRecording}
                         </Button>
                         <Button size="sm" variant="ghost" className="text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20">
                            <FileText className="w-4 h-4" /> {t.reports.pdf}
                         </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>


        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="clay-panel border-l-4 border-l-primary-500">
              <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>{t.reports.totalHours}</p>
              <div className="flex items-end gap-3 mt-1">
                 <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.875rem', fontWeight: 'bold' }}>42.5h</h2>
                 <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded mb-1"><ArrowUp className="w-3 h-3" /> 12%</span>
              </div>
           </Card>
           <Card className="clay-panel border-l-4 border-l-secondary-500">
              <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>{t.reports.avgCost}</p>
               <div className="flex items-end gap-3 mt-1">
                 <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.875rem', fontWeight: 'bold' }}>$1,250</h2>
                 <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded mb-1"><ArrowUp className="w-3 h-3" /> 5%</span>
              </div>
           </Card>
           <Card className="clay-panel border-l-4 border-l-blue-500">
              <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>{t.reports.tasksCompleted}</p>
               <div className="flex items-end gap-3 mt-1">
                 <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.875rem', fontWeight: 'bold' }}>85%</h2>
                 <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded mb-1"><ArrowUp className="w-3 h-3" /> 8%</span>
              </div>
           </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
           <Card>
              <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '1.5rem' }}>{t.reports.frequencyTrend}</h3>
              <TrendChart />
           </Card>
           <Card>
              <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '1.5rem' }}>{t.reports.speakingDistribution}</h3>
              <SpeakingTimeChart />
           </Card>
        </div>

         <div className="grid lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2">
              <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '1.5rem' }}>{t.reports.participationScore}</h3>
              <ScoreChart />
           </Card>
           <div style={{ backgroundColor: isDarkMode ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#ffffff', borderRadius: '2rem', borderWidth: '1px', borderStyle: 'solid', borderColor: isDarkMode ? 'none' : '#e5e7eb', padding: '1.5rem', boxShadow: isDarkMode ? '8px 8px 24px rgba(0, 0, 0, 0.4)' : '8px 8px 24px rgba(0, 0, 0, 0.04)' }}>
              <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.reports.insightTitle}</h3>
              <p style={{ color: isDarkMode ? '#c7d2fe' : '#000000', marginBottom: '1.5rem' }}>{t.reports.insightText}</p>
              
              <div style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(79, 70, 229, 0.1)', backdropFilter: 'blur(4px)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                 <p style={{ color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#4b5563', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.reports.topKeyword}</p>
                 <p style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>"Roadmap"</p>
              </div>
              
              <Button className="w-full border-none hover:opacity-90" style={{ backgroundColor: isDarkMode ? '#ffffff' : '#4f46e5', color: isDarkMode ? '#4f46e5' : '#ffffff' }}>{t.reports.viewInsights}</Button>
           </div>
        </div>
      </div>
    </>
  );
}
