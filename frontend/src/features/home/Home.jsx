"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import FlashNewsSection from './components/FlashNewsSection';
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
    // Reveal page smoothly upon mounting
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-700 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>

      <div className="w-full">
        <Hero />
        <FlashNewsSection />
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

