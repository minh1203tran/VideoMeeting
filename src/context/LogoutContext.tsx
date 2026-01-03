import { createContext, useContext } from 'react';

export interface LogoutContextType {
  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (value: boolean) => void;
}

export const LogoutContext = createContext<LogoutContextType | undefined>(undefined);

export const useLogout = () => {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogout must be used within MainLayout');
  }
  return context;
};
