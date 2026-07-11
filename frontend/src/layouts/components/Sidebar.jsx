import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, 
  MonitorPlay, Type, Image, BookOpen, 
  Award, Building2, Briefcase, Handshake, 
  MessageSquare, Star, Newspaper, Heart, PanelBottom
} from 'lucide-react';
import logo from '../../assets/Images/LOGO__KMCT School of Business Management (1).png';

const Sidebar = () => {
  const mainLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const cmsLinks = [
    { name: 'Header & Navbar', path: '/admin/cms/header', icon: <Type className="w-5 h-5" /> },
    { name: 'Hero Section', path: '/admin/cms/hero', icon: <MonitorPlay className="w-5 h-5" /> },
    { name: 'About KSBM', path: '/admin/cms/about', icon: <Image className="w-5 h-5" /> },
    { name: 'Academic Programs', path: '/admin/cms/academics', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Accreditation', path: '/admin/cms/accreditation', icon: <Award className="w-5 h-5" /> },
    { name: 'Management', path: '/admin/cms/management', icon: <Users className="w-5 h-5" /> },
    { name: 'Facilities', path: '/admin/cms/facilities', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Placement', path: '/admin/cms/placement', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Recruiters', path: '/admin/cms/recruiters', icon: <Handshake className="w-5 h-5" /> },
    { name: 'Testimonials', path: '/admin/cms/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Achievements', path: '/admin/cms/achievements', icon: <Star className="w-5 h-5" /> },
    { name: 'News', path: '/admin/cms/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Life at KSBM', path: '/admin/cms/life', icon: <Heart className="w-5 h-5" /> },
    { name: 'Footer', path: '/admin/cms/footer', icon: <PanelBottom className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white flex flex-col h-full hidden lg:flex shrink-0 border-r border-gray-100 shadow-sm z-10">
      <div className="px-6 py-5 shrink-0 flex items-center justify-center border-b border-gray-50">
        <img src={logo} alt="KSBM Logo" className="h-10 object-contain" />
      </div>
      
      {/* Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
        
        {/* Core Settings */}
        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Core</p>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-[#697A8D] hover:bg-gray-50'
                  }`
                }
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Website CMS */}
        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Website Content</p>
          <div className="space-y-1">
            {cmsLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-[#697A8D] hover:bg-gray-50'
                  }`
                }
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

      </nav>

      <div className="p-6 shrink-0 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-[#566A7F]">Admin User</p>
            <p className="text-xs text-gray-400">admin@ksbm.ac.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
