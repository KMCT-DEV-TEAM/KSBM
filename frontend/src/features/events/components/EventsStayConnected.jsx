"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EventsStayConnected = ({ stayConnected }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % (stayConnected.posters.length || 1));
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + stayConnected.posters.length) % (stayConnected.posters.length || 1));

  if (!stayConnected || stayConnected.posters.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 overflow-hidden relative bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
      <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-widest text-pink-500 mb-16">
        {stayConnected.heading}
      </h2>
      <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[550px] flex items-center justify-center">
        {stayConnected.posters.map((poster, idx) => {
          // Calculate relative position to active index
          const diff = (idx - carouselIndex + stayConnected.posters.length) % stayConnected.posters.length;
          let position = 0;
          if (diff === 0) position = 0; // Center
          else if (diff === 1 || diff === - (stayConnected.posters.length - 1)) position = 1; // Right
          else if (diff === stayConnected.posters.length - 1 || diff === -1) position = -1; // Left
          else position = 2; // Hidden

          const isVisible = position !== 2;
          const zIndex = position === 0 ? 30 : 20;
          const scale = position === 0 ? 1 : 0.8;
          const xOffset = position === 0 ? 0 : position === 1 ? '50%' : '-50%';
          const rotateY = position === 0 ? 0 : position === 1 ? -15 : 15;
          const opacity = position === 0 ? 1 : position === 2 ? 0 : 0.6;

          return (
            <motion.div
              key={idx}
              className="absolute w-[250px] sm:w-[350px] md:w-[400px] h-full cursor-pointer"
              initial={false}
              animate={{
                x: xOffset,
                scale: scale,
                rotateY: rotateY,
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
              onClick={() => {
                if (position === 1) handleNext();
                if (position === -1) handlePrev();
              }}
              style={{ perspective: 1000, pointerEvents: isVisible ? 'auto' : 'none' }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-pink-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
                <img src={poster.img} alt="Poster" className="w-full h-full object-cover" />
                {position !== 0 && <div className="absolute inset-0 bg-black/40"></div>}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-8 gap-4">
        <button onClick={handlePrev} className="p-3 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={handleNext} className="p-3 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
};

export default EventsStayConnected;
