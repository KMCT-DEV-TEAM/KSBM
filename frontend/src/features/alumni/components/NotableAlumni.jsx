"use client";
import React from 'react';
import { motion } from 'framer-motion';

const notableAlumniData = [
  {
    name: 'Dr. Arvind Nair',
    role: 'CEO, Global Corporate',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Dr. Arvind Nair',
    role: 'Director of Strategy, Apex',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Dr. Arvind Nair',
    role: 'Founder & MD, FinTech Labs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Dr. Arvind Nair',
    role: 'VP Operations, HealthCorp',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Dr. Arvind Nair',
    role: 'Managing Partner, Ventures',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'
  }
];

const NotableAlumni = ({ data }) => {
  const items = data?.items || notableAlumniData;
  const subtitle = data?.subtitle || 'OUR PRIDE';
  const heading = data?.heading || 'Notable Alumni';

  return (
    <section className="py-20 md:py-28 mb-8 md:mb-12 bg-[#2b2b68] text-white relative overflow-hidden">

      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-white/70 uppercase block mb-3">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
            {heading}
          </h2>
        </motion.div>

        {/* Alumni Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {items.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Profile Image Box */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-white/5 relative mb-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Name & Role */}
              <div className="text-center w-full px-1">
                <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-primary transition-colors line-clamp-1">
                  {person.name}
                </h3>
                <p className="text-[11px] text-white/70 font-light mt-0.5 line-clamp-1">
                  {person.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NotableAlumni;
