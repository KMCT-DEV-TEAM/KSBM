import React from 'react';
import AboutHero from './components/AboutHero';
import LegacySection from './components/LegacySection';
import StatsSection from './components/StatsSection';
import VisionMissionSection from './components/VisionMissionSection';
import AccreditationSection from './components/AccreditationSection';
import LeadershipSection from './components/LeadershipSection';
import AboutCtaSection from './components/AboutCtaSection';

const AboutUs = () => {
  return (
    <div className="bg-[#fcfcfd]">
      <AboutHero />
      <LegacySection />
      <StatsSection />
      <VisionMissionSection />
      <AccreditationSection />
      <LeadershipSection />
      <AboutCtaSection />
    </div>
  );
};

export default AboutUs;
