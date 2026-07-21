"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ManagementDeskHero = ({ data }) => {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-end justify-center overflow-hidden bg-gray-900 pb-24 md:pb-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${data?.heroBgImage || "/assets/Images/image 2.png"}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto flex flex-col items-start text-left">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 tracking-tight"
        >
          {data?.heroHeading || "Management Desk"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/90 text-xs sm:text-sm max-w-4xl leading-relaxed font-normal"
        >
          {data?.heroSubtext || "Our leaders stand at the forefront of delivering dynamic management education through innovative teaching, practical learning and personalized mentorship to shape today's students into tomorrow's successful business leaders."}
        </motion.p>
      </div>
    </div>
  );
};

export default ManagementDeskHero;
