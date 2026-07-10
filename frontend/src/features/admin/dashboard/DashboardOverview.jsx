import React from 'react';
import { Users, BookOpen, Building2, TrendingUp, MoreVertical, CreditCard, DollarSign } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    { label: 'Students', value: '1,248', icon: <Users className="w-5 h-5 text-[#71DD37]" />, bg: 'bg-[#71DD37]/10', trend: '+28.14%' },
    { label: 'Programs', value: '24', icon: <BookOpen className="w-5 h-5 text-[#03C3EC]" />, bg: 'bg-[#03C3EC]/10', trend: '+4.5%' },
    { label: 'Facilities', value: '12', icon: <Building2 className="w-5 h-5 text-[#FF3E1D]" />, bg: 'bg-[#FF3E1D]/10', trend: '-2.1%' },
    { label: 'Attendance', value: '94%', icon: <TrendingUp className="w-5 h-5 text-[#FFAB00]" />, bg: 'bg-[#FFAB00]/10', trend: '+1.2%' },
  ];

  return (
    <div className="space-y-6 text-[#566A7F]">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="z-10 w-2/3">
            <h3 className="text-xl font-bold text-primary mb-2">Congratulations Admin! 🎉</h3>
            <p className="text-sm text-[#697A8D] mb-4 leading-relaxed">
              You have resolved 72% more inquiries today. Check your new badge in your profile.
            </p>
            <button className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors">
              View Badges
            </button>
          </div>
          {/* Abstract illustration placeholder on the right */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary fill-current">
              <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46C87.4,-32.9,90,-16.5,88.5,-0.9C87,14.7,81.4,29.4,73.6,42.2C65.8,55,55.8,65.9,43.4,73.4C31,80.9,15.5,85,-0.6,86C-16.7,87,-33.4,84.9,-46.8,76.9C-60.2,68.9,-70.3,55,-77.4,39.8C-84.5,24.6,-88.6,8.1,-87.3,-7.9C-86,-23.9,-79.3,-39.4,-68.8,-50.8C-58.3,-62.2,-44,-69.5,-30.2,-76.3C-16.4,-83.1,-3.1,-89.4,10.6,-91.3C24.3,-93.2,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>

        {/* Small Stats Grid (2x2) */}
        <div className="grid grid-cols-2 gap-6">
          {stats.slice(0, 2).map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <button className="text-[#697A8D] hover:text-primary">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-[#697A8D] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#566A7F]">{stat.value}</h3>
              <p className={`text-xs mt-1 font-semibold ${stat.trend.startsWith('+') ? 'text-[#71DD37]' : 'text-[#FF3E1D]'}`}>
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#566A7F]">Enrollment Revenue</h3>
            <button className="text-[#697A8D] hover:text-primary">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-100 rounded-xl bg-[#F5F5F9]/50 flex items-center justify-center text-[#697A8D]">
            Bar Chart Visualization
          </div>
        </div>

        {/* Small Stats Grid Continued & Transactions */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {stats.slice(2, 4).map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    {stat.icon}
                  </div>
                  <button className="text-[#697A8D] hover:text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-[#697A8D] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#566A7F]">{stat.value}</h3>
                <p className={`text-xs mt-1 font-semibold ${stat.trend.startsWith('+') ? 'text-[#71DD37]' : 'text-[#FF3E1D]'}`}>
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#566A7F]">Recent Activity</h3>
              <button className="text-[#697A8D] hover:text-primary">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#566A7F]">New Fee Payment</p>
                    <p className="text-xs text-[#697A8D]">B.Tech Program</p>
                  </div>
                  <p className="text-sm font-semibold text-[#71DD37]">+$82.60</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
