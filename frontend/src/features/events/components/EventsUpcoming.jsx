"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EventsUpcoming = ({ upcomingEvents }) => {
  return (
    <section className="w-full px-6 relative z-0">
      {/* Decorative Glow */}
      <div className="absolute left-10 top-10 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full z-[-1]"></div>

      {/* Decorative Curves (Right Edge) */}
      <div className="absolute right-0 top-24 w-14 md:w-24 h-auto pointer-events-none opacity-80 z-[-1]">
        <img src="/assets/Images/Group 254 (1).png" alt="Decorative Curves" className="w-full h-full object-contain" />
      </div>

      {/* Decorative Curves (Left Bottom Edge) */}
      <div className="absolute left-0 bottom-24 w-14 md:w-24 h-auto pointer-events-none opacity-80 z-[-1] scale-x-[-1]">
        <img src="/assets/Images/Group 254 (1).png" alt="Decorative Curves" className="w-full h-full object-contain" />
      </div>

      {/* Decorative Polygon (Left Side) */}
      <div className="absolute left-10 md:left-24 top-[40%] w-12 md:w-16 h-auto pointer-events-none opacity-80 z-0 animate-pulse drop-shadow-[0_0_15px_rgba(200,55,171,0.5)]">
        <img src="/assets/Images/Polygon 7.png" alt="Decorative Polygon" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
          style={{
            background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Coming Soon</h5>
        <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-widest mb-12 leading-tight drop-shadow-[0_0_15px_rgba(249,73,180,0.8)]">
          {upcomingEvents.heading}
        </h2>
        <div className="space-y-6">
          {upcomingEvents.events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex flex-col md:flex-row bg-[#050505] rounded-[2rem] overflow-hidden shadow-2xl p-4 gap-6 md:gap-8 border border-purple"
            >
              {/* Image Section */}
              <div className="w-full md:w-[35%] shrink-0 h-40 md:h-48 lg:h-52 -ml-5">
                <img src="/assets/Images/image 94.png" alt={event.title} className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_15px_rgba(200,55,171,0.2)]" />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-start pr-4 md:pr-28 pt-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 uppercase tracking-wide">{event.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
              </div>

              {/* Date Ribbon */}
              <div className="absolute top-0 right-5 bg-[#c837ab] w-[80px] h-[110px] rounded-b-[18px] flex flex-col items-center justify-center z-10 shadow-lg">
                <span className="text-white text-xs md:text-sm font-medium mb-1 capitalize">{event.month}</span>
                <span className="text-white text-xl md:text-2xl font-bold">{event.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsUpcoming;
