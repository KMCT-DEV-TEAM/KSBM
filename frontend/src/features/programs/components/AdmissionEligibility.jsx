"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const AdmissionEligibility = ({ eligibility }) => {
  return (
    <section id="admission" className="py-20 sm:py-28 bg-primary relative overflow-hidden text-white">
      {/* Decorative Gradient / Grid */}
      <div className="absolute inset-0 opacity-10 " />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mt-3 mb-4 font-heading">
            Admission & Eligibility
          </h2>
          <p className="text-gray-300 text-base sm:text-lg font-normal">
            Clear, transparent, and merit-based admission process designed to discover passionate future business leaders.
          </p>
        </motion.div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16 max-w-5xl mx-auto">
          {eligibility.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 rounded-[18px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">

                  <span className="text-2xl font-bold text-white/80 font-heading">
                    {item.step || `0${idx + 1}`}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors duration-300 mb-2 font-heading">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-white font-normal leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center justify-center pt-6"
        >
          <p className="text-gray-300 text-sm sm:text-base font-medium mb-6">
            Ready to embark on your leadership and academic excellence journey?
          </p>
          <Link
            href="/#contact"
            className="px-10 py-5 rounded-[18px] bg-white text-primary font-semibold text-base tracking-wide shadow-[0_12px_30px_rgba(255,255,255,0.25)] hover:bg-blue-50 hover:scale-[1.03] transition-all duration-300 flex items-center gap-3 group"
          >
            <span>Start your Application</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default AdmissionEligibility;
