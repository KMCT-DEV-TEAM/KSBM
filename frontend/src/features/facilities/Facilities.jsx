"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import FacilitiesHero from './components/FacilitiesHero';
import InstitutionalResourcesSection from './components/InstitutionalResourcesSection';
import ClubsSection from './components/ClubsSection';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Facilities = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const watermarkImg = '/assets/Images/watermark_logo.png';

  useEffect(() => {
    const fetchFacilitiesData = async () => {
      try {
        const response = await api.get('/cms/facilities-page');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch facilities data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilitiesData();
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      <main className="flex-1">
        <FacilitiesHero data={data.hero} />

        {/* Pattern Separator */}

        <InstitutionalResourcesSection
          headerData={data.institutionalResources}
          libraryData={data.library}
          otherResourcesData={data.otherResources}
        />

        {/* Pattern Separator */}
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-[1.5px] bg-[#CCE2F2]/30 flex-1"></div>
            <img src={watermarkImg} alt="Divider Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-200" />
            <div className="h-[1.5px] bg-[#CCE2F2]/30 flex-1"></div>
          </div>
        </div>

        <ClubsSection data={data.clubs} />
      </main>

      <Footer />
    </div>
  );
};

export default Facilities;
