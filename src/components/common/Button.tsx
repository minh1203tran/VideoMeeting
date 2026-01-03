import React from 'react';
import { cn } from '../../utils/cn';
import { useDarkMode } from '../../context/DarkModeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'left',
  children,
  style,
  ...props 
}) => {
  const { isDarkMode } = useDarkMode();
  
  const variants = {
    primary: {
      light: { backgroundColor: '#10b981', color: '#ffffff', borderColor: 'transparent' },
      dark: { backgroundColor: '#10b981', color: '#ffffff', borderColor: 'transparent' }
    },
    secondary: {
      light: { backgroundColor: '#8b5cf6', color: '#ffffff', borderColor: 'transparent' },
      dark: { backgroundColor: '#8b5cf6', color: '#ffffff', borderColor: 'transparent' }
    },
    danger: {
      light: { backgroundColor: '#ef4444', color: '#ffffff', borderColor: 'transparent' },
      dark: { backgroundColor: '#ef4444', color: '#ffffff', borderColor: 'transparent' }
    },
    outline: {
      light: { backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' },
      dark: { backgroundColor: '#1f2937', color: '#d1d5db', borderColor: '#374151' }
    },
    ghost: {
      light: { backgroundColor: '#f3f4f6', color: '#4b5563', borderColor: 'transparent' },
      dark: { backgroundColor: '#1f2937', color: '#9ca3af', borderColor: 'transparent' }
    },
  };

  const sizes = {
    sm: { padding: '0.375rem 1rem', fontSize: '0.75rem', borderRadius: '0.75rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderRadius: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1rem', borderRadius: '1rem' },
  };

  const currentVariant = variants[variant];
  const modeStyle = isDarkMode ? currentVariant.dark : currentVariant.light;
  
  return (
    <button
      style={{
        ...modeStyle,
        ...sizes[size],
        ...style,
        transition: 'all 0.3s ease',
        border: variant === 'outline' ? '2px solid' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        gap: '0.5rem',
        cursor: 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        pointerEvents: props.disabled ? 'none' : 'auto',
      } as React.CSSProperties}
      className={cn(className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={cn("w-5 h-5", size === 'sm' && "w-4 h-4")} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={cn("w-5 h-5", size === 'sm' && "w-4 h-4")} />}
    </button>
  );
};
