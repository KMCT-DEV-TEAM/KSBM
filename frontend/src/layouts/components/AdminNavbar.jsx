import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens)
    navigate('/admin/login');
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        {/* Search Bar Placeholder */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none outline-none text-sm w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-[#1a237e] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-6 bg-gray-200"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
