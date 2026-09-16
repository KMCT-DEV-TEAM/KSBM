"use client";
import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ExamResultsTable = ({ data }) => {
  const [showAll, setShowAll] = React.useState(false);

  const rawResults = (data?.results && data.results.length > 0)
    ? data.results
    : [
      {
        id: 1,
        slNo: '01',
        dateDuration: 'NOV 10',
        courseName: 'CS502: Advanced Algorithms',
        semesterInfo: 'VIII Sem MBA 2026',
        pdfUrl: '#'
      },
      {
        id: 2,
        slNo: '02',
        dateDuration: 'NOV 15',
        courseName: 'MG601: Strategic Management & Leadership',
        semesterInfo: 'VIII Sem MBA 2026',
        pdfUrl: '#'
      },
      {
        id: 3,
        slNo: '03',
        dateDuration: 'NOV 18',
        courseName: 'BA404: Corporate Finance & Accounting',
        semesterInfo: 'VI Sem BBA 2026',
        pdfUrl: '#'
      },
      {
        id: 4,
        slNo: '04',
        dateDuration: 'NOV 22',
        courseName: 'MK505: Digital Marketing Analytics',
        semesterInfo: 'IV Sem MBA 2026',
        pdfUrl: '#'
      },
      {
        id: 5,
        slNo: '05',
        dateDuration: 'NOV 25',
        courseName: 'HR302: Human Resource Development',
        semesterInfo: 'IV Sem BBA 2026',
        pdfUrl: '#'
      },
      {
        id: 6,
        slNo: '06',
        dateDuration: 'NOV 28',
        courseName: 'EC201: Managerial Economics & Policy',
        semesterInfo: 'VI Sem MBA 2026',
        pdfUrl: '#'
      }
    ];

  const displayedResults = showAll ? rawResults : rawResults.slice(0, 3);

  const handleViewPdf = (e, pdfUrl, courseName) => {
    if (!pdfUrl || pdfUrl === '#') {
      e.preventDefault();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Opening examination result...',
        text: courseName?.substring(0, 40) + '...',
        showConfirmButton: false,
        timer: 2500
      });
    }
  };

  return (
    <section id="results" className="pb-20 lg:pb-32 bg-white relative">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl sm:text-[28px] font-semibold text-[#1b2559] font-heading tracking-tight shrink-0">
              Results
            </h3>
            <div className="h-[1px] bg-gray-200/80 flex-1"></div>
            {rawResults.length > 0 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-[#1b2559] hover:underline shrink-0 cursor-pointer"
              >
                {showAll 
                  ? 'See less' 
                  : (rawResults.length > 3 ? `See all (${rawResults.length - 3} more)` : 'See all')}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1.5">Easily check published end-semester examination results</p>
        </div>

        {/* Table Container */}
        {rawResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-gray-200/80 rounded-[18px] overflow-hidden shadow-2xs bg-white"
          >
            {/* Table Header (Hidden on Mobile) */}
            <div className="hidden md:grid bg-primary text-white text-[11px] font-semibold uppercase tracking-wider py-4 px-6 grid-cols-12 items-center">
              <div className="col-span-2">SL NO</div>
              <div className="col-span-3">DATE & DURATION</div>
              <div className="col-span-5">PROGRAM / COURSE</div>
              <div className="col-span-2 text-right">ACTION</div>
            </div>

            {/* Table Rows / Mobile Cards */}
            <div className="divide-y divide-gray-100 flex flex-col gap-4 p-4 md:p-0 md:gap-0 bg-gray-50/50 md:bg-transparent">
              {displayedResults.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex flex-col md:grid md:grid-cols-12 md:items-center py-5 px-5 md:px-6 bg-white hover:bg-slate-50/70 transition-colors border md:border-0 border-gray-100 rounded-2xl md:rounded-none shadow-sm md:shadow-none gap-3 md:gap-0"
                >
                  <div className="md:col-span-2 flex items-center justify-between md:block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Sl No</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      {item.slNo}
                    </span>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between md:block border-t border-gray-50 md:border-0 pt-2 md:pt-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Date & Duration</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                      {item.dateDuration}
                    </span>
                  </div>

                  <div className="md:col-span-5 pr-4 border-t border-gray-50 md:border-0 pt-2 md:pt-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden mb-1 block">Program / Course</span>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm block leading-tight">
                      {item.courseName}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium block mt-1">
                      {item.semesterInfo}
                    </span>
                  </div>

                  <div className="md:col-span-2 md:text-right border-t border-gray-50 md:border-0 pt-3 md:pt-0 mt-1 md:mt-0">
                    {item.pdfUrl && item.pdfUrl !== '#' && (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleViewPdf(e, item.pdfUrl, item.courseName)}
                        className="inline-flex items-center gap-2 md:gap-1.5 text-xs font-semibold text-[#1b2559] bg-[#1b2559]/5 hover:bg-[#1b2559]/10 md:bg-transparent px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none transition-colors md:justify-end group cursor-pointer w-full md:w-auto justify-center"
                      >
                        <FileText className="w-4 h-4 md:w-3.5 md:h-3.5 text-[#1b2559] group-hover:scale-110 transition-transform" />
                        <span>View PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16 px-6 bg-slate-50/60 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">No results found</p>
            <p className="text-xs text-gray-400">We couldn't find any published examination results at this time.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default ExamResultsTable;
