import React, { useState, useEffect } from 'react'
import logo from '../assets/Images/LOGO__KMCT School of Business Management (1).png'

const Header = () => {
  const [activeNav, setActiveNav] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change color when scrolled past the Hero section (which is min-h-[85vh] or 750px)
      // We'll use 85vh minus header height as a solid threshold
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

  const navItems = [
    'Home',
    'About Us',
    'Campus',
    'People',
    'Placement',
    'Programs',
    'Events',
    'Admission',
    'Examinations',
  ];

  return (
    <header className={`w-full shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-primary' : 'bg-background'}`}>
      <div className="flex items-center justify-between max-w-[1440px] mx-auto px-4 lg:px-8 h-20">
        {/* Logo Section */}
        <a href="/" className="flex items-center no-underline bg-white/80 p-1 rounded-md backdrop-blur-sm">
          <img src={logo} alt="KSBM Logo" className="h-6 lg:h-8 object-contain" />
        </a>

        {/* Right Section: Nav & Button */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Navigation Section */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center list-none gap-3 xl:gap-5 m-0 p-0">
              {navItems.map((item) => (
                <li key={item} className="relative">
                  <a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className={`no-underline text-sm py-2 transition-colors duration-300 inline-block ${
                      isScrolled ? 'hover:text-secondary' : 'hover:text-primary'
                    } ${activeNav === item
                      ? (isScrolled 
                          ? 'text-white font-semibold relative after:content-[""] after:absolute after:-bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[1px] after:bg-white after:rounded-sm' 
                          : 'text-primary font-semibold relative after:content-[""] after:absolute after:-bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[1px] after:bg-primary after:rounded-sm')
                      : (isScrolled ? 'text-gray-200 font-medium' : 'text-text-secondary font-medium')
                      }`}
                    onClick={() => setActiveNav(item)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Button */}
          <div className="flex items-center">
            <button className={`${isScrolled ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-[#1e2869]'} border-none rounded-full py-2 px-5 text-[14px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(43,57,144,0.3)] shadow-[0_4px_10px_rgba(43,57,144,0.2)] active:translate-y-[1px] active:shadow-[0_2px_6px_rgba(43,57,144,0.2)]`}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
