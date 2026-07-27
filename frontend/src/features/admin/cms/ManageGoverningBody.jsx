"use client";
import React, { useState } from 'react';
import { FileText, Users } from 'lucide-react';
import ManageGoverningHero from './ManageGoverningHero';
import ManageGoverningMembers from './ManageGoverningMembers';
import { motion, AnimatePresence } from 'framer-motion';

const ManageGoverningBody = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'hero', label: 'Hero & Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Governing Members', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div
          className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
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
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'hero' && <ManageGoverningHero />}
          {activeTab === 'members' && <ManageGoverningMembers />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageGoverningBody;
