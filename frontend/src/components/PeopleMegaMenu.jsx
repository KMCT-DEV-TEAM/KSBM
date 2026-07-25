"use client";
import React from 'react';
import Link from 'next/link';
import { Users, GraduationCap, Award, Building2, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const peopleLinks = [
  {
    label: 'FACULTY',
    description: 'Meet our full-time distinguished professors leading academic rigor and mentorship.',
    icon: <Users className="w-5 h-5 text-primary" />,
    href: '/faculty'
  },
  {
    label: 'ALUMNI',
    description: 'Our global network of successful business leaders, innovators, and graduates.',
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    href: '/alumni'
  },
  {
    label: 'PLACEMENT',
    description: 'Explore career opportunities, recruiter partnerships, and placement statistics.',
    icon: <Briefcase className="w-5 h-5 text-primary" />,
    href: '/placement'
  },
  {
    label: 'EXAMINATION',
    description: 'Academic schedules, examination rules, assessment guidelines, and portals.',
    icon: <Award className="w-5 h-5 text-primary" />,
    href: '/examinations'
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
          className="absolute top-[calc(100%+35px)] left-1/2 -translate-x-1/2 w-[380px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col p-8 z-50"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              ACADEMICS & RESOURCES
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {peopleLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-3 hover:border-primary transition-colors"
              >
                <span className="text-[12px] font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                  {link.label}
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

export default PeopleMegaMenu;
