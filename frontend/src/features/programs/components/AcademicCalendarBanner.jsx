"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Calendar as CalendarIcon, Clock, GraduationCap, CalendarPlus, ChevronRight, X, Filter, Sparkles, CheckCircle2, BookOpen, Briefcase, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const filteredEvents = selectedFilter === 'All'
    ? events
    : events.filter(e => e.semester === selectedFilter || e.category === selectedFilter);

  // Helper to create Google Calendar Add link
  const createGoogleCalendarUrl = (event) => {
    const text = encodeURIComponent(`KSBM Academic Event: ${event.title}`);
    const details = encodeURIComponent(`${event.description || ''} • Semester: ${event.semester || 'KSBM Schedule'} • Category: ${event.category || 'Event'}`);
    const location = encodeURIComponent('KMCT School of Business Management (KSBM), Campus');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[24px] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 shadow-sm"
        >
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-4 leading-tight font-heading">
              {titleText}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              {descriptionText}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Interactive View Schedule Button */}
              <button
                type="button"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                className="w-full sm:w-auto px-8 py-4 rounded-[18px] bg-primary text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(27,37,89,0.25)] hover:bg-[#162050] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group.5 cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{isScheduleOpen ? 'Hide Interactive Schedule' : viewBtnText}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isScheduleOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>

              {/* Download Calendar Link */}
              <Link
                href={downloadBtnUrl}
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 rounded-[18px] bg-white border-2 border-primary/20 text-primary font-semibold text-sm tracking-wide hover:bg-blue-50/60 transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 hover:-translate-y-0.5 transition-transform" />
                <span>{downloadBtnText}</span>
              </Link>
            </div>



          </div>

          {/* Right Vector/Illustration card */}
          <div className="lg:col-span-5 relative flex items-center justify-center z-10">
            <div className="relative rounded-3xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-500 ease-out max-h-[440px] w-full max-w-[460px] shadow-lg border border-white">
              <img
                src={image}
                alt={titleText}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none" />
            </div>
            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-2xl -z-10" />
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-amber-400 tracking-widest uppercase block mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> INTERACTIVE ACADEMIC TIMELINE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                      Important Dates, Assessments & Milestones
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Filter by term or event type. Click "Add to Calendar" on any milestone to set personal reminders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsScheduleOpen(false)}
                    className="self-start md:self-center bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="py-6 flex flex-wrap items-center gap-2 border-b border-slate-800/80">
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

                      <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Schedule
                        </span>
                        <a
                          href={createGoogleCalendarUrl(ev)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          <span>Add to Calendar</span>
                        </a>
                      </div>
                    </div>
                  ))}

                  {filteredEvents.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl">
                      No events found for category "{selectedFilter}". Select another category or click "All".
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
