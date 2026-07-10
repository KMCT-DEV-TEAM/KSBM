import React, { useState, useEffect } from 'react';
import logo from '../assets/Images/LOGO__KMCT School of Business Management (1).png';
import { Menu, X } from 'lucide-react';
import api from '../api/axios';

const Header = ({ previewData }) => {
  const [activeNav, setActiveNav] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // CMS States
  const [navItems, setNavItems] = useState([
    { label: 'Home', link: '#home' },
    { label: 'About Us', link: '#about-us' },
    { label: 'Campus', link: '#campus' },
    { label: 'Programs', link: '#programs' },
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
          const { data } = await api.get('/cms/header');
          if (data.navItems && data.navItems.length > 0) {
            setNavItems(data.navItems);
            setActiveNav(data.navItems[0].label);
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

  return (
    <header className={`w-[98%] max-w-[1440px] fixed left-0 right-0 mx-auto mt-2 lg:mt-3 rounded-2xl z-50 transition-all duration-300 border ${isScrolled ? 'bg-primary border-transparent shadow-lg' : 'bg-white/20 border-white/30 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)]'}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        
        {/* Logo Section */}
        <a href="/" className="flex items-center no-underline shrink-0">
          <img 
            src={logoUrl || logo} 
            alt="KSBM Logo" 
            className="h-5 sm:h-6 lg:h-8 object-contain transition-all duration-300 brightness-0 invert" 
          />
        </a>

        {/* Right Section: Nav & Button */}
        <div className={`flex items-center gap-4 xl:gap-8 ${getAlignmentClass()}`}>
          
          {/* Navigation Section */}
          <nav className={`${desktopClass} items-center`}>
            <ul className="flex items-center list-none gap-3 xl:gap-5 m-0 p-0">
              {navItems.map((item, idx) => (
                <li key={idx} className="relative">
                  <a
                    href={item.link}
                    className={`no-underline text-sm py-2 transition-colors duration-300 inline-block hover:text-white ${activeNav === item.label
                      ? 'text-white font-semibold relative after:content-[""] after:absolute after:-bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[1px] after:bg-white after:rounded-sm'
                      : 'text-gray-200 font-medium'
                      }`}
                    onClick={() => setActiveNav(item.label)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Button */}
          {actionButton.isVisible && (
            <div className={`${desktopClass} items-center`}>
              <button className={`${isScrolled ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-[#1e2869]'} border-none rounded-full py-2 px-5 text-[14px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(0,0,0,0.15)] shadow-[0_4px_10px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-[0_2px_6px_rgba(0,0,0,0.1)]`}>
                {actionButton.text}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className={`${mobileToggleClass} items-center ml-2`}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={`${mobileDropdownClass} absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col py-4 px-6 z-50`}>
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  className={`block no-underline text-base font-medium ${activeNav === item.label ? 'text-primary font-bold' : 'text-slate-600'
                    }`}
                  onClick={() => {
                    setActiveNav(item.label);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {actionButton.isVisible && (
              <li className="pt-4 border-t border-gray-100">
                <button className="w-full bg-primary text-white rounded-full py-3 text-[14px] font-semibold cursor-pointer">
                  {actionButton.text}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
