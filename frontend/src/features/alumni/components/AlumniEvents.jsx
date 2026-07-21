"use client";
import React from 'react';
import { motion } from 'framer-motion';

const eventsData = [
  {
    title: 'Global Alumni Reunion 2024',
    description: 'Join fellow graduates for a weekend of celebration, networking, and keynotes from industry leaders.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    date: 'December 2024'
  },
  {
    title: 'Med Tech Innovation Summit',
    description: 'An exclusive panel discussing the intersection of healthcare management and AI technology.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    date: 'October 2024'
  },
  {
    title: 'Annual Alumni Sports Meet',
    description: 'Relive campus memories with friendly cricket and football tournaments at KMCT grounds.',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
    date: 'August 2024'
  },
  {
    title: 'Global Alumni Reunion 2023',
    description: 'A look back at our memorable digital and physical gathering celebrating 20 years of excellence.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    date: 'December 2023'
  }
];

const AlumniEvents = ({ data }) => {
  const items = data?.items || eventsData;
  const heading = data?.heading || 'ALUMNI EVENTS';

  return (
    <section className="py-20 md:py-28 bg-gray-50/70 border-t border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-[#2b2b68] uppercase">
            {heading}
          </span>
        </motion.div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/60 flex flex-col group cursor-pointer"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AlumniEvents;
