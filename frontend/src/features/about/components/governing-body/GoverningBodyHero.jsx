"use client";
import React from 'react';
import { motion } from 'framer-motion';

const GoverningBodyHero = () => {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image (Using placeholder since boardroom not provided) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Images/image 2.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 px-6 w-full max-w-5xl mx-auto mt-20 flex flex-col items-start text-left">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6"
        >
          KSBM Governing Body
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl leading-relaxed"
        >
          Strategizing for excellence: The leadership framework dedicated to advancing pharmaceutical management education through visionary governance, industrial synergy, and academic rigor.
        </motion.p>
      </div>
    </div>
  );
};

export default GoverningBodyHero;
