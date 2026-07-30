"use client";
import React, { useState } from 'react';
import { FileText, Building2, Users } from 'lucide-react';
import ManageFacilitiesHero from './ManageFacilitiesHero';
import ManageInstitutionalResources from './ManageInstitutionalResources';
import ManageClubs from './ManageClubs';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const ManageFacilitiesPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'hero');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabsContainerRef = React.useRef(null);

  // Update URL when tab changes without causing a full reload
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`/admin/cms/facilities?tab=${tabId}`, { scroll: false });
  };

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
              onClick={() => handleTabChange(tab.id)}
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
          {activeTab === 'resources' && <ManageInstitutionalResources />}
          {activeTab === 'clubs' && <ManageClubs />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ManageFacilitiesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageFacilitiesPageContent />
    </Suspense>
  );
};

export default ManageFacilitiesPage;
