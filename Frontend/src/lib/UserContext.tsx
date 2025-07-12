import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success && response.user) {
          setUser({
            _id: response.user._id,
            name: response.user.fullName,
            email: response.user.email,
            profilePic: response.user.profilePic,
            role: response.user.role
          });
        }
      } catch (error) {
        console.log('No authenticated user found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}; 