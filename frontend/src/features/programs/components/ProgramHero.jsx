"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { useGlobalLinks } from '../../../hooks/useGlobalLinks';

const ProgramHero = ({ program }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isBba = program.id === 'bba';
  const globalLinks = useGlobalLinks();
  const brochureUrl = globalLinks['hero_brochure']?.link || null;

  useEffect(() => {
    const img = new Image();
    img.src = program.heroImage || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop";
    img.onload = () => setImagesLoaded(true);
    img.onerror = () => setImagesLoaded(true);
  }, [program.heroImage]);

  const line1 = program.heroTitleLine1 || (isBba ? "Bachelor of Business" : "Master of Business");
  const line2 = program.heroTitleLine2 || (isBba ? "Administration (BBA)" : "Administration (MBA)");
  const primaryBtnText = program.heroPrimaryBtnText || "EXPLORE PROGRAM";
  const secondaryBtnText = program.heroSecondaryBtnText || "DOWNLOAD BROCHURE";

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex items-center">
      {/* Background Image with Transition */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <img
          src={program.heroImage || "/assets/Images/mba/mba_hero_bg.png"}
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
      </motion.div>

      {/* Main Content exact match with Home Hero container */}
      {program?.showSections?.hero !== false && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
          }
        }}
        className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:py-32"
      >
        {/* Pill Badge */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="inline-flex items-center gap-2.5 bg-background/20 backdrop-blur-md rounded-full pr-5 pl-2 py-1.5 text-[0.60rem] sm:text-[0.65rem] font-semibold tracking-widest text-white border border-white/30 uppercase mb-8 self-start shadow-sm"
        >
          <div className="flex items-center justify-center bg-white/10 rounded-full p-1">
            <svg viewBox="-50 -50 100 100" className="w-5 h-5 text-[#5594c0]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 8 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 45})`}>
                  <polygon points="0,-4 -6,-16 6,-16" />
                  <polygon points="0,-32 -8,-18 8,-18" />
                  <polygon points="0,-34 -12,-48 12,-48" />
                  <polygon points="-11,-20 -20,-20 -15,-30" />
                  <polygon points="11,-20 20,-20 15,-30" />
                </g>
              ))}
            </svg>
          </div>
          {`ACADEMIC PROGRAM • ${program.shortTitle}`}
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white"
        >
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="max-w-[75%] sm:max-w-xl md:max-w-2xl text-xs md:text-sm mt-6 text-gray-200 leading-relaxed font-medium"
        >
          {program.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-10"
        >
          <Link href="#overview" className="bg-secondary text-primary text-sm md:text-base font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start">
            <span>{primaryBtnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          {brochureUrl ? (
            <a
              href={brochureUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start"
            >
              <Download className="w-4 h-4" />
              <span>{secondaryBtnText}</span>
            </a>
          ) : null}
        </motion.div>
      </motion.div>
      )}
    </div>
  );
};

export default ProgramHero;
