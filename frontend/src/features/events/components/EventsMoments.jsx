"use client"
import React from 'react';

const EventsMoments = ({ momentsCaptured }) => {
  return (
    <section className="w-full py-19 px-6 relative bg-transparent">
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scrollUp 50s linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown 60s linear infinite;
        }
        .animate-scroll-up-fast {
          animation: scrollUp 40s linear infinite;
        }
        .pause-on-hover:hover .animate-scroll-up,
        .pause-on-hover:hover .animate-scroll-down,
        .pause-on-hover:hover .animate-scroll-up-fast {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="relative flex items-center justify-center w-full mt-10 mb-12">
          {/* Ambient Section Primary Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[200px] z-[-1] pointer-events-none opacity-35 blur-[60px]"
            style={{ backgroundImage: 'radial-gradient(circle at center, #2B2F66 20%, rgba(115, 115, 115, 0) 100%)' }}
          ></div>

          {/* Background Image Left */}
          <img src="/assets/Images/image%2055.png" alt="" className="absolute left-[-2%] top-[40px] h-[280px] md:h-[380px] lg:h-[480px] w-auto object-contain opacity-80 z-0 pointer-events-none drop-shadow-[0_0_20px_rgba(43,47,102,0.4)]" />

          {/* Center Heading Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2 drop-shadow-sm text-text-secondary">
              Gallery
            </h5>
            <h2 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest text-primary drop-shadow-sm leading-snug">
              {momentsCaptured.heading}
            </h2>
          </div>

          {/* Background Image Right */}
          <img src="/assets/Images/Events/image%20142.png" alt="" className="absolute right-[-2%] top-[15px] h-[180px] md:h-[280px] lg:h-[400px] w-auto object-contain opacity-80 z-0 pointer-events-none drop-shadow-[0_0_20px_rgba(43,47,102,0.4)]" />
        </div>

        {/* Scrolling Gallery Grid */}
        <div className="w-[98%] max-w-[1440px] mx-auto h-[500px] md:h-[800px] overflow-hidden relative mt-8 md:mt-16 flex items-center justify-center pause-on-hover">
          {/* Ambient Gallery Middle Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] z-[-1] pointer-events-none opacity-35 blur-[60px]"
            style={{ backgroundImage: 'radial-gradient(circle at center, #2B2F66 20%, rgba(115, 115, 115, 0) 100%)' }}
          ></div>

          {/* Fading edges for smooth entry/exit */}
          <div className="absolute top-0 left-0 w-full h-[100px] z-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[100px] z-20 pointer-events-none"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 h-full w-full relative z-10">
            {/* Column 1 (Scrolls Up) */}
            <div className="h-full overflow-hidden">
              <div className="flex flex-col animate-scroll-up">
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col gap-6 pb-6">
                    {momentsCaptured.images.map((item, idx) => (
                      <div key={`col1-${groupIdx}-${idx}`} className="w-[95%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-[0_0_10px_rgba(43,47,102,0.15)] transition-colors">
                        <img src={item.img || "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop"} alt="Moment" className="w-full h-[180px] md:h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 (Scrolls Down) */}
            <div className="h-full overflow-hidden block">
              <div className="flex flex-col animate-scroll-down">
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col gap-6 pb-6">
                    {[...momentsCaptured.images].reverse().map((item, idx) => (
                      <div key={`col2-${groupIdx}-${idx}`} className="w-[95%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-[0_0_10px_rgba(43,47,102,0.15)] transition-colors">
                        <img src={item.img || "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop"} alt="Moment" className="w-full h-[180px] md:h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 (Scrolls Up) */}
            <div className="h-full overflow-hidden hidden md:block">
              <div className="flex flex-col animate-scroll-up-fast">
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col gap-6 pb-6">
                    {momentsCaptured.images.map((item, idx) => (
                      <div key={`col3-${groupIdx}-${idx}`} className="w-[95%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-[0_0_10px_rgba(43,47,102,0.15)] transition-colors">
                        <img src={item.img || "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop"} alt="Moment" className="w-full h-[180px] md:h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsMoments;
