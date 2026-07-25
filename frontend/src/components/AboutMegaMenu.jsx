"use client";
import React from 'react';
import Link from 'next/link';
import { Target, Users, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aboutLinks = [
  {
    label: 'ABOUT US',
    description: 'Overview of KMCT School of Business, our vision, mission, and legacy.',
    icon: <Target className="w-5 h-5 text-primary" />,
    href: '/about'
  },
  {
    label: 'GOVERNING BODY',
    description: 'Distinguished leaders governing academic and institutional excellence.',
    icon: <Users className="w-5 h-5 text-primary" />,
    href: '/about/governing-body'
  },
  {
    label: 'ADVISORY BOARD',
    description: 'Industry luminaries providing strategic guidance and corporate alignment.',
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    href: '/about/advisory-board'
  },
  {
    label: 'MANAGEMENT DESK',
    description: "Messages from our Chairman, Vice Chairman, and Director.",
    icon: <Building2 className="w-5 h-5 text-primary" />,
    href: '/about/management-desk'
  }
];

const AboutMegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }) => {
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
              ABOUT KSBM
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {aboutLinks.map((link, idx) => (
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

export default AboutMegaMenu;
