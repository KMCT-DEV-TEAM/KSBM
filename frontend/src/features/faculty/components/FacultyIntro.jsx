"use client";
import React from 'react';
import { motion } from 'framer-motion';

const FacultyIntro = ({ data }) => {
  return (
    <section className="relative py-16 md:py-24 bg-[#fcfcfd] overflow-hidden border-b border-gray-100">
      {/* Decorative Watermark Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/assets/Images/watermark_logo.png"
          alt="KSBM Watermark"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl"
        >
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 block">
            {data?.introSubheading || "FACULTY MEMBERS"}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1e2869] mb-6 tracking-tight">
            {data?.introHeading || "Learn from the Best"}
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {data?.introText || "At KSBM, our faculty members are the cornerstone of academic excellence. With a blend of strong academic credentials, industry expertise, and a passion for teaching, they create a dynamic learning environment that encourages critical thinking, innovation, and leadership. Beyond the classroom, our faculty mentor, inspire, and guide students through every stage of their academic journey, equipping them with the knowledge, confidence, and practical skills needed to succeed in an ever-evolving global business landscape."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FacultyIntro;
