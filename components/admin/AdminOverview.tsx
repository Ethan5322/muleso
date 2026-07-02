'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users, Activity, BookOpen, QrCode, Inbox, Clock, Plus, FileText, BarChart3, UserPlus,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface Row { id: string; created_at: string; status?: string; name?: string; service?: string }

const RANGES = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

export default function AdminOverview() {
  const [bookings, setBookings] = useState<Row[]>([]);
  const [leads, setLeads] = useState<Row[]>([]);
  const [visitors, setVisitors] = useState<Row[]>([]);
  const [scans, setScans] = useState<Row[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, l, v, s, p] = await Promise.all([
          fetch('/api/admin/bookings').then((r) => (r.ok ? r.json() : [])).catch(() => []),
          fetch('/api/admin/leads').then((r) => (r.ok ? r.json() : [])).catch(() => []),
          supabase.from('visitors').select('id,created_at'),
          supabase.from('qr_scans').select('id,created_at'),
          supabase.from('portfolio').select('id'),
        ]);
        setBookings(Array.isArray(b) ? b : []);
        setLeads(Array.isArray(l) ? l : []);
        setVisitors(v.data || []);
        setScans(s.data || []);
        setPortfolioCount((p.data || []).length);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const won = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Completed').length;
  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const conversion = bookings.length > 0 ? Math.round((won / bookings.length) * 100) : 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const visitorsToday = visitors.filter((v) => v.created_at?.startsWith(todayStr)).length;

  const series = useMemo(() => {
    const map: Record<string, { date: string; label: string; bookings: number; leads: number }> = {};
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = { date: key, label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), bookings: 0, leads: 0 };
    }
    bookings.forEach((b) => { const k = (b.created_at || '').slice(0, 10); if (map[k]) map[k].bookings++; });
    leads.forEach((l) => { const k = (l.created_at || '').slice(0, 10); if (map[k]) map[k].leads++; });
    return Object.values(map);
  }, [bookings, leads, days]);

  const activity = useMemo(() => {
    const merged = [
      ...bookings.map((b) => ({ ...b, kind: 'booking' as const })),
      ...leads.map((l) => ({ ...l, kind: 'lead' as const })),
    ]
      .filter((x) => x.created_at)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 8);
    return merged;
  }, [bookings, leads]);

  const kpis = [
    { icon: Inbox, label: 'Leads', value: leads.length, sub: `${newLeads} new`, color: 'from-cyan-600 to-blue-500' },
    { icon: BookOpen, label: 'Bookings', value: bookings.length, sub: `${pending} pending`, color: 'from-blue-600 to-cyan-500' },
    { icon: Activity, label: 'Conversion', value: `${conversion}%`, sub: `${won} won`, color: 'from-emerald-600 to-teal-500' },
    { icon: Users, label: 'Visitors', value: visitors.length, sub: `${visitorsToday} today`, color: 'from-purple-600 to-pink-500' },
    { icon: QrCode, label: 'QR Scans', value: scans.length, sub: `${portfolioCount} projects`, color: 'from-amber-600 to-orange-500' },
  ];

  const quickActions = [
    { href: '/admin/portfolio', label: 'Add Project', icon: Plus },
    { href: '/admin/pages', label: 'Manage Pages', icon: FileText },
    { href: '/admin/bookings', label: 'View Bookings', icon: BookOpen },
    { href: '/admin/visitors', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/team', label: 'Register Admin', icon: UserPlus },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-[#1E3A5F] pb-5">
        <div>
          <h1 className="text-3xl font-bold font-sora">Dashboard</h1>
          <p className="text-[#5A6B88] text-sm mt-1">Live overview of your bookings, traffic, and content</p>
        </div>
        <div className="flex gap-1 bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                days === r.days ? 'bg-[#00C8FF]/15 text-[#00C8FF]' : 'text-[#5A6B88] hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[#0A0E17] border border-[#1E3A5F] animate-pulse" />
            ))
          : kpis.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-5 hover:border-[#00C8FF] transition-all">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <p className="text-[#5A6B88] text-xs font-semibold">{s.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <span className="text-[11px] text-emerald-400 font-semibold">{s.sub}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Trend chart */}
      <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-5">
        <h2 className="text-sm font-bold font-sora mb-4">Bookings &amp; leads — last {days} days</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C8FF" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00C8FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7B2FFF" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7B2FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#5A6B88', fontSize: 11 }} interval="preserveStartEnd" minTickGap={24} />
              <YAxis allowDecimals={false} tick={{ fill: '#5A6B88', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0A0E17', border: '1px solid #1E3A5F', borderRadius: 10, color: '#fff' }} />
              <Area type="monotone" dataKey="bookings" stroke="#00C8FF" fill="url(#gB)" strokeWidth={2} name="Bookings" />
              <Area type="monotone" dataKey="leads" stroke="#7B2FFF" fill="url(#gL)" strokeWidth={2} name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Quick actions</h2>
          <div className="space-y-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0F1624] border border-[#1E3A5F] hover:border-[#00C8FF] hover:bg-[#141d2e] text-sm font-semibold transition-all"
                >
                  <Icon size={17} className="text-[#00C8FF]" /> {a.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Recent activity</h2>
          {loading ? (
            <p className="text-[#5A6B88] text-sm">Loading…</p>
          ) : activity.length === 0 ? (
            <p className="text-[#5A6B88] text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {activity.map((a) => (
                <div key={`${a.kind}-${a.id}`} className="flex items-center gap-3 p-2.5 hover:bg-[#141d2e] rounded-lg transition">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.kind === 'booking' ? 'bg-[#00C8FF]/10 text-[#00C8FF]' : 'bg-[#7B2FFF]/10 text-[#a78bfa]'}`}>
                    {a.kind === 'booking' ? <BookOpen size={15} /> : <Inbox size={15} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {a.name || 'Unknown'}{' '}
                      <span className="text-[#5A6B88] font-normal">
                        · {a.kind === 'booking' ? a.service || 'Booking' : 'New lead'}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#5A6B88] flex items-center gap-1">
                      <Clock size={11} /> {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                  {a.status && (
                    <span className="text-[11px] font-semibold text-[#8A9AB8]">{a.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
