import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDarkMode } from '../../context/DarkModeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className 
}) => {
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useDarkMode();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease-out forwards'
        } as React.CSSProperties}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${isDarkMode ? '#1f2937' : '#e5e7eb'}`,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        } as React.CSSProperties}
        className={cn(className)}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: `1px solid ${isDarkMode ? '#1f2937' : '#f3f4f6'}`,
            borderColor: isDarkMode ? '#1f2937' : '#e5e7eb'
          }}
        >
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: isDarkMode ? '#ffffff' : '#111827',
            letterSpacing: '-0.025em'
          }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              padding: '0.5rem',
              color: isDarkMode ? '#9ca3af' : '#9ca3af',
              backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#374151';
              } else {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#9ca3af';
              e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f3f4f6';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>

      {/* Inline Styles for Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};
