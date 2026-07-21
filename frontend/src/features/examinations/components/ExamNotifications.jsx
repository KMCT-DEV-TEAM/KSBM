"use client";
import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ExamNotifications = ({ data }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [showAll, setShowAll] = React.useState(false);

  const rawNotifications = (data?.notifications && data.notifications.length > 0)
    ? data.notifications
    : [
      {
        id: 1,
        label: 'EXAMINATION ANNOUNCEMENT',
        title: 'REVISED TIME TABLE FOR FOURTH SEMESTER MBA (REGULAR / SUPPLEMENTARY EXAMINATIONS - JULY 2026)',
        date: '17 Jul 2026',
        pdfUrl: '#'
      },
      {
        id: 2,
        label: 'EXAMINATION ANNOUNCEMENT',
        title: 'CONDUCT OF PRACTICAL & VIVA - VOCE IN RESPECT OF FOURTH SEMESTER M.A SOCIOLOGY (CBCSS - CODL) APRIL 2026',
        date: '17 Jul 2026',
        pdfUrl: '#'
      },
      {
        id: 3,
        label: 'EXAMINATION ANNOUNCEMENT',
        title: 'REVISED TIME TABLE FOR SIXTH SEMESTER BBA (DEGREE - CBCSS) EXAMINATIONS - JUNE 2026',
        date: '12 Jul 2026',
        pdfUrl: '#'
      },
      {
        id: 4,
        label: 'IMPORTANT NOTICE',
        title: 'ONLINE REGISTRATION EXTENSION FOR SECOND SEMESTER MBA & BBA SUPPLEMENTARY EXAMS 2026',
        date: '05 Jul 2026',
        pdfUrl: '#'
      },
      {
        id: 5,
        label: 'CIRCULAR',
        title: 'PUBLICATION OF REVALUATION RESULTS - FIRST & THIRD SEMESTER MBA DEGREE EXAMINATIONS 2026',
        date: '28 Jun 2026',
        pdfUrl: '#'
      }
    ];

  // Derive categories or tags
  const categories = ['ALL', 'MBA', 'BBA'];

  const filteredNotifications = rawNotifications.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'ALL') return true;
    return item.title?.toUpperCase().includes(activeCategory) || item.label?.toUpperCase().includes(activeCategory);
  });

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 3);

  const handleDownloadPdf = (e, pdfUrl, title) => {
    if (!pdfUrl || pdfUrl === '#') {
      e.preventDefault();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Downloading document...',
        text: title?.substring(0, 40) + '...',
        showConfirmButton: false,
        timer: 2500
      });
    }
  };

  return (
    <section id="notifications" className="pb-16 lg:pb-24 bg-white relative">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl sm:text-[28px] font-semibold text-[#1b2559] font-heading tracking-tight shrink-0">
              Notifications
            </h3>
            <div className="h-[1px] bg-gray-200/80 flex-1"></div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-[#1b2559] hover:underline shrink-0 cursor-pointer"
            >
              {showAll ? 'See less' : 'See all'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">Search through recent examination timetable updates and circulars</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-50 text-gray-600 hover:bg-slate-100 border border-gray-200/60'
                }`}
            >
              {cat === 'ALL' ? 'All Notifications' : cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-5">
            {displayedNotifications.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#F6F6F6] border border-gray-200/70 rounded-[18px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-200/60 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex-1 pr-4">
                  <span className="text-[10px] font-semibold tracking-[0.12em] text-gray-400 uppercase block mb-1.5">
                    {item.label || 'EXAMINATION ANNOUNCEMENT'}
                  </span>
                  <h4 className="text-sm sm:text-[15px] font-semibold text-gray-900 font-heading leading-snug mb-2.5">
                    {item.title}
                  </h4>
                  <span className="text-xs text-gray-400 font-medium block">
                    {item.date}
                  </span>
                </div>

                <a
                  href={item.pdfUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleDownloadPdf(e, item.pdfUrl, item.title)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100/90 hover:bg-slate-200 text-[#1b2559] px-4.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 shadow-2xs group self-start sm:self-center cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#1b2559] group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download PDF</span>
                </a>
              </motion.div>
            ))}

            {filteredNotifications.length > 3 && (
              <div className="pt-4 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 hover:border-[#1b2559] text-xs font-semibold text-[#1b2559] bg-white hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <span>{showAll ? 'Show Less' : `See All (${filteredNotifications.length - displayedNotifications.length} more)`}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-slate-50/60 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">No notifications found</p>
            <p className="text-xs text-gray-400 mb-4">We couldn't find any announcements matching "{searchQuery}" in category "{activeCategory}"</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-[#151c44] transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ExamNotifications;
