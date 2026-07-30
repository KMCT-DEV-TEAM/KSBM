"use client";
import React from 'react';
import { motion } from 'framer-motion';

const GoverningBodyHero = ({ data }) => {
  const heroBgImage = data?.heroBgImage || "/assets/Images/image 2.png";
  const heroHeading = data?.heroHeading || "KSBM Governing Body";
  const heroSubtext = data?.heroSubtext || "Strategizing for excellence: The leadership framework dedicated to advancing pharmaceutical management education through visionary governance, industrial synergy, and academic rigor.";

  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-end justify-center overflow-hidden bg-gray-900 pb-24 md:pb-32">
      {/* Background Image */}
      {data?.showHeroBgImage !== false && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBgImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>
      )}

      {data?.showHeroTextContent !== false && (
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto flex flex-col items-start text-left">
        {data?.showHeroHeading !== false && (
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {heroHeading}
          </motion.h1>
        )}
        {data?.showHeroSubtext !== false && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 text-xs md:text-sm lg:text-base max-w-3xl leading-relaxed whitespace-pre-wrap"
          >
            {heroSubtext}
          </motion.p>
        )}
      </div>
      )}
    </div>
  );
};

export default GoverningBodyHero;
