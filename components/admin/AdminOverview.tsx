'use client';

import { BarChart3, Users, FileText, Settings } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { label: 'Total Projects', value: '12', icon: FileText, color: '#00C8FF' },
    { label: 'Website Pages', value: '8', icon: BarChart3, color: '#7B2FFF' },
    { label: 'Total Bookings', value: '47', icon: Users, color: '#E8B84B' },
    { label: 'Active Users', value: '3', icon: Settings, color: '#00FF88' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome to your MuleSoo admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6 hover:border-[#00C8FF] transition-all">
              <div className="flex items-center justify-between mb-4">
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 px-6 rounded-lg transition-all">+ Add Project</button>
          <button className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white font-bold py-3 px-6 rounded-lg transition-all">+ New Page</button>
          <button className="bg-[#E8B84B] hover:bg-[#D8A83B] text-black font-bold py-3 px-6 rounded-lg transition-all">View Bookings</button>
          <button className="bg-[#00FF88] hover:bg-[#00E878] text-black font-bold py-3 px-6 rounded-lg transition-all">Export Data</button>
        </div>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">✓ Last login: Today at 18:53 GMT+0200</p>
          <p className="text-gray-400 text-sm">✓ Session: Secure (24 hours)</p>
          <p className="text-gray-400 text-sm">✓ 2FA Status: Enabled</p>
          <p className="text-gray-400 text-sm">✓ Audit Logging: Active</p>
        </div>
      </div>
    </div>
  );
}
