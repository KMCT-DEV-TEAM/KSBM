"use client";
import React from 'react';
import { motion } from 'framer-motion';

const AdvisoryBoardContent = ({ data }) => {
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

        <div className="mb-4">
          <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            {data?.contentSubheading || "ADVISORY BOARD"}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#454e7d] mb-8">
          {data?.contentHeading || "Institutional Advisory Board"}
        </h2>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px]">
          {(data?.contentDescription && data.contentDescription.length > 0 ? data.contentDescription : [
            "The Institutional Advisory Board of KMCT School of Business Management plays a crucial role in guiding the institution's strategic vision and academic progress. The board is chaired by Dr. Navas KM, with Dr. Ayisha Nazreen (Executive Trustee and Director) serving as a Special Invitee, and Dr. Shmmon M (Principal) serving as the Member Secretary. The board also includes selected faculty members representing industry, research, teaching staff, and nominated members, ensuring a well-rounded governance structure.",
            "The Institutional Advisory Board is committed to fostering academic excellence, promoting research-driven initiatives, and strengthening industry collaborations. It aims to provide strategic direction for curriculum development, faculty advancement, and student success, ensuring the college remains at the forefront of management education and innovation."
          ]).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AdvisoryBoardContent;
