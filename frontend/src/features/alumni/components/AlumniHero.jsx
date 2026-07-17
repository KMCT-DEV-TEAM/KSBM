"use client";
import React from 'react';
import { motion } from 'framer-motion';

const AlumniHero = ({ data }) => {
  return (
    <section className="relative h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32">
      {/* Background Image */}
      <img
        src={data?.backgroundImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"}
        alt="KSBM Alumni Network"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#0b1238]/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto text-white flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {data?.title || 'Alumni'}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium leading-relaxed max-w-3xl">
            {data?.subtitle || 'Our alumni stand at the forefront of global business, driving innovation through principled leadership and strategic excellence across industries worldwide.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AlumniHero;
