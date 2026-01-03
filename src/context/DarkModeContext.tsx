import React from 'react';
import { DarkModeContextType } from './DarkModeTypes';

export const DarkModeContext = React.createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
