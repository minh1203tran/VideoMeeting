import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../utils/cn';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { LogoutContext } from '../context/LogoutContext';
import { useDarkMode } from '../context/DarkModeContext';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  
  console.log('🟩 MainLayout RENDER: isDarkMode =', isDarkMode, '| HTML className =', document.documentElement.className);

  // Apply dark mode class to HTML whenever isDarkMode changes
  useEffect(() => {
    console.log('🟩 MainLayout EFFECT: isDarkMode changed to', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('✅ MainLayout: Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('✅ MainLayout: Removed dark class');
    }
    console.log('🟩 MainLayout EFFECT: HTML className after =', document.documentElement.className);
  }, [isDarkMode]);

  // Responsive Handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Force page reload to ensure clean auth state
    window.location.href = '/?logout=true';
  };

  return (
    <LogoutContext.Provider value={{ showLogoutConfirm, setShowLogoutConfirm }}>
      <div 
        style={{
          backgroundColor: isDarkMode ? '#0f1419' : '#f0f2f5',
          transition: 'background-color 0.3s ease'
        }}
        className="min-h-screen flex font-outfit"
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isMobile={isMobile} 
        />

      <main 
        style={{
          backgroundColor: isDarkMode ? '#0f1419' : '#f0f2f5',
          color: isDarkMode ? '#ffffff' : '#111827',
          transition: 'all 0.3s ease'
        }}
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isSidebarOpen && !isMobile ? 'ml-[17rem]' : 'ml-[7rem]',
          isMobile && 'ml-0'
        )}
      >
        <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {/* 
            Updated max-width logic:
            - Default: max-w-[1600px]
            - 2xl (1536px+ screens): max-w-[95%] to fill the screen
            - 3xl/Ultra-wide: Limit to 2400px so it doesn't get too crazy
           */}
          <div className="max-w-[1600px] 2xl:max-w-[95%] 3xl:max-w-[2400px] mx-auto space-y-6">
             <Header 
               isSidebarOpen={isSidebarOpen} 
               setIsSidebarOpen={setIsSidebarOpen}
             />
             <div className="animate-fade-in-up">
                <Outlet />
             </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Dialog - Full Screen Center */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div style={{ backgroundColor: isDarkMode ? '#1a2332' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border-2">
            {/* Title */}
            <h3 style={{ color: isDarkMode ? '#ffffff' : '#000000', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}>
              {t.common.logoutTitle}
            </h3>
            
            {/* Message */}
            <p style={{ color: isDarkMode ? '#9ca3af' : '#4b5563', textAlign: 'center', lineHeight: '1.625' }}>
              {t.common.logoutMessage}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button 
                style={{ backgroundColor: isDarkMode ? '#10b981' : '#000000', color: '#ffffff' }}
                className="w-full hover:opacity-90 rounded-xl py-3 font-semibold"
                onClick={confirmLogout}
              >
                {t.nav.logout}
              </Button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db', color: isDarkMode ? '#ffffff' : '#000000', backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}
                className="w-full px-6 py-3 rounded-xl font-semibold transition-all border-2 hover:opacity-80"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </LogoutContext.Provider>
  );
};

export default MainLayout;
