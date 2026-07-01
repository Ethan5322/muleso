'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  QrCode,
  ImageIcon,
  FileText,
  Settings,
  Globe,
  Quote,
  Wrench,
  Inbox,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Leads', href: '/admin/leads', icon: Inbox },
  { label: 'Bookings', href: '/admin/bookings', icon: BookOpen },
  { label: 'Visitors', href: '/admin/visitors', icon: Users },
  { label: 'QR Scans', href: '/admin/qr-scans', icon: QrCode },
  { label: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { label: 'Site Content', href: '/admin/site-content', icon: Globe },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Make the installable PWA available only inside /admin (branded as MuleSoo).
  // The public site no longer prompts visitors to install.
  useEffect(() => {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/manifest.json';
    manifest.setAttribute('data-admin-pwa', 'true');
    document.head.appendChild(manifest);

    const apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    apple.href = '/mulesoo-logo.png';
    apple.setAttribute('data-admin-pwa', 'true');
    document.head.appendChild(apple);

    return () => {
      document.querySelectorAll('[data-admin-pwa]').forEach((el) => el.remove());
    };
  }, []);

  // Login pages render their own full-screen UI — no admin chrome.
  if (pathname === '/admin/login' || pathname === '/admin/face-login') {
    return <>{children}</>;
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('admin_session');
    toast.success('Signed out');
    router.push('/');
  };

  const NavLinks = () => (
    <nav className="p-4 space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              active
                ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white shadow-lg'
                : 'text-[#7A8BA8] hover:text-[#00C8FF] hover:bg-[#1A2332]'
            }`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0F1624] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0A0E17] border-b border-[#1E3A5F] shadow-lg">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#1A2332] text-[#00C8FF]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold font-sora leading-tight">MuleSoo Admin</h1>
              <p className="text-[#7A8BA8] text-[11px] leading-tight">Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-xs text-[#7A8BA8]">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              Secured session
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 bg-[#0A0E17] border-r border-[#1E3A5F] min-h-[calc(100vh-69px)]">
          <NavLinks />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              className="lg:hidden fixed top-[69px] left-0 bottom-0 w-64 bg-[#0A0E17] border-r border-[#1E3A5F] z-40 overflow-y-auto"
            >
              <NavLinks />
            </motion.aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
