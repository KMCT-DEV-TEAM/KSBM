"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Calendar as CalendarIcon, Clock, GraduationCap, CalendarPlus, ChevronRight, X, Filter, Sparkles, CheckCircle2, BookOpen, Briefcase, Award, Search, FileSpreadsheet, FileDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const defaultCalendarEvents = [
  { id: '1', title: 'Orientation & Leadership Summit', date: 'July 15 - July 18, 2026', semester: 'Trimester 1', category: 'Leadership & Events', description: 'Inaugural session, corporate guest keynotes, and campus orientation for the incoming cohort.' },
  { id: '2', title: 'Trimester 1 Mid-Term Assessments', date: 'September 10 - September 18, 2026', semester: 'Trimester 1', category: 'Exams & Assessments', description: 'Mid-term written and case-based evaluation across core foundational subjects.' },
  { id: '3', title: 'Global Corporate Immersion & Industrial Tour', date: 'October 05 - October 10, 2026', semester: 'Trimester 1', category: 'Industrial Visits', description: 'On-site industrial visits to top tech hubs and financial conglomerates.' },
  { id: '4', title: 'End-Semester Examinations & Project Defense', date: 'October 24 - October 30, 2026', semester: 'Trimester 1', category: 'Exams & Assessments', description: 'Final comprehensive examinations and viva-voce for Trimester 1 completion.' },
  { id: '5', title: 'Inter-Term Break & Winter Internship Prep', date: 'November 01 - November 08, 2026', semester: 'Trimester 1', category: 'Term Breaks & Holidays', description: 'Semester break and career counseling workshops for summer internship placement readiness.' },
  { id: '6', title: 'Trimester 2 Commencement & Core Electives', date: 'November 10, 2026', semester: 'Trimester 2', category: 'Leadership & Events', description: 'Start of Trimester 2 coursework focusing on advanced managerial electives.' },
  { id: '7', title: 'Annual Management Fest & CXO Colloquium', date: 'January 14 - January 16, 2027', semester: 'Trimester 2', category: 'Leadership & Events', description: 'National level B-school symposium featuring industry leaders and management competitions.' },
  { id: '8', title: 'Summer Internship Placement Drive', date: 'February 15 - February 28, 2027', semester: 'Trimester 2', category: 'Industrial Visits', description: 'On-campus recruitment process for 8-10 week corporate summer internships.' }
];

const AcademicCalendarBanner = ({ program }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const badgeText = program?.academicCalendarBanner?.badgeText || 'ACADEMIC SCHEDULE 2026-27';
  const titleText = program?.academicCalendarBanner?.title || 'Download the Official Academic Calendar';
  const descriptionText = program?.academicCalendarBanner?.description || 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.';
  const viewBtnText = program?.academicCalendarBanner?.viewBtnText || 'View Calendar';
  const viewBtnUrl = program?.academicCalendarBanner?.viewBtnUrl || '/assets/Images/image 64.png';
  const downloadBtnText = program?.academicCalendarBanner?.downloadBtnText || 'Download Calendar';
  const downloadBtnUrl = program?.academicCalendarBanner?.downloadBtnUrl || '/assets/Images/image 64.png';
  const image = program?.academicCalendarBanner?.image || '/assets/Images/image 64.png';

  const events = (program?.academicCalendarBanner?.events && program.academicCalendarBanner.events.length > 0)
    ? program.academicCalendarBanner.events
    : defaultCalendarEvents;

  const filters = ['All', 'Trimester 1', 'Trimester 2', 'Exams & Assessments', 'Leadership & Events', 'Industrial Visits', 'Term Breaks & Holidays'];

  const filteredEvents = events.filter(e => {
    const matchesFilter = selectedFilter === 'All' || e.semester === selectedFilter || e.category === selectedFilter;
    const matchesSearch = !searchQuery ||
      (e.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.date?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.semester?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Helper to create Google Calendar Add link
  const createGoogleCalendarUrl = (event) => {
    const text = encodeURIComponent(`KSBM Academic Event: ${event.title}`);
    const details = encodeURIComponent(`${event.description || ''} • Semester: ${event.semester || 'KSBM Schedule'} • Category: ${event.category || 'Event'}`);
    const location = encodeURIComponent('KMCT School of Business Management (KSBM), Campus');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  // Helper to export iCalendar (.ics) file
  const downloadIcsFile = (eventsList, filename = 'KSBM_Academic_Schedule.ics') => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KSBM//Academic Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    eventsList.forEach(ev => {
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`SUMMARY:KSBM: ${ev.title || 'Academic Event'}`);
      icsContent.push(`DESCRIPTION:${(ev.description || '').replace(/[\r\n]+/g, ' ')} (Semester: ${ev.semester || 'N/A'}, Category: ${ev.category || 'N/A'})`);
      icsContent.push(`LOCATION:KMCT School of Business Management (KSBM) Campus`);
      icsContent.push(`UID:${ev.id || Math.random().toString(36).substring(2)}@ksbm.edu.in`);
      icsContent.push(`STATUS:CONFIRMED`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to export CSV file
  const downloadCsvFile = (eventsList, filename = 'KSBM_Academic_Schedule.csv') => {
    const headers = ['Title', 'Date Range', 'Semester', 'Category', 'Description'];
    const rows = eventsList.map(ev => [
      `"${(ev.title || '').replace(/"/g, '""')}"`,
      `"${(ev.date || '').replace(/"/g, '""')}"`,
      `"${(ev.semester || '').replace(/"/g, '""')}"`,
      `"${(ev.category || '').replace(/"/g, '""')}"`,
      `"${(ev.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewAction = (e) => {
    if (viewBtnUrl && viewBtnUrl !== '#' && viewBtnUrl !== '/assets/Images/image 64.png') {
      window.open(viewBtnUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsScheduleOpen(!isScheduleOpen);
    }
  };

  const handleDownloadAction = (e) => {
    if (downloadBtnUrl && downloadBtnUrl !== '#' && downloadBtnUrl !== '/assets/Images/image 64.png') {
      window.open(downloadBtnUrl, '_blank', 'noopener,noreferrer');
    } else {
      e.preventDefault();
      downloadIcsFile(events, 'KSBM_Official_Academic_Schedule.ics');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Schedule Downloaded (.ICS)',
        text: 'Import directly into Apple Calendar, Outlook, or Google Calendar.',
        showConfirmButton: false,
        timer: 3500
      });
    }
  };

  return (
    <section className="py-28 lg:py-40 bg-white relative my-12 border-t border-b border-gray-100">
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
                <span>{viewBtnUrl && viewBtnUrl !== '#' && viewBtnUrl !== '/assets/Images/image 64.png' ? viewBtnText : (isScheduleOpen ? 'Hide Interactive Schedule' : viewBtnText)}</span>
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

        {/* Interactive Academic Schedule Viewer Section */}
        <AnimatePresence>
          {isScheduleOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden mt-8"
            >
              <div className="bg-slate-900 text-white rounded-[24px] p-6 sm:p-10 shadow-2xl border border-slate-800">

                {/* Header of Schedule Viewer */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-amber-400 tracking-widest uppercase block mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> INTERACTIVE ACADEMIC TIMELINE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                      Important Dates, Assessments & Milestones
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Search milestones, filter by term, and export schedules directly to your personal calendar or spreadsheet.
                    </p>
                  </div>

                  {/* Export action buttons */}
                  <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        downloadIcsFile(filteredEvents, 'KSBM_Filtered_Schedule.ics');
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Exported .ICS Schedule', showConfirmButton: false, timer: 2500 });
                      }}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Export (.ICS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        downloadCsvFile(filteredEvents, 'KSBM_Filtered_Schedule.csv');
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Exported .CSV Spreadsheet', showConfirmButton: false, timer: 2500 });
                      }}
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Export (.CSV)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsScheduleOpen(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors cursor-pointer ml-1"
                      title="Close Schedule"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="py-6 space-y-4 border-b border-slate-800/80">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by keyword, event title, or month..."
                      className="w-full pl-10 pr-9 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mr-2">
                      <Filter className="w-3.5 h-3.5" /> Filter By:
                    </div>
                    {filters.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedFilter === f
                          ? 'bg-primary text-white shadow-md scale-105 border border-blue-400/30'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Events Grid / Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-8">
                  {filteredEvents.map((ev, idx) => (
                    <div
                      key={ev.id || idx}
                      className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group hover:border-blue-500/40 relative"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-900/60 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {ev.semester || 'Trimester 1'}
                            </span>
                            <span className="bg-slate-700/80 text-amber-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                              {ev.category || 'Leadership & Events'}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                            {ev.date}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors font-heading mb-2">
                          {ev.title}
                        </h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Schedule
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              downloadIcsFile([ev], `${(ev.title || 'Event').replace(/\s+/g, '_')}.ics`);
                              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Event downloaded (.ics)', showConfirmButton: false, timer: 2000 });
                            }}
                            className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                            title="Download single event (.ics)"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>.ICS</span>
                          </button>
                          <a
                            href={createGoogleCalendarUrl(ev)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                            <span>Add to Google</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredEvents.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl">
                      No events found matching {searchQuery ? `"${searchQuery}"` : `category "${selectedFilter}"`}. Click "All" or clear search.
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default AcademicCalendarBanner;
