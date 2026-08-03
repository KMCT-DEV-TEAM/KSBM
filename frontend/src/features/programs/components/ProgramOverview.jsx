"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, CheckCircle, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalLinks } from '../../../hooks/useGlobalLinks';

const ProgramOverview = ({ program }) => {
  const badgeText = program.overviewBadgeText || (program.id === 'bba' ? 'UNDERGRADUATE EXCELLENCE' : 'POSTGRADUATE EXCELLENCE');
  const floatingBadgeText = program.overviewFloatingBadgeText || (program.id === 'bba' ? '3-Year Foundation' : '100% Case-Study Driven');
  const primaryBtnText = program.overviewPrimaryBtnText || 'Apply Now';
  const secondaryBtnText = program.overviewSecondaryBtnText || 'Download Brochure';
  const globalLinks = useGlobalLinks();
  const applyLink = globalLinks['global_apply']?.link || '#admission';
  const brochureUrl = globalLinks['hero_brochure']?.link || null;

  return (
    <section id="overview" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase mb-3 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-[#5594c0]" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-semibold text-primary tracking-tight leading-[1.2] mb-6 font-heading">
              {program.overviewTitle || program.title}
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6 font-normal">
              {program.overviewText}
            </p>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 font-normal">
              {program.overviewSubtext}
            </p>


            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href={applyLink}
                className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-primary text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(27,37,89,0.25)] hover:bg-[#162050] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {brochureUrl ? (
                <a
                  href={brochureUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-white border-2 border-primary/20 text-primary font-semibold text-sm tracking-wide hover:bg-blue-50/50 hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 text-primary group-hover:-translate-y-0.5 transition-transform" />
                  <span>{secondaryBtnText}</span>
                </a>
              ) : null}
            </div>
          </motion.div>

          {/* Right Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-[10px] overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3]">
                <img
                  src={program.overviewImage || "/assets/Images/mba/mba_main.png"}
                  alt={`${program.shortTitle} Overview`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge 1 - Bottom Left Border */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-5 sm:-bottom-6 left-2 sm:-left-6 lg:-left-10 bg-white p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center gap-3.5 z-20"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                    {floatingBadgeText}
                  </h4>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default ProgramOverview;
