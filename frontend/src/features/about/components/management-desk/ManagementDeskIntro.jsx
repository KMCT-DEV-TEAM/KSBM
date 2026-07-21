"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ManagementDeskIntro = ({ data }) => {
  const defaultDescription = [
    "The Management Desk at KSBM sets the vision, strategy, and direction for the institution, guiding future leaders and administrators with a firm commitment to high academic and professional standards. Our dedicated management board brings invaluable experience across top industries, governing and mentoring students with confidence. Through strategic guidance and a student-centric approach, they ensure that every learner receives the opportunities, support, and mentorship needed to excel in both academic and professional life."
  ];

  const description = data?.introDescription && data.introDescription.length > 0
    ? data.introDescription
    : defaultDescription;

  return (
    <section className="py-20 relative w-full overflow-hidden">
      {/* Decorative Rotating Half Watermark on Right Edge of Screen */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, ease: "linear", repeat: Infinity }}
        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-[280px] md:w-[320px] h-[280px] md:h-[320px] opacity-50 pointer-events-none select-none z-0"
      >
        <div
          className="w-full h-full bg-primary"
          style={{
            maskImage: `url('/assets/Images/watermark_logo.png')`,
            WebkitMaskImage: `url('/assets/Images/watermark_logo.png')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      </motion.div>

      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col relative max-w-5xl"
        >
          <div className="mb-4">
            <span className="text-gray-400 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {data?.introSubheading || "MANAGEMENT DESK"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2b2b68] mb-6 tracking-tight">
            {data?.introHeading || "A Vision That Inspires Excellence"}
          </h2>

          <div className="space-y-4 text-gray-600 leading-relaxed text-xs sm:text-sm font-normal">
            {description.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ManagementDeskIntro;
