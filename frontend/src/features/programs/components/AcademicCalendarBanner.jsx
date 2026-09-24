"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { downloadFile } from '../../../utils/downloadFile';

const AcademicCalendarBanner = ({ program }) => {
  const router = useRouter();
  const badgeText = program?.academicCalendarBanner?.badgeText || 'ACADEMIC SCHEDULE 2026-27';
  const titleText = program?.academicCalendarBanner?.title || 'Download the Official Academic Calendar';
  const descriptionText = program?.academicCalendarBanner?.description || 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.';
  
  const viewBtnText = 'View Calendar';
  const downloadBtnText = 'Download Calendar';
  
  const image = program?.academicCalendarBanner?.image || '/assets/Images/mba/mba_schedule.png';
  const pdfUrl = program?.academicCalendarBanner?.pdfUrl;

  const handleViewAction = (e) => {
    e.preventDefault();
    if (pdfUrl) {
      router.push(`/pdf-viewer?url=${encodeURIComponent(pdfUrl)}&title=Academic Calendar`);
    } else {
      Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No Calendar PDF Available', showConfirmButton: false, timer: 3000 });
    }
  };

  const handleDownloadAction = (e) => {
    e.preventDefault();
    if (pdfUrl) {
      downloadFile(e, pdfUrl, 'KSBM_Academic_Schedule.pdf');
    } else {
      Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No Calendar PDF Available', showConfirmButton: false, timer: 3000 });
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-white relative my-12">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
              {titleText}
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-xl font-normal">
              {descriptionText}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleViewAction}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-[#1b2559] text-white font-semibold text-xs tracking-wide shadow-md hover:bg-[#151c44] hover:-translate-y-0.5 transition-all duration-300 text-center cursor-pointer"
              >
                <span>{viewBtnText}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAction}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-white border border-gray-300 text-[#1b2559] font-semibold text-xs tracking-wide hover:bg-gray-50/80 hover:border-[#1b2559] transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadBtnText}</span>
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center z-10">
            <div className="relative max-h-[300px] w-full max-w-[380px] flex justify-center">
              <img
                src={image}
                alt={titleText}
                className="w-full h-auto object-contain max-h-[260px] drop-shadow-md transform hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default AcademicCalendarBanner;
