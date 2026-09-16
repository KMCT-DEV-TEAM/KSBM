"use client";
import React from 'react';
import { motion } from 'framer-motion';

const DownloadHero = ({ heroData, fullScreen = false }) => {
  const title = heroData?.title || 'Download';
  const subtitle = heroData?.subtitle || 'Access all essential academic documents in one convenient location. Download application forms, brochures, academic regulations, examination guidelines, fee structures, and other important resources. Stay informed with the latest documents to support your academic journey and campus experience.';
  const backgroundImage = heroData?.backgroundImage || '/assets/Images/image 73.png';

  return (
    <section className={`relative w-full ${fullScreen ? 'min-h-screen h-[100vh]' : 'min-h-[70vh] sm:min-h-[78vh] md:min-h-[82vh] lg:min-h-[86vh]'} flex items-end bg-[#1B2155] overflow-hidden pt-28 sm:pt-32 pb-36 sm:pb-40 lg:pb-44`}>
      {/* Background Image & Deep Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Download Backdrop"
          className="w-full h-full object-cover opacity-35 object-center scale-105 transform duration-1000"
        />
        <div className="absolute inset-0 bg-primary/50"></div>
      </div>

      {/* Full Size Content Container */}
      <div className="relative z-10 w-[94%] max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-7 drop-shadow-md leading-tight">
            {title}
          </h1>
          <p className="text-[15px] text-white/80 leading-relaxed drop-shadow-sm max-w-2xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadHero;
