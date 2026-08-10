"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, X, BookOpen, Download, FileText, Send, Award, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const LearningDimensionsGrid = ({ dimensions = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [activeModalSemester, setActiveModalSemester] = useState(0);

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
          <span className="text-[14px] font-semibold tracking-[0.25em] text-white uppercase mb-3 px-4 py-1.5 ">
            PROGRAM STRUCTURE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold tracking-tight text-white mt-3 mb-4 font-heading">
            4-Semester Curriculum Roadmap
          </h2>
          <p className="text-gray-300 text-[16px] font-normal">
            A comprehensive journey from fundamentals to executive mastery.
          </p>
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
            <div className="flex animate-scroll-left-dim gap-5 xl:gap-6 px-4">
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
                    className={`shrink-0 w-[300px] sm:w-[350px] lg:w-[419px] min-h-[389px] h-full rounded-[20px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 border cursor-pointer ${isPrimary
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 place-items-center">
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
                  className={`w-full max-w-[419px] min-h-[389px] h-full rounded-[20px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 border cursor-pointer ${isPrimary
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={() => {
              setActiveModalSemester(0);
              setIsCurriculumModalOpen(true);
            }}
            className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-[#303580] transition-all duration-300 rounded-[18px] px-8 py-3.5 flex items-center gap-3 text-base font-semibold group cursor-pointer"
          >
            <span>View Our Detailed Curriculum</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>


    </section>
  );
};

export default LearningDimensionsGrid;
