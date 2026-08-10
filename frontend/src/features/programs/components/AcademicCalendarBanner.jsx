"use client";
import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const AcademicCalendarBanner = ({ program }) => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
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
      setIsPdfModalOpen(true);
    } else {
      Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No Calendar PDF Available', showConfirmButton: false, timer: 3000 });
    }
  };

  const handleDownloadAction = async (e) => {
    e.preventDefault();
    if (pdfUrl) {
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'KSBM_Academic_Schedule.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed, falling back to open:", error);
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }
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

      <AnimatePresence>
        {isPdfModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl h-[75vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-[#1b2559]">Academic Calendar</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadAction}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1b2559] rounded-lg transition-colors text-sm font-semibold cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-gray-100">
                <iframe 
                  src={`${pdfUrl}#toolbar=0`} 
                  className="w-full h-full border-none"
                  title="Academic Calendar PDF"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AcademicCalendarBanner;
