import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Landmark, Building2, Star, Users, Briefcase, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'governance', label: 'GOVERNANCE BODIES' },
  { id: 'management', label: 'MANAGEMENT DESK' },
  { id: 'kmctGroup', label: 'KMCT GROUP OF INSTITUTION' },
];

const tabContent = {
  overview: {
    description: "KMCT School of Business (KSBM) ignites a passion for intellectual discovery and lifelong learning. Empowering each individual to achieve their fullest potential.",
    links: [
      { label: 'VISION & MISSION', icon: <Target className="w-5 h-5 text-primary" />, href: '/about#vision' },
      { label: 'KMCT LEGACY', icon: <Landmark className="w-5 h-5 text-primary" />, href: '/about#legacy' },
      { label: 'CAMPUS & FACILITIES', icon: <Building2 className="w-5 h-5 text-primary" />, href: '/about#campus' },
      { label: 'KEY HIGHLIGHTS', icon: <Star className="w-5 h-5 text-primary" />, href: '/about#stats' },
    ]
  },
  governance: {
    description: "The Governance Bodies ensure that KSBM adheres to the highest standards of academic integrity, strategic vision, and institutional excellence.",
    links: [
      { label: 'ORGANOGRAM', icon: <Building2 className="w-5 h-5 text-primary" />, href: '/about#organogram' },
      { label: 'GOVERNING BODY', icon: <Users className="w-5 h-5 text-primary" />, href: '/about/governing-body' },
      { label: 'INSTITUTIONAL ADVISORY BOARD', icon: <GraduationCap className="w-5 h-5 text-primary" />, href: '/about#advisory-board' },
    ]
  },
  management: {
    description: "The Management Desk provides strategic direction and steadfast support to ensure KSBM remains at the forefront of business education.",
    links: [
      { label: 'CHAIRMAN\'S MESSAGE', icon: <Users className="w-5 h-5 text-primary" />, href: '/about#chairman' },
      { label: 'DIRECTOR\'S DESK', icon: <Target className="w-5 h-5 text-primary" />, href: '/about#director' },
      { label: 'LEADERSHIP TEAM', icon: <Users className="w-5 h-5 text-primary" />, href: '/about#leadership' },
    ]
  },
  kmctGroup: {
    description: "KMCT Group of Institutions is a premier educational trust dedicated to providing quality education across medicine, engineering, and management.",
    links: [
      { label: 'ABOUT THE TRUST', icon: <Building2 className="w-5 h-5 text-primary" />, href: '/about#trust' },
      { label: 'OUR SISTER INSTITUTIONS', icon: <Landmark className="w-5 h-5 text-primary" />, href: '/about#institutions' },
      { label: 'SOCIAL INITIATIVES', icon: <Star className="w-5 h-5 text-primary" />, href: '/about#social' },
    ]
  },
};

const AboutMegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
          className="absolute top-[calc(100%+35px)] left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex z-50"
        >
          {/* Left Sidebar */}
          <div className="w-[40%] bg-white py-6 border-r border-gray-100 flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onMouseEnter={() => setActiveTab(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left pl-8 pr-4 py-3.5 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === tab.id
                  ? 'border-l-[3px] border-primary text-primary bg-blue-50/50'
                  : 'border-l-[3px] border-transparent text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="w-[60%] p-8 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col justify-start"
              >
                <div className="flex flex-col gap-4">
                  {tabContent[activeTab]?.links.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-3 hover:border-primary transition-colors"
                    >
                      <span className="text-[12px] font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutMegaMenu;
