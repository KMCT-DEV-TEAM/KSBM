"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import AcademicPrograms from './components/AcademicPrograms';
import AccreditationSection from './components/AccreditationSection';
import FacilitiesSection from './components/FacilitiesSection';
import PlacementSection from './components/PlacementSection';
import RecruitersSection from './components/RecruitersSection';
import TestimonialsSection from './components/TestimonialsSection';
import AchievementsSection from './components/AchievementsSection';
import NewsSection from './components/NewsSection';
import LifeAtKSBMSection from './components/LifeAtKSBMSection';
import ManagementSection from './components/ManagementSection';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';
    let dataLoaded = false;

    const checkReady = () => {
      if (windowLoaded && dataLoaded) {
        // Small delay to let React render the fetched data and Framer Motion to prepare
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

    // Wait for the primary above-the-fold APIs to finish fetching
    Promise.all([
      api.get('/cms/hero', { hideLoader: true }).catch(() => {}),
      api.get('/cms/about', { hideLoader: true }).catch(() => {})
    ]).then(() => {
      dataLoaded = true;
      checkReady();
    });

    // Fallback in case load takes too long
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

      <div className="w-full">
        <Hero />
        <AboutSection />
        <AcademicPrograms />
        <AccreditationSection />
        <ManagementSection />
        <FacilitiesSection />
        <PlacementSection />
        <RecruitersSection />
        <TestimonialsSection />
        <AchievementsSection />
        <NewsSection />
        <LifeAtKSBMSection />
      </div>
    </>
  );
};

export default Home;

