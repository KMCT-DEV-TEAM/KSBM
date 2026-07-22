import React from 'react';
import { motion } from 'framer-motion';

const TopRecruiters = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;
  const recruiters = data.items;
  return (
    <section className="py-16 bg-white relative text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
      >

        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">{data.title}</h2>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          {data.description}
        </p>

        {/* Infinite Scroll Logo Marquee */}
        <div className="overflow-hidden w-full relative">
          {/* Gradient Edges for smooth fade */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Line 1 - Moving Left */}
          <motion.div 
            className="flex w-max gap-12 md:gap-20 py-4 mb-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >
            {[...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters].map((recruiter, index) => (
              <div key={`l1-${recruiter.id}-${index}`} className="w-24 md:w-32 lg:w-40 flex-shrink-0 flex items-center justify-center p-4">
                <img src={recruiter.logo} alt={recruiter.name} className="w-full h-auto object-contain" />
              </div>
            ))}
          </motion.div>

          {/* Line 2 - Moving Left */}
          <motion.div 
            className="flex w-max gap-12 md:gap-20 py-4 mb-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {[...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters].map((recruiter, index) => (
              <div key={`l2-${recruiter.id}-${index}`} className="w-24 md:w-32 lg:w-40 flex-shrink-0 flex items-center justify-center p-4">
                <img src={recruiter.logo} alt={recruiter.name} className="w-full h-auto object-contain" />
              </div>
            ))}
          </motion.div>

          {/* Line 3 - Moving Left (Faster) */}
          <motion.div 
            className="flex w-max gap-12 md:gap-20 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters, ...recruiters].map((recruiter, index) => (
              <div key={`l3-${recruiter.id}-${index}`} className="w-24 md:w-32 lg:w-40 flex-shrink-0 flex items-center justify-center p-4">
                <img src={recruiter.logo} alt={recruiter.name} className="w-full h-auto object-contain" />
              </div>
            ))}
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default TopRecruiters;
