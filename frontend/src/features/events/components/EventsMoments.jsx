"use client"
import { motion } from 'framer-motion';
const EventsMoments = ({ momentsCaptured }) => {
  return (
    <section className="w-full py-19 px-6 relative bg-black">

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="relative flex items-center justify-center w-full mt-10 mb-12">
          {/* Ambient Section Pink Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[200px] bg-pink-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

          {/* Background Image Left */}
          <img src="/assets/Images/image%2055.png" alt="" className="absolute left-[-2%] top-[40px] h-[280px] md:h-[380px] lg:h-[480px] w-auto object-contain opacity-80 z-0 pointer-events-none drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]" />

          {/* Center Heading Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]"
              style={{
                background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Gallery</h5>
            <h2 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest text-[#ffccf0] drop-shadow-[0_0_15px_rgba(219,39,119,0.8)] leading-snug">
              {momentsCaptured.heading}
            </h2>
          </div>

          {/* Background Image Right */}
          <img src="/assets/Images/Events/image%20142.png" alt="" className="absolute right-[-2%] top-[15px] h-[180px] md:h-[280px] lg:h-[400px] w-auto object-contain opacity-80 z-0 pointer-events-none drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]" />
        </div>

        {/* Scrolling Gallery Grid */}
        <div className="w-[98%] max-w-[1440px] mx-auto h-[800px] overflow-hidden relative mt-16 flex items-center justify-center">
          {/* Ambient Gallery Middle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-pink-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

          {/* Fading edges for smooth entry/exit */}
          <div className="absolute top-0 left-0 w-full h-[100px] z-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[100px] z-20 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full w-full relative z-10">
            {/* Column 1 (Scrolls Up) */}
            <div className="h-full overflow-hidden">
              <motion.div
                className="flex flex-col gap-6"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              >
                {[...momentsCaptured.images, ...momentsCaptured.images].map((item, idx) => (
                  <div key={`col1-${idx}`} className="w-[90%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-white/5 transition-colors">
                    <img src={item.img} alt="Moment" className="w-full h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Column 2 (Scrolls Down) */}
            <div className="h-full overflow-hidden hidden md:block">
              <motion.div
                className="flex flex-col gap-6"
                animate={{ y: ["-50%", "0%"] }}
                transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              >
                {[...momentsCaptured.images, ...momentsCaptured.images].reverse().map((item, idx) => (
                  <div key={`col2-${idx}`} className="w-[90%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-white/5 transition-colors">
                    <img src={item.img} alt="Moment" className="w-full h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Column 3 (Scrolls Up) */}
            <div className="h-full overflow-hidden hidden md:block">
              <motion.div
                className="flex flex-col gap-6"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              >
                {[...momentsCaptured.images, ...momentsCaptured.images].map((item, idx) => (
                  <div key={`col3-${idx}`} className="w-[90%] md:w-[85%] mx-auto rounded-xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-colors">
                    <img src={item.img} alt="Moment" className="w-full h-[240px] lg:h-[320px] object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsMoments;
