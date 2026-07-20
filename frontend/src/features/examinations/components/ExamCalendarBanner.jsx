"use client";
import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamCalendarBanner = ({ data }) => {
  const title = data?.calendarTitle || 'Download the Official Exam Calendar';
  const text = data?.calendarText || 'Stay informed with the official Exam Calendar. Access semester schedules, examination dates, academic milestones, holidays, project timelines, and important university events—all in one place.';
  const viewBtnText = data?.calendarViewBtnText || 'View Calendar';
  const viewBtnUrl = data?.calendarViewBtnUrl || '/assets/Images/image 64.png';
  const downloadBtnText = data?.calendarDownloadBtnText || 'Download Calendar';
  const downloadBtnUrl = data?.calendarDownloadBtnUrl || '/assets/Images/image 64.png';
  const image = data?.calendarImage || '/assets/Images/image 64.png';

  return (
    <section className="pb-16 lg:pb-24 bg-white relative">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative py-6"
        >
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold text-[#1b2559] tracking-tight mb-4 font-heading leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-xl font-normal">
              {text}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href={viewBtnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-[#1b2559] text-white font-semibold text-xs tracking-wide shadow-md hover:bg-[#151c44] hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                {viewBtnText}
              </a>

              <a
                href={downloadBtnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-white border border-gray-300 text-[#1b2559] font-semibold text-xs tracking-wide hover:bg-gray-50/80 hover:border-[#1b2559] transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadBtnText}</span>
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center z-10">
            <div className="relative max-h-[300px] w-full max-w-[380px] flex justify-center">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-contain max-h-[260px] drop-shadow-md transform hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExamCalendarBanner;
