"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Why is MBA/PGDM at KSBM preferred by top recruiters?",
    answer: "KSBM programs are designed with active corporate input, ensuring our curriculum remains at the cutting edge of industry demands. Through Harvard & IIM case-study pedagogy, live corporate projects, and intensive mentorship, our graduates are job-ready and equipped with practical strategic competencies from day one."
  },
  {
    question: "What is the eligibility criteria for the MBA program?",
    answer: "Candidates must hold a recognized Bachelor's Degree in any discipline with minimum 50% aggregate marks (45% for reserved categories). Additionally, applicants must possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance examinations."
  },
  {
    question: "How are scholarships or financial assistance awarded?",
    answer: "KSBM offers merit-based scholarships for high scorers in entrance exams and university graduations, alongside need-based financial aid for economically disadvantaged students. Educational loan assistance and tie-ups with leading banks are also provided during counseling."
  },
  {
    question: "What is the selection procedure after applying online?",
    answer: "Once your online application is submitted and reviewed, shortlisted candidates are invited for the Group Discussion (GD) and Personal Interview (PI) rounds. Final selection is based on academic record, entrance test score, and GD/PI performance."
  }
];

const AdmissionFaqSection = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqItems = (data?.faqs && data.faqs.length > 0) ? data.faqs : faqs;

  return (
    <section className="py-15 sm:py-20 relative overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Large FAQ Heading */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col items-center"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-primary font-heading leading-none mb-4 sm:mb-6">
              FAQ
            </h2>
          </motion.div>

          {/* Right Accordion List */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-8 space-y-3"
          >
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[18px] border transition-all duration-300 overflow-hidden ${isOpen
                    ? 'bg-white border-primary/20 shadow-[0_10px_30px_rgba(43,47,102,0.06)]'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none gap-3"
                  >
                    <span className="text-sm sm:text-base font-semibold transition-colors font-heading text-primary">
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-text-secondary'
                      }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 sm:px-5 pb-4 pt-2 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 font-normal">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AdmissionFaqSection;
