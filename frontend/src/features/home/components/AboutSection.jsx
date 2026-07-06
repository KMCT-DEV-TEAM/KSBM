import React from 'react';
import { Rotate3d } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="relative w-full bg-white pt-20 lg:pt-32 pb-10">
      {/* Abstract Background Pattern (Top Left) */}
      <div 
        className="absolute top-0 left-0 w-64 h-64 lg:w-96 lg:h-96 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#f0f4f8 2px, transparent 2px)',
          backgroundSize: '24px 24px',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)' // simple geometric shape as placeholder
        }}
      ></div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Top Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Image Container */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-[80%] max-w-[450px]">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                alt="Graduating Student" 
                className="w-full h-auto rounded-lg object-cover z-10 relative"
                style={{ clipPath: 'inset(0 0 0 0 round 1rem)' }}
              />
              
              {/* Floating 360 Button */}
              <div className="absolute -bottom-6 -left-6 bg-[#2b3990] text-white p-4 rounded-xl shadow-[0_10px_20px_rgba(43,57,144,0.3)] z-20 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-1">
                <Rotate3d className="w-6 h-6" />
                <span className="text-[10px] font-bold">360°</span>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="order-1 lg:order-2">
            <h4 className="text-[#0088cc] text-xs lg:text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              BUILDING EXCELLENCE SINCE 1995 <span className="w-4 h-[2px] bg-[#0088cc]"></span>
            </h4>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2b3990] leading-[1.2] mb-8">
              Shaping Tomorrow's<br />Business Leaders
            </h2>

            <div className="space-y-6 text-slate-600 text-[0.95rem] leading-relaxed">
              <p>
                At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today's evolving business landscape.
              </p>
              <p>
                Our MBA program equips students with advanced managerial knowledge, strategic thinking, and leadership skills for successful corporate careers, while the BBA program builds a strong foundation in business, communication, and management for higher studies and professional growth. Supported by experienced faculty, modern infrastructure, and strong industry collaborations, KSBM provides an inspiring environment that nurtures critical thinking, entrepreneurship, innovation, and lifelong learning.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Stats Banner */}
      <div className="w-full bg-[#f4fafe] mt-24 py-16">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-200">
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl font-light text-[#2b3990] mb-4">16+</span>
              <span className="text-[0.7rem] font-bold tracking-widest text-gray-500 uppercase">YEARS OF EXCELLENCE</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl font-light text-[#2b3990] mb-4">991+</span>
              <span className="text-[0.7rem] font-bold tracking-widest text-gray-500 uppercase">ACTIVE STUDENTS</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl font-light text-[#2b3990] mb-4">196+</span>
              <span className="text-[0.7rem] font-bold tracking-widest text-gray-500 uppercase">GLOBAL RECRUITERS</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl font-light text-[#2b3990] mb-4">196+</span>
              <span className="text-[0.7rem] font-bold tracking-widest text-gray-500 uppercase">GLOBAL RECRUITERS</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
