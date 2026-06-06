'use client';

import { TrendingUp, Users, FileText, Zap, Activity, AlertCircle } from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#1E3A5F] pb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor your website performance and manage operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FileText, label: 'Portfolio Projects', value: '12', change: '+2 this month', color: 'from-blue-600 to-cyan-500' },
          { icon: Users, label: 'Total Bookings', value: '47', change: '+8 this week', color: 'from-purple-600 to-pink-500' },
          { icon: Zap, label: 'Website Pages', value: '8', change: 'All published', color: 'from-amber-600 to-orange-500' },
          { icon: Activity, label: 'System Status', value: '✓ Online', change: '99.9% uptime', color: 'from-emerald-600 to-teal-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-6 hover:border-[#00C8FF] hover:shadow-lg hover:shadow-[#00C8FF]/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-xl transition-opacity" style={{ backgroundImage: `linear-gradient(to right, rgb(0, 200, 255), rgb(123, 47, 255))` }}></div>
              <div className="relative">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
                <p className="text-gray-400 text-sm font-semibold mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <span className="text-xs text-emerald-400 font-semibold">{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={24} className="text-[#00C8FF]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: '+ Add New Project', color: 'bg-[#00C8FF] hover:bg-[#00B3E6]', textColor: 'text-black' },
              { label: '+ Create New Page', color: 'bg-[#7B2FFF] hover:bg-[#6B1FEF]', textColor: 'text-white' },
              { label: '📊 View Analytics', color: 'bg-[#E8B84B] hover:bg-[#D8A83B]', textColor: 'text-black' },
              { label: '📥 Export Data', color: 'bg-[#00FF88] hover:bg-[#00E878]', textColor: 'text-black' },
            ].map((action, i) => (
              <button key={i} className={`${action.color} ${action.textColor} font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg`}>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertCircle size={24} className="text-[#00FF88]" />
            System Status
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Database', status: '✓ Connected', color: 'text-emerald-400' },
              { label: 'API Server', status: '✓ Running', color: 'text-emerald-400' },
              { label: 'Email Service', status: '✓ Active', color: 'text-emerald-400' },
              { label: 'Storage', status: '✓ 45% Used', color: 'text-emerald-400' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#1A2332] rounded-lg">
                <span className="text-gray-400 font-semibold">{item.label}</span>
                <span className={`${item.color} font-bold`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { icon: '✓', action: 'Admin logged in successfully', time: '5 minutes ago', color: 'text-emerald-400' },
            { icon: '✓', action: '2FA authentication verified', time: '5 minutes ago', color: 'text-blue-400' },
            { icon: '✓', action: 'Session established - 24 hours', time: '5 minutes ago', color: 'text-amber-400' },
            { icon: '✓', action: 'Audit logging enabled', time: '5 minutes ago', color: 'text-purple-400' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#1A2332] rounded-lg transition">
              <span className={`${activity.color} text-lg font-bold`}>{activity.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold">{activity.action}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
