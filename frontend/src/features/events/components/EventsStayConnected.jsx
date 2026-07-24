"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EventsStayConnected = ({ stayConnected }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const displayPosters = stayConnected?.posters?.length > 0 ? stayConnected.posters : [
    { img: '/assets/Images/Mask%20group%20(1).png' },
    { img: '/assets/Images/Mask%20group%20(1).png' },
    { img: '/assets/Images/Mask%20group%20(1).png' },
    { img: '/assets/Images/Mask%20group%20(1).png' },
    { img: '/assets/Images/Mask%20group%20(1).png' },
    { img: '/assets/Images/Mask%20group%20(1).png' }
  ];

  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % displayPosters.length);
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + displayPosters.length) % displayPosters.length);

  return (
    <section className="w-full py-20 px-6 overflow-hidden relative bg-black">

      {/* Background Image 129 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 flex items-center justify-center">
        <img src="/assets/Images/image 129.png" alt="Stay Connected Background" className="w-full h-auto object-contain" />
      </div>

      {/* Gradient Overlay for seamless blending with top/bottom sections */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none"></div>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#C837AB" offset="0%" />
            <stop stopColor="#FFDD55" offset="40%" />
            <stop stopColor="#FF543E" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

        {/* Left Side: Announcement Text */}
        <div className="flex-1 w-full text-left flex flex-col justify-center px-4 lg:px-0">
          <h5 className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
            style={{
              background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Guest Announcement</h5>
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white mb-6 uppercase tracking-widest leading-tight">
            I'm excited to join the happiness with you all at <br className="hidden xl:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C837AB] via-[#FFDD55] to-[#FF543E]">KALEIDO KMCT 2025</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-light tracking-wide uppercase">
            The Pan-KMCT Cultural Fest
          </p>
          <p className="text-xl md:text-2xl text-white mb-6 font-semibold leading-relaxed">
            I am coming to Inaugurate KALEIDO KMCT 2025 on <br className="hidden xl:block" />
            <span className="text-pink-400 font-bold">23rd September 2025 at 2 PM</span>
          </p>

        </div>

        {/* Right Side: Carousel & Scattered Icons */}
        <div className="flex-1 w-full relative flex flex-col items-center">

          {/* Scattered Social Media Icons with Gradient Fill */}
          <a href="#" className="absolute top-[0%] left-[5%] z-40">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="url(#iconGradient)">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="#" className="absolute top-[10%] right-[0%] hover:scale-150 transition-transform duration-300 z-40">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="url(#iconGradient)">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>
          <a href="#" className="absolute bottom-[20%] left-[0%] hover:scale-150 transition-transform duration-300 z-40">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="url(#iconGradient)">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          <a href="#" className="absolute bottom-[5%] right-[10%] hover:scale-150 transition-transform duration-300 z-40">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="url(#iconGradient)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <div className="relative w-full max-w-[500px] mx-auto h-[320px] md:h-[440px] flex items-center justify-center">
            {displayPosters.map((poster, idx) => {
              // Calculate relative position to active index
              const diff = (idx - carouselIndex + displayPosters.length) % displayPosters.length;
              let position = 0;
              if (diff === 0) position = 0; // Center
              else if (diff === 1 || diff === - (displayPosters.length - 1)) position = 1; // Right
              else if (diff === displayPosters.length - 1 || diff === -1) position = -1; // Left
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
                  className="absolute w-[200px] sm:w-[280px] md:w-[320px] h-full cursor-pointer"
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
        </div>
      </div>
    </section>
  );
};

export default EventsStayConnected;
