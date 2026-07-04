'use client';

import { useState, useEffect, useRef } from 'react';
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
  Building2,
  ScanBarcode,
  MessageSquare,
  ListChecks,
  Network,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  IdCard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminNotifications from '@/components/admin/AdminNotifications';
import AdminSearch from '@/components/admin/AdminSearch';

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard; exact?: boolean };
type NavSection = { title: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true }],
  },
  {
    title: 'Sales & Leads',
    items: [{ label: 'Leads', href: '/admin/leads', icon: Inbox }],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Bookings', href: '/admin/bookings', icon: BookOpen },
      { label: 'Visitors', href: '/admin/visitors', icon: Users },
      { label: 'QR Scans', href: '/admin/qr-scans', icon: QrCode },
    ],
  },
  {
    title: 'Site Management',
    items: [
      { label: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Services', href: '/admin/services', icon: Wrench },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
      { label: 'Site Content', href: '/admin/site-content', icon: Globe },
    ],
  },
  {
    title: 'Corporate Team',
    items: [
      { label: 'Team Admins', href: '/admin/team', icon: Building2 },
      { label: 'Departments', href: '/admin/departments', icon: Network },
      { label: 'Tasks', href: '/admin/tasks', icon: ListChecks },
      { label: 'Team Chat', href: '/admin/team-chat', icon: MessageSquare },
      { label: 'Scan ID', href: '/admin/scan', icon: ScanBarcode },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Installable PWA only inside /admin (branded as MuleSoo).
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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Login pages render their own full-screen UI — no admin chrome.
  if (pathname === '/admin/login' || pathname === '/admin/face-login') {
    return <>{children}</>;
  }

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  const downloadMyCard = async () => {
    setProfileOpen(false);
    try {
      const res = await fetch('/corporate/api/my-card');
      if (!res.ok) {
        toast.error('Could not load your ID card');
        return;
      }
      const { card } = await res.json();
      const { generateIdCard } = await import('@/lib/corp/generateIdCard');
      await generateIdCard(card);
      toast.success('ID card downloaded');
    } catch {
      toast.error('Could not generate ID card');
    }
  };

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
    <nav className="p-3 space-y-5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4A5A78]">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white shadow-lg shadow-[#00C8FF]/20'
                      : 'text-[#8A9AB8] hover:text-white hover:bg-[#141d2e]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0B111C] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0A0E17]/95 backdrop-blur border-b border-[#1E3A5F]">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
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
              <h1 className="text-base font-bold font-sora leading-tight">MuleSoo Admin</h1>
              <p className="text-[#5A6B88] text-[11px] leading-tight">Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdminSearch />
            <AdminNotifications />

            {/* Profile menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-[#141d2e] transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center text-sm font-bold">
                  M
                </span>
                <span className="hidden sm:block text-left leading-tight">
                  <span className="block text-xs font-semibold">Main Admin</span>
                  <span className="block text-[10px] text-[#00FF88]">● Secured</span>
                </span>
                <ChevronDown size={15} className="text-[#5A6B88]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0A0E17] border border-[#1E3A5F] rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1E3A5F]">
                    <p className="text-sm font-semibold">Main Admin</p>
                    <p className="text-[11px] text-[#5A6B88] flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={12} className="text-[#00FF88]" /> 2FA + Face secured
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadMyCard}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#8A9AB8] hover:bg-[#141d2e] hover:text-white"
                  >
                    <IdCard size={15} /> My ID Card
                  </button>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#8A9AB8] hover:bg-[#141d2e] hover:text-white"
                  >
                    <Settings size={15} /> Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-600/10"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 bg-[#0A0E17] border-r border-[#1E3A5F] min-h-[calc(100vh-61px)]">
          <NavLinks />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              className="lg:hidden fixed top-[61px] left-0 bottom-0 w-64 bg-[#0A0E17] border-r border-[#1E3A5F] z-40 overflow-y-auto"
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
