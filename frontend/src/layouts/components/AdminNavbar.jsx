import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';
import LogoutModal from '../../components/LogoutModal';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/admin/login');
  };

  return (
    <>
      <header className="mx-8 mt-6 h-16 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          {/* Search Bar Placeholder */}
          <div className="hidden md:flex items-center gap-2">
            <Search className="w-5 h-5 text-[#697A8D]" />
            <input 
              type="text" 
              placeholder="Search (Ctrl+/)" 
              className="bg-transparent border-none outline-none text-[15px] text-[#566A7F] placeholder-[#697A8D] w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-[#697A8D] hover:text-primary transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

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
