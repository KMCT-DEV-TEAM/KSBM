"use client";
import React from 'react';
import { motion } from 'framer-motion';

const PlacementHero = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative w-full min-h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32 bg-[#1b2559]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={data.backgroundImage || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop"}
          alt={data.title}
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
          <motion.span
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="inline-block px-4 py-1.5 rounded-md bg-white/15 text-white text-xs font-medium backdrop-blur-md mb-4 border border-white/20 tracking-wide"
          >
            {data.badge}
          </motion.span>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } } }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            {data.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i !== data.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } } }}
            className="text-base md:text-lg text-white/80 max-w-2xl font-light leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PlacementHero;
