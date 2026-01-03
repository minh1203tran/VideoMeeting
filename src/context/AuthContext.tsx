import { ReactNode, useState, useEffect } from 'react';
import type { User } from '../types/user';
import { AuthContext } from './authContextConfig';
import { authService } from '../services/authService';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('Attempting to fetch current user...');
        const response = await authService.getCurrentUser();
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          const userData = response.data.data;
          const user: User = {
            id: userData.id || userData.userId || '',
            name: userData.fullName || userData.full_name || userData.name || userData.firstName || '',
            email: userData.email || '',
            avatar: userData.avatar || userData.avatar_url || userData.profilePicture || `https://picsum.photos/seed/${userData.id}/100/100`,
          };
          console.log('Processed User (from response.data.data):', user);
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        } else if (response.data) {
          // Fallback if data structure is different
          const userData = response.data;
          const user: User = {
            id: userData.id || userData.userId || '',
            name: userData.fullName || userData.full_name || userData.name || userData.firstName || '',
            email: userData.email || '',
            avatar: userData.avatar || userData.avatar_url || userData.profilePicture || `https://picsum.photos/seed/${userData.id}/100/100`,
          };
          console.log('Processed User (from response.data):', user);
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Failed to fetch current user from API:', error);
        console.error('Error details:', {
          message: (error as any)?.message,
          status: (error as any)?.response?.status,
          statusText: (error as any)?.response?.statusText,
          data: (error as any)?.response?.data,
        });
        
        // Try to load from localStorage as fallback
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            console.log('Loaded user from localStorage:', user);
            setUser(user);
          } catch (e) {
            console.error('Failed to parse saved user:', e);
          }
        } else {
          console.warn('No user data found in localStorage either');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
