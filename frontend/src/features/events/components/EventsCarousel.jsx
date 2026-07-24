"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const EventsCarousel = ({ highlightedPrograms, carouselIndex, setCarouselIndex }) => {
  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % (highlightedPrograms.images.length || 1));
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + highlightedPrograms.images.length) % (highlightedPrograms.images.length || 1));

  const baseImages = [
    { img: '/assets/Images/Home/img1.jpeg' },
    { img: '/assets/Images/Home/img2.jpeg' },
    { img: '/assets/Images/Home/img3.jpeg' },
    { img: '/assets/Images/Home/img4.jpeg' },
    { img: '/assets/Images/Home/img5.jpeg' },
    { img: '/assets/Images/Home/img6.jpeg' },
    { img: '/assets/Images/Home/img7.jpeg' }
  ];

  // Duplicate the array to ensure enough cards exist to seamlessly wrap around the back of the 3D cylinder
  const allImages = [...baseImages, ...baseImages];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % allImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [allImages.length, setCarouselIndex]);

  if (!highlightedPrograms || !highlightedPrograms.images || highlightedPrograms.images.length === 0) return null;

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

      {/* Background Accent Images (Group 276) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
        <img src="/assets/Images/Group_276.png" alt="" className="absolute left-[15%] top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain opacity-70" />
        <img src="/assets/Images/Group_276.png" alt="" className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain" />
        <img src="/assets/Images/Group_276.png" alt="" className="absolute right-[15%] top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain opacity-70" />
      </div>

      <div className="flex flex-col items-center relative z-10 mb-16">
        <h5 className=" text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
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
        style={{ perspective: '500px', transformStyle: 'preserve-3d' }}
      >
        {allImages.map((item, idx) => {
          const total = allImages.length;

          let offset = (idx - carouselIndex) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const absOffset = Math.abs(offset);

          // We keep all cards mounted even when off-screen (opacity 0) so Framer Motion maintains continuous 3D transforms
          // as they wrap around the back of the cylinder.

          let a1 = 0, a2 = 0, a3 = 0, a4 = 0;
          let tx0 = 0;
          let tx1 = 0, tx2 = 0, tx3 = 0, tx4 = 0;

          // Smooth oval curve
          const ang1 = 15;
          const ang2 = 32;
          const ang3 = 50;
          const ang4 = 60; // Sharp bend for the invisible card to prevent camera clipping

          let totalAngle = 0;
          const gap = 7; // 5% of card width gap between cards

          if (offset > 0) {
            tx0 = 50 + gap;
            if (offset >= 1) { a1 = -ang1; tx1 = offset === 1 ? 50 : 100 + gap; totalAngle += ang1; }
            if (offset >= 2) { a2 = -ang2; tx2 = offset === 2 ? 50 : 100 + gap; totalAngle += ang2; }
            if (offset >= 3) { a3 = -ang3; tx3 = offset === 3 ? 50 : 100 + gap; totalAngle += ang3; }
            if (offset >= 4) { a4 = -ang4; tx4 = offset === 4 ? 50 : 100 + gap; totalAngle += ang4; }
          } else if (offset < 0) {
            tx0 = -50 - gap;
            const abs = Math.abs(offset);
            if (abs >= 1) { a1 = ang1; tx1 = abs === 1 ? -50 : -100 - gap; totalAngle += ang1; }
            if (abs >= 2) { a2 = ang2; tx2 = abs === 2 ? -50 : -100 - gap; totalAngle += ang2; }
            if (abs >= 3) { a3 = ang3; tx3 = abs === 3 ? -50 : -100 - gap; totalAngle += ang3; }
            if (abs >= 4) { a4 = ang4; tx4 = abs === 4 ? -50 : -100 - gap; totalAngle += ang4; }
          }

          const opacity = absOffset >= 4 ? 0 : 1;
          const zIndex = 10 + absOffset;

          return (
            <motion.div
              key={idx}
              className="absolute w-[170px] sm:w-[240px] md:w-[300px] aspect-[3/6]"
              initial={false}
              animate={{
                "--tx0": tx0,
                "--a1": a1,
                "--tx1": tx1,
                "--a2": a2,
                "--tx2": tx2,
                "--a3": a3,
                "--tx3": tx3,
                "--a4": a4,
                "--tx4": tx4,
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{
                duration: 2.5,
                ease: "linear"
              }}
              style={{
                transform: "translateZ(-500px) translateX(calc(var(--tx0) * 1%)) rotateY(calc(var(--a1) * 1deg)) translateX(calc(var(--tx1) * 1%)) rotateY(calc(var(--a2) * 1deg)) translateX(calc(var(--tx2) * 1%)) rotateY(calc(var(--a3) * 1deg)) translateX(calc(var(--tx3) * 1%)) rotateY(calc(var(--a4) * 1deg)) translateX(calc(var(--tx4) * 1%))",
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden border border-white/10 flex items-center justify-center bg-black/40">
                <img
                  src={item.img}
                  alt="Program"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EventsCarousel;