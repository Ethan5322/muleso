'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createCorpBrowserClient } from '@/lib/corp/supabaseBrowser';
import { Building2, LogOut, LayoutDashboard, MessageSquare, Hash, ShieldCheck, Settings, ArrowLeft, CheckSquare } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import type { CorpAdmin } from '@/lib/corp/constants';

export default function CorpShell({
  admin,
  email,
  children,
}: {
  admin: CorpAdmin;
  email: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadDM, setUnreadDM] = useState(0);
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [myOpenTasks, setMyOpenTasks] = useState(0);

  const loadUnread = useCallback(async () => {
    try {
      const r = await fetch('/corporate/api/notifications');
      if (r.ok) {
        const d = await r.json();
        setUnreadDM(d.unreadDM ?? 0);
        setUnreadMentions(d.unreadMentions ?? 0);
        // My Work badge reflects open assignments AND unread @mentions on notes.
        setMyOpenTasks((d.myOpenTasks ?? 0) + (d.unreadTaskMentions ?? 0));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadUnread();
    const poll = setInterval(loadUnread, 15000);
    return () => clearInterval(poll);
    // refresh when navigating (e.g. after reading a thread)
  }, [loadUnread, pathname]);

  useEffect(() => {
    const supabase = createCorpBrowserClient();
    const ch = supabase
      .channel('corp-notif-' + admin.id)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_direct_messages', filter: `recipient_id=eq.${admin.id}` },
        () => loadUnread()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_channel_mentions', filter: `mentioned_admin_id=eq.${admin.id}` },
        () => loadUnread()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'corp_tasks', filter: `assignee_id=eq.${admin.id}` },
        () => loadUnread()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_task_mentions', filter: `mentioned_admin_id=eq.${admin.id}` },
        () => loadUnread()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [admin.id, loadUnread]);

  const signOut = async () => {
    const supabase = createCorpBrowserClient();
    await supabase.auth.signOut();
    router.replace('/corporate/login');
    router.refresh();
  };

  const nav = [
    { href: '/corporate', label: 'Dashboard', icon: LayoutDashboard, on: true },
    { href: '/corporate/work', label: 'My Work', icon: CheckSquare, on: true },
    { href: '/corporate/messages', label: 'Messages', icon: MessageSquare, on: true },
    { href: '/corporate/channel', label: 'Team Channel', icon: Hash, on: true },
    { href: '/corporate/settings', label: 'Settings', icon: Settings, on: true },
    ...(admin.is_super_admin
      ? [{ href: '/corporate/control', label: 'Control Panel', icon: ShieldCheck, on: true }]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast host for the corporate workspace — same reason as /admin:
          ClientWrapper renders no ChatbotWidget here, so nothing was listening. */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0A0F1E',
            color: '#F0F2FA',
            border: '1px solid #1A2640',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00FF88', secondary: '#0A0F1E' } },
          error: { duration: 6000, iconTheme: { primary: '#FF5C7C', secondary: '#0A0F1E' } },
        }}
      />

      {/* Top bar */}
      <header className="border-b border-[#1A2640] bg-[#0A0F1E]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.back()}
              title="Back"
              className="p-1.5 -ml-1 rounded-lg text-[#A8B2D0] hover:text-white hover:bg-[#0D1528] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-action-primary)] to-[#7B2FFF] flex items-center justify-center">
              <Building2 className="text-white" size={18} />
            </span>
            <div className="leading-tight">
              <p className="font-bold font-sora text-sm">MuleSoo Corporate</p>
              <p className="text-[11px] text-[#8FA0BE]">
                {admin.is_super_admin ? 'Super Admin' : admin.department_name || `Dept ${admin.department_id ?? ''}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-[#A8B2D0]">{admin.display_name || email}</span>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#A8B2D0] hover:text-[var(--color-action-on-dark)] transition-colors"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav (horizontal scroll) */}
      <nav className="md:hidden border-b border-[#1A2640] bg-[#0A0F1E]/80 overflow-x-auto">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {nav.filter((i) => i.on).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const count =
              item.href === '/corporate/messages' ? unreadDM
              : item.href === '/corporate/channel' ? unreadMentions
              : item.href === '/corporate/work' ? myOpenTasks
              : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active ? 'bg-[var(--color-action-primary)]/15 text-[var(--color-action-on-dark)]' : 'text-[#A8B2D0] bg-[#0D1528]'
                }`}
              >
                <Icon size={14} /> {item.label}
                {count > 0 && (
                  <span className="text-[9px] font-bold bg-[var(--color-action-primary)] text-black rounded-full px-1">{count}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar nav */}
        <nav className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const cls = `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-[var(--color-action-primary)]/10 text-[var(--color-action-on-dark)]'
                : 'text-[#A8B2D0] hover:bg-[#0D1528] hover:text-[#F0F2FA]'
            }`;
            const count =
              item.href === '/corporate/messages' ? unreadDM
              : item.href === '/corporate/channel' ? unreadMentions
              : item.href === '/corporate/work' ? myOpenTasks
              : 0;
            const badge =
              count > 0 ? (
                <span className="ml-auto text-[10px] font-bold bg-[var(--color-action-primary)] text-black rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              ) : null;
            return item.on ? (
              <Link key={item.href} href={item.href} className={cls}>
                <Icon size={17} /> {item.label} {badge}
              </Link>
            ) : (
              <span
                key={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[#8FA0BE] cursor-not-allowed"
                title="Coming in a later phase"
              >
                <Icon size={17} /> {item.label}
                <span className="ml-auto text-[9px] uppercase tracking-wide">soon</span>
              </span>
            );
          })}
        </nav>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
