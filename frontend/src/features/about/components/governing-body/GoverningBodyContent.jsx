"use client";
import React from 'react';
import { motion } from 'framer-motion';

const GoverningBodyContent = ({ data }) => {
  return (
    <section className="py-20 w-[98%] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col relative"
      >
        {/* Background decorative shape like in mockup (right side faded pattern) */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none -z-10 w-64 h-64 bg-contain bg-no-repeat bg-right-top"></div>

        <div className="mb-4">
          <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            {data?.contentSubheading || "COMMITTEE"}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#454e7d] mb-8">
          {data?.contentHeading || "Governing Body"}
        </h2>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px]">
          {(data?.contentDescription && data.contentDescription.length > 0 ? data.contentDescription : [
            "The Governing Body of KMCT School of Business Management plays a pivotal role in shaping the institution's academic and administrative framework. The body is chaired by Dr. Navas KM, with Dr. Ayisha Nazreen serving as the Special Invitee, and Dr. Sujith Varma as the Member Secretary. It also includes selected faculty members who serve as academic nominees, industry representatives, and ex-officio members, ensuring a diverse and well-rounded leadership.",
            "The Governing Body is committed to maintaining academic excellence, fostering research and innovation, and strengthening industry-academic collaborations. Through strategic decision-making and policy implementation, it ensures the holistic development of students and the institution, keeping pace with the evolving landscape of management education."
          ]).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default GoverningBodyContent;
