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
import ManagementDeskHero from '../../../features/about/components/management-desk/ManagementDeskHero';
import ManagementDeskIntro from '../../../features/about/components/management-desk/ManagementDeskIntro';
import ManagementDeskMembers from '../../../features/about/components/management-desk/ManagementDeskMembers';

import ProgramHero from '../../../features/programs/components/ProgramHero';
import ProgramOverview from '../../../features/programs/components/ProgramOverview';
import LearningDimensionsGrid from '../../../features/programs/components/LearningDimensionsGrid';
import WhyChoosePills from '../../../features/programs/components/WhyChoosePills';
import SummerInternshipBanner from '../../../features/programs/components/SummerInternshipBanner';
import DynamicLearningSection from '../../../features/programs/components/DynamicLearningSection';
import MomentsGallery from '../../../features/programs/components/MomentsGallery';
import AcademicCalendarBanner from '../../../features/programs/components/AcademicCalendarBanner';
import AdmissionEligibility from '../../../features/programs/components/AdmissionEligibility';
import TopRecruitersGrid from '../../../features/programs/components/TopRecruitersGrid';

import EventsHero from '../../../features/events/components/EventsHero';
import EventsAbout from '../../../features/events/components/EventsAbout';
import EventsUpcoming from '../../../features/events/components/EventsUpcoming';
import EventsCarousel from '../../../features/events/components/EventsCarousel';
import EventsEssence from '../../../features/events/components/EventsEssence';
import EventsStayConnected from '../../../features/events/components/EventsStayConnected';
import EventsMoments from '../../../features/events/components/EventsMoments';

const ManagementDesk = ({ previewData }) => (
  <>
    {previewData.showHero && (!previewData.previewType || previewData.previewType === 'hero') && <ManagementDeskHero data={previewData} />}
    {previewData.showIntro && (!previewData.previewType || previewData.previewType === 'intro') && <ManagementDeskIntro data={previewData} />}
    {previewData.showMembers && (!previewData.previewType || previewData.previewType === 'members') && <ManagementDeskMembers data={previewData} />}
  </>
);

const componentsMap = {
  AboutHero,
  VisionMissionSection,
  LegacySection,
  LeadershipSection,
  StatsSection,
  AboutCtaSection,
  AdvisoryBoard,
  GoverningBody,
  ManagementDesk,
  ProgramHero,
  ProgramOverview,
  LearningDimensionsGrid,
  WhyChoosePills,
  SummerInternshipBanner,
  DynamicLearningSection,
  MomentsGallery,
  AcademicCalendarBanner,
  AdmissionEligibility,
  TopRecruitersGrid,
  EventsHero,
  EventsAbout,
  EventsUpcoming,
  EventsCarousel,
  EventsEssence,
  EventsStayConnected,
  EventsMoments
};

export default function CMSPreviewPage() {
  const [previewState, setPreviewState] = useState({ componentName: null, data: null });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('All');

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

  const isEvents = previewState.componentName?.startsWith('Events');
  const bgClass = isEvents ? 'bg-[#050505] text-white' : 'bg-[#FCFCFD]';

  return (
    <div className={`w-full min-h-screen ${bgClass} overflow-x-hidden`}>
      <Component 
        previewData={previewState.data}
        data={previewState.data}
        program={previewState.data}
        dimensions={previewState.data?.dimensions || []}
        eligibility={previewState.data?.eligibility || []}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        {...previewState.data}
      />
    </div>
  );
}
