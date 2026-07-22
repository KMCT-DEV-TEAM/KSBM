import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const PlacementOverview = ({ data }) => {
  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
                src={data.collageImage1}
                alt="Collage Image 1"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Top/Right Overlapping Image */}
            <div className="absolute top-0 right-0 z-20 w-[60%] sm:w-[55%] h-[200px] sm:h-[240px] rounded-3xl overflow-hidden shadow-xl border-4 sm:border-[6px] border-white bg-gray-100">
              <img
                src={data.collageImage2}
                alt="Collage Image 2"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Bottom Floating Banner Box */}
            <div className="absolute bottom-8 sm:bottom-15 right-2 sm:right-6 z-30 w-[70%] sm:w-[60%] max-w-[340px] bg-primary text-white p-3 sm:p-3.5 rounded-xl shadow-2xl border border-white/15 flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-lg shrink-0">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                {data.floatingQuote}
              </p>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                  {data.deskBadge}
                </span>
                <div className="h-px bg-primary/30 w-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                {data.title}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-base text-gray-600 leading-relaxed font-medium">
                {data.description1}
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                {data.description2}
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-6 sm:gap-10 border-t border-gray-100">
              <div>
                <p className="text-3xl font-bold text-primary mb-1">{data.stat1Value}</p>
                <p className="text-sm text-gray-500 font-medium">{data.stat1Label}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-1">{data.stat2Value}</p>
                <p className="text-sm text-gray-500 font-medium">{data.stat2Label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlacementOverview;
