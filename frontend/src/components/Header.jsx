import React, { useState } from 'react';

const Header = () => {
  const [activeNav, setActiveNav] = useState('Home');

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
    <header className="w-full bg-white border-b border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50 font-sans">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto px-4 lg:px-8 h-20">
        {/* Logo Section */}
        <div className="flex items-center no-underline text-black">
          <img src="/logo.png" alt="KMCT Logo" className="max-h-[60px] hidden" />
          {/* Fallback text if logo image is missing */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-[#0088cc] rounded-full relative"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 15%, transparent 16%), radial-gradient(#ffffff 15%, transparent 16%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 5px 5px'
              }}
            ></div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#0a1128] tracking-tight leading-tight">KMCT.org</span>
              <span className="text-[0.65rem] font-semibold text-[#0a1128] tracking-wide mt-0.5">GROUP OF INSTITUTIONS</span>
            </div>
            <div className="w-[2px] h-10 bg-[#2b3990] mx-2 hidden xl:block"></div>
            <div className="hidden xl:flex flex-col">
              <span className="text-[0.95rem] font-medium text-gray-800">KMCT SCHOOL OF BUSINESS</span>
              <span className="text-[0.95rem] font-medium text-gray-800">MANAGEMENT</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center list-none gap-4 xl:gap-6 m-0 p-0">
            {navItems.map((item) => (
              <li key={item} className="relative">
                <a
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`no-underline text-sm py-2 transition-colors duration-300 inline-block hover:text-[#2b3990] ${
                    activeNav === item 
                      ? 'text-[#2b3990] font-semibold relative after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[3px] after:bg-[#2b3990] after:rounded-sm' 
                      : 'text-slate-500 font-medium'
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
          <button className="bg-[#2b3990] text-white border-none rounded-full py-2.5 px-6 text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-[#1e2869] hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(43,57,144,0.3)] shadow-[0_4px_10px_rgba(43,57,144,0.2)] active:translate-y-[1px] active:shadow-[0_2px_6px_rgba(43,57,144,0.2)]">
            Apply Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
