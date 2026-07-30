"use client";
import React from 'react';
import { motion } from 'framer-motion';

const GoverningBodyContent = ({ data }) => {
  if (data?.showContentDetails === false) return null;

  return (
    <section className="py-20 w-[98%] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col relative"
      >
        {/* Background decorative shape */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none -z-10 w-64 h-64 bg-contain bg-no-repeat bg-right-top"></div>

        {data?.showContentSubheading !== false && (
          <div className="mb-4">
            <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">
              {data?.contentSubheading || "COMMITTEE"}
            </span>
          </div>
        )}

        {data?.showContentHeading !== false && (
          <h2 className="text-3xl md:text-4xl font-bold text-[#454e7d] mb-8">
            {data?.contentHeading || "Governing Body"}
          </h2>
        )}

        {data?.showContentDescription !== false && (
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px]">
            {(data?.contentDescription && data.contentDescription.length > 0 ? data.contentDescription : [
              "The Governing Body of KMCT School of Business Management plays a crucial role in guiding the institution's strategic vision and academic progress. It is composed of distinguished leaders and experts from various industries who provide valuable insights and guidance. Their collective expertise ensures that our curriculum remains relevant, innovative, and aligned with industry standards, empowering our students to become the future leaders of the business world.",
              "We regularly collaborate with industry experts to adapt our programs, ensuring students acquire the practical skills necessary for today's dynamic business environment. This commitment to excellence makes our graduates highly sought after by top employers globally."
            ]).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default GoverningBodyContent;
