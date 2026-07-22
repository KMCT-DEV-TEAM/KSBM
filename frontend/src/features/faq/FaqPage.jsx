"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react';
import api from '../../api/axios';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [data, setData] = useState({
    hero: {
      title: 'Everything You Need to Know',
      subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Need More Information?',
      faqs: [
        {
          question: 'What MBA programs are offered at KMCT College of MBA?',
          answer: 'MBA program offers industry-relevant specializations such as Finance, Marketing, Human Resource Management, Operations Management, Business Analytics, and International Business.'
        },
        {
          question: 'What the eligibility criteria of mba admission ?',
          answer: 'Candidates must hold a recognized Bachelor\'s Degree in any discipline with a minimum 50% aggregate marks (45% for reserved categories) and possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance exams.'
        },
        {
          question: 'Does the college provide placement assistance?',
          answer: 'Yes, KSBM has a dedicated Corporate Relations and Placement Cell that maintains active corporate tie-ups, conducts pre-placement training, resume building, and arranges campus recruitment drives with top multinational and national companies.'
        },
        {
          question: 'Are scholarships available for deserving students?',
          answer: 'Yes, KSBM offers merit-based scholarships for high scorers in qualifying entrance exams and degree examinations, along with financial assistance guidance and education loan support through partner banks.'
        },
        {
          question: 'What are the hostel and campus facilities like?',
          answer: 'KSBM provides secure, separate hostel accommodation for male and female students with modern amenities, Wi-Fi connectivity, state-of-the-art computer labs, rich digital library resources, and dedicated sports complexes.'
        }
      ]
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      try {
        const res = await api.get('/cms/faq');
        if (res.data) {
          setData(prev => ({
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            mainContent: { ...prev.mainContent, ...(res.data.mainContent || {}) }
          }));
        }
      } catch (err) {
        console.error('Failed to fetch FAQ settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const hero = data.hero || {};
  const mainContent = data.mainContent || {};
  const faqs = Array.isArray(mainContent.faqs) && mainContent.faqs.length > 0
    ? mainContent.faqs
    : [
        {
          question: 'What MBA programs are offered at KMCT College of MBA?',
          answer: 'MBA program offers industry-relevant specializations such as Finance, Marketing, Human Resource Management, Operations Management, Business Analytics, and International Business.'
        },
        {
          question: 'What the eligibility criteria of mba admission ?',
          answer: 'Candidates must hold a recognized Bachelor\'s Degree in any discipline with a minimum 50% aggregate marks (45% for reserved categories) and possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance exams.'
        },
        {
          question: 'Does the college provide placement assistance?',
          answer: 'Yes, KSBM has a dedicated Corporate Relations and Placement Cell that maintains active corporate tie-ups, conducts pre-placement training, resume building, and arranges campus recruitment drives with top multinational and national companies.'
        }
      ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        {/* Top Hero Section */}
        <section className="relative min-h-[400px] sm:min-h-[480px] md:min-h-[540px] flex items-center justify-center overflow-hidden bg-[#111836] py-16 sm:py-20 px-4">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage || "/assets/Images/image 73.png"}
              alt="FAQ Hero Background"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-primary/75" />
          </div>

          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                {hero.title || 'Everything You Need to Know'}
              </h1>

              <p className="font-medium text-white/80 leading-relaxed text-[18px] max-w-2xl">
                {hero.subtitle || 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="pt-12 pb-20 md:pt-16 md:pb-28 bg-white text-gray-800">
          <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Centered Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-[#111836] tracking-tight text-center mb-12 sm:mb-16"
            >
              {mainContent.heading || 'Need More Information?'}
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Column: FAQ Illustration Graphic matching exact screenshot layout */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 flex flex-col items-center justify-center pt-4 sm:pt-8"
              >
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
                  
                  {/* Outer Dotted Orbit Circle */}
                  <svg className="absolute inset-0 w-full h-full text-gray-300 pointer-events-none" viewBox="0 0 300 300">
                    <circle cx="150" cy="150" r="110" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="150" cy="260" r="4" fill="#111836" />
                    <circle cx="250" cy="110" r="3" fill="#6366f1" />
                    <path d="M 50,130 L 65,115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 65,130 L 50,115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  {/* Top Chat Question Bubble (`?`) */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-8 right-12 bg-blue-100/90 border border-blue-200 text-[#111836] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12"
                  >
                    <span className="text-2xl font-black text-[#111836] tracking-tighter">?</span>
                  </motion.div>

                  {/* Top Left Message Bubble (`...`) */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-12 left-12 bg-[#111836] text-white px-3.5 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-md transform -rotate-6"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-300" />
                  </motion.div>

                  {/* Bottom Left Speech Bubble */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-12 left-10 bg-blue-50 border border-blue-200/80 w-16 h-10 rounded-xl rounded-tr-none flex flex-col justify-center px-2.5 shadow-sm transform -rotate-6"
                  >
                    <div className="w-full h-1 bg-blue-300/80 rounded-full mb-1.5" />
                    <div className="w-2/3 h-1 bg-blue-200 rounded-full" />
                  </motion.div>

                  {/* Big Bold FAQ Text */}
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-[72px] sm:text-[84px] font-black tracking-tighter text-[#111836] leading-none drop-shadow-sm">
                      FAQ
                    </h3>
                  </div>

                </div>
              </motion.div>

              {/* Right Column: Accordion Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-8 space-y-4"
              >
                {faqs.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'bg-white border-[#111836]/20 shadow-md ring-1 ring-[#111836]/5'
                          : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer focus:outline-none gap-4"
                      >
                        <span className="text-base sm:text-[17px] font-semibold text-[#111836] transition-colors leading-snug">
                          {item.question}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen ? 'bg-[#111836] text-white rotate-180' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
                            <div className="px-5 sm:px-6 pb-6 pt-1 text-text-primary text-[15px] leading-relaxed border-t border-gray-100 font-normal">
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
      </main>
    </div>
  );
};

export default FaqPage;
