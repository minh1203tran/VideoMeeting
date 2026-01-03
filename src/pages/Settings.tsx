import { User, Bell, Lock, Globe, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useLanguage } from '../i18n';
import { useAuthContext } from '../context/useAuthContext';
import { useDarkMode } from '../context/DarkModeContext';

type SettingTab = 'profile' | 'integrations' | 'notifications' | 'privacy';

export default function Settings() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t.common.loading}...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: t.settings.profile, icon: User },
    { id: 'integrations' as const, label: t.settings.integrations, icon: Globe },
    { id: 'notifications' as const, label: t.settings.notifications, icon: Bell },
    { id: 'privacy' as const, label: t.settings.privacy, icon: Lock },
  ];

  return (
    <>
       <div className="mb-8">
           <h1 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>{t.settings.title}</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">{t.settings.subtitle}</p>
        </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 backgroundColor: activeTab === tab.id ? (isDarkMode ? '#1e293b' : '#f0f9ff') : 'transparent',
                 color: activeTab === tab.id ? (isDarkMode ? '#10b981' : '#0369a1') : (isDarkMode ? '#9ca3af' : '#4b5563')
               }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all`}
             >
                <tab.icon className="w-5 h-5" />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
           {/* Profile Tab */}
           {activeTab === 'profile' && (
             <>
           <Card>
              <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px' }}>{t.settings.profileInfo}</h2>
              
              <div className="flex items-center gap-6 mb-8">
                 <img src={user?.avatar || 'https://picsum.photos/seed/user/100/100'} alt="Avatar" style={{ borderColor: isDarkMode ? '#4b5563' : '#f3f4f6' }} className="w-24 h-24 rounded-full border-4" />
                 <div>
                    <div className="flex gap-3">
                       <Button size="sm" variant="outline">{t.settings.changeAvatar}</Button>
                       <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">{t.common.remove}</Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{t.settings.avatarHint}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="block text-sm font-bold mb-2">{t.settings.fullName}</label>
                    <input type="text" defaultValue={user?.name || ''} style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#000000' }} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500" />
                 </div>
                 <div>
                    <label style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="block text-sm font-bold mb-2">{t.settings.emailAddress}</label>
                    <input type="email" disabled defaultValue={user?.email || ''} style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#000000', opacity: 0.6, cursor: 'not-allowed' }} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500" />
                 </div>
                  <div className="md:col-span-2">
                    <label style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="block text-sm font-bold mb-2">{t.settings.bio}</label>
                    <textarea rows={3} style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#000000' }} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder={t.settings.bioPlaceholder}></textarea>
                 </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                 <Button>{t.common.saveChanges}</Button>
              </div>
           </Card>
             </>
           )}

           {/* Integrations Tab */}
           {activeTab === 'integrations' && (
             <Card>
             <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px' }}>{t.settings.integrations}</h2>
             
             {/* ClickUp Integration Card */}
             <div className="p-5 border rounded-2xl flex items-center justify-between" style={{ borderColor: isDarkMode ? '#4b5563' : '#e9d5ff', backgroundColor: isDarkMode ? '#1a2332' : '#faf5ff' }}>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                     {/* ClickUp Logo Placeholder */}
                     <div className="w-6 h-6 bg-purple-600 rounded-full relative overflow-hidden">
                        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 bg-white/30 rounded-bl-full"></div>
                     </div>
                   </div>
                   <div>
                      <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold' }}>ClickUp</h3>
                      <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>{t.settings.clickupDesc}</p>
                   </div>
                </div>
                <Button className="bg-[#7b68ee] hover:bg-[#6a5acd] border-none text-white shadow-lg shadow-purple-500/20">
                   {t.settings.connectClickUp}
                </Button>
             </div>
           </Card>
           )}

           {/* Notifications Tab */}
           {activeTab === 'notifications' && (
             <Card>
              <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px' }}>{t.settings.notifications}</h2>
              <div className="space-y-6">
                 <div className="flex justify-between items-center p-4 border rounded-xl" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
                    <div>
                       <p style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>{t.settings.emailSummaries}</p>
                       <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>{t.settings.emailSummariesDesc}</p>
                    </div>
                    <ToggleRight className="w-10 h-10 text-primary-500 cursor-pointer" />
                 </div>
                 <div className="flex justify-between items-center p-4 border rounded-xl" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
                    <div>
                       <p style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>{t.settings.autoJoin}</p>
                       <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>{t.settings.autoJoinDesc}</p>
                    </div>
                    <ToggleRight className="w-10 h-10 text-primary-500 cursor-pointer" />
                 </div>
              </div>
            </Card>
           )}

           {/* Privacy & Security Tab */}
           {activeTab === 'privacy' && (
             <Card>
              <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottomColor: isDarkMode ? '#4b5563' : '#f3f4f6', borderBottomWidth: '1px' }}>{t.settings.privacy}</h2>
              <div className="space-y-6">
                 <div className="p-4 border rounded-xl" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                    <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.settings.password}</h3>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{t.settings.passwordDesc}</p>
                    <Button variant="outline" size="sm">{t.common.edit}</Button>
                 </div>
                 <div className="p-4 border rounded-xl" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                    <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.settings.twoFactor}</h3>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{t.settings.twoFactorDesc}</p>
                    <Button variant="outline" size="sm">{t.common.edit}</Button>
                 </div>
                 <div className="p-4 border rounded-xl" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                    <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.settings.activeSessions}</h3>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{t.settings.activeSessionsDesc}</p>
                    <Button variant="outline" size="sm">{t.common.view}</Button>
                 </div>
              </div>
            </Card>
           )}
        </div>
      </div>
    </>
  );
}
