import React from 'react';
import { Rotate3d } from 'lucide-react';
import graduateImg from '../../../assets/Images/graduate.png';
import watermarkImg from '../../../assets/Images/watermark_logo.png';


const AboutSection = () => {
  return (
    <section className="relative w-full bg-background pt-20 lg:pt-32 pb-10 overflow-hidden">
      {/* Background Logo Watermark */}
      <div className="absolute top-10 left-0 -translate-x-[35%] opacity-80 pointer-events-none z-0">
        <img src={watermarkImg} alt="Background Watermark" className="w-[250px] lg:w-[380px] h-auto object-contain mix-blend-multiply contrast-150" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

        {/* Top Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Image Container */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start lg:ml-36">
            <div className="relative w-[80%] max-w-[450px]">
              <img
                src={graduateImg}
                alt="Graduating Student"
                className="w-full h-auto rounded-lg object-cover z-10 relative"
                style={{ clipPath: 'inset(0 0 0 0 round 1rem)' }}
              />

              {/* Floating 360 Button */}
              <div className="absolute bottom-4 -left-2 bg-primary text-white px-3 py-1.5 rounded-lg shadow-lg z-20 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-0.5">
                <Rotate3d className="w-6 h-5" />
                <span className="text-[9px] font-bold">360°</span>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="order-1 lg:order-2 lg:-ml-12">
            <h4 className="text-[#3C95D7] text-xs lg:text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
              BUILDING EXCELLENCE SINCE 1995 <span className="w-2 h-[2px] bg-[#3C95D7]"></span>
            </h4>

            <h2 className="text-4xl lg:text-5xl font-bold text-primary leading-[1.2] mb-8">
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
      <div className="w-full ">
        <div className="max-w-[1440px]  bg-[#f4fafe] py-16 mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">

            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl md:text-6xl font-serif text-[#4e558e] mb-4">16+</span>
              <span className="text-[0.7rem] font-bold tracking-[0.15em] text-gray-600 uppercase">YEARS OF EXCELLENCE</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl md:text-6xl font-serif text-[#4e558e] mb-4">991+</span>
              <span className="text-[0.7rem] font-bold tracking-[0.15em] text-gray-600 uppercase">ACTIVE STUDENTS</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl md:text-6xl font-serif text-[#4e558e] mb-4">196+</span>
              <span className="text-[0.7rem] font-bold tracking-[0.15em] text-gray-600 uppercase">GLOBAL RECRUITERS</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-5xl md:text-6xl font-serif text-[#4e558e] mb-4">196+</span>
              <span className="text-[0.7rem] font-bold tracking-[0.15em] text-gray-600 uppercase">GLOBAL RECRUITERS</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
