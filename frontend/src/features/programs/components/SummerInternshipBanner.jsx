"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const SummerInternshipBanner = ({ program }) => {
  const badgeText = program?.internshipBadge || "EXPERIENTIAL LEARNING";
  const btnText = program?.internshipBtnText || "Apply Now";
  const btnLink = program?.internshipBtnLink || "/#contact";
  const floatingImages = program?.internshipImages && program.internshipImages.length > 0
    ? program.internshipImages
    : [
        "/assets/Images/image 2.png",
        "/assets/Images/image 27.png",
        "/assets/Images/image 28.png"
      ];

  return (
    <section className="relative min-h-[660px] lg:min-h-[760px] flex items-center py-16 lg:py-24 overflow-hidden bg-[#111836]">
      {/* Full-width Scenic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={program?.internshipBgImage || "/assets/Images/image 67.png"}
          alt="Summer Internship Background"
          className="w-full h-full object-cover object-center opacity-45 transform hover:scale-105 transition-transform duration-1000"
        />
        {/* Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-[#303580]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111836] via-transparent to-transparent opacity-60" />
      </div>

      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start lg:pt-6"
          >
            <span className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-[0.25em] text-white uppercase mb-7">
              <span className="w-8 h-[2px] bg-white rounded-full shrink-0" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[58px] font-bold tracking-tight text-white mb-6 leading-tight font-heading">
              {program?.internshipTitle || "Summer Internship Program"}
            </h2>
            <p className="text-gray-200 text-[16px] font-normal leading-relaxed max-w-2xl mb-8">
              {program?.internshipDesc || "Our mandatory 8-week summer internship bridges the gap between academic theory and real-world corporate challenges, enabling students to work directly with industry leaders across top conglomerates and high-growth startups."}
            </p>

            <Link
              href={btnLink}
              className="px-8 py-4 rounded-[18px] bg-white text-primary font-semibold text-sm sm:text-base tracking-wide shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:bg-blue-50 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Floating Cards positioned lower down below the text section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end mt-12 lg:mt-[220px] lg:translate-y-25"
          >
            <div className="grid grid-cols-3 gap-3.5 sm:gap-5 w-full max-w-md lg:max-w-none">
              {floatingImages.map((imgUrl, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] border-4 border-white/20 aspect-[3/4] bg-gray-800"
                >
                  <img
                    src={imgUrl}
                    alt={`Internship Highlight ${i + 1}`}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SummerInternshipBanner;
