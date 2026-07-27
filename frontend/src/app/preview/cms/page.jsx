"use client";
import React, { useState, useEffect } from 'react';
import AboutHero from '../../../features/about/components/AboutHero';
import VisionMissionSection from '../../../features/about/components/VisionMissionSection';
import LegacySection from '../../../features/about/components/LegacySection';
import LeadershipSection from '../../../features/about/components/LeadershipSection';
import StatsSection from '../../../features/about/components/StatsSection';
import AboutCtaSection from '../../../features/about/components/AboutCtaSection';
import AdvisoryBoard from '../../../features/about/AdvisoryBoard';
import GoverningBody from '../../../features/about/GoverningBody';

const componentsMap = {
  AboutHero,
  VisionMissionSection,
  LegacySection,
  LeadershipSection,
  StatsSection,
  AboutCtaSection,
  AdvisoryBoard,
  GoverningBody
};

export default function CMSPreviewPage() {
  const [previewState, setPreviewState] = useState({ componentName: null, data: null });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-cms-data') {
        setPreviewState({
          componentName: event.data.componentName,
          data: event.data.payload
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready' }, '*');
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!previewState.componentName) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-gray-500">
        Loading Preview...
      </div>
    );
  }

  const Component = componentsMap[previewState.componentName];
  if (!Component) {
    return <div className="p-4 text-red-500">Component {previewState.componentName} not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#FCFCFD] overflow-x-hidden">
      <Component previewData={previewState.data} />
    </div>
  );
}
