"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, GraduationCap, Download, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGlobalLinks } from '../../../hooks/useGlobalLinks';

const AdmissionHero = ({ data, showText = true }) => {
  const globalLinks = useGlobalLinks();
  const heroApplyBtn = globalLinks['global_apply'];
  const heroBrochureBtn = globalLinks['hero_brochure'];
  
  const badgeText = data?.heroBadgeText || 'ADMISSION OPEN FOR 2025-26';
  const title = data?.heroTitle || 'Your Path to Corporate Leadership Starts Here';
  const subtitle = data?.heroSubtitle || 'Join a diverse cohort of MBA & BBA candidates at the forefront of business mastery. Transparent, merit-based, and designed to unlock your full leadership potential.';
  const bgImage = data?.heroBgImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';

  return (
    <section className="relative min-h-[80vh] sm:min-h-screen w-full bg-[#111638] text-white overflow-hidden shadow-2xl flex items-center">
      {/* Background Image with Transition */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={bgImage}
          alt="KSBM Campus & Admissions"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/Images/admissions/image 73.png';
          }}
        />
        <div className="absolute inset-0 bg-black/75 " />
      </motion.div>

      {/* Background Glows & Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />

      {/* Main Content exact match with MBA Hero container */}
      {showText && (
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
          className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:py-32 flex flex-col items-start text-left"
        >
          {/* Breadcrumb Tag / Pill Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[18px] bg-white/10 border border-white/15 backdrop-blur-md mb-8 self-start shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-blue-200 uppercase">
              {badgeText}
            </span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white font-heading text-left max-w-3xl sm:max-w-4xl"
          >
            {title}
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="max-w-2xl text-xs md:text-sm mt-6 text-gray-200 leading-relaxed font-medium text-left"
          >
            {subtitle}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="flex flex-row flex-wrap items-center gap-4 mt-10"
          >
            {heroApplyBtn?.isActive !== false && (
              <a
                href={heroApplyBtn?.link || '#'}
                target={(heroApplyBtn?.link || '').startsWith('http') ? '_blank' : undefined}
                rel={(heroApplyBtn?.link || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white text-primary text-sm md:text-base font-bold px-6 py-3.5 rounded-full flex items-center gap-2 hover:bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-auto justify-center"
              >
                {heroApplyBtn?.label || 'Apply Now'} <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}
            {heroBrochureBtn?.isActive !== false && (
              <a
                href={heroBrochureBtn?.link || '#'}
                target={(heroBrochureBtn?.link || '').startsWith('http') ? '_blank' : undefined}
                rel={(heroBrochureBtn?.link || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-background/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-bold px-6 py-3.5 rounded-full flex items-center gap-2 hover:bg-background/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-auto justify-center"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                <span>{heroBrochureBtn?.label || 'Download Brochure'}</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default AdmissionHero;
