import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { useDarkMode } from '../../context/DarkModeContext';

export const LanguageSelector: React.FC<{ className?: string; shouldUseDarkText?: boolean; isDarkMode?: boolean }> = ({ 
  className = '', 
  shouldUseDarkText = false,
  isDarkMode: isDarkModeProp = undefined
}) => {
  const { language, setLanguage } = useLanguage();
  const { isDarkMode: isDarkModeContext } = useDarkMode();
  const isDarkMode = isDarkModeProp !== undefined ? isDarkModeProp : isDarkModeContext;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
        style={{
          backgroundColor: isDarkMode ? '#1f2937' : shouldUseDarkText ? '#ffffff' : '#f3f4f6',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? '#374151' : shouldUseDarkText ? '#e5e7eb' : '#d1d5db'
        }}
      >
        <img 
          src={language === 'en' ? '/images/gb.svg' : '/images/vn.svg'} 
          alt={language === 'en' ? 'Flag' : 'Cờ'}
          className="w-5 h-5 2xl:w-6 2xl:h-6 object-cover rounded-sm"
        />
        <span className="text-sm 2xl:text-base font-semibold" style={{ color: isDarkMode ? '#ffffff' : shouldUseDarkText ? '#111827' : '#111827' }}>
          {language === 'en' ? 'EN' : 'VI'}
        </span>
        <ChevronDown className="w-4 h-4 2xl:w-5 2xl:h-5" style={{ color: isDarkMode ? '#ffffff' : shouldUseDarkText ? '#111827' : '#6b7280' }} />
      </button>
      
      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          <div style={{ 
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            width: '160px',
            backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
            overflow: 'hidden',
            zIndex: 50
          }}>
            <button
              onClick={() => {
                setLanguage('en');
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: language === 'en' ? (isDarkMode ? '#1e293b' : '#eff6ff') : 'transparent',
                color: language === 'en' ? '#10b981' : (isDarkMode ? '#d1d5db' : '#374151'),
                border: 'none',
                cursor: 'pointer'
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3 hover:opacity-80"
            >
              <img src="/images/gb.svg" alt="English" className="w-5 h-5 object-cover rounded-sm" />
              <span>English</span>
              {language === 'en' && <Check className="w-4 h-4 ml-auto" />}
            </button>
            <button
              onClick={() => {
                setLanguage('vi');
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: language === 'vi' ? (isDarkMode ? '#1e293b' : '#eff6ff') : 'transparent',
                color: language === 'vi' ? '#10b981' : (isDarkMode ? '#d1d5db' : '#374151'),
                border: 'none',
                cursor: 'pointer'
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3 hover:opacity-80"
            >
              <img src="/images/vn.svg" alt="Tiếng Việt" className="w-5 h-5 object-cover rounded-sm" />
              <span>Tiếng Việt</span>
              {language === 'vi' && <Check className="w-4 h-4 ml-auto" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
