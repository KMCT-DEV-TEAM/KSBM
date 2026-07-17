"use client";
import React from 'react';
import { motion } from 'framer-motion';

const FacultyHero = ({ data }) => {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-end justify-center overflow-hidden bg-gray-900 pb-24 md:pb-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('${data?.heroBgImage || "/assets/Images/image 2.png"}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto flex flex-col items-start text-left">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight"
        >
          {data?.heroHeading || "Faculty Members"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-sm lg:text-base text-gray-200 font-medium leading-relaxed max-w-3xl"
        >
          {data?.heroSubtext || "Our distinguished faculty are committed to delivering quality education through innovative teaching, practical learning, and personalized mentorship, helping students build the skills and confidence needed for successful careers."}
        </motion.p>
      </div>
    </div>
  );
};

export default FacultyHero;
