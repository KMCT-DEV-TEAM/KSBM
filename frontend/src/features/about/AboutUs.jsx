"use client";
import React, { useState, useEffect } from 'react';
import AboutHero from './components/AboutHero';
import LegacySection from './components/LegacySection';
import StatsSection from './components/StatsSection';
import VisionMissionSection from './components/VisionMissionSection';
import AccreditationSection from './components/AccreditationSection';
import LeadershipSection from './components/LeadershipSection';
import AboutCtaSection from './components/AboutCtaSection';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';
    let dataLoaded = false;

    const checkReady = () => {
      if (windowLoaded && dataLoaded) {
        setTimeout(() => setIsLoaded(true), 400);
      }
    };

    const handleWindowLoad = () => {
      windowLoaded = true;
      checkReady();
    };

    if (windowLoaded) {
      checkReady();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    Promise.all([
      api.get('/cms/about-us-hero', { hideLoader: true }).catch(() => {}),
      api.get('/cms/vision-mission', { hideLoader: true }).catch(() => {})
    ]).then(() => {
      dataLoaded = true;
      checkReady();
    });

    const fallback = setTimeout(() => setIsLoaded(true), 5000);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>

      <div className="bg-[#fcfcfd]">
        <AboutHero />
        <LegacySection />
        <StatsSection />
        <VisionMissionSection />
        <AccreditationSection />
        <LeadershipSection />
        <AboutCtaSection />
      </div>
    </>
  );
};

export default AboutUs;
