"use client";
import React, { useState } from 'react';
import ProgramPage from './ProgramPage';
import { GraduationCap, Award } from 'lucide-react';

const ProgramsLanding = () => {
  const [activeTab, setActiveTab] = useState('mba');

  return (
    <div className="relative">
      {/* Floating Switcher bar */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#111836]/95 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center gap-2">
        <button
          onClick={() => setActiveTab('mba')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
            activeTab === 'mba'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>MBA Program</span>
        </button>
        <button
          onClick={() => setActiveTab('bba')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
            activeTab === 'bba'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>BBA Program</span>
        </button>
      </div>

      <ProgramPage programType={activeTab} />
    </div>
  );
};

export default ProgramsLanding;
