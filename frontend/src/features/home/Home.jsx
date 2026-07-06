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

const Home = () => {
  return (
    <div>
      {/* Header called inside Home as requested */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Third Section: About KSBM */}
      <AboutSection />
      
      {/* Fourth Section: Academic Programs */}
      <AcademicPrograms />
      
      {/* Fifth Section: Accreditation & Affiliations */}
      <AccreditationSection />
      
      {/* Sixth Section: College Facilities */}
      <FacilitiesSection />
      
      {/* Seventh Section: Placement Highlights */}
      <PlacementSection />
      
      {/* Eighth Section: Recruiters/Partners */}
      <RecruitersSection />
      
      {/* Ninth Section: Testimonials */}
      <TestimonialsSection />
      
      {/* Tenth Section: College Achievements */}
      <AchievementsSection />
      
      {/* Eleventh Section: Latest News */}
      <NewsSection />
      
      {/* Twelfth Section: Life at KSBM */}
      <LifeAtKSBMSection />
      
      {/* Rest of the page content can go here in the future */}
    </div>
  );
};

export default Home;
