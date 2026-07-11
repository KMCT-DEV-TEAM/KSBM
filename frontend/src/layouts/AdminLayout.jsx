"use client";
import React from 'react';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#F5F5F9] overflow-hidden font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Dynamic Page Content (Children Area) */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;

