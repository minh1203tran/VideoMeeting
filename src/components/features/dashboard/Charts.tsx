import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { useLanguage } from '../../../i18n';
import { useDarkMode } from '../../../context/DarkModeContext';

// --- Improved Trend Chart (Area with Gradient) ---
export const TrendChart: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const data = [
    { day: '1', meetings: 2 },
    { day: '5', meetings: 4 },
    { day: '10', meetings: 3 },
    { day: '15', meetings: 7 },
    { day: '20', meetings: 5 },
    { day: '25', meetings: 8 },
    { day: '30', meetings: 6 },
  ];

  return (
    <div className="h-72 w-full mt-2 rounded-2xl p-6" style={{ backgroundColor: isDarkMode ? '#1a2332' : '#f9fafb' }}>
      <div className="flex justify-between items-center mb-6">
         <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#000000' }}>{t.dashboard.meetingActivity}</h3>
         <select style={{ backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', borderColor: isDarkMode ? '#4b5563' : '#d1d5db', color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="border-none text-xs rounded-lg px-3 py-2 hover:opacity-80">
            <option>{t.dashboard.last30Days}</option>
         </select>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
          />
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#d1d5db'} vertical={false} />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: isDarkMode ? '#1a2332' : '#ffffff', 
               border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`, 
               borderRadius: '12px', 
               boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
             }}
             itemStyle={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 600 }}
             cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
          />
          <Area 
            type="monotone" 
            dataKey="meetings" 
            stroke="#10b981" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorMeetings)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Improved Speaking Time (Radial Bar) ---
export const SpeakingTimeChart: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const data = [
    { name: 'You', uv: 35, fill: '#10b981' },
    { name: 'Sarah', uv: 25, fill: '#3b82f6' },
    { name: 'Mike', uv: 20, fill: '#f59e0b' },
    { name: 'Others', uv: 20, fill: '#8b5cf6' },
  ];

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

  return (
    <div className="h-64 w-full relative">
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', marginBottom: '0.5rem' }}>{t.dashboard.speakingTime}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="40%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={data}>
          <RadialBar
            background
            dataKey="uv"
            cornerRadius={10} // Rounded ends
          />
          <Legend 
            iconSize={10} 
            layout="vertical" 
            verticalAlign="middle" 
            wrapperStyle={style} 
            formatter={(value) => (
                <span style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-sm font-medium ml-2">{value}</span>
            )}
          />
           <Tooltip 
             contentStyle={{ backgroundColor: isDarkMode ? '#1a2332' : '#ffffff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, color: isDarkMode ? '#fff' : '#111827' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Improved Score Chart (Rounded Bars) ---
export const ScoreChart: React.FC = () => {
    const { t } = useLanguage();
    const { isDarkMode } = useDarkMode();
    const data = [
      { week: 'Mon', score: 65 },
      { week: 'Tue', score: 85 },
      { week: 'Wed', score: 78 },
      { week: 'Thu', score: 55 },
      { week: 'Fri', score: 92 },
    ];
  
    return (
      <div className="h-56 w-full mt-6">
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', marginBottom: '1rem' }}>{t.dashboard.participationScore}</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} opacity={0.5} />
            <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
                dy={10}
            />
            <Tooltip 
               cursor={{fill: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)', radius: 8}}
               contentStyle={{ backgroundColor: isDarkMode ? '#1a2332' : '#ffffff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, color: isDarkMode ? '#fff' : '#111827' }}
            />
            <Bar 
                dataKey="score" 
                fill="#8b5cf6" 
                radius={[6, 6, 6, 6]} // Fully rounded bars
                background={{ fill: isDarkMode ? '#1f2937' : '#f3f4f6', radius: 6 }} // Grey background for bars
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
