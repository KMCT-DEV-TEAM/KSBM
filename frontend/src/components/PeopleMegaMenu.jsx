"use client";
import React from 'react';
import Link from 'next/link';
import { Users, GraduationCap, Award, Building2, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const peopleLinks = [
  {
    label: 'KSBM FACULTY',
    description: 'Meet our full-time distinguished professors leading academic rigor and mentorship.',
    icon: <Users className="w-5 h-5 text-primary" />,
    href: '/faculty'
  },
  {
    label: 'ALUMNI',
    description: 'Our global network of successful business leaders, innovators, and graduates.',
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    href: '/#alumni'
  }
];

const PeopleMegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }) => {
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
          className="absolute top-[calc(100%+35px)] left-1/2 -translate-x-1/2 w-[460px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden flex flex-col p-6 z-50"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              FACULTY & ALUMNI
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {peopleLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-start gap-3.5 p-3 rounded-2xl group cursor-pointer hover:bg-blue-50/60 transition-all duration-200"
              >
                <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200 shrink-0 mt-0.5">
                  {link.icon}
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-normal">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PeopleMegaMenu;
