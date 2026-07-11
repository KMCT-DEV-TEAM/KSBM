import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>KMCT School of Business Management | KSBM</title>
        <meta name="description" content="Welcome to KMCT School of Business Management (KSBM). We build careers that matter with 99% placement rates, top-tier academic programs, accreditation, state-of-the-art facilities, and a vibrant campus life." />
        <meta name="keywords" content="KMCT, KSBM, MBA, Business School, Management, Placement, Education, Kerala, Business Management" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KMCT School of Business Management | KSBM" />
        <meta property="og:description" content="Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life." />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KMCT School of Business Management | KSBM" />
        <meta name="twitter:description" content="Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life." />
      </Helmet>

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
      
      {/* Management Section */}
      <ManagementSection />
      
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
