import { Outlet, Link } from 'react-router-dom';
import { Video, Sparkles, Sun, Moon } from 'lucide-react';
import { LanguageSelector } from '../components/common';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';

export const AuthLayout = () => {
  const { t } = useLanguage();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Detect browser's dark mode preference
  const [isBrowserDarkMode, setIsBrowserDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for browser dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsBrowserDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate if we should use light background for better visibility
  // Use light background when: browser is light BUT website is dark
  const shouldUseLightBg = !isBrowserDarkMode && isDarkMode;
  const shouldUseDarkText = !isBrowserDarkMode && isDarkMode;

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  useEffect(() => {
    console.log('AuthLayout - isDarkMode:', isDarkMode);
    console.log('AuthLayout - isBrowserDarkMode:', isBrowserDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isBrowserDarkMode]);

  return (
    <div 
      className="min-h-screen w-full flex font-outfit transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#0f1115' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827'
      }}
    >
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isDarkMode ? '#374151' : '#d1d5db'
          }}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {/* Language Selector */}
        <LanguageSelector shouldUseDarkText={shouldUseDarkText} isDarkMode={isDarkMode} />
      </div>

      {/* Left Side - Hero/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-gray-900/90"></div>
        
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-8">
            <Video className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold leading-tight">
            Capture every <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">meaningful moment</span>
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Join thousands of teams who use MeetingAI to transcribe, summarize, and extract insights from their conversations automatically.
          </p>

          <div className="flex gap-4 pt-4">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-gray-900" />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Sparkles key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div 
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative transition-colors duration-300"
        style={{
          backgroundColor: isDarkMode ? '#0f1115' : '#ffffff'
        }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white">
              <Video className="w-5 h-5" />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ color: shouldUseLightBg ? '#111827' : (isDarkMode ? '#ffffff' : '#111827') }}
            >
              MeetingAI
            </span>
          </div>

          <Outlet />

          <div className="text-center text-sm">
            <p style={{ color: shouldUseLightBg ? '#6b7280' : (isDarkMode ? '#9ca3af' : '#6b7280') }}>
              {t.login.terms}{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">{t.login.termsOfService}</Link>
              {' '}{t.login.and}{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">{t.login.privacyPolicy}</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
