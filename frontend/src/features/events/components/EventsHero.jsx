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
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-[#050505]/10">

      {/* Decorative Mandala (Bottom Left, perfectly split with next section) */}
      <div className="absolute left-[-10%] bottom-0 translate-y-[35%] w-64 sm:w-80 md:w-96 lg:w-[32rem] aspect-square z-20 pointer-events-none opacity-80 mix-blend-screen">
        <img src="/assets/Images/mandala.png" alt="Mandala" className="w-full h-full object-contain" />
      </div>

      {/* Background Image: Scaled Down */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-10">
        <img
          src="/assets/Images/Group 250.png"
          alt="Events Hero Background"
          className="w-[75%] md:w-[65%] lg:w-[55%] max-w-5xl h-auto object-contain opacity-90"
        />
        {/* Subtle gradient overlay to ensure the film strip pops if needed */}
        <div className="absolute inset-0 bg-[#050505]/60"></div>
      </div>

      {/* Right Side: Film Strip Floating on Top */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex justify-end overflow-hidden pointer-events-auto ">

        {/* Film Strip Image Container */}
        <div className="relative w-48 md:w-56 lg:w-64 aspect-[1/3]">

          {/* The 3 Photos (placed behind the film strip overlay) */}
          <div className="absolute inset-0 flex flex-col justify-between py-[2%] pl-[25%] pr-[15%] z-0">
            {stripImages.map((img, idx) => (
              <div key={idx} className="h-[30%] w-full overflow-hidden">
                <img
                  src="/assets/Images/image 86.png"
                  alt={`Film frame ${idx + 1}`}
                  className="w-[85%] mb-5 ml-5 h-full object-fill opacity-90"
                />
              </div>
            ))}
          </div>

          {/* Film Strip Overlay */}
          <img
            src="/assets/Images/image 85.png"
            alt="Film Strip Overlay"
            className="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none drop-shadow-2xl"
          />

        </div>
      </div>

    </section>
  );
};

export default EventsHero;
