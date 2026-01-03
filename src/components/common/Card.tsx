import React from 'react';
import { useDarkMode } from '../../context/DarkModeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'flat' | 'glass';
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  noPadding = false,
  variant = 'default',
  style = {}
}) => {
  const { isDarkMode } = useDarkMode();
  
  const variants = {
    default: {
      backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      boxShadow: isDarkMode 
        ? '8px 8px 24px rgba(0, 0, 0, 0.4)' 
        : '8px 8px 24px rgba(0, 0, 0, 0.04)'
    },
    flat: {
      backgroundColor: isDarkMode ? '#131820' : '#f9fafb',
      borderColor: isDarkMode ? '#1f2937' : '#e5e7eb',
      boxShadow: 'none'
    },
    glass: {
      backgroundColor: isDarkMode ? 'rgba(24, 33, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
      borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'none'
    },
  };

  return (
    <div 
      style={{
        ...variants[variant],
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '2rem',
        transition: 'all 0.3s ease',
        padding: !noPadding ? '1.5rem' : '0',
        ...style
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
