"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, Building2, TrendingUp, MoreVertical, AlertTriangle, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../../api/axios';

const DashboardOverview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [grievances, setGrievances] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [grievanceRes, contactRes] = await Promise.all([
          api.get('/grievances'),
          api.get('/contact')
        ]);
        setGrievances(grievanceRes.data || []);
        setContacts(contactRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Compute Stats
  const totalGrievances = grievances.length;
  const pendingGrievances = grievances.filter(g => g.status === 'Pending').length;
  
  const totalContacts = contacts.length;
  const pendingContacts = contacts.filter(c => c.status === 'New' || c.status === 'Read').length;

  const stats = [
    { label: 'Total Grievances', value: totalGrievances, icon: <AlertTriangle className="w-5 h-5 text-[#FF3E1D]" />, bg: 'bg-[#FF3E1D]/10', trend: '' },
    { label: 'Pending Grievances', value: pendingGrievances, icon: <Clock className="w-5 h-5 text-[#FFAB00]" />, bg: 'bg-[#FFAB00]/10', trend: '' },
    { label: 'Total Enquiries', value: totalContacts, icon: <MessageSquare className="w-5 h-5 text-[#03C3EC]" />, bg: 'bg-[#03C3EC]/10', trend: '' },
    { label: 'Pending Enquiries', value: pendingContacts, icon: <Clock className="w-5 h-5 text-[#FFAB00]" />, bg: 'bg-[#FFAB00]/10', trend: '' },
  ];

  // Combine and sort for recent activity
  const recentActivity = [
    ...grievances.map(g => ({ ...g, type: 'grievance', dateObj: new Date(g.createdAt) })),
    ...contacts.map(c => ({ ...c, type: 'contact', dateObj: new Date(c.createdAt) }))
  ]
    .sort((a, b) => b.dateObj - a.dateObj)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#566A7F]">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="z-10 w-2/3">
            <h3 className="text-xl font-bold text-primary mb-2">Welcome Back, Admin! 👋</h3>
            <p className="text-sm text-[#697A8D] mb-4 leading-relaxed">
              You currently have <span className="font-bold text-[#FFAB00]">{pendingGrievances + pendingContacts}</span> items awaiting your review.
            </p>
          </div>
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
              </div>
              <p className="text-sm font-semibold text-[#697A8D] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#566A7F]">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-[#566A7F]">Recent Activity</h3>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
              Latest {recentActivity.length} Items
            </span>
          </div>
          
          <div className="flex-1 space-y-4">
            {recentActivity.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No recent activity to display.
              </div>
            ) : (
              recentActivity.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => router.push(item.type === 'grievance' ? '/admin/grievances' : '/admin/contact-submissions')}
                  className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1
                    ${item.type === 'grievance' ? 'bg-[#FF3E1D]/10 text-[#FF3E1D]' : 'bg-[#03C3EC]/10 text-[#03C3EC]'}`}
                  >
                    {item.type === 'grievance' ? <AlertTriangle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-[#566A7F]">
                        {item.type === 'grievance' ? `Grievance: ${item.grievanceType || item.department}` : 'New Contact Enquiry'}
                      </p>
                      <span className="text-xs text-gray-400">{item.dateObj.toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#697A8D] mt-1 line-clamp-1">
                      From: {item.name} ({item.email || item.phone})
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.message || item.description || "No description provided."}
                    </p>
                  </div>
                  <div className="shrink-0 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                      ${(item.status === 'Pending' || item.status === 'New') ? 'bg-[#FFAB00]/10 text-[#FFAB00]' : 
                        item.status === 'Resolved' ? 'bg-[#71DD37]/10 text-[#71DD37]' : 
                        'bg-gray-100 text-gray-600'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Small Stats Grid Continued */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {stats.slice(2, 4).map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#697A8D] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#566A7F]">{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;

