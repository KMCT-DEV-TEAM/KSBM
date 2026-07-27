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
    duration: 'Postgraduate Program',
    icon: <Briefcase className="w-5 h-5 text-primary" />,
    href: '/programs/mba'
  },
  {
    id: 'bba',
    label: 'BBA',
    title: 'Bachelor of Business Administration',
    description: 'A dynamic three-year undergraduate program building strong foundational business skills, entrepreneurship capabilities, and leadership excellence.',
    duration: 'Undergraduate Program',
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
          className="absolute top-[calc(100%+28px)] left-1/2 -translate-x-1/2 w-[320px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col p-5 z-50"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              ACADEMIC PROGRAMS
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {programLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-3 hover:border-primary transition-colors"
              >
                <span className="text-[12px] font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                  {link.label} - {link.title}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgramsMegaMenu;
