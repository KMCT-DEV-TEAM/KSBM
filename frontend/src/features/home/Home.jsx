"use client";
import React from 'react';
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

const Home = () => {
  return (
    <div>

      <Header />
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
  );
};

export default Home;

