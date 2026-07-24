"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EventsCarousel = ({ highlightedPrograms, carouselIndex, setCarouselIndex }) => {
  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % (highlightedPrograms.images.length || 1));
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + highlightedPrograms.images.length) % (highlightedPrograms.images.length || 1));

  if (!highlightedPrograms || !highlightedPrograms.images || highlightedPrograms.images.length === 0) return null;

  const allImages = [
    ...highlightedPrograms.images,
    { img: '/assets/Images/carousel_extra_1.png' },
    { img: '/assets/Images/carousel_extra_2.png' }
  ];

  return (
    <section
      className="w-full py-24 overflow-hidden relative"
      style={{
        backgroundImage: 'url(/assets/Images/image_148.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/90 z-0 pointer-events-none"></div>

      {/* Top Blend Gradient */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-0 pointer-events-none"></div>

      {/* Bottom Blend Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none"></div>

      {/* Background Accent Lines */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(236, 72, 153, 0.1) 40px, rgba(236, 72, 153, 0.1) 41px)' }}
      />

      <div className="flex flex-col items-center relative z-10 mb-16">
        <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
          style={{
            background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Showcase</h5>
        <h2 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest text-[#ffccf0] drop-shadow-[0_0_15px_rgba(219,39,119,0.8)]">
          {highlightedPrograms.heading}
        </h2>
      </div>

      {/* 3D Container with Increased Perspective */}
      <div
        className="relative w-full h-[380px] sm:h-[480px] md:h-[520px] flex items-center justify-center z-10"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {allImages.map((item, idx) => {
          const total = allImages.length;

          let offset = (idx - carouselIndex) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const absOffset = Math.abs(offset);

          // Hide extra off-screen cards beyond 3 on each side
          if (absOffset > 3) return null;

          const angle = 25;
          let x1 = 0;
          let ry = 0;
          let x2 = 0;

          if (offset > 0) {
            x1 = 50;
            ry = -angle; // Right wing comes forward
            x2 = 50 + (offset - 1) * 100;
          } else if (offset < 0) {
            x1 = -50;
            ry = angle; // Left wing comes forward
            x2 = -50 - (Math.abs(offset) - 1) * 100;
          }

          const opacity = absOffset >= 3 ? 0 : 1;
          const zIndex = 10 + absOffset;

          return (
            <motion.div
              key={idx}
              className="absolute w-[170px] sm:w-[240px] md:w-[300px] aspect-[3/4]"
              initial={false}
              animate={{
                x: `${x1}%`,
                z: -300,
                rotateY: ry,
                zIndex: zIndex
              }}
              transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 90,
                damping: 18
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.div
                className="w-full h-full"
                initial={false}
                animate={{
                  x: `${x2}%`,
                  opacity: opacity
                }}
                transition={{
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 90,
                  damping: 18
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden border border-white/10">
                  <img
                    src={item.img}
                    alt="Program"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EventsCarousel;