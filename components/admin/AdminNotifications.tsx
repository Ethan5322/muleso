'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Bell, Inbox, BookOpen } from 'lucide-react';

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [newLeads, setNewLeads] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevTotal = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [leads, bookings] = await Promise.all([
        fetch('/api/admin/leads').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/admin/bookings').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      const nl = Array.isArray(leads) ? leads.filter((l: { status?: string }) => l.status === 'New').length : 0;
      const pb = Array.isArray(bookings) ? bookings.filter((b: { status?: string }) => b.status === 'Pending').length : 0;
      setNewLeads(nl);
      setPendingBookings(pb);
      const total = nl + pb;
      if (prevTotal.current !== null && total > prevTotal.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 4000);
      }
      prevTotal.current = total;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 30000);
    return () => clearInterval(poll);
  }, [load]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const total = newLeads + pendingBookings;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-[#141d2e] text-[#8A9AB8] hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell size={19} className={pulse ? 'animate-bounce text-[#00C8FF]' : ''} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF4D6D] text-white text-[10px] font-bold flex items-center justify-center">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0A0E17] border border-[#1E3A5F] rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1E3A5F]">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-[11px] text-[#8296B8]">Live activity across your business</p>
          </div>
          <div className="divide-y divide-[#141d2e]">
            <Link
              href="/admin/leads"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#141d2e] transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-[#00C8FF]/10 text-[#00C8FF] flex items-center justify-center">
                <Inbox size={17} />
              </span>
              <div className="flex-1">
                <p className="text-sm text-white">New leads</p>
                <p className="text-[11px] text-[#8296B8]">Awaiting your response</p>
              </div>
              <span className={`text-sm font-bold ${newLeads > 0 ? 'text-[#00C8FF]' : 'text-[#7A8BA8]'}`}>{newLeads}</span>
            </Link>
            <Link
              href="/admin/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#141d2e] transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-[#E8B84B]/10 text-[#E8B84B] flex items-center justify-center">
                <BookOpen size={17} />
              </span>
              <div className="flex-1">
                <p className="text-sm text-white">Pending bookings</p>
                <p className="text-[11px] text-[#8296B8]">Need confirmation</p>
              </div>
              <span className={`text-sm font-bold ${pendingBookings > 0 ? 'text-[#E8B84B]' : 'text-[#7A8BA8]'}`}>{pendingBookings}</span>
            </Link>
          </div>
          {total === 0 && (
            <div className="px-4 py-4 text-center text-xs text-[#8296B8]">You&apos;re all caught up ✓</div>
          )}
        </div>
      )}
    </div>
  );
}
