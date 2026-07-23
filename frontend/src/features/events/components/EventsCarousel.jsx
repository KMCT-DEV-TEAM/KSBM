"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EventsCarousel = ({ highlightedPrograms, carouselIndex, setCarouselIndex }) => {
  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % (highlightedPrograms.images.length || 1));
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + highlightedPrograms.images.length) % (highlightedPrograms.images.length || 1));

  if (!highlightedPrograms || highlightedPrograms.images.length === 0) return null;

  return (
    <section className="w-full py-24 overflow-hidden relative bg-[#050505]">
      {/* Background Subtle Vertical Lines to match the screenshot vibe */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(236, 72, 153, 0.1) 40px, rgba(236, 72, 153, 0.1) 41px)' }}></div>

      <h2 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest text-[#ffccf0] mb-20 drop-shadow-[0_0_15px_rgba(219,39,119,0.8)] relative z-10">
        {highlightedPrograms.heading}
      </h2>
      <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center z-10" style={{ perspective: 2000 }}>
        {[...highlightedPrograms.images, { img: '/assets/Images/carousel_extra_1.png' }, { img: '/assets/Images/carousel_extra_2.png' }].map((item, idx, extendedImages) => {
          const len = extendedImages.length;
          const diff = (idx - carouselIndex + len) % len;

          let position = 0;
          if (diff === 0) position = 0;
          else if (diff === 1 || diff === -(len - 1)) position = 1;
          else if (diff === 2 || diff === -(len - 2)) position = 2;
          else if (diff === 3 || diff === -(len - 3)) position = 3;
          else if (diff === len - 1 || diff === -1) position = -1;
          else if (diff === len - 2 || diff === -2) position = -2;
          else if (diff === len - 3 || diff === -3) position = -3;
          else position = 4; // hidden

          const isVisible = position !== 4;
          const zIndex = 10 + Math.abs(position) * 10;
          
          let rotateY = 0;
          if (position > 0) rotateY = 35;
          if (position < 0) rotateY = -35;
          
          let z = 0;
          if (position === 0) z = -500;
          else if (Math.abs(position) === 1) z = -350;
          else if (Math.abs(position) === 2) z = -150;
          else if (Math.abs(position) === 3) z = 0;
          
          let xOffset = 0;
          if (position === 1) xOffset = '75%';
          if (position === -1) xOffset = '-75%';
          if (position === 2) xOffset = '150%';
          if (position === -2) xOffset = '-150%';
          if (position === 3) xOffset = '225%';
          if (position === -3) xOffset = '-225%';
          
          const opacity = position === 4 ? 0 : 1;

          return (
            <motion.div
              key={idx}
              className="absolute w-[220px] sm:w-[320px] md:w-[400px] h-full"
              initial={false}
              animate={{
                x: xOffset,
                z: z,
                rotateY: rotateY,
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
              style={{ perspective: 1200, pointerEvents: 'none' }}
            >
              <div className="w-full h-full shadow-[0_15px_50px_rgba(0,0,0,0.9)] relative">
                <img src={item.img} alt="Program" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          );
        })}
      </div>


    </section>
  );
};

export default EventsCarousel;
