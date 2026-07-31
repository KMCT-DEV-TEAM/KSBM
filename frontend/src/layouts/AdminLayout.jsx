"use client";
import React from 'react';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import { NotificationProvider } from '../context/NotificationContext';

const AdminLayout = ({ children }) => {
  return (
    <NotificationProvider>
      <div className="fixed inset-0 flex w-full bg-[#F5F5F9] overflow-hidden font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Dynamic Page Content (Children Area) */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
        
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;

