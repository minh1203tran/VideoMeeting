import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { useDarkMode } from '../../context/DarkModeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    const { isDarkMode } = useDarkMode();
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-text">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            style={{
              backgroundColor: isDarkMode ? '#1a2332' : '#f9fafb',
              color: isDarkMode ? '#e5e7eb' : '#111827',
              borderColor: error ? '#f87171' : (isDarkMode ? '#374151' : '#e5e7eb'),
              transition: 'all 0.3s ease'
            }}
            className={cn(
              'w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-400 focus:border-red-500',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
