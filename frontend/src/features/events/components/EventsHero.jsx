"use client";
import React from 'react';

const EventsHero = ({ hero }) => {
  // Placeholder images for the film strip (cinematic event shots)
  const stripImages = [
    "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <section className="relative w-full h-[75vh] md:h-[100vh] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Decorative Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-[-1] pointer-events-none opacity-35 blur-[80px]"
        style={{ backgroundImage: 'radial-gradient(circle at center, #2B2F66 20%, rgba(115, 115, 115, 0) 100%)' }}
      ></div>

      {/* Background Image: Scaled Down */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-10">
        {/* Subtle gradient overlay to ensure the film strip pops if needed */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Content Overlay (Title and Subtitle) */}
      {hero?.showTextContent !== false && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center md:justify-start items-start text-left px-6 md:px-16 lg:px-32 xl:px-48 pt-0 md:pt-36 lg:pt-40 w-full pointer-events-none">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-4 text-primary leading-[1.2] md:w-[60%]"
          >
            {hero?.title || 'THE SPIRIT OF CULTURE'}
          </h1>
          <p className="text-text-primary font-medium text-xs sm:text-sm md:text-base max-w-lg lg:max-w-xl leading-relaxed drop-shadow-sm">
            {hero?.subtitle || 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life.'}
          </p>
        </div>
      )}

    </section>
  );
};

export default EventsHero;
