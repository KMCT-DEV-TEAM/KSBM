import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Dynamic Page Content (Outlet Area) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;
