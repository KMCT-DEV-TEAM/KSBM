"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye } from 'lucide-react';

const VisionMissionSection = () => {
  const scrollRef = useRef(null);
  const floatScrollRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Custom scrollbar thumb movement (track is 150px, thumb is 40px)
  const indicatorY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isHovered) return;

    floatScrollRef.current = el.scrollTop;
    let animationId;
    const scroll = () => {
      floatScrollRef.current += 0.1; // Adjusted speed
      el.scrollTop = floatScrollRef.current;

      // Sync if user manually scrolls
      if (Math.abs(el.scrollTop - floatScrollRef.current) > 2) {
        floatScrollRef.current = el.scrollTop;
      }

      // Reset if reached the bottom
      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        el.scrollTop = 0;
        floatScrollRef.current = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <section className="py-20 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >


        {/* Mission Card */}


        {/* Vision Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } } }}
          className="flex items-stretch"
        >
          {/* Left Vertical Text */}
          <div className="hidden md:flex flex-col items-center mr-4 lg:mr-8 justify-center">
            <span className="text-[#454e7d] font-semibold tracking-widest text-sm uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              OUR VISION
            </span>
            <div className="w-[1px] h-24 bg-[#454e7d] mt-4 opacity-50"></div>
          </div>

          <div className="flex-1 relative rounded-2xl shadow-lg p-10 lg:p-14 flex flex-col justify-center items-center min-h-[300px] overflow-hidden group">
            {/* Background Image */}
            <img
              src="/assets/Images/image 27.png"
              alt="Vision Background"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
            />
            {/* Purple Overlay */}
            <div className="absolute inset-0 bg-[#454e7d]/90 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              {/* Eye Icon */}
              <div className="mb-4 text-white/80">
                <Eye size={36} strokeWidth={1} />
              </div>

              {/* Title */}
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold mb-8">
                Our Vision
              </h3>

              {/* Content text */}
              <p className="text-white/90 text-sm md:text-base leading-relaxed italic max-w-sm">
                "To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } } }}
          className="flex items-stretch"
        >
          {/* Left Vertical Text */}
          <div className="hidden md:flex flex-col items-center mr-4 lg:mr-8 justify-center">
            <span className="text-[#454e7d] font-semibold tracking-widest text-sm uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              OUR MISSION
            </span>
            <div className="w-[1px] h-24 bg-[#454e7d] mt-4 opacity-50"></div>
          </div>

          <div className="flex-1 relative rounded-2xl shadow-lg p-10 lg:p-14 flex flex-col min-h-[300px] overflow-hidden group">
            {/* Background Image */}
            <img
              src="/assets/Images/image 28.png"
              alt="Mission Background"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
            />
            {/* Purple Overlay */}
            <div className="absolute inset-0 bg-[#454e7d]/90 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 w-full h-full flex flex-col relative z-10">
              {/* Top Center Title */}
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold text-center mb-16">
                Our Mission
              </h3>

              {/* Content Section */}
              <div className="flex flex-col pr-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-[2px] h-6 bg-white shrink-0"></div>
                  <h4 className="text-white text-lg font-bold tracking-wide">Our Mission</h4>
                </div>

                {/* Scrollable Container */}
                <div
                  ref={scrollRef}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onTouchStart={() => setIsHovered(true)}
                  onTouchEnd={() => setIsHovered(false)}
                  className="overflow-y-auto pr-2 h-[120px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-6"
                >
                  <p className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1">
                    To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.
                  </p>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1">
                    To provide high-quality healthcare education that integrates academic excellence with clinical practice.
                  </p>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1">
                    To foster a culture of continuous learning, ethical practice, and compassionate patient care.
                  </p>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1">
                    To contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.
                  </p>
                </div>
              </div>

              {/* Custom Scroll Indicator (Right Edge) */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-[150px] w-[2px] bg-white/10 rounded-full">
                <motion.div
                  className="w-full bg-gradient-to-b from-white to-transparent rounded-full"
                  style={{ height: '40px', y: indicatorY }}
                />
              </div>
            </div>
          </div>
        </motion.div>


      </motion.div>
    </section>
  );
};

export default VisionMissionSection;
