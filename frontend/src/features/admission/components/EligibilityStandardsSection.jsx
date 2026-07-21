"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Badge, AwardIcon, } from 'lucide-react';

const programData = {
  MBA: {
    eligibilityText: "Any recognized Bachelor’s degree with a valid CMAT/CAT/KMAT score.",
    approvedIntake: "60 Seats",
    eligibilityCriteria: [
      "Any recognized Bachelor's degree with min. 50% marks (45% for reserved categories).",
      "Entrance Exam: Valid score in KMAT / CMAT / CAT / MAT.",
      "Final year graduation students can apply provisionally subject to passing criteria."
    ],
    programHighlights: [
      "General Category : Minimum 50% marks in aggregate in graduation",
      "SC/ST/OBC : According to state rules and relaxation guidelines",
      "Duration : 2 Years Full-Time (AICTE Approved & AACSB Accredited)"
    ],
    feeStructure: {
      amount: "Rs. 50,000/-",
      period: "per Semester"
    }
  },
  BBA: {
    eligibilityText: "Passed 10+2 / Higher Secondary examination from any recognized board with min. 50% marks.",
    approvedIntake: "60 Seats",
    eligibilityCriteria: [
      "Passed 10+2 / Higher Secondary examination from any recognized board with min. 50% marks.",
      "Merit-based direct admission and academic counseling.",
      "Open to students from all streams (Commerce, Science, Humanities)."
    ],
    programHighlights: [
      "General Category : Minimum 50% marks in aggregate in 10+2",
      "SC/ST/OBC : According to state rules and relaxation guidelines",
      "Duration : 3 Years Full-Time Undergraduate Degree"
    ],
    feeStructure: {
      amount: "Rs. 25,000/-",
      period: "per Semester"
    }
  }
};

const EligibilityStandardsSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('MBA');
  
  const heading = data?.eligibilityHeading || 'Eligibility & Standards';
  const subtitle = data?.eligibilitySubtitle || 'Academic standards and requirements for admission into our premier programs.';
  
  const mergedData = {
    MBA: {
      eligibilityText: data?.mba?.eligibilityText || programData.MBA.eligibilityText,
      approvedIntake: data?.mba?.approvedIntake || programData.MBA.approvedIntake,
      eligibilityCriteria: (data?.mba?.eligibilityCriteria && data.mba.eligibilityCriteria.length > 0) ? data.mba.eligibilityCriteria : programData.MBA.eligibilityCriteria,
      programHighlights: (data?.mba?.programHighlights && data.mba.programHighlights.length > 0) ? data.mba.programHighlights : programData.MBA.programHighlights,
      feeStructure: {
        amount: data?.feeStructure?.amount || programData.MBA.feeStructure.amount,
        period: data?.feeStructure?.period || programData.MBA.feeStructure.period
      }
    },
    BBA: {
      eligibilityText: data?.bba?.eligibilityText || programData.BBA.eligibilityText,
      approvedIntake: data?.bba?.approvedIntake || programData.BBA.approvedIntake,
      eligibilityCriteria: (data?.bba?.eligibilityCriteria && data.bba.eligibilityCriteria.length > 0) ? data.bba.eligibilityCriteria : programData.BBA.eligibilityCriteria,
      programHighlights: (data?.bba?.programHighlights && data.bba.programHighlights.length > 0) ? data.bba.programHighlights : programData.BBA.programHighlights,
      feeStructure: {
        amount: data?.feeStructure?.amount || programData.BBA.feeStructure.amount,
        period: data?.feeStructure?.period || programData.BBA.feeStructure.period
      }
    }
  };

  const currentData = mergedData[activeTab];

  return (
    <section className="py-14 sm:py-20 bg-[#fcfcfd] relative">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary mb-3 font-heading">
            {heading}
          </h2>
          <p className="text-gray-600 text-[16px] sm:text-[17px] font-normal">
            {subtitle}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('MBA')}
            className={`px-8 py-2.5 rounded-[18px] text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'MBA'
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            MBA
          </button>
          <button
            onClick={() => setActiveTab('BBA')}
            className={`px-8 py-2.5 rounded-[18px] text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'BBA'
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            BBA
          </button>
        </div>

        {/* Content Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full space-y-5"
          >
            {/* Top 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Eligibility Criteria Card */}
              <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-2 ">
                    <div className="w-9 h-9 rounded-[18px] bg-blue-50 flex items-center justify-center text-primary">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary font-heading">
                      Eligibility Criteria
                    </h3>
                  </div>
                  <p className="text-[14px] text-text-secondary leading-relaxed">
                    {currentData.eligibilityText || (Array.isArray(currentData.eligibilityCriteria) ? currentData.eligibilityCriteria[0] : currentData.eligibilityCriteria)}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary font-heading mb-1.5">
                    APPROVED INTAKE
                  </h4>
                  <p className="text-[14px] text-text-secondary font-normal">
                    {currentData.approvedIntake || "60 Seats"}
                  </p>
                </div>
              </div>

              {/* Program Highlights Card */}
              <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3">
                    <div className="w-9 h-9 rounded-[18px] bg-blue-50 flex items-center justify-center text-primary">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary font-heading">
                      Program Highlights
                    </h3>
                  </div>

                  <ul className="space-y-2.5">
                    {currentData.programHighlights.map((item, idx) => {
                      const parts = item.split(':');
                      return (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span className="text-xs sm:text-sm leading-normal">
                            {parts.length > 1 ? (
                              <>
                                <span className="text-text-primary font-semibold">{parts[0].trim()} : </span>
                                <span className="text-text-secondary">{parts.slice(1).join(':').trim()}</span>
                              </>
                            ) : (
                              <span className="text-text-secondary">{item}</span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

            </div>

            {/* Bottom Full-Width Fee Structure Banner Card */}
            <div className="bg-primary text-white rounded-[18px] p-5 sm:p-6 shadow-[0_15px_40px_rgba(43,47,102,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6 border border-[#C4C6CF] w-full">
              <div className="flex flex-col justify-center">
                <h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                  Fee Structure
                </h4>
                <p className="text-xs text-gray-300 uppercase tracking-wider mb-1.5">
                  Total Fee
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-semibold text-white">
                    {currentData.feeStructure.amount}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 font-normal">
                    {currentData.feeStructure.period}
                  </span>
                </div>
              </div>

              {/* Scholarship Note Box */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-[18px] border border-white/15 max-w-md w-full md:w-auto">
                <AwardIcon className="w-6 h-6 text-white shrink-0" />
                <p className="text-xs text-gray-200 font-medium leading-normal">
                  Scholarships available for merit and economically disadvantaged students.
                </p>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section >
  );
};

export default EligibilityStandardsSection;
