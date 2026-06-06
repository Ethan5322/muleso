'use client';

import { useAdmin } from '@/context/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminHeader() {
  const { isAdmin, logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  // Only show admin header on /admin routes when logged in
  if (!isAdmin || !pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out from admin');
    router.push('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#00BFFF]/20 to-[#7B2FBE]/20 border-b border-[#00BFFF]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse"></div>
          <span className="text-[#00BFFF] font-semibold text-sm">🛡️ ADMIN MODE ACTIVE</span>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 bg-[#00BFFF]/20 hover:bg-[#00BFFF]/30 border border-[#00BFFF] text-[#00BFFF] px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <BarChart3 size={16} />
            Dashboard
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Exit Admin
          </motion.button>
        </div>
      </div>
    </div>
  );
}
