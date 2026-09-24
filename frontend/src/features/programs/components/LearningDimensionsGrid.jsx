"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, X, BookOpen, Download, FileText, Send, Award, Clock, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

const LearningDimensionsGrid = ({
  dimensions = [],
  curriculumPdf = '',
  badgeText,
  title,
  subtitle,
  btnText,
  showBtn,
  program = {}
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activeModalSemester, setActiveModalSemester] = useState(0);

  const finalBadge = badgeText || program.dimensionsBadgeText || 'PROGRAM STRUCTURE';
  const finalTitle = title || program.dimensionsTitle || '4-Semester Curriculum Roadmap';
  const finalSubtitle = subtitle || program.dimensionsSubtitle || 'A comprehensive journey from fundamentals to executive mastery.';
  const finalBtnText = btnText || program.dimensionsBtnText || 'View Curriculum';
  const finalShowBtn = showBtn ?? program.showDimensionsBtn ?? true;
  const finalCurriculumPdf = curriculumPdf || program.curriculumPdf || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Marketing & Strategy'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const semesterDetails = [
    {
      semester: 'Semester 01',
      title: 'Core Foundations',
      credits: '18 Credits',
      duration: '6 Months (Jul – Dec)',
      focus: 'Building strong fundamental knowledge across essential business functions, accounting, managerial economics, and leadership principles.',
      subjects: [
        { code: 'MBA101', name: 'Financial Accounting & Reporting', credits: '4' },
        { code: 'MBA102', name: 'Marketing Management & Consumer Psychology', credits: '4' },
        { code: 'MBA103', name: 'Organizational Behavior & Leadership Dynamics', credits: '4' },
        { code: 'MBA104', name: 'Managerial Economics & Decision Science', credits: '3' },
        { code: 'MBA105', name: 'Business Communication & Executive Presence', credits: '3' },
      ],
      deliverable: 'Live Case Study Evaluation & Harvard Business Review Colloquium'
    },
    {
      semester: 'Semester 02',
      title: 'Analytical Depth',
      credits: '20 Credits',
      duration: '6 Months (Jan – Jun)',
      focus: 'Mastering quantitative techniques, corporate financial modeling, operations optimization, and data-driven corporate decision making.',
      subjects: [
        { code: 'MBA201', name: 'Corporate Finance & Valuation Modeling', credits: '4' },
        { code: 'MBA202', name: 'Operations Research & Supply Chain Optimization', credits: '4' },
        { code: 'MBA203', name: 'Business Analytics, AI Tools & Big Data', credits: '4' },
        { code: 'MBA204', name: 'Human Resource Management & Talent Strategy', credits: '4' },
        { code: 'MBA205', name: 'Research Methodology & Statistical Inference', credits: '4' },
      ],
      deliverable: '8-Week Mandatory Summer Corporate Internship & Defense'
    },
    {
      semester: 'Semester 03',
      title: 'Strategic Integration',
      credits: '22 Credits',
      duration: '6 Months (Jul – Dec)',
      focus: 'Synthesizing cross-functional insights to formulate global competitive strategies, innovation frameworks, and specialization tracks.',
      subjects: [
        { code: 'MBA301', name: 'Global Strategic Management & Competitiveness', credits: '4' },
        { code: 'MBA302', name: 'Innovation Management & Corporate Entrepreneurship', credits: '4' },
        { code: 'MBA303', name: 'Specialization Core Track I (Major Elective)', credits: '5' },
        { code: 'MBA304', name: 'Specialization Core Track II (Major Elective)', credits: '5' },
        { code: 'MBA305', name: 'Legal Aspects of Business & Corporate Governance', credits: '4' },
      ],
      deliverable: 'Strategic Industry Consulting Immersion Project'
    },
    {
      semester: 'Semester 04',
      title: 'Capstone Mastery',
      credits: '16 Credits',
      duration: '6 Months (Jan – Jun)',
      focus: 'Applying integrated management competencies to solve complex real-world consulting problems and executive readiness.',
      subjects: [
        { code: 'MBA401', name: 'Industry Consulting Capstone Project', credits: '6' },
        { code: 'MBA402', name: 'Entrepreneurial Lab & Venture Incubation', credits: '4' },
        { code: 'MBA403', name: 'Specialization Advanced Track III (Elective)', credits: '3' },
        { code: 'MBA404', name: 'Specialization Advanced Track IV (Elective)', credits: '3' },
      ],
      deliverable: 'Final Executive Thesis Defense & Corporate Placement Readiness'
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in your name, email, and phone number to download the syllabus.',
        confirmButtonColor: '#303580'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCurriculumModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Syllabus Sent Successfully!',
        html: `Thank you, <b>${formData.name}</b>!<br>The complete 4-Semester Curriculum & Syllabus Guide has been emailed to <b>${formData.email}</b>.`,
        confirmButtonColor: '#303580',
        timer: 4500
      });
      setFormData({ name: '', email: '', phone: '', specialization: 'Marketing & Strategy' });
    }, 1200);
  };

  const handleViewCurriculum = () => {
    if (finalCurriculumPdf) {
      setIsPdfModalOpen(true);
    } else {
      setActiveModalSemester(0);
      setIsCurriculumModalOpen(true);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-[#303580] relative overflow-hidden text-white">
      {/* Background Image Rectangle 52 */}
      <img
        src="/assets/Images/mba/mba_feature_1.png"
        alt="Background Pattern"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#303580]/85 pointer-events-none" />

      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          {finalBadge && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[13px] font-semibold tracking-[0.25em] uppercase mb-4 shadow-sm">
              {finalBadge}
            </span>
          )}
          {finalTitle && (
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold tracking-tight text-white mt-1 mb-3 font-heading">
              {finalTitle}
            </h2>
          )}
          {finalSubtitle && (
            <p className="text-gray-300 text-[16px] font-normal mb-5 whitespace-pre-line">
              {finalSubtitle}
            </p>
          )}
          {/* {finalShowBtn && finalBtnText && (
            <div className="flex justify-center">
              <button
                onClick={handleViewCurriculum}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                <span>{finalBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )} */}
        </motion.div>

        {/* Cards Container */}
        {dimensions.length > 4 ? (
          <div className="w-full overflow-hidden relative group py-4">
            <style>{`
              @keyframes scrollLeftDim {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll-left-dim {
                animation: scrollLeftDim ${dimensions.length * 6}s linear infinite;
                width: max-content;
              }
              .group:hover .animate-scroll-left-dim {
                animation-play-state: paused;
              }
            `}</style>
            <div className="flex animate-scroll-left-dim gap-5 xl:gap-6 px-4 items-stretch">
              {[...dimensions, ...dimensions].map((dim, idx) => {
                const realIdx = idx % dimensions.length;
                const isLast = realIdx === dimensions.length - 1;
                const isPrimary = hoveredIdx === realIdx || (hoveredIdx === null && isLast);

                const creditsText = dim.credits || (realIdx === 0 ? 'Credits: 18' : realIdx === 1 ? 'Credits: 20' : realIdx === 2 ? 'Credits: 22' : 'Credits: 16');
                const displayTopics = (dim.topics && dim.topics.length > 0) ? dim.topics : [];
                const displayTitle = dim.title || 'Curriculum Dimension';

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(realIdx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => {
                      setActiveModalSemester(realIdx);
                      setIsCurriculumModalOpen(true);
                    }}
                    className={`shrink-0 w-[300px] sm:w-[350px] lg:w-[419px] min-h-[389px] h-auto rounded-[20px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 border cursor-pointer ${isPrimary
                      ? 'bg-[#303580] text-white border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
                      : 'bg-white text-[#303580] border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]'
                      }`}
                  >
                    {/* Top Section */}
                    <div>
                      <div className="mb-6">
                        <span className={`text-[24px] font-bold tracking-tight block transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-[#303580]'}`}>
                          {dim.number || `0${realIdx + 1}`}
                        </span>
                        <h3 className={`text-[16px] font-normal tracking-tight mt-1 leading-snug transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-[#303580]'}`}>
                          {displayTitle}
                        </h3>
                      </div>
                      {/* Topics */}
                      <div className="flex flex-col gap-3.5 mt-2">
                        {displayTopics.map((topic, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isPrimary ? 'bg-white' : 'bg-[#303580]'}`} />
                            <span className={`text-[13.5px] font-normal leading-snug transition-colors duration-300 ${isPrimary ? 'text-white/95' : 'text-slate-700'}`}>
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Bottom Section */}
                    <div className="mt-auto pt-4">
                      <div className={`w-full h-px mb-4 transition-colors duration-300 ${isPrimary ? 'bg-white/20' : 'bg-slate-100'}`} />
                      <p className={`text-[12px] font-normal transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-gray-400'}`}>
                        {creditsText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 justify-items-center items-stretch">
            {(dimensions.length > 0 ? dimensions : [{}, {}, {}, {}]).map((dim, idx) => {
              const isLast = idx === (dimensions.length > 0 ? dimensions.length - 1 : 3);
              const isPrimary = hoveredIdx === idx || (hoveredIdx === null && isLast);

              const creditsText = dim.credits || (idx === 0 ? 'Credits: 18' : idx === 1 ? 'Credits: 20' : idx === 2 ? 'Credits: 22' : 'Credits: 16');
              const defaultTopics = idx === 0
                ? ['Financial Accounting', 'Marketing Management', 'Organizational Behavior']
                : idx === 1
                  ? ['Corporate Finance', 'Operations Research', 'Business Analytics']
                  : idx === 2
                    ? ['Global Strategy', 'Innovation Management', 'Specialization Track I']
                    : ['Industry Consulting Project', 'Entrepreneurial Lab', 'Final Thesis'];

              const displayTopics = (dim.topics && dim.topics.length > 0)
                ? dim.topics
                : defaultTopics;

              const displayTitle = dim.title
                ? dim.title
                : idx === 0 ? 'Core Foundations' : idx === 1 ? 'Analytical Depth' : idx === 2 ? 'Strategic Integration' : 'Capstone Mastery';

              return (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => {
                    setActiveModalSemester(idx);
                    setIsCurriculumModalOpen(true);
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className={`w-full max-w-[419px] min-h-[389px] h-auto rounded-[20px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 border cursor-pointer ${isPrimary
                    ? 'bg-[#303580] text-white border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
                    : 'bg-white text-[#303580] border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]'
                    }`}
                >
                  {/* Top Section */}
                  <div>
                    <div className="mb-6">
                      <span className={`text-[24px] font-bold tracking-tight block transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-[#303580]'}`}>
                        {dim.number || `0${idx + 1}`}
                      </span>
                      <h3 className={`text-[16px] font-normal tracking-tight mt-1 leading-snug transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-[#303580]'}`}>
                        {displayTitle}
                      </h3>
                    </div>
                    {/* Topics */}
                    <div className="flex flex-col gap-3.5 mt-2">
                      {displayTopics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isPrimary ? 'bg-white' : 'bg-[#303580]'}`} />
                          <span className={`text-[13.5px] font-normal leading-snug transition-colors duration-300 ${isPrimary ? 'text-white/95' : 'text-slate-700'}`}>
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Bottom Section */}
                  <div className="mt-auto pt-4">
                    <div className={`w-full h-px mb-4 transition-colors duration-300 ${isPrimary ? 'bg-white/20' : 'bg-slate-100'}`} />
                    <p className={`text-[12px] font-normal transition-colors duration-300 ${isPrimary ? 'text-white' : 'text-gray-400'}`}>
                      {creditsText}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Curriculum Button */}
        {finalShowBtn && finalBtnText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={handleViewCurriculum}
              className="bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300 rounded-full px-8 py-3.5 flex items-center gap-3 text-base font-semibold group cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <BookOpen className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform" />
              <span>{finalBtnText}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

      </div>

      {/* Interactive Curriculum & Syllabus Modal */}
      <AnimatePresence>
        {isCurriculumModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsCurriculumModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] shadow-2xl max-w-5xl w-full text-slate-900 overflow-hidden relative border border-gray-100 my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#303580] text-white p-6 sm:p-8 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <BookOpen className="w-4 h-4" /> Comprehensive Syllabus Guide
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    4-Semester MBA Roadmap & Subject Breakdown
                  </h3>
                  <p className="text-sm text-gray-200 mt-1">
                    Explore credit structures, core subjects, and experiential consulting milestones.
                  </p>
                </div>
                <button
                  onClick={() => setIsCurriculumModalOpen(false)}
                  className="absolute top-5 right-5 sm:relative sm:top-0 sm:right-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Semester Tabs Navigation */}
              <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/80 px-6 pt-3 gap-2 shrink-0">
                {semesterDetails.map((sem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveModalSemester(idx)}
                    className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeModalSemester === idx
                      ? 'bg-white text-[#303580] border-[#303580] shadow-sm'
                      : 'text-gray-500 hover:text-[#303580] border-transparent'
                      }`}
                  >
                    {sem.semester}: {sem.title}
                  </button>
                ))}
              </div>

              {/* Modal Body - Grid Layout */}
              <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Active Semester Subject Details */}
                <div className="lg:col-span-7 space-y-6">
                  {semesterDetails[activeModalSemester] && (
                    <motion.div
                      key={activeModalSemester}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/80 p-4 rounded-xl border border-blue-100">
                        <div>
                          <h4 className="text-lg font-bold text-[#303580]">
                            {semesterDetails[activeModalSemester].semester} — {semesterDetails[activeModalSemester].title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 mt-1">
                            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-blue-600" /> {semesterDetails[activeModalSemester].credits}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600" /> {semesterDetails[activeModalSemester].duration}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {semesterDetails[activeModalSemester].focus}
                      </p>

                      {/* Subjects Table */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                          <span>Subject Name & Code</span>
                          <span>Credits</span>
                        </div>
                        <div className="divide-y divide-gray-100 bg-white">
                          {semesterDetails[activeModalSemester].subjects.map((subj, sIdx) => (
                            <div key={sIdx} className="px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50/60 transition-colors">
                              <div>
                                <span className="font-bold text-[#303580] mr-2 text-xs bg-blue-50 px-2 py-0.5 rounded">{subj.code}</span>
                                <span className="font-semibold text-gray-800">{subj.name}</span>
                              </div>
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{subj.credits} Cr</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverable Badge */}
                      <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold text-amber-900 block mb-0.5">Key Semester Deliverable:</span>
                          <span className="text-amber-800 leading-relaxed">{semesterDetails[activeModalSemester].deliverable}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column: Request Complete Syllabus Form */}
                <div className="lg:col-span-5 bg-gray-50 p-6 sm:p-7 rounded-2xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#303580] font-bold text-base mb-2">
                      <Download className="w-5 h-5" /> Request Complete Syllabus Guide
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6">
                      Get the detailed 45-page official curriculum brochure including case study titles, corporate project guidelines, and faculty advisors directly to your inbox.
                    </p>

                    {finalCurriculumPdf && (
                      <div className="mb-5 p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-[#303580] shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-800">Official Curriculum PDF</p>
                            <p className="text-[11px] text-gray-500">Available for instant viewing</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCurriculumModalOpen(false);
                            setIsPdfModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#303580] hover:bg-[#252a69] text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#303580] focus:outline-none text-sm font-medium bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#303580] focus:outline-none text-sm font-medium bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#303580] focus:outline-none text-sm font-medium bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Specialization Track</label>
                        <select
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#303580] focus:outline-none text-sm font-medium bg-white"
                        >
                          <option value="Marketing & Strategy">Marketing & Strategy</option>
                          <option value="Financial Management & Analytics">Financial Management & Analytics</option>
                          <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                          <option value="Human Resource Management">Human Resource Management</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-[#303580] hover:bg-[#252a69] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span>Sending Guide...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Download Complete Syllabus PDF
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2 text-[11px] text-gray-500">
                    <FileText className="w-4 h-4 text-[#303580] shrink-0" />
                    <span>Instant PDF delivery via secure email. No spam guaranteed.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated PDF Curriculum Viewer Modal */}
      <AnimatePresence>
        {isPdfModalOpen && finalCurriculumPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
            onClick={() => setIsPdfModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full text-slate-900 overflow-hidden relative border border-white/20 flex flex-col h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="bg-[#303580] text-white px-5 py-4 flex items-center justify-between gap-4 shrink-0 shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-base sm:text-lg font-bold leading-tight truncate">
                      Program Curriculum & Syllabus
                    </h3>
                    <p className="text-xs text-white/70 truncate hidden sm:block">
                      Official comprehensive academic roadmap & course details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={finalCurriculumPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/15"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                  <a
                    href={finalCurriculumPdf}
                    download="Curriculum_Syllabus.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E3A008] hover:bg-[#c98d04] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Body */}
              <div className="flex-1 w-full h-full bg-slate-100 relative">
                <iframe
                  src={`${finalCurriculumPdf}#view=FitH`}
                  className="w-full h-full border-none"
                  title="Curriculum & Syllabus Document"
                />
              </div>

              {/* Bottom bar with fallback if PDF fails to render on mobile browsers */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <span>If the PDF preview does not display, click the button to open directly.</span>
                <a
                  href={finalCurriculumPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#303580] hover:underline font-semibold"
                >
                  Click here to view PDF directly &rarr;
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LearningDimensionsGrid;
