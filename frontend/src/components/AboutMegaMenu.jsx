"use client";
import React from 'react';
import Link from 'next/link';
import { Target, Users, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aboutLinks = [
  {
    label: 'OVERVIEW',
    description: 'Overview of KMCT School of Business, our vision, mission, and legacy.',
    icon: <Target className="w-5 h-5 text-primary" />,
    href: '/about'
  },
  {
    label: 'GOVERNING BODY',
    description: 'Distinguished leaders governing academic and institutional excellence.',
    icon: <Users className="w-5 h-5 text-primary" />,
    subLinks: [
      { label: 'Overview', href: '/about/governing-body' },
      { label: 'Organogram', href: '/assets/Organogram.pdf', target: '_blank' }
    ]
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
  const [hoveredLink, setHoveredLink] = React.useState(null);

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
          className="absolute top-[calc(100%+28px)] left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col p-5 z-50 overflow-visible"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              ABOUT KSBM
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {aboutLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.subLinks ? (
                  <div className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-3 hover:border-primary transition-colors">
                    <span className="text-[12px] font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-3 hover:border-primary transition-colors"
                  >
                    <span className="text-[12px] font-bold tracking-wider text-gray-800 uppercase group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                )}
                
                <AnimatePresence>
                  {link.subLinks && hoveredLink === link.label && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 left-[calc(100%+25px)] w-[220px] bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 flex flex-col"
                    >
                      {link.subLinks.map((sub, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <Link
                            href={sub.href}
                            target={sub.target}
                            className="group flex items-center justify-between text-[12px] font-bold tracking-wider text-gray-700 uppercase hover:text-primary transition-colors py-2 px-3 hover:bg-gray-50 rounded-md"
                          >
                            <span>{sub.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </Link>
                          {sIdx !== link.subLinks.length - 1 && (
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                          )}
                        </React.Fragment>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutMegaMenu;
