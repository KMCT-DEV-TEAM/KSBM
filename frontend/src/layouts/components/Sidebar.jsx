import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, GraduationCap, Building } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Academics', path: '/admin/academics', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Facilities', path: '/admin/facilities', icon: <Building className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#1a237e] text-white flex flex-col h-full hidden lg:flex shrink-0">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold tracking-tight">KSBM Admin</h2>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white font-semibold shadow-inner' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-gray-400">admin@ksbm.ac.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
