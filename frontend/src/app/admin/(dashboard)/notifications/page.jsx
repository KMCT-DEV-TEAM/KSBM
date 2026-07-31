"use client";
import React, { useState } from 'react';
import { useNotifications } from '../../../../context/NotificationContext';
import { Bell, CheckCircle2, AlertTriangle, MessageSquare, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();
  
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [search, setSearch] = useState('');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.isRead) return false;
    if (filter === 'read' && !notif.isRead) return false;
    if (search && !notif.title.toLowerCase().includes(search.toLowerCase()) && !notif.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)]">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage all your system alerts and incoming requests</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${unreadCount > 0 ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters and List Section */}
      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-2 w-full sm:w-auto">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
                  ${filter === f ? 'bg-primary text-white shadow-sm' : 'bg-white text-[#697A8D] border border-gray-200 hover:bg-gray-50'}
                `}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100 min-h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-[#566A7F]">No notifications found</h3>
              <p className="text-[#697A8D] text-sm mt-1 max-w-sm">
                {search ? 'Try adjusting your search terms or filters.' : "You're all caught up! There are no notifications to display."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-5 flex flex-col sm:flex-row gap-4 items-start transition-colors
                  ${notif.isRead ? 'bg-white opacity-80' : 'bg-[#f8f9fc] border-l-4 border-l-primary'}
                `}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1
                  ${notif.type === 'NEW_GRIEVANCE' ? 'bg-[#FF3E1D]/10 text-[#FF3E1D]' : 'bg-[#03C3EC]/10 text-[#03C3EC]'}`}
                >
                  {notif.type === 'NEW_GRIEVANCE' ? <AlertTriangle className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 className={`text-base ${notif.isRead ? 'text-[#697A8D]' : 'text-[#566A7F] font-bold'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{notif.message}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto shrink-0">
                  {!notif.isRead && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif._id);
                      }}
                      className="px-3 py-1.5 text-sm font-semibold text-[#697A8D] hover:text-primary transition-colors flex-1 sm:flex-none text-center"
                    >
                      Mark Read
                    </button>
                  )}
                  {notif.link && (
                    <button 
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif._id);
                        router.push(notif.link);
                      }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex-1 sm:flex-none"
                    >
                      View Request
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
