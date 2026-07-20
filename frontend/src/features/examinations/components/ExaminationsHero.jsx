"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ExaminationsHero = ({ data }) => {
  const badgeText = data?.heroBadgeText || 'Examinations 2026';
  const title = data?.heroTitle || 'Stay Informed. Stay Prepared. Excel in Every Examination.';
  const subtitle = data?.heroSubtitle || 'Access examination schedules, important notifications, and semester results in one place. Stay updated with key dates and academic announcements to ensure a smooth and well-organized examination experience throughout your MBA journey.';
  const bgImage = data?.heroImage || '/assets/Images/image 73.png';

  return (
    <section className="relative w-full min-h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32 bg-[#1b2559]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Examinations at KSBM"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient exactly matching About us hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col items-start text-left">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="max-w-4xl"
        >
          {badgeText && (
            <motion.span
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="inline-block px-4 py-1.5 rounded-md bg-white/15 text-white text-xs font-medium backdrop-blur-md mb-4 border border-white/20 tracking-wide"
            >
              {badgeText}
            </motion.span>
          )}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1] tracking-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="text-xs md:text-sm lg:text-base text-gray-200 max-w-3xl leading-relaxed font-medium"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExaminationsHero;
