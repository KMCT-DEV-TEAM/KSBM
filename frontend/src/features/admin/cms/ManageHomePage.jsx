"use client";
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Home, Info, GraduationCap, Award, Users, Building2, Briefcase, Star, Trophy, Newspaper, Heart } from 'lucide-react';
import ManageHero from './ManageHero';
import ManageAbout from './ManageAbout';
import ManagePrograms from './ManagePrograms';
import ManageAccreditation from './ManageAccreditation';
import ManageManagement from './ManageManagement';
import ManageFacilities from './ManageFacilities';
import ManagePlacement from './ManagePlacement';
import ManageRecruiters from './ManageRecruiters';
import ManageTestimonials from './ManageTestimonials';
import ManageAchievements from './ManageAchievements';
import ManageNews from './ManageNews';
import ManageLifeAtKsbm from './ManageLifeAtKsbm';

const ManageHomePage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);

  const tabs = [
    { id: 'hero', name: 'Hero Banner', icon: <Home className="w-4 h-4" /> },
    { id: 'about', name: 'About KSBM', icon: <Info className="w-4 h-4" /> },
    { id: 'academics', name: 'Academic Programs', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'accreditation', name: 'Accreditation', icon: <Award className="w-4 h-4" /> },
    { id: 'management', name: 'Management', icon: <Users className="w-4 h-4" /> },
    { id: 'facilities', name: 'Home Facilities', icon: <Building2 className="w-4 h-4" /> },
    { id: 'placement', name: 'Placement', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'recruiters', name: 'Recruiters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'testimonials', name: 'Testimonials', icon: <Star className="w-4 h-4" /> },
    { id: 'achievements', name: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'news', name: 'News', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'life', name: 'Life at KSBM', icon: <Heart className="w-4 h-4" /> }
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Home Page Management</h1>
        <p className="text-sm text-gray-500">Manage all sections of the home page from a single unified interface. Select a tab below to edit its content.</p>
      </div>

      {/* Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
          title="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

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
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
          title="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'hero' && <ManageHero />}
        {activeTab === 'about' && <ManageAbout />}
        {activeTab === 'academics' && <ManagePrograms />}
        {activeTab === 'accreditation' && <ManageAccreditation />}
        {activeTab === 'management' && <ManageManagement />}
        {activeTab === 'facilities' && <ManageFacilities />}
        {activeTab === 'placement' && <ManagePlacement />}
        {activeTab === 'recruiters' && <ManageRecruiters />}
        {activeTab === 'testimonials' && <ManageTestimonials />}
        {activeTab === 'achievements' && <ManageAchievements />}
        {activeTab === 'news' && <ManageNews />}
        {activeTab === 'life' && <ManageLifeAtKsbm />}
      </div>
    </div>
  );
};

export default ManageHomePage;
