"use client";
import React from 'react';
import Link from 'next/link';
import { Briefcase, Award, ArrowRight, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const programLinks = [
  {
    id: 'mba',
    label: 'MBA',
    title: 'Master of Business Administration',
    description: 'A rigorous two-year postgraduate program designed to mold visionary business leaders, strategic thinkers, and dynamic corporate innovators.',
    duration: '2 Years • Postgraduate',
    icon: <Briefcase className="w-5 h-5 text-primary" />,
    href: '/programs/mba'
  },
  {
    id: 'bba',
    label: 'BBA',
    title: 'Bachelor of Business Administration',
    description: 'A dynamic three-year undergraduate program building strong foundational business skills, entrepreneurship capabilities, and leadership excellence.',
    duration: '3 Years • Undergraduate',
    icon: <Award className="w-5 h-5 text-primary" />,
    href: '/programs/bba'
  }
];

const ProgramsMegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-[calc(100%+35px)] left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden flex flex-col p-6 z-50"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              ACADEMIC PROGRAMS
            </span>
            <span className="text-[11px] font-semibold text-primary/80">
              Admissions Open 2026
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {programLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-start gap-4 p-4 rounded-2xl group cursor-pointer hover:bg-blue-50/70 transition-all duration-200 border border-transparent hover:border-blue-100/60"
              >
                <div className="p-3 rounded-2xl bg-blue-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200 shrink-0 mt-0.5 text-primary">
                  {link.icon}
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-wide text-gray-900 group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                        {link.label}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary/80 mb-1 block">
                    {link.duration}
                  </span>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/80 -mx-6 -mb-6 px-6 py-3.5">
            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AICTE Approved & Calicut University Affiliated</span>
            </div>
            <Link 
              href="/programs/mba" 
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Explore All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgramsMegaMenu;
