"use client";
import React, { useState } from 'react';
import { FileText, Building2, Users } from 'lucide-react';
import ManageFacilitiesHero from './ManageFacilitiesHero';
import ManageFacilities from './ManageFacilities';
import ManageClubs from './ManageClubs';
import { motion, AnimatePresence } from 'framer-motion';

const ManageFacilitiesPage = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabsContainerRef = React.useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'resources', label: 'Institutional Resources', icon: <Building2 className="w-4 h-4" /> },
    { id: 'clubs', label: 'Clubs & Cells', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full space-y-8">

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
          {activeTab === 'hero' && <ManageFacilitiesHero />}
          {activeTab === 'resources' && <ManageFacilities />}
          {activeTab === 'clubs' && <ManageClubs />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageFacilitiesPage;
