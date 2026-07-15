"use client";
import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80" 
          alt="Campus Background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
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
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1] tracking-tight"
          >
            Advancing Business Integrity and Innovation.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="text-xs md:text-sm lg:text-base text-gray-200 max-w-3xl leading-relaxed font-medium"
          >
            KMCT School of Business (KSBM) ignites a passion for intellectual discovery and lifelong learning. Empowering each individual to achieve their fullest potential.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
