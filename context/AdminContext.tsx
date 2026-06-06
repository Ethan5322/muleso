'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Middleware handles authentication, so we just manage logout state
  const [isAdmin, setIsAdmin] = useState(true);

  const logout = async () => {
    try {
      // Call logout API to clear session cookie
      await fetch('/api/admin/logout', { method: 'POST' });

      // Clear localStorage
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_attempts');
      localStorage.removeItem('admin_lockout');

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    return {
      isAdmin: false,
      setIsAdmin: () => {},
      logout: () => {},
    };
  }
  return context;
}
