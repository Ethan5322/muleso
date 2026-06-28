'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Activity, BookOpen, QrCode, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  wonBookings: number;
  conversion: number;
  totalVisitors: number;
  visitorsToday: number;
  totalScans: number;
  scansThisWeek: number;
  portfolioCount: number;
}

interface RecentBooking {
  id: string;
  name: string;
  service: string;
  status: string;
  created_at: string;
}

const todayStr = () => new Date().toISOString().split('T')[0];
const weekAgoStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookingsData, visitorsRes, scansRes, portfolioRes] = await Promise.all([
          fetch('/api/admin/bookings').then((r) => (r.ok ? r.json() : [])).catch(() => []),
          supabase.from('visitors').select('id,created_at'),
          supabase.from('qr_scans').select('id,created_at'),
          supabase.from('portfolio').select('id'),
        ]);

        const bookings = Array.isArray(bookingsData) ? bookingsData : [];
        const visitors = visitorsRes.data || [];
        const scans = scansRes.data || [];
        const portfolio = portfolioRes.data || [];

        const won = bookings.filter((b: any) => b.status === 'Confirmed' || b.status === 'Completed').length;
        const pending = bookings.filter((b: any) => b.status === 'Pending').length;

        setStats({
          totalBookings: bookings.length,
          pendingBookings: pending,
          wonBookings: won,
          conversion: bookings.length > 0 ? (won / bookings.length) * 100 : 0,
          totalVisitors: visitors.length,
          visitorsToday: visitors.filter((v: any) => v.created_at?.startsWith(todayStr())).length,
          totalScans: scans.length,
          scansThisWeek: scans.filter((s: any) => s.created_at >= weekAgoStr()).length,
          portfolioCount: portfolio.length,
        });
        setRecent(bookings.slice(0, 5) as RecentBooking[]);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const kpis = stats
    ? [
        { icon: BookOpen, label: 'Total Bookings', value: String(stats.totalBookings), sub: `${stats.pendingBookings} pending`, color: 'from-blue-600 to-cyan-500' },
        { icon: Activity, label: 'Conversion Rate', value: `${stats.conversion.toFixed(0)}%`, sub: `${stats.wonBookings} won`, color: 'from-emerald-600 to-teal-500' },
        { icon: Users, label: 'Total Visitors', value: String(stats.totalVisitors), sub: `${stats.visitorsToday} today`, color: 'from-purple-600 to-pink-500' },
        { icon: QrCode, label: 'QR Scans', value: String(stats.totalScans), sub: `${stats.scansThisWeek} this week`, color: 'from-amber-600 to-orange-500' },
      ]
    : [];

  const statusColor = (s: string) =>
    s === 'Pending' ? 'text-yellow-400'
    : s === 'Confirmed' ? 'text-blue-400'
    : s === 'Completed' ? 'text-emerald-400'
    : 'text-red-400';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#1E3A5F] pb-6">
        <h1 className="text-4xl font-bold text-white mb-2 font-sora">Admin Dashboard</h1>
        <p className="text-[#7A8BA8]">Live overview of your bookings, traffic, and content</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-[#0A0E17] border border-[#1E3A5F] animate-pulse" />
            ))
          : kpis.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-6 hover:border-[#00C8FF] transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <p className="text-[#7A8BA8] text-sm font-semibold mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <span className="text-xs text-emerald-400 font-semibold">{stat.sub}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/portfolio" className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 px-6 rounded-lg transition-all text-center">
              + Add Project
            </Link>
            <Link href="/admin/pages" className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white font-bold py-3 px-6 rounded-lg transition-all text-center">
              + Manage Pages
            </Link>
            <Link href="/admin/bookings" className="bg-[#E8B84B] hover:bg-[#D8A83B] text-black font-bold py-3 px-6 rounded-lg transition-all text-center">
              📋 View Bookings
            </Link>
            <Link href="/admin/visitors" className="bg-[#00FF88] hover:bg-[#00E878] text-black font-bold py-3 px-6 rounded-lg transition-all text-center">
              📊 View Analytics
            </Link>
          </div>
        </div>

        {/* Content snapshot */}
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Content</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#1A2332] rounded-lg">
              <span className="text-[#7A8BA8] font-semibold flex items-center gap-2"><FileText size={18} /> Portfolio Items</span>
              <span className="text-[#00C8FF] font-bold">{loading ? '—' : stats?.portfolioCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#1A2332] rounded-lg">
              <span className="text-[#7A8BA8] font-semibold flex items-center gap-2"><BookOpen size={18} /> Pending Bookings</span>
              <span className="text-yellow-400 font-bold">{loading ? '—' : stats?.pendingBookings}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#1A2332] rounded-lg">
              <span className="text-[#7A8BA8] font-semibold flex items-center gap-2"><Activity size={18} /> System</span>
              <span className="text-emerald-400 font-bold">✓ Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-[#00C8FF] text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {loading ? (
          <p className="text-[#7A8BA8]">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-[#7A8BA8]">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-3 hover:bg-[#1A2332] rounded-lg transition">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{b.name} <span className="text-[#7A8BA8] font-normal">· {b.service}</span></p>
                  <p className="text-[#7A8BA8] text-sm flex items-center gap-1"><Clock size={13} /> {new Date(b.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-bold ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
