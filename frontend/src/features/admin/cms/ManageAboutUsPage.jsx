"use client";
import React, { useState } from 'react';
import { FileText, Eye, Clock, Users, BarChart, MousePointerClick, ChevronLeft, ChevronRight } from 'lucide-react';
import ManageAboutUsHero from './ManageAboutUsHero';
import ManageVisionMission from './ManageVisionMission';
import ManageLegacy from './ManageLegacy';
import ManageAboutUsStats from './ManageAboutUsStats';
import ManageAboutCta from './ManageAboutCta';
import ManageLeadership from './ManageLeadership';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabsContainerRef = React.useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'vision', label: 'Vision & Mission', icon: <Eye className="w-4 h-4" /> },
    { id: 'legacy', label: 'Legacy Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'leadership', label: 'Leadership', icon: <Users className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart className="w-4 h-4" /> },
    { id: 'cta', label: 'Apply CTA', icon: <MousePointerClick className="w-4 h-4" /> }
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8 pb-16">

      {/* Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">


        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'hero' && <ManageAboutUsHero />}
          {activeTab === 'vision' && <ManageVisionMission />}
          {activeTab === 'legacy' && <ManageLegacy />}
          {activeTab === 'leadership' && <ManageLeadership />}
          {activeTab === 'stats' && <ManageAboutUsStats />}
          {activeTab === 'cta' && <ManageAboutCta />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageAboutUsPage;
