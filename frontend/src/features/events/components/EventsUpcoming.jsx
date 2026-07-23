"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EventsUpcoming = ({ upcomingEvents }) => {
  return (
    <section className="w-full py-20 px-6 relative">
      <div className="absolute left-10 top-10 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xl md:text-2xl font-semibold uppercase tracking-widest text-pink-500 mb-12">
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
              className="flex flex-col md:flex-row bg-[#0a0a0a] rounded-2xl overflow-hidden border border-pink-500/30 hover:border-pink-500/70 transition-colors shadow-[0_0_15px_rgba(219,39,119,0.1)] hover:shadow-[0_0_25px_rgba(219,39,119,0.3)]"
            >
              <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0 relative">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] hidden md:block"></div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
              </div>
              <div className="w-full md:w-32 bg-gradient-to-b from-pink-600/20 to-purple-900/20 flex flex-row md:flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-pink-500/20">
                <span className="text-4xl font-black text-pink-500">{event.date}</span>
                <span className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-2 md:ml-0 md:mt-1">{event.month}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsUpcoming;
