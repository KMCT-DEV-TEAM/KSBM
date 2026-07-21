"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const EliteAdvantageSection = ({ data }) => {
  const heading = data?.eliteHeading || 'The Elite Advantage';
  const desc = data?.eliteDesc || 'The MBA program at KSBM is uniquely crafted for young professionals and recent graduates aiming for high-impact leadership careers. Through our case-study pedagogy, industry immersions, and rigorous academic standards, students gain practical business intelligence and decision-making capabilities that stand out in today\'s corporate landscape.\n\nSupported by experienced faculty and corporate mentors, we focus on analytical depth, strategic vision, and holistic individual development, preparing students to excel in top multinational corporations and dynamic entrepreneurial ventures across India and globally.';
  const image = data?.eliteImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop';

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center items-start text-left"
          >
            <div className="flex items-center gap-4 sm:gap-6 w-full mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary tracking-tight font-heading shrink-0">
                {heading}
              </h2>
              <div className="h-[1px] bg-[#E3E3E3] flex-1 rounded-full" />
            </div>

            {desc.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-600 text-[17px] leading-relaxed mb-6 font-normal">
                {para}
              </p>
            ))}

          </motion.div>

          {/* Right Image Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex items-stretch justify-center relative"
          >
            <div className="relative w-full h-full min-h-[300px] rounded-[18px] overflow-hidden shadow-[0_20px_50px_rgba(43,47,102,0.15)] border-4 border-white group">
              <img
                src={image}
                alt="Corporate Leadership Handshake at KSBM"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = '/assets/Images/image 2.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default EliteAdvantageSection;
