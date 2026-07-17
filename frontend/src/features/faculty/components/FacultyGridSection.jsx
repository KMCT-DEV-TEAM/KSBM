"use client";
import React from 'react';
import { motion } from 'framer-motion';

const FacultyGridSection = ({ title, members, id }) => {
  if (!members || members.length === 0) return null;

  const isKsbmFaculty = id === 'ksbm-faculty' || title?.toLowerCase().includes('ksbm');

  return (
    <section
      id={id}
      className={`py-12 md:py-16 relative border-b border-gray-200/60 ${isKsbmFaculty ? 'bg-cover bg-center' : 'bg-[#fcfcfd]'}`}
      style={isKsbmFaculty ? { backgroundImage: "url('/assets/Images/image 58.png')" } : {}}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        {/* Section Header with right divider line */}
        <div className="flex items-center gap-6 mb-10 md:mb-14">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1e2869] whitespace-nowrap tracking-tight">
            {title}
          </h3>
          <div className={`flex-grow h-[1.5px] ${isKsbmFaculty ? 'bg-primary' : 'bg-gray-200/80'}`}></div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {members.map((member, idx) => (
            <FacultyCard key={member._id || idx} member={member} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FacultyCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, type: "spring", stiffness: 90 }}
      className="rounded-2xl md:rounded-[24px] overflow-hidden relative aspect-[3/4] bg-gray-200/60 group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/80 flex flex-col justify-end"
    >
      {/* Photo */}
      <img
        src={member.image || "/assets/Images/image 31.png"}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.src = "/assets/Images/image 31.png";
        }}
      />

      {/* Subtle Gradient protection for overlay card */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80"></div>

      {/* Floating Bottom Info Card */}
      <div className="relative z-10 mx-3.5 mb-3.5 bg-white/75 backdrop-blur-md rounded-xl p-3.5 sm:p-4 shadow-lg border border-white/50 transition-all duration-300 group-hover:bg-white/90 group-hover:-translate-y-1">
        <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1">
          {member.name}
        </h4>
        <p className="text-[11px] sm:text-xs text-gray-500 font-medium line-clamp-2 leading-snug">
          {member.title}
        </p>
      </div>
    </motion.div>
  );
};

export default FacultyGridSection;
