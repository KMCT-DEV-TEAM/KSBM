"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, Search, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';
import LogoutModal from '../../components/LogoutModal';
import { useNotifications } from '../../context/NotificationContext';

import api from '../../api/axios';

const AdminNavbar = () => {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const searchablePages = [
    { name: 'Dashboard Overview', path: '/admin/dashboard' },
    { name: 'Notifications', path: '/admin/notifications' },
    { name: 'Home Page Management', path: '/admin/cms/home' },
    { name: 'About Us Page', path: '/admin/cms/about-us' },
    { name: 'Advisory Board', path: '/admin/cms/about-us/advisory' },
    { name: 'Governing Body', path: '/admin/cms/about-us/governing' },
    { name: 'Management Desk', path: '/admin/cms/about-us/management-desk' },
    { name: 'Faculty Members', path: '/admin/cms/faculty' },
    { name: 'Alumni Page', path: '/admin/cms/alumni' },
    { name: 'Placement Page', path: '/admin/cms/placement-page' },
    { name: 'Examination Page', path: '/admin/cms/examinations' },
    { name: 'Committees & Cells', path: '/admin/cms/committees-and-cells' },
    { name: 'MBA Program Page', path: '/admin/cms/programs/mba' },
    { name: 'BBA Program Page', path: '/admin/cms/programs/bba' },
    { name: 'Manage Facilities Page', path: '/admin/cms/facilities' },
    { name: 'Manage Facility Details', path: '/admin/cms/facilities-details' },
    { name: 'Manage Admissions Page', path: '/admin/cms/admissions' },
    { name: 'Manage Events Page', path: '/admin/cms/events' },
    { name: 'Manage Blogs Page', path: '/admin/cms/blogs' },
    { name: 'Manage Gallery Page', path: '/admin/cms/gallery' },
    { name: 'Contact Page', path: '/admin/cms/contact-page' },
    { name: 'FAQ Page', path: '/admin/cms/faq' },
    { name: 'Privacy Policy', path: '/admin/cms/privacy-policy' },
    { name: 'Terms & Conditions', path: '/admin/cms/terms-and-conditions' },
    { name: 'Grievance Page', path: '/admin/cms/grievance' },
    { name: 'Download Page', path: '/admin/cms/download' },
    { name: 'Mandatory Disclosure', path: '/admin/cms/mandatory-disclosure' },
    { name: 'View Grievance Tickets', path: '/admin/grievances' },
    { name: 'Contact Form Submissions', path: '/admin/contact-submissions' },
    { name: 'Header & Navbar', path: '/admin/cms/header' },
    { name: 'Footer', path: '/admin/cms/footer' },
  ];

  const filteredPages = searchablePages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.isRead);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      router.push('/admin/login');
    }
  };

  return (
    <>
      <header className="mx-8 mt-6 h-16 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="hidden md:flex items-center gap-2 relative" ref={searchRef}>
            <Search className="w-5 h-5 text-[#697A8D]" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent border-none outline-none text-[15px] text-[#566A7F] placeholder-[#697A8D] w-64"
            />

            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 mt-4 w-[576px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="max-h-80 overflow-y-auto py-2">
                  {filteredPages.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      No pages found matching "{searchQuery}"
                    </div>
                  ) : (
                    filteredPages.map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchFocused(false);
                          router.push(page.path);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#566A7F] hover:bg-primary/5 hover:text-primary transition-colors font-medium flex items-center justify-between"
                      >
                        {page.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative text-[#697A8D] hover:text-primary transition-colors focus:outline-none"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-[#566A7F]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-medium">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    unreadNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          markAsRead(notif._id);
                          setIsDropdownOpen(false);
                          if (notif.link) router.push(notif.link);
                        }}
                        className={`group flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 bg-primary/5`}
                      >
                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${notif.type === 'NEW_GRIEVANCE' ? 'bg-[#FF3E1D]/10 text-[#FF3E1D]' : 'bg-[#03C3EC]/10 text-[#03C3EC]'}`}
                        >
                          {notif.type === 'NEW_GRIEVANCE' ? <AlertTriangle className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 pr-6 relative">
                          <p className={`text-sm text-[#566A7F] font-semibold`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.message}</p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif._id);
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/admin/notifications');
                    }}
                    className="w-full py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default AdminNavbar;

