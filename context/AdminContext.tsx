'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if admin session exists and is VALID on mount
    try {
      const session = localStorage.getItem('admin_session');
      if (!session) {
        setMounted(true);
        return;
      }

      const sessionData = JSON.parse(session);

      // STRONG VALIDATION: All required fields must exist
      if (!sessionData || !sessionData.authenticated || !sessionData.timestamp) {
        localStorage.removeItem('admin_session');
        setMounted(true);
        return;
      }

      // Check session expiry (24 hours)
      const sessionAge = Date.now() - sessionData.timestamp;
      const MAX_SESSION_AGE = 24 * 60 * 60 * 1000;

      if (sessionAge > MAX_SESSION_AGE) {
        localStorage.removeItem('admin_session');
        setMounted(true);
        return;
      }

      // Session is valid
      setIsAdmin(true);
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('admin_session');
    }

    setMounted(true);
  }, []);

  const logout = () => {
    // Clear ALL admin-related data
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_attempts');
    localStorage.removeItem('admin_lockout');
    setIsAdmin(false);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    // Return default context if not within provider
    return {
      isAdmin: false,
      setIsAdmin: () => {},
      logout: () => {},
    };
  }
  return context;
}
