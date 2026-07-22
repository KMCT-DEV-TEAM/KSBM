"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Settings,
  MonitorPlay, Type, Image, BookOpen,
  Award, Building2, Briefcase, Handshake,
  MessageSquare, Star, Newspaper, Heart, PanelBottom,
  ChevronDown, ChevronRight, Home, Info, Globe, GraduationCap
} from 'lucide-react';
const logo = '/assets/Images/LOGO__KMCT School of Business Management (1).png';

const Sidebar = () => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState('Home');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const mainLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const cmsSections = [
    {
      title: 'Global Content',
      icon: <Globe className="w-5 h-5" />,
      links: [
        { name: 'Header & Navbar', path: '/admin/cms/header' },
        { name: 'Footer', path: '/admin/cms/footer' },
      ]
    },
    {
      title: 'Home',
      icon: <Home className="w-5 h-5" />,
      links: [
        { name: 'Home Page Management', path: '/admin/cms/home' },
      ]
    },
    {
      title: 'Programs (MBA/BBA)',
      icon: <GraduationCap className="w-5 h-5" />,
      links: [
        { name: 'MBA Program Page', path: '/admin/cms/programs/mba' },
        { name: 'BBA Program Page', path: '/admin/cms/programs/bba' },
      ]
    },
    {
      title: 'Examinations',
      icon: <BookOpen className="w-5 h-5" />,
      links: [
        { name: 'Manage Examinations Page', path: '/admin/cms/examinations' },
      ]
    },
    {
      title: 'Admissions',
      icon: <Award className="w-5 h-5" />,
      links: [
        { name: 'Manage Admissions Page', path: '/admin/cms/admissions' },
      ]
    },
    {
      title: 'About Us',
      icon: <Info className="w-5 h-5" />,
      links: [
        { name: 'Hero Section', path: '/admin/cms/about-us/hero' },
        { name: 'Vision & Mission', path: '/admin/cms/about-us/vision' },
        { name: 'Leadership', path: '/admin/cms/about-us/leadership' },
        { name: 'Legacy', path: '/admin/cms/about-us/legacy' },
        { name: 'Stats', path: '/admin/cms/about-us/stats' },
        { name: 'Advisory Board', path: '/admin/cms/about-us/advisory' },
        { name: 'Governing Body', path: '/admin/cms/about-us/governing' },
        { name: 'Management Desk', path: '/admin/cms/about-us/management-desk' },
        { name: 'Faculty Members', path: '/admin/cms/faculty' },
        { name: 'Apply CTA', path: '/admin/cms/about-us/cta' },
      ]
    },
    {
      title: 'Faculty',
      icon: <Users className="w-5 h-5" />,
      links: [
        { name: 'Faculty Members', path: '/admin/cms/faculty' },
        { name: 'Alumni Page Management', path: '/admin/cms/alumni' },
      ]
    },
    {
      title: 'Facilities',
      icon: <Building2 className="w-5 h-5" />,
      links: [
        { name: 'Hero Section', path: '/admin/cms/facilities/hero' },
        { name: 'Institutional Resources', path: '/admin/cms/facilities/institutional-resources' },
        { name: 'Clubs', path: '/admin/cms/facilities/clubs' },
      ]
    }
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
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${pathname === link.path
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-[#697A8D] hover:bg-gray-50'
                  }`}
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Website CMS */}
        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Website Content</p>
          <div className="space-y-1">
            {cmsSections.map((section) => {
              const isActiveSection = section.links.some(link => pathname.startsWith(link.path));
              const isOpen = openSection === section.title;

              return (
                <div key={section.title} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${isActiveSection && !isOpen
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-[#697A8D] hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActiveSection ? 'text-primary' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pl-11 pr-2 space-y-1 py-1">
                      {section.links.map((link) => (
                        <Link
                          key={link.path}
                          href={link.path}
                          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${pathname === link.path
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-[#697A8D] hover:bg-gray-50'
                            }`}
                        >
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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

