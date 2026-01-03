import React, { useState, useEffect } from 'react';
import { DarkModeContext } from './DarkModeContext';

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    console.log('🟦 DarkModeContext INIT: darkMode from localStorage =', saved);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to HTML when isDarkMode changes
  useEffect(() => {
    console.log('🟦 DarkModeContext EFFECT: applying dark mode, isDarkMode =', isDarkMode);
    console.log('🟦 HTML className BEFORE:', document.documentElement.className);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      console.log('✅ Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      console.log('✅ Removed dark class');
    }
    console.log('🟦 HTML className AFTER:', document.documentElement.className);
  }, [isDarkMode]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode' && e.newValue !== null) {
        console.log('🟦 DarkModeContext STORAGE EVENT:', e.newValue === 'true');
        setIsDarkMode(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleDarkMode: () => setIsDarkMode(!isDarkMode) }}>
      {children}
    </DarkModeContext.Provider>
  );
};
