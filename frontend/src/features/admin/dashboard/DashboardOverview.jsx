import React from 'react';
import { Users, BookOpen, Building2, TrendingUp } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    { label: 'Total Students', value: '1,248', icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
    { label: 'Active Programs', value: '24', icon: <BookOpen className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
    { label: 'Campus Facilities', value: '12', icon: <Building2 className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100' },
    { label: 'Avg Attendance', value: '94%', icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts or tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Enrollment Trends</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#1a237e]"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">New application received</p>
                  <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
