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
          className="absolute top-[calc(100%+35px)] left-1/2 -translate-x-1/2 w-[370px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden flex flex-col p-4.5 z-50"
        >
          <div className="flex items-center justify-between pb-2 mb-2 px-1">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              ACADEMIC PROGRAMS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {programLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center gap-3.5 p-3 rounded-2xl group cursor-pointer hover:bg-blue-50/70 transition-all duration-200 border border-transparent hover:border-blue-100/60"
              >
                <div className="p-2.5 rounded-2xl bg-blue-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200 shrink-0 text-primary">
                  {link.icon}
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[13px] font-bold tracking-wide text-gray-900 group-hover:text-primary transition-colors truncate">
                        {link.title}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary rounded-full shrink-0">
                        {link.label}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                    {link.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgramsMegaMenu;
