import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#252b57] text-white pt-20 pb-8 overflow-hidden">
      
      {/* Background Geometric Pattern */}
      {/* Left Pattern */}
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-5 pointer-events-none transform -translate-x-1/2 translate-y-1/4"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px), radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          clipPath: 'circle(50% at 50% 50%)'
        }}
      ></div>
      {/* Right Pattern */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] pointer-events-none transform translate-x-1/3 -translate-y-1/4"
        style={{
          backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)',
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}
      ></div>

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: About & Social */}
          <div className="flex flex-col pr-4">
            <h3 className="text-2xl font-bold mb-6 tracking-wide text-white">KSBM</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-[90%] font-medium">
              Empowering global leaders through intellectual rigor and strategic excellence since 1998.
            </p>
            
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase mb-4 text-white">
              CONNECT US
            </h4>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1877F2] hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366] hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Programs */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase mb-8 text-white">
              PROGRAMS
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">MBA Full-time</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Executive MBA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BBA Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PhD in Management</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase mb-8 text-white">
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accreditations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News & Events</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase mb-8 text-white">
              CONTACT INFORMATION
            </h4>
            <ul className="flex flex-col gap-5 text-sm text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
                <span>KMCT Hills, Kerala, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 opacity-80" />
                <a href="mailto:admissions@ksbm.ac.in" className="hover:text-white transition-colors">
                  admissions@ksbm.ac.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 opacity-80" />
                <a href="tel:+914952211444" className="hover:text-white transition-colors">
                  +91 495 2211 444
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.65rem] text-gray-400 font-medium">
          <p>
            © 2024 KMCT School of Business. All rights reserved. Accredited by AACSB & AMBA.
          </p>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
          <p>
            Developed by : Kmct Dev Team
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
