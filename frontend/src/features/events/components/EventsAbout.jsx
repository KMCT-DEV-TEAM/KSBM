"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EventsAbout = () => {
  return (
    <section className="relative w-full px-6 md:px-12 lg:px-24 overflow-hidden z-0">

      {/* Decorative Mandala (Top Left) */}
      <div className="absolute left-[-10%] top-0 -translate-y-[65%] w-64 sm:w-80 md:w-96 lg:w-[32rem] aspect-square z-20 pointer-events-none opacity-80 mix-blend-screen">
        <img src="/assets/Images/mandala.png" alt="Mandala" className="w-full h-full object-contain" />
      </div>

      {/* Decorative Floating Triangles */}
      <div
        className="absolute top-16 left-[25%] md:left-[35%] w-16 h-16  pointer-events-none"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      ></div>
      <div
        className="absolute top-8 left-[35%] md:left-[45%] w-10 h-10  pointer-events-none"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      ></div>
      <div
        className="absolute bottom-20 left-[30%] md:left-[40%] w-20 h-20 pointer-events-none"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      ></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex justify-center md:justify-start"
        >
          {/* Circular decorative wireframe lines on the left edge (faint) */}
          <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-[1px] border-orange-500/10 pointer-events-none"></div>
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-[1px] border-orange-500/5 pointer-events-none"></div>

          <img
            src="/assets/Images/image 91.png"
            alt="The Spirit of Culture"
            className="w-[85%] max-w-sm lg:max-w-md h-auto object-contain relative z-10"
          />
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 relative z-10"
        >
          {/* Background Radial Glow/Shade */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-[-1] pointer-events-none opacity-35 blur-[60px]"
            style={{ backgroundImage: 'radial-gradient(circle at center, #C837AB 0%, rgba(115, 115, 115, 0) 100%)' }}
          ></div>
          {/* Subheading */}
          <h4
            className="text-sm font-medium tracking-widest text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)' }}
          >
            About
          </h4>

          {/* Heading */}
          <h2 className="text-3xl lg:text-[34px] font-bold text-white tracking-wide uppercase leading-tight drop-shadow-[0_0_15px_rgba(249,73,180,0.6)]">
            THE SPIRIT OF CULTURE
          </h2>

          {/* Paragraphs */}
          <div className="text-gray-300 text-xs md:text-[14px] leading-relaxed space-y-6 font-medium">
            <p>
              Discover a celebration where creativity knows no limits and every performance tells a story worth remembering. Kaleido is more than a cultural festival—it's a vibrant platform where passion meets purpose, traditions blend with innovation, and talent shines without boundaries. Bringing together students, artists, performers, and creative minds from diverse backgrounds, the festival transforms the campus into a spectacular stage filled with energy, color, and inspiration.
            </p>
            <p>
              Immerse yourself in a world of mesmerizing dance performances, soul-stirring music, captivating theatre, expressive fine arts, photography, fashion, literature, and countless cultural experiences that celebrate the richness of artistic expression. Whether you're stepping into the spotlight as a performer, competing to showcase your skills, cheering for your peers, or simply enjoying the electrifying atmosphere, every moment at Kaleido is designed to inspire, connect, and create lasting memories.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <button className="px-8 py-3 rounded-md bg-gradient-to-r from-[#e74694] to-[#f57451] text-white font-semibold text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(231,70,148,0.4)]">
              Event Brochure
            </button>
            <button className="px-8 py-3 rounded-md border-[1.5px] border-[#e74694]/70 hover:border-[#e74694] text-white font-semibold text-sm hover:bg-[#e74694]/10 transition-colors duration-300">
              Download Calender
            </button>
          </div>

          {/* Musical Notes Decorative Icon */}
          <div className="absolute -bottom-8 -right-4 md:-right-8 opacity-60 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18C9 19.1046 8.10457 20 7 20C5.89543 20 5 19.1046 5 18C5 16.8954 5.89543 16 7 16C8.10457 16 9 16.8954 9 18ZM9 18V5L21 3V14M21 16C21 17.1046 20.1046 18 19 18C17.8954 18 17 17.1046 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16ZM21 16V6M9 9L21 7" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="paint0_linear" x1="5" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e74694" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default EventsAbout;
