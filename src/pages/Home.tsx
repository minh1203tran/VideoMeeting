import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Video, Mic, Zap, Globe, ArrowRight, Sparkles, Check, BarChart3, AlertCircle, Clock, Sun, Moon, Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '../components/common/Button';
import { FadeIn } from '../components/common/FadeIn';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useLanguage } from '../i18n';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../hooks/useAuth';

const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Antenna Stem */}
    <path d="M12 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Head */}
    <rect x="4" y="8" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
    {/* Eyes */}
    <path d="M9 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M15 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Leaf Antenna */}
    <path d="M12 4c0 0 3-2 5-1 2 1 2 4 0 5-2 1-5-4-5-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=64&h=64"
];

// 5 Slides for the Carousel
const HERO_SLIDES = [
    {
       title: "ASSISTANT_VIEW_V2.0",
       userImage: MOCK_AVATARS[0],
       message: "Okay, so for the Q3 roadmap, the AI assistant needs to prioritize the mobile dashboard.",
       insightTitle: "INSIGHT DETECTED",
       insightDesc: "Action Item: Assign 'Q3 Roadmap Draft' to Alex by Friday.",
       score: "98%",
       color: "from-primary-500 to-secondary-500"
    },
    {
       title: "LIVE_TRANSCRIPT_MODE",
       userImage: MOCK_AVATARS[1],
       message: "I'll schedule the follow-up with the design team for next Tuesday at 2 PM.",
       insightTitle: "CALENDAR EVENT",
       insightDesc: "Detected: Design Sync on Tuesday, 2:00 PM.",
       score: "100%",
       color: "from-blue-500 to-indigo-500"
    },
    {
       title: "SENTIMENT_ANALYSIS",
       userImage: MOCK_AVATARS[2],
       message: "We are really excited about the new features, but worried about the timeline.",
       insightTitle: "SENTIMENT: MIXED",
       insightDesc: "Flagged: Client concern regarding delivery timeline.",
       score: "85%",
       color: "from-amber-400 to-orange-500"
    },
    {
       title: "SUMMARY_GENERATOR",
       userImage: MOCK_AVATARS[3],
       message: "To wrap up, let's all agree to review the PRD by end of day tomorrow.",
       insightTitle: "KEY DECISION",
       insightDesc: "Decision: PRD Review deadline set for EOD Tomorrow.",
       score: "92%",
       color: "from-emerald-400 to-teal-500"
    },
    {
       title: "GLOBAL_TRANSLATION",
       userImage: MOCK_AVATARS[4],
       message: "Bonjour tout le monde. La réunion d'aujourd'hui porte sur l'expansion.",
       insightTitle: "TRANSLATED (FR → EN)",
       insightDesc: "Hello everyone. Today's meeting covers expansion.",
       score: "99%",
       color: "from-pink-500 to-rose-500"
    }
];

// Helper Component for the "Mock Cards"
// Updated with responsive classes (2xl:) to scale up significantly on large screens
const MockCard = ({ 
  title, 
  userImage, 
  message, 
  insightTitle, 
  insightDesc, 
  score,
  color,
  isDarkMode,
  shouldUseDarkText
}: { 
  title: string, 
  userImage: string, 
  message: string, 
  insightTitle: string, 
  insightDesc: string,
  score: string,
  color: string,
  isDarkMode: boolean,
  shouldUseDarkText: boolean
}) => (
  <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] 2xl:rounded-[3.5rem] shadow-[20px_20px_60px_rgba(0,0,0,0.1),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-none border-4 border-white dark:border-gray-500 p-8 2xl:p-12 flex flex-col justify-between relative overflow-hidden transform transition-all">
    {/* Header */}
    <div className="flex justify-between items-center mb-6 2xl:mb-10 relative z-10">
        <div className="flex gap-2 2xl:gap-3">
          <div className="w-3 h-3 2xl:w-4 2xl:h-4 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 2xl:w-4 2xl:h-4 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 2xl:w-4 2xl:h-4 rounded-full bg-green-400"></div>
        </div>
        <div className="px-3 py-1 2xl:px-4 2xl:py-2 rounded-full bg-gray-100 dark:bg-gray-600 text-[10px] 2xl:text-xs font-mono font-bold tracking-wider" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#9ca3af' }}>{title}</div>
    </div>

    {/* Chat Area */}
    <div className="flex items-start gap-4 2xl:gap-6 mb-5 2xl:mb-8 relative z-10">
        <div className="w-12 h-12 2xl:w-20 2xl:h-20 rounded-2xl 2xl:rounded-3xl bg-indigo-100 dark:bg-indigo-900/30 shrink-0 overflow-hidden flex items-center justify-center">
          <img src={userImage} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-100 p-4 2xl:p-8 rounded-2xl 2xl:rounded-[2rem] rounded-tl-none flex-1">
             <div className="flex gap-1 2xl:gap-1.5 mb-2 2xl:mb-4 h-3 2xl:h-4 items-center">
              <span className={`w-1 2xl:w-1.5 h-3 2xl:h-4 rounded-full animate-pulse bg-gray-400`}></span>
              <span className={`w-1 2xl:w-1.5 h-5 2xl:h-8 rounded-full animate-pulse bg-gray-400 [animation-delay:0.1s]`}></span>
              <span className={`w-1 2xl:w-1.5 h-2 2xl:h-3 rounded-full animate-pulse bg-gray-400 [animation-delay:0.2s]`}></span>
            </div>
            <p className="text-sm 2xl:text-xl font-medium leading-snug" style={{ color: (isDarkMode || shouldUseDarkText) ? '#1f2937' : '#4b5563' }}>"{message}"</p>
        </div>
    </div>

    {/* Insight Box */}
    <div className={`relative overflow-hidden rounded-2xl 2xl:rounded-3xl p-[2px] bg-gradient-to-r ${color} z-10 transition-colors duration-500`}>
      <div className="bg-white dark:bg-gray-500 p-4 2xl:p-6 rounded-[14px] 2xl:rounded-[22px]">
        <div className="flex justify-between items-start mb-1 2xl:mb-2">
          <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest flex items-center gap-1 2xl:gap-2" style={{ color: (isDarkMode || shouldUseDarkText) ? '#1f2937' : '#6b7280' }}>
             <Sparkles className="w-3 h-3 2xl:w-4 2xl:h-4" /> {insightTitle}
          </span>
          <span className="text-sm 2xl:text-xl font-extrabold" style={{ color: '#111827' }}>{score}</span>
        </div>
        <p className="text-xs 2xl:text-lg font-medium mb-0 truncate" style={{ color: '#111827' }}>{insightDesc}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated: initialAuth, isLoading: initialAuthLoading } = useAuth();
  
  const onLogin = () => navigate('/login');
  const onEnterApp = () => navigate('/dashboard');
  
  const [activeSlide, setActiveSlide] = useState(0);
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  
  console.log('🟨 Home RENDER: isDarkMode =', isDarkMode);
  const isLogoutParam = searchParams.get('logout') === 'true';
  
  // Compute authenticated state based on logout param
  const isAuthenticated = isLogoutParam ? false : initialAuth;
  const authLoading = isLogoutParam ? false : initialAuthLoading;
  
  // Detect browser's dark mode preference
  const [isBrowserDarkMode, setIsBrowserDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  console.log('🟨 Home RENDER: isBrowserDarkMode =', isBrowserDarkMode);
  
  // Use global language context
  const { t } = useLanguage();

  // Listen for browser dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsBrowserDarkMode(e.matches);
      console.log('Browser dark mode changed:', e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen for localStorage changes from other pages (MainLayout/Logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode' && e.newValue !== null) {
        const newDarkMode = e.newValue === 'true';
        console.log('Home: Dark mode changed from localStorage:', newDarkMode);
        setIsDarkMode(newDarkMode);
      }
      // Detect logout: when authToken is removed
      if (e.key === 'authToken' && e.newValue === null) {
        console.log('Home: User logged out, showing login buttons');
        // Redirect to home with logout param
        navigate('/?logout=true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setIsDarkMode, navigate]);

  // Calculate if we should use dark text for better contrast
  // Use dark text when: browser is dark BUT website is light
  const shouldUseDarkText = isBrowserDarkMode && !isDarkMode;

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    console.log('🟨 Home TOGGLE: isDarkMode =', isDarkMode, '| newMode =', newMode);
    console.log('🟨 Home TOGGLE: HTML className BEFORE =', document.documentElement.className);
    setIsDarkMode(newMode);
    console.log('🟨 Home TOGGLE: setIsDarkMode called with', newMode);
  };

  // Apply dark mode class to document on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Carousel Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="min-h-screen font-sans overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#4a5568' : '#f8fafc',
        color: isDarkMode ? '#ffffff' : '#111827'
      }}
      data-dark-mode={isDarkMode}
    >
      
      {/* Navbar - Fixed and Responsive */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
        <div 
          className="w-full max-w-7xl 2xl:max-w-[95%] 3xl:max-w-[2400px] h-20 backdrop-blur-xl rounded-[2rem] shadow-lg flex justify-between items-center px-4 sm:px-6 2xl:px-10 transition-all duration-300 pointer-events-auto"
          style={{
            backgroundColor: isDarkMode ? 'rgba(74, 85, 104, 0.95)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDarkMode ? 'rgba(113, 128, 150, 1)' : 'rgba(229, 231, 235, 0.8)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform hover:scale-105">
              <LogoIcon className="w-6 h-6 2xl:w-7 2xl:h-7 text-white" />
            </div>
            <span className="text-xl 2xl:text-2xl font-extrabold tracking-tight hidden sm:inline">Meeting <span className="text-primary-600">Assistant</span></span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div 
            className="hidden md:flex items-center gap-8 2xl:gap-12 text-sm 2xl:text-lg font-bold transition-colors"
            style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#4b5563' }}
          >
            <a href="#features" onClick={scrollToSection('features')} className="hover:text-primary-600 transition-colors"
             style={{ color: isDarkMode ? '#ffffff' : shouldUseDarkText ? '#111827' : '#111827' }}>{t.nav.features}</a>
            <a href="#pricing" onClick={scrollToSection('pricing')} className="hover:text-primary-600 transition-colors"
             style={{ color: isDarkMode ? '#ffffff' : shouldUseDarkText ? '#111827' : '#111827' }}>{t.nav.ready}</a>
            <a href="#about" onClick={scrollToSection('about')} className="hover:text-primary-600 transition-colors"
             style={{ color: isDarkMode ? '#ffffff' : shouldUseDarkText ? '#111827' : '#111827' }}>{t.nav.about}</a>
          </div>

          {/* Action Buttons - Shrink 0 to prevent crushing */}
          <div className="flex gap-3 2xl:gap-5 shrink-0 items-center">
            {/* Language Selector */}
            <LanguageSelector shouldUseDarkText={shouldUseDarkText} isDarkMode={isDarkMode} />
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 2xl:p-3 rounded-xl hover:opacity-80 transition-all border"
              style={{
                backgroundColor: isDarkMode ? '#4a5568' : '#f3f4f6',
                borderColor: isDarkMode ? '#718096' : '#d1d5db'
              }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 2xl:w-6 2xl:h-6 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 2xl:w-6 2xl:h-6 text-gray-600" />
              )}
            </button>
            
            {!authLoading && !isAuthenticated && (
              <>
                <Button 
                  size="lg" 
                  onClick={onLogin} 
                  className="shadow-lg shadow-primary-500/20 2xl:text-lg 2xl:px-8 2xl:py-4"              
                >{t.nav.login}</Button>
              </>
            )}
            
            <Button 
              onClick={isAuthenticated ? onEnterApp : onLogin} 
              size="lg"
              className={`shadow-lg shadow-primary-500/20 2xl:text-lg 2xl:px-8 2xl:py-4 ${isAuthenticated ? '2xl:text-xl 2xl:px-12 2xl:py-5' : ''}`}
            >
              {t.nav.getAssistant}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Height (min-h-screen) for separate flow */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] 2xl:w-[800px] 2xl:h-[800px] bg-primary-300/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-[-10%] w-[600px] h-[600px] 2xl:w-[900px] 2xl:h-[900px] bg-secondary-300/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[2400px] mx-auto w-full grid lg:grid-cols-2 gap-16 2xl:gap-32 items-center relative z-10">
          
          {/* Hero Content */}
          <FadeIn direction="right" className="space-y-8 2xl:space-y-12 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-sm 2xl:text-base font-bold shadow-sm hover:scale-105 transition-transform cursor-default" style={{ color: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#111827' }}>
              <Sparkles className="w-4 h-4 text-secondary-500" />
              <span>{t.hero.badge}</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl 2xl:text-[9rem] font-extrabold leading-[0.9] tracking-tight" style={{ color: (isDarkMode) ? '#ffffff' : '#111827' }}>
              {t.hero.title1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-teal-400 animate-gradient-x">{t.hero.title2}</span> <br/>
              {t.hero.title3}
            </h1>
            
            <p className="text-xl 2xl:text-4xl max-w-lg 2xl:max-w-4xl leading-relaxed font-medium" style={{ color: (isDarkMode) ? '#ffffff' : '#111827' }}>
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button onClick={isAuthenticated ? onEnterApp : onLogin} size="lg" className="px-10 py-5 text-lg 2xl:text-2xl 2xl:px-14 2xl:py-8 shadow-xl shadow-primary-500/30 hover:scale-105 transition-transform">
                 {t.hero.tryDemo} <ArrowRight className="w-5 h-5 2xl:w-7 2xl:h-7" />
               </Button>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center gap-6">
               <div className="flex -space-x-4">
                 {MOCK_AVATARS.map((avatar, i) => (
                   <img 
                      key={i} 
                      src={avatar} 
                      alt="User"
                      className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-full border-[3px] border-white dark:border-gray-900 object-cover shadow-md"
                   />
                 ))}
                 <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-full bg-black text-white border-[3px] border-white dark:border-gray-900 flex items-center justify-center text-xs 2xl:text-sm font-bold shadow-md">+2k</div>
               </div>
               <div>
                  <div className="flex text-yellow-400 gap-0.5 text-lg 2xl:text-xl">
                    {'★★★★★'.split('').map((s,i) => <span key={i}>{s}</span>)}
                  </div>
                  <p className="text-sm 2xl:text-lg font-bold" style={{ color: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#111827' }}>{t.hero.lovedBy}</p>
               </div>
            </div>
          </FadeIn>

          {/* Hero Visual - Fading Carousel */}
          <div className="relative w-full h-[500px] 2xl:h-[700px] hidden lg:flex items-center justify-center order-1 lg:order-2 perspective-1000">
             
             {/* --- Static Floating Elements (Outside Carousel) --- */}
             {/* Top Right Logo Badge */}
             <div className="absolute -top-10 -right-4 2xl:-top-12 2xl:-right-12 w-24 h-24 2xl:w-32 2xl:h-32 bg-primary-500 rounded-3xl shadow-xl flex items-center justify-center animate-float z-30 border border-primary-400/50">
                <LogoIcon className="w-14 h-14 2xl:w-20 2xl:h-20 text-white" />
             </div>
             {/* Left Side Recording Badge */}
             <div className="absolute top-1/2 -left-12 2xl:-left-20 w-auto px-6 py-4 2xl:px-8 2xl:py-6 bg-white dark:bg-gray-600 rounded-2xl shadow-xl flex items-center gap-3 animate-float [animation-delay:1s] z-30 border border-white/50 dark:border-gray-500/50 transform -translate-y-1/2">
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm 2xl:text-lg text-gray-800 dark:text-white">{t.hero.recording}</span>
             </div>

             {/* --- Carousel Container --- */}
             <div className="relative w-[500px] h-[360px] xl:w-[580px] xl:h-[420px] 2xl:w-[720px] 2xl:h-[520px]">
               {HERO_SLIDES.map((slide, idx) => {
                 const isActive = idx === activeSlide;
                 return (
                   <div 
                      key={idx}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                        isActive 
                          ? 'opacity-100 scale-100 z-20 translate-y-0 rotate-0' 
                          : 'opacity-0 scale-95 z-0 translate-y-8 rotate-3'
                      }`}
                   >
                     <MockCard {...slide} isDarkMode={isDarkMode} shouldUseDarkText={shouldUseDarkText} />
                   </div>
                 );
               })}
             </div>

             {/* Carousel Indicators (Dots) */}
             <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3">
               {HERO_SLIDES.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setActiveSlide(idx)}
                   className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                     idx === activeSlide ? 'bg-primary-500 w-8' : 'bg-gray-300 dark:bg-gray-500 hover:bg-primary-300'
                   }`}
                 />
               ))}
             </div>
             
             {/* Decorative Background Elements */}
             <div className="absolute -top-10 right-20 z-0 pointer-events-none">
               <div className="w-16 h-16 bg-primary-400/20 rounded-full blur-xl animate-pulse"></div>
             </div>
             <div className="absolute bottom-0 left-20 z-0 pointer-events-none">
               <div className="w-24 h-24 bg-secondary-400/20 rounded-full blur-xl animate-pulse"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid Style with Mockups */}
      <section 
        id="features" 
        className="py-24 rounded-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.02)] relative z-20 transition-colors duration-300"
        style={{ backgroundColor: isDarkMode ? '#5a6878' : '#ffffff' }}
      >
        <div className="max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[2400px] mx-auto px-6 transition-all duration-300">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
             <div className="inline-block p-2 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mb-4">
                <LogoIcon className="w-8 h-8 text-primary-600" />
             </div>
            <h2 className="text-4xl 2xl:text-5xl font-extrabold mb-4" style={{ color: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#111827' }}>{t.features.title}</h2>
            <p className="text-lg 2xl:text-xl" style={{ color: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#111827' }}>{t.features.subtitle}</p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-10">
             
             {/* Feature 1: Real-time Transcription */}
             <FadeIn delay={100} className="col-span-1 md:col-span-2 bg-[#f8fafc] dark:bg-gray-600 rounded-[2.5rem] p-10 relative overflow-hidden group min-h-[450px] border border-gray-100 dark:border-gray-500 flex flex-col justify-between">
                <div className="relative z-10 max-w-md 2xl:max-w-xl mb-8">
                   <div className="w-14 h-14 bg-white dark:bg-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-400">
                      <Mic className="w-7 h-7 text-primary-500" />
                   </div>
                   <h3 className="text-2xl 2xl:text-3xl font-bold mb-3" style={{ color: (isDarkMode) ? '#111827' : '#111827' }}>{t.features.transcription.title}</h3>
                   <p className="text-lg 2xl:text-xl leading-relaxed" style={{ color: (isDarkMode) ? '#111827' : '#111827' }}>
                     {t.features.transcription.desc}
                   </p>
                </div>
                
                {/* Mockup UI for Transcription */}
                <div className="bg-white dark:bg-gray-500 rounded-t-3xl shadow-xl border border-gray-200 dark:border-gray-500 p-6 space-y-4 opacity-90 group-hover:translate-y-[-10px] transition-transform duration-500">
                   <div className="flex gap-4">
                      <img src={MOCK_AVATARS[0]} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                         <p className="text-xs font-bold mb-1" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#9ca3af' }}>Alex • 10:02 AM</p>
                         <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 dark:text-white">
                            We need to focus on the retention metrics for Q3.
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-4 flex-row-reverse">
                      <img src={MOCK_AVATARS[2]} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 text-right">
                         <p className="text-xs font-bold mb-1" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#9ca3af' }}>Sarah • 10:03 AM</p>
                         <div className="bg-primary-50 dark:bg-primary-700 p-3 rounded-2xl rounded-tr-none text-sm text-gray-700 dark:text-white text-left">
                            Agreed. I'll pull the cohort analysis report by Friday.
                         </div>
                      </div>
                   </div>
                </div>
             </FadeIn>

             {/* Feature 2: Instant Action Items */}
             <FadeIn delay={200} className="bg-gradient-to-b from-primary-500 to-primary-600 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col shadow-lg shadow-primary-500/30 min-h-[450px]">
                <div className="mb-8">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                      <Zap className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl 2xl:text-3xl font-bold mb-3 text-gray-900 dark:text-white">{t.features.actionItems.title}</h3>
                   <p className="text-white/80 text-lg 2xl:text-xl">{t.features.actionItems.desc}</p>
                </div>

                {/* Mockup UI for Checklist */}
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-t-3xl border border-white/20 p-5 space-y-3 group hover:bg-white/15 transition-colors">
                   <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-white"><Check className="w-3 h-3"/></div>
                      <span className="text-sm font-medium line-through opacity-60">Send Q3 Report</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-lg transform scale-105">
                      <div className="w-5 h-5 rounded-full border-2 border-primary-500"></div>
                      <span className="text-sm font-bold text-gray-800">Email Investors</span>
                      <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">High</span>
                   </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/10 opacity-70">
                      <div className="w-5 h-5 rounded-full border-2 border-white/50"></div>
                      <span className="text-sm font-medium">Schedule Team Sync</span>
                   </div>
                </div>
             </FadeIn>

             {/* Feature 3: Universal Sync */}
             <FadeIn delay={100} className="bg-[#ffffff] rounded-[2.5rem] p-8 min-h-[350px] flex flex-col border border-pink-100 dark:border-gray-500">
                <div className="mb-6">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#ffffff' }}>
                      <Globe className="w-6 h-6" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#ec4899' }} />
                   </div>
                   <h3 className="text-2xl 2xl:text-3xl font-bold mb-3" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#111827' }}>{t.features.sync.title}</h3>
                   <p className="text-lg font-medium" style={{ color: (isDarkMode || shouldUseDarkText) ? '#0f1013ff' : '#111827' }}>{t.features.sync.desc}</p>
                </div>
                
                {/* Mockup Logos */}
                <div className="mt-auto grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border aspect-square" style={{ backgroundColor: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#ffffff', borderColor: (isDarkMode || shouldUseDarkText)  ? '#e5e7eb' : '#f3f4f6' }}>
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">Z</div>
                      <span className="text-xs font-bold" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#4b5563' }}>Zoom</span>
                   </div>
                    <div className="p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border aspect-square" style={{ backgroundColor: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#ffffff', borderColor: (isDarkMode || shouldUseDarkText)  ? '#e5e7eb' : '#f3f4f6' }}>
                      <div className="w-10 h-10 bg-[#ea4335] rounded-full flex items-center justify-center text-white font-bold"><Video className="w-5 h-5"/></div>
                      <span className="text-xs font-bold" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#4b5563' }}>Meet</span>
                   </div>
                </div>
             </FadeIn>

             {/* Feature 4: CTA Card */}
             <FadeIn delay={200} className="col-span-1 md:col-span-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden flex items-center justify-between min-h-[350px]">
                 <div className="relative z-10 max-w-lg">
                    <h3 className="text-3xl 2xl:text-5xl font-bold mb-6" style={{ color: (isDarkMode || shouldUseDarkText) ? '#111827' : '#ffffff' }}>{t.features.cta.title}</h3>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="flex -space-x-3">
                          {MOCK_AVATARS.map((src, i) => (
                             <img key={i} src={src} className="w-10 h-10 rounded-full border-2" style={{ borderColor: (isDarkMode || shouldUseDarkText) ? '#ffffff' : '#111827' }} />
                          ))}
                       </div>
                       <p className="font-medium" style={{ color: (isDarkMode || shouldUseDarkText) ? '#6b7280' : '#9ca3af' }}>{t.features.cta.join}</p>
                    </div>
                    <Button onClick={isAuthenticated ? onEnterApp : onLogin} className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-primary-600 dark:text-white border-none shadow-xl px-8 py-4 text-lg rounded-2xl font-bold transition-transform hover:-translate-y-1">
                       {t.features.cta.button}
                    </Button>
                 </div>
                 
                 {/* Decorative Circle */}
                 <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
                 
                 <div className="hidden md:block relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-64 transform rotate-6">
                       <div className="h-2 w-12 bg-gray-500/50 rounded-full mb-4"></div>
                       <div className="space-y-3">
                          <div className="h-2 w-full bg-gray-500/30 rounded-full"></div>
                          <div className="h-2 w-3/4 bg-gray-500/30 rounded-full"></div>
                          <div className="h-2 w-1/2 bg-gray-500/30 rounded-full"></div>
                       </div>
                    </div>
                 </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* "Ready?" CTA Section (Replaces Pricing) */}
      <section id="pricing" className="py-20 px-6 relative z-20">
        <FadeIn delay={100} className="max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[2400px] mx-auto bg-emerald-400 dark:bg-emerald-600 rounded-[3rem] overflow-hidden relative shadow-2xl transition-all duration-300">
          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400/80 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>

          <div className="grid lg:grid-cols-2 gap-12 items-center p-8 md:p-16 2xl:p-24 relative z-10">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <h2 className="text-4xl lg:text-6xl 2xl:text-8xl font-extrabold leading-[1.1]" style={{ color: '#111827 !important' }}>
                {t.ready.title1} <br/>
                {t.ready.title2} <br/>
                {t.ready.title3}
              </h2>
              <p className="text-xl 2xl:text-3xl font-medium max-w-md 2xl:max-w-xl mx-auto lg:mx-0" style={{ color: '#111827 !important' }}>
                {t.ready.subtitle}
              </p>
              
              <Button 
                onClick={isAuthenticated ? onEnterApp : onLogin} 
                className="bg-gray-900 hover:bg-gray-800 text-white border-none text-lg 2xl:text-2xl px-10 py-4 2xl:px-14 2xl:py-6 h-auto shadow-xl hover:-translate-y-1 transition-all"
              >
                {t.ready.button} <ArrowRight className="ml-2 w-5 h-5 2xl:w-6 2xl:h-6" />
              </Button>
            </div>

            {/* Right Content - Visual Mockup */}
            <div className="relative h-[400px] lg:h-[500px] 2xl:h-[700px] w-full flex items-center justify-center lg:justify-end">
              
              {/* 3D Character (Placeholder using an illustration style image) */}
              <img 
                src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=826&t=st=1709490000~exp=1709490600~hmac=a" 
                alt="3D Assistant" 
                className="absolute bottom-0 right-0 h-[90%] w-auto object-contain z-20 drop-shadow-2xl grayscale-[0.2] mix-blend-hard-light opacity-90"
                style={{ mixBlendMode: 'normal' }}
              />
              {/* Fallback styling if image fails or to enhance 3d feel */}
               <div className="absolute bottom-0 right-4 lg:right-10 w-64 h-[80%] bg-gradient-to-t from-emerald-900/20 to-transparent rounded-b-3xl z-10"></div>

              {/* Floating Dashboard Card */}
              <div className="absolute top-10 left-0 lg:-left-10 w-full max-w-md 2xl:max-w-xl bg-white dark:bg-gray-600 rounded-3xl p-6 2xl:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/40 dark:border-gray-500 z-30 animate-float">
                 
                 {/* Mockup Header */}
                 <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                          <BarChart3 className="w-5 h-5 2xl:w-6 2xl:h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-sm 2xl:text-base text-gray-900 dark:text-white">Sales Objection Handling</h4>
                          <div className="flex gap-2 mt-0.5">
                             <span className="text-[10px] 2xl:text-xs bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-100">Sales</span>
                             <span className="text-[10px] 2xl:text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1"><Check className="w-3 h-3" /> Easy</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                       <Clock className="w-3 h-3" /> 3:00
                    </div>
                 </div>

                 {/* Mockup Body */}
                 <div className="space-y-4">
                    {/* Chat Bubble Left */}
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                       <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-2xl rounded-tl-none text-xs 2xl:text-sm text-gray-600 dark:text-gray-100">
                          "I'm sorry you feel that way. Let me explain how our product actually solves that issue..."
                       </div>
                    </div>

                    {/* Feedback/Score Box */}
                    <div className="bg-emerald-900 text-white p-4 rounded-xl relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs 2xl:text-sm font-bold text-emerald-200 uppercase tracking-wider">Analysis Score</span>
                             <span className="text-xl 2xl:text-2xl font-bold">85/100</span>
                          </div>
                          <div className="w-full bg-emerald-800 h-1.5 rounded-full mb-3">
                             <div className="w-[85%] bg-emerald-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                          </div>
                          <div className="flex gap-2 items-start text-xs 2xl:text-sm text-emerald-100">
                             <AlertCircle className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" />
                             <p>Good empathy shown, but try to pivot to the value proposition sooner.</p>
                          </div>
                       </div>
                       {/* Abstract bg lines */}
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    </div>
                 </div>

                 {/* Audio Control Bar Mockup */}
                 <div className="mt-6 flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-600 p-2 rounded-xl">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                       <div className="w-3 h-3 bg-white rounded-[1px]"></div>
                    </div>
                    <div className="flex-1 h-8 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <div className="flex gap-0.5 items-end h-4">
                           {[3,5,8,4,6,3,7,4,8,5,3].map((h,i) => (
                              <div key={i} className="w-1 bg-gray-300 dark:bg-gray-600 rounded-full" style={{height: `${h*10}%`}}></div>
                           ))}
                        </div>
                    </div>
                    <div className="w-20 px-3 py-1 bg-white dark:bg-gray-600 rounded-lg text-[10px] font-bold text-center text-gray-500 dark:text-gray-100">
                       Recording...
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer 
        id="about" 
        className={`border-t py-20 px-6 rounded-t-[3rem] transition-colors duration-300 ${isDarkMode ? 'dark-footer-text' : ''}`}
        style={{
          backgroundColor: isDarkMode ? '#4a5568' : '#ffffff',
          borderColor: (isDarkMode || shouldUseDarkText) ? '#718096' : '#e5e7eb'
        }}
      > 
        <FadeIn className="max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[2400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 transition-all duration-300">
           <div className="max-w-sm">
             <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                <LogoIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Meeting Assistant</span>
             </div>
             <p className="leading-relaxed mb-6" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
               {t.footer.description}
             </p>
             <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors group" style={{ backgroundColor: isDarkMode ? '#4a5568' : '#f3f4f6' }}>
                  <Twitter className="w-5 h-5 group-hover:text-white" style={{ color: isDarkMode ? '#ffffff' : '#111827' }} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors group" style={{ backgroundColor: isDarkMode ? '#4a5568' : '#f3f4f6' }}>
                  <Linkedin className="w-5 h-5 group-hover:text-white" style={{ color: isDarkMode ? '#ffffff' : '#111827' }} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors group" style={{ backgroundColor: isDarkMode ? '#4a5568' : '#f3f4f6' }}>
                  <Github className="w-5 h-5 group-hover:text-white" style={{ color: isDarkMode ? '#ffffff' : '#111827' }} />
                </a>
             </div>
           </div>
           
           <div className="flex flex-wrap gap-12 sm:gap-24">
             <div>
               <h4 className="font-bold mb-6" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{t.footer.product}</h4>
               <ul className="space-y-4 text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                 <li><a href="#features" onClick={scrollToSection('features')} className="hover:text-primary-500 transition-colors">{t.nav.features}</a></li>
                 <li><a href="#pricing" onClick={scrollToSection('pricing')} className="hover:text-primary-500 transition-colors">{t.footer.pricing}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.integrations}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.changelog}</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-bold mb-6" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{t.footer.company}</h4>
               <ul className="space-y-4 text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.aboutUs}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.careers}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.blog}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.contact}</a></li>
               </ul>
             </div>
              <div>
               <h4 className="font-bold mb-6" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{t.footer.legal}</h4>
               <ul className="space-y-4 text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.privacy}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.terms}</a></li>
                 <li><a href="#" className="hover:text-primary-500 transition-colors">{t.footer.security}</a></li>
               </ul>
             </div>
           </div>
        </FadeIn>
        <div className="max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[2400px] mx-auto pt-12 mt-12 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
          {t.footer.copyright}
        </div>
      </footer>
    </div>
  );
}