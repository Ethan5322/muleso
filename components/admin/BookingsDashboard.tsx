'use client';

import { Mail, Phone, CheckCircle, Clock } from 'lucide-react';

const bookings = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+27123456789', service: 'Website Design', status: 'New', date: '2026-06-06' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+27987654321', service: 'AI Chatbot', status: 'Viewed', date: '2026-06-05' },
  { id: 3, name: 'Mike Williams', email: 'mike@example.com', phone: '+27555666777', service: 'Logo Design', status: 'Contacted', date: '2026-06-04' },
];

export default function BookingsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Customer Bookings</h2>
        <p className="text-gray-400">View and manage customer inquiries</p>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2332]">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Name</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Service</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Status</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Date</th>
              <th className="text-center px-6 py-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-semibold">{booking.name}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Mail size={14} /> {booking.email}</span>
                      <span className="flex items-center gap-1"><Phone size={14} /> {booking.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{booking.service}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'New' ? 'bg-blue-600/20 text-blue-400' :
                    booking.status === 'Viewed' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-green-600/20 text-green-400'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{booking.date}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black px-3 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle size={16} /> Mark Contacted
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Booking Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Inquiries</span>
              <span className="text-white font-bold">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">New Bookings</span>
              <span className="text-blue-400 font-bold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contacted</span>
              <span className="text-green-400 font-bold">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="text-yellow-400 font-bold">59.6%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <button className="w-full bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2 px-4 rounded-lg mb-2">
            Export All Bookings (CSV)
          </button>
          <button className="w-full bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white font-bold py-2 px-4 rounded-lg">
            Send Mass Email
          </button>
        </div>
      </div>
    </div>
  );
}
