"use client";
import React, { useState } from 'react';
import { FileText, Users } from 'lucide-react';
import ManageAdvisoryHero from './ManageAdvisoryHero';
import ManageAdvisoryMembers from './ManageAdvisoryMembers';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAdvisoryBoard = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'hero', label: 'Hero & Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Advisory Members', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'hero' && <ManageAdvisoryHero />}
          {activeTab === 'members' && <ManageAdvisoryMembers />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageAdvisoryBoard;
