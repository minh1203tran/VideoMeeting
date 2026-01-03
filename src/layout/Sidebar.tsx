import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Video, 
  FileText, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useLanguage } from '../i18n';
import { useLogout } from '../context/LogoutContext';
import { useDarkMode } from '../context/DarkModeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="4" y="8" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M9 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M15 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 4c0 0 3-2 5-1 2 1 2 4 0 5-2 1-5-4-5-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { setShowLogoutConfirm } = useLogout();
  const { isDarkMode } = useDarkMode();

  const navItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, path: '/dashboard' },
    { icon: Calendar, label: t.nav.myMeetings, path: '/meetings' },
    { icon: Video, label: t.nav.recordings, path: '/recordings' },
    { icon: FileText, label: t.nav.reports, path: '/reports' },
    { icon: Settings, label: t.nav.settings, path: '/settings' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        style={{
          backgroundColor: isDarkMode ? '#131820' : '#ffffff',
          borderColor: isDarkMode ? '#1f2937' : '#f3f4f6',
          transition: 'all 0.3s ease'
        }}
        className={cn(
          "fixed top-4 left-4 z-30 h-[calc(100vh-2rem)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
          "rounded-[2rem] shadow-[4px_0_24px_rgba(0,0,0,0.02)] border",
          isOpen ? 'w-64 translate-x-0' : isMobile ? '-translate-x-[120%] w-64' : 'w-24'
        )}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo Section */}
          <div className={cn(
            "flex items-center px-6 mb-8 transition-all",
            !isOpen && !isMobile ? "justify-center px-0" : ""
          )}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
              <LogoIcon className="w-7 h-7 text-white" />
            </div>
            <div className={cn(
              "ml-3 transition-opacity duration-300",
              !isOpen && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            )}>
              <h1 className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white leading-none">
                Meeting <span className="text-primary-600">Assistant</span>
              </h1>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Powered</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "w-full flex items-center p-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200',
                    !isOpen && !isMobile ? "justify-center" : ""
                  )}
                  title={!isOpen ? item.label : ''}
                >
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 transition-transform duration-300",
                    isActive ? 'text-white scale-110' : 'group-hover:scale-110'
                  )} />
                  
                  <span className={cn(
                    "ml-3 font-medium whitespace-nowrap transition-all duration-200",
                    !isOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100'
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="px-4 mt-4">
            <button 
              onClick={handleLogoutClick}
              className={cn(
                "flex items-center w-full p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors",
                !isOpen && !isMobile ? 'justify-center' : ''
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn(
                "ml-3 font-medium whitespace-nowrap",
                !isOpen && !isMobile ? 'hidden' : 'block'
              )}>{t.nav.logout}</span>
            </button>
          </div>

          {/* Logout Confirmation Dialog */}
          {/* Dialog moved to MainLayout for proper full-screen centering */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
