"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ExaminationsOverview = ({ data }) => {
  const title = data?.overviewTitle || 'Examination Overview';
  const text1 = data?.overviewText1 || 'Our examination system is designed to evaluate students through a comprehensive and transparent assessment process that reflects both academic knowledge and practical application. A balanced combination of internal assessments, assignments, presentations, case studies, projects, and end-semester examinations ensures continuous learning and holistic development throughout the program.';
  const text2 = data?.overviewText2 || 'The examination process follows the academic calendar and is conducted with fairness, consistency, and integrity. Students are encouraged to demonstrate analytical thinking, problem-solving abilities, and managerial competencies through various evaluation methods. Timely notifications, published examination schedules, and prompt result declarations help students stay informed and well-prepared.';
  const image = data?.overviewImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-[#1b2559] tracking-tight leading-tight mb-6 font-heading">
              {title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-5 font-normal">
              {text1}
            </p>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed font-normal">
              {text2}
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 aspect-[4/3] w-full max-w-lg lg:max-w-none bg-gray-100">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-500 ease-out"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ExaminationsOverview;
