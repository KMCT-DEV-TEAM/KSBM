"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const LegacySection = ({ data }) => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Side: Overlapping Collage Composition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative pb-16 pt-8 sm:pb-20 sm:pt-12 px-2 sm:px-6"
          >
            {/* Bottom/Left Main Image */}
            <div className="relative z-10 w-[85%] sm:w-[80%] h-[280px] sm:h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
              <img
                src={data?.mainImage || "/assets/Images/image 60.png"}
                alt="Graduates celebrating"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Top/Right Overlapping Image */}
            <div className="absolute top-0 right-0 z-20 w-[60%] sm:w-[55%] h-[200px] sm:h-[240px] rounded-3xl overflow-hidden shadow-xl border-4 sm:border-[6px] border-white bg-gray-100">
              <img
                src={data?.secondaryImage || "https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1000&auto=format&fit=crop"}
                alt="Graduate achievement"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Bottom Floating Banner Box */}
            <div className="absolute bottom-8 sm:bottom-15 right-2 sm:right-6 z-30 w-[70%] sm:w-[60%] max-w-[340px] bg-primary text-white p-3 sm:p-3.5 rounded-xl shadow-2xl border border-white/15 flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-lg shrink-0">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                {data?.floatingQuote || '"Shaping the future through principled leadership and excellence."'}
              </p>
            </div>
          </motion.div>

          {/* Right Side: Text & Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                {data?.subtitle || 'KSBM ALUMNI NETWORK / OUR LEGACY'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2b2b68] tracking-tight leading-tight">
              {data?.title || 'Legacy of Excellence'}
            </h2>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {data?.description1 || 'Since our inception, the KMCT School of Business Management has been a beacon of academic brilliance and professional development. Our alumni embody our mission, leading top organizations and shaping global markets across diverse industries.'}
            </p>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {data?.description2 || 'With over three decades of history, we take immense pride in having trained thousands of remarkable business leaders. The KMCT Alumni Association is dedicated to fostering lifelong relationships between the institution and its graduates.'}
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200/80">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#2b2b68] tracking-tight">
                  {data?.stat1Value || '30k+'}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1.5">
                  {data?.stat1Label || 'Global Alumni'}
                </p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#2b2b68] tracking-tight">
                  {data?.stat2Value || '150+'}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1.5">
                  {data?.stat2Label || 'Industry Leaders'}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LegacySection;
