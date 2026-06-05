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
    // Check if admin session exists on mount
    const session = localStorage.getItem('admin_session');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.authenticated) {
        setIsAdmin(true);
      }
    }
    setMounted(true);
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_session');
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
