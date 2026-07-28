"use client";
import React, { useState, useEffect } from 'react';
const logo = '/assets/Images/Header/LOGO__KMCT School of Business Management (1).png';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AboutMegaMenu from './AboutMegaMenu';
import PeopleMegaMenu from './PeopleMegaMenu';
import ProgramsMegaMenu from './ProgramsMegaMenu';

const getSubLinks = (label) => {
  if (!label) return null;
  const lower = label.toLowerCase().trim();
  if (lower === 'about us' || lower === 'about' || lower.includes('about')) {
    return [
      { label: 'Overview', href: '/about' },
      { label: 'Governing Body', href: '/about/governing-body' },
      { label: 'Organogram', href: '/assets/Organogram.pdf' },
      { label: 'Advisory Board', href: '/about/advisory-board' },
      { label: 'Management Desk', href: '/about/management-desk' },
    ];
  }
  if (lower === 'academics' || lower === 'people' || lower === 'faculty' || lower.includes('academics') || lower.includes('people') || lower.includes('faculty')) {
    return [
      { label: 'Faculty', href: '/faculty' },
      { label: 'Alumni', href: '/alumni' },
      { label: 'Placement', href: '/placement' },
      { label: 'Examination', href: '/examinations' },
      { label: 'Committees & Cells', href: '/committees-and-cells' },
    ];
  }
  if (lower === 'programs' || lower === 'program' || lower.includes('program')) {
    return [
      { label: 'MBA (Master of Business Administration)', href: '/programs/mba' },
      { label: 'BBA (Bachelor of Business Administration)', href: '/programs/bba' },
    ];
  }
  return null;
};

const Header = ({ previewData }) => {
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [expandedMobileNav, setExpandedMobileNav] = useState({});

  useEffect(() => {
    if (isMobileMenuOpen) {
      const newExpanded = {};
      if (pathname.startsWith('/about') && pathname !== '/about') {
        newExpanded['About Us'] = true;
        newExpanded['About'] = true;
      } else if (pathname.startsWith('/programs/')) {
        newExpanded['Programs'] = true;
        newExpanded['Program'] = true;
      }
      setExpandedMobileNav(newExpanded);
    } else {
      setExpandedMobileNav({});
    }
  }, [isMobileMenuOpen, pathname]);
  
  let menuTimeout;
  const handleMouseEnter = (label) => {
    clearTimeout(menuTimeout);
    const lower = label.toLowerCase();
    if (lower === 'about us' || lower === 'about') {
      setActiveMegaMenu('about');
    } else if (lower === 'academics' || lower === 'people' || lower === 'faculty' || lower.includes('academics') || lower.includes('people') || lower.includes('faculty')) {
      setActiveMegaMenu('people');
    } else if (lower === 'programs' || lower === 'program' || lower.includes('program')) {
      setActiveMegaMenu('programs');
    } else {
      setActiveMegaMenu(null);
    }
  };

  const handleMouseLeave = () => {
    menuTimeout = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  // CMS States
  const [navItems, setNavItems] = useState([
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about' },
    { label: 'Academics', link: '/faculty' },
    { label: 'Programs', link: '/programs' },
    { label: 'Facility', link: '/facilities' },
    { label: 'Admission', link: '/admissions' },
    { label: 'Events', link: '/events' },
    { label: 'Blogs', link: '/blogs' },
    { label: 'Grievance', link: '/grievance' },
    { label: 'Mandatory Disclosure', link: '/mandatory-disclosure' },
  ]); // Fallback
  const [actionButton, setActionButton] = useState({ text: 'Apply Now', isVisible: true });
  const [logoUrl, setLogoUrl] = useState('');
  const [alignment, setAlignment] = useState('center');

  useEffect(() => {
    if (previewData) {
      setNavItems(previewData.navItems || []);
      if (previewData.navItems?.length > 0 && !activeNav) setActiveNav(previewData.navItems[0].label);
      setActionButton(previewData.actionButton || { text: 'Apply Now', isVisible: true });
      setLogoUrl(previewData.logoUrl || '');
      setAlignment(previewData.alignment || 'center');
    } else {
      const fetchHeaderSettings = async () => {
        try {
          const { data } = await api.get('/cms/header', { hideLoader: true });
          if (data.navItems && data.navItems.length > 0) {
            const formattedNavItems = data.navItems.map(item => {
              const labelLower = item.label.toLowerCase();
              if (labelLower === 'home' || item.link === '#home') return { ...item, link: '/' };
              if (labelLower === 'about us' || labelLower === 'about' || item.link.includes('about')) return { ...item, link: '/about' };
              if (labelLower === 'facilities' || labelLower === 'facility' || item.link.includes('facilities')) return { ...item, link: '/facilities' };
              if (labelLower === 'people' || labelLower === 'faculty' || labelLower === 'academics' || item.link === '#people' || item.link === '#faculty' || item.link.includes('people') || item.link.includes('faculty') || item.link.includes('academics')) return { ...item, link: '/faculty' };
              if (labelLower === 'programs' || labelLower === 'program' || item.link === '#programs' || item.link.includes('programs')) return { ...item, link: '/programs' };
              if (labelLower === 'examinations' || labelLower === 'examination' || item.link === '#examinations' || item.link.includes('examinations')) return { ...item, link: '/examinations' };
              if (labelLower === 'placement' || labelLower === 'placements' || item.link === '#placement' || item.link.includes('placement')) return { ...item, link: '/placement' };
              if (labelLower === 'alumni' || item.link.includes('alumni')) return { ...item, link: '/alumni' };
              if (labelLower === 'admission' || labelLower === 'admissions' || item.link === '#admission' || item.link.includes('admission')) return { ...item, link: '/admissions' };
              if (labelLower === 'events' || item.link === '#events' || item.link.includes('events')) return { ...item, link: '/events' };
              if (labelLower === 'blogs' || labelLower === 'blog' || labelLower === 'insights' || item.link === '#blogs' || item.link === '#blog' || item.link.includes('blog')) return { ...item, link: '/blogs' };
              if (labelLower === 'grievance' || item.link.includes('grievance')) return { ...item, link: '/grievance' };
              if (labelLower === 'mandatory disclosure' || item.link.includes('mandatory')) return { ...item, link: '/mandatory-disclosure' };
              if (labelLower === 'contact' || labelLower === 'contact us' || item.link.includes('contact')) return { ...item, link: '/contact' };
              if (item.link.startsWith('#')) return { ...item, link: '/' + item.link };
              return item;
            });

            // Ensure Blogs navigation item exists in Header
            if (!formattedNavItems.some(item => item.link === '/blogs' || item.label.toLowerCase().includes('blog'))) {
              const eventsIdx = formattedNavItems.findIndex(i => i.link === '/events' || i.label.toLowerCase() === 'events');
              if (eventsIdx !== -1) {
                formattedNavItems.splice(eventsIdx + 1, 0, { label: 'Blogs', link: '/blogs', _id: 'blogs-nav-item' });
              } else {
                formattedNavItems.push({ label: 'Blogs', link: '/blogs', _id: 'blogs-nav-item' });
              }
            }

            setNavItems(formattedNavItems);
            setActiveNav(formattedNavItems[0]?.label || 'Home');
          }
          if (data.actionButton) setActionButton(data.actionButton);
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.alignment) setAlignment(data.alignment);
        } catch (error) {
          console.error('Failed to fetch header settings:', error);
        }
      };
      fetchHeaderSettings();
    }

    // Listener for iframe preview messages
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-header-data') {
        const payload = event.data.payload;
        if (payload.navItems) setNavItems(payload.navItems);
        if (payload.actionButton) setActionButton(payload.actionButton);
        if (payload.logoUrl) setLogoUrl(payload.logoUrl);
        if (payload.alignment) setAlignment(payload.alignment);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [previewData]);

  // Sync activeNav with URL pathname for page navigations
  useEffect(() => {
    if (navItems.length > 0) {
      // Find exact match first
      let activeItem = navItems.find(item => item.link === pathname);
      
      // If no exact match, check for partial match (e.g. /about/governing-body)
      if (!activeItem) {
        activeItem = navItems.find(item => item.link !== '/' && pathname.startsWith(item.link));
      }

      if (activeItem) {
        setActiveNav(activeItem.label);
      } else if (pathname === '/') {
        setActiveNav('Home');
      }
    }
  }, [pathname, navItems]);

  useEffect(() => {

    const handleScroll = () => {
      const scrollThreshold = Math.min(window.innerHeight * 0.85, 750) - 80;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preview Mode Overrides (to bypass actual viewport media queries)
  const isPreviewMobile = previewData?.previewDevice === 'mobile' || previewData?.previewDevice === 'tablet';
  const isPreviewDesktop = previewData?.previewDevice === 'desktop';

  const getAlignmentClass = () => {
    if (isPreviewMobile) return 'flex-1 justify-end';
    if (isPreviewDesktop) {
      switch (alignment) {
        case 'left': return 'flex-1 justify-start pl-8';
        case 'center': return 'flex-1 justify-center';
        case 'right': default: return 'flex-1 justify-end';
      }
    }
    // Real responsive behavior
    switch (alignment) {
      case 'left': return 'flex-1 justify-end lg:justify-start lg:pl-8';
      case 'center': return 'flex-1 justify-end lg:justify-center';
      case 'right': default: return 'flex-1 justify-end';
    }
  };

  const desktopClass = isPreviewMobile ? 'hidden' : isPreviewDesktop ? 'flex' : 'hidden lg:flex';
  const mobileToggleClass = isPreviewDesktop ? 'hidden' : isPreviewMobile ? 'flex' : 'flex lg:hidden';
  const mobileDropdownClass = isPreviewDesktop ? 'hidden' : isPreviewMobile ? '' : 'lg:hidden';

  const isEventsPage = pathname === '/events';

  const headerBgClass = isEventsPage 
    ? `bg-white/10 backdrop-blur-md border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)] ${isScrolled ? 'bg-white/20 border-white/30' : ''}`
    : `bg-white border-gray-200 ${isScrolled ? 'border-transparent shadow-lg' : 'shadow-sm'}`;

  const getNavTextClass = (isActive) => {
    if (isEventsPage) {
      return isActive
        ? 'text-white font-semibold relative after:content-[""] after:absolute after:-bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-white after:rounded-sm'
        : 'text-white/80 font-medium hover:text-white';
    }
    return isActive
      ? 'text-primary font-semibold relative after:content-[""] after:absolute after:-bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-primary after:rounded-sm'
      : 'text-gray-600 font-medium hover:text-primary';
  };

  return (
    <header className={`w-[98%] max-w-[1440px] fixed left-0 right-0 mx-auto mt-2 lg:mt-3 rounded-2xl z-[100] transition-all duration-300 border ${headerBgClass}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-[5px] min-h-[70px] sm:min-h-[78px]">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center no-underline shrink-0">
          <img 
            src={logoUrl || logo} 
            alt="KSBM Logo" 
            className={`h-5 sm:h-6 lg:h-7 object-contain transition-all duration-300 ${isEventsPage ? 'brightness-0 invert' : ''}`} 
          />
        </Link>

        {/* Right Section: Nav & Button */}
        <div className={`flex items-center gap-4 xl:gap-8 ${getAlignmentClass()}`}>
          
          {/* Navigation Section */}
          <nav className={`${desktopClass} items-center`}>
            <ul className="flex items-center list-none gap-2.5 xl:gap-4 m-0 p-0">
              {navItems.filter(item => item.isVisible !== false).map((item, idx) => (
                <li 
                  key={idx} 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {getSubLinks(item.label) ? (
                    <span
                      className={`cursor-pointer text-[13.5px] py-2 transition-colors duration-300 inline-block ${getNavTextClass(activeNav === item.label)}`}
                      onClick={() => setActiveNav(item.label)}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.link}
                      className={`no-underline text-[13.5px] py-2 transition-colors duration-300 inline-block ${getNavTextClass(activeNav === item.label)}`}
                      onClick={() => setActiveNav(item.label)}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Mega Menu Injection */}
                  {(item.label.toLowerCase() === 'about us' || item.label.toLowerCase() === 'about') && (
                    <AboutMegaMenu 
                      isOpen={activeMegaMenu === 'about'} 
                      onMouseEnter={() => handleMouseEnter('about')} 
                      onMouseLeave={handleMouseLeave} 
                    />
                  )}

                  {(item.label.toLowerCase() === 'academics' || item.label.toLowerCase() === 'people' || item.label.toLowerCase() === 'faculty' || item.label.toLowerCase().includes('academics') || item.label.toLowerCase().includes('people') || item.label.toLowerCase().includes('faculty')) && (
                    <PeopleMegaMenu 
                      isOpen={activeMegaMenu === 'people'} 
                      onMouseEnter={() => handleMouseEnter('people')} 
                      onMouseLeave={handleMouseLeave} 
                    />
                  )}

                  {(item.label.toLowerCase() === 'programs' || item.label.toLowerCase() === 'program' || item.label.toLowerCase().includes('program')) && (
                    <ProgramsMegaMenu 
                      isOpen={activeMegaMenu === 'programs'} 
                      onMouseEnter={() => handleMouseEnter('programs')} 
                      onMouseLeave={handleMouseLeave} 
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Button */}
          {actionButton.isVisible && (
            <div className={`${desktopClass} items-center`}>
              <button className="bg-primary text-white hover:bg-[#1e2869] border-none rounded-full py-2 px-5 text-[13.5px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(0,0,0,0.15)] shadow-[0_4px_10px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
                {actionButton.text}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className={`${mobileToggleClass} items-center ml-2`}>
            <button
              onClick={() => {
                if (isMobileMenuOpen) {
                  setExpandedMobileNav({});
                }
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`p-2 rounded-md ${isEventsPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`${mobileDropdownClass} absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col py-4 px-6 z-50 max-h-[calc(100vh-110px)] overflow-y-auto overscroll-contain origin-top`}
          >
            <ul className="flex flex-col gap-4 list-none m-0 p-0">
              {navItems.filter(item => item.isVisible !== false).map((item, idx) => {
                const subLinks = getSubLinks(item.label);
                const hasSubs = Boolean(subLinks && subLinks.length > 0);
                const isExpanded = Boolean(expandedMobileNav[item.label]);

                return (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03, ease: "easeOut" }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between w-full">
                      {hasSubs ? (
                        <span
                          className={`block text-base font-medium py-1 flex-1 transition-colors cursor-pointer ${
                            activeNav === item.label ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'
                          }`}
                          onClick={() => {
                            setActiveNav(item.label);
                            setExpandedMobileNav(prev => ({
                              ...prev,
                              [item.label]: !prev[item.label]
                            }));
                          }}
                        >
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={item.link}
                          className={`block no-underline text-base font-medium py-1 flex-1 transition-colors ${
                            activeNav === item.label ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'
                          }`}
                          onClick={() => {
                            setActiveNav(item.label);
                            setIsMobileMenuOpen(false);
                            setExpandedMobileNav({});
                          }}
                        >
                          {item.label}
                        </Link>
                      )}
                      {hasSubs && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedMobileNav(prev => ({
                              ...prev,
                              [item.label]: !prev[item.label]
                            }));
                          }}
                          className="p-2 ml-2 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center justify-center"
                          >
                            <ChevronDown size={20} className={isExpanded ? "text-primary" : "text-slate-500"} />
                          </motion.span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {hasSubs && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 mt-1.5 flex flex-col gap-2 border-l-2 border-primary/20 ml-2 py-1">
                            {subLinks.map((sub, sIdx) => (
                              <motion.div
                                key={sIdx}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: sIdx * 0.03 + 0.05 }}
                              >
                                <Link
                                  href={sub.href}
                                  className="text-sm text-slate-700 hover:text-primary font-medium py-1.5 flex items-center justify-between transition-colors block"
                                  onClick={() => {
                                    setActiveNav(item.label);
                                    setIsMobileMenuOpen(false);
                                    setExpandedMobileNav({});
                                  }}
                                >
                                  <span>{sub.label}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
              {actionButton.isVisible && (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: (navItems.length || 5) * 0.03, ease: "easeOut" }}
                  className="pt-4 border-t border-gray-100"
                >
                  <button className="w-full bg-primary text-white rounded-full py-3 text-[14px] font-semibold cursor-pointer shadow-md hover:bg-[#1e2869] transition-all">
                    {actionButton.text}
                  </button>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

