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

      {/* Overlapping Curved Lines Design (Left Edge of Screen) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 md:w-10 h-auto pointer-events-none opacity-80 z-0">
        <img src="/assets/Images/Group 254.png" alt="Decorative Curves" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex justify-center md:justify-start"
        >
          {/* Decorative Polygon */}
          <div className="absolute top-12 right-25 w-16 h-16 z-20 pointer-events-none drop-shadow-md opacity-80 animate-pulse">
            <img src="/assets/Images/Polygon 7.png" alt="Decorative Polygon" className="w-full h-full object-contain" />
          </div>

          <img
            src="/assets/Images/image 91.png"
            alt="The Spirit of Culture"
            className="w-full max-w-md lg:max-w-lg h-auto object-contain relative z-10"
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
          <h5 className=" text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
            style={{
              background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>About</h5>

          {/* Heading */}
          <h2 className="text-[40px] font-bold text-white tracking-wide uppercase leading-tight drop-shadow-[0_0_15px_rgba(249,73,180,0.6)]">
            THE SPIRIT OF CULTURE
          </h2>

          {/* Paragraphs */}
          <div className="text-gray-300 text-sm md:text-[15px] leading-relaxed space-y-6 font-medium">
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

          {/* Decorative Icon */}
          <div className="absolute -bottom-8 -right-4 md:-right-8 opacity-60 animate-bounce" style={{ animationDuration: '3s' }}>
            <img src="/assets/Images/image 117.png" alt="Decorative Icon" className="w-50 h-50 object-contain" />
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default EventsAbout;
