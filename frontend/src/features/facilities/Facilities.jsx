"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import FacilitiesSkeleton from './components/FacilitiesSkeleton';
import FacilitiesHero from './components/FacilitiesHero';
import InstitutionalResourcesSection from './components/InstitutionalResourcesSection';
import ClubsSection from './components/ClubsSection';

const Facilities = () => {
  const [data, setData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [previewSection, setPreviewSection] = useState(null);
  const [isIframe, setIsIframe] = useState(false);

  const watermarkImg = '/assets/Images/Home/watermark_logo.png';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(window.self !== window.top);
    }

    const handleMessage = (event) => {
      if (event.data?.type === 'LIVE_PREVIEW_UPDATE' && event.data.data) {
        setData(event.data.data);
        setDataLoaded(true);
        if (event.data.activeTab) {
          setPreviewSection(event.data.activeTab);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready' }, '*');
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isIframe) {
      setDataLoaded(false); // Wait for the payload
      return;
    }
    const fetchFacilitiesData = async () => {
      try {
        const response = await api.get('/cms/facilities-page', { hideLoader: true });
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch facilities data:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    fetchFacilitiesData();
  }, [isIframe]);


  if (!dataLoaded) {
    if (isIframe) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#FCFCFD] text-gray-500">
          Loading preview data...
        </div>
      );
    }
    return (
      <>
        <PageTransition dataLoaded={dataLoaded} />
        <FacilitiesSkeleton />
      </>
    );
  }

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <main className="flex-1">
          {(!previewSection || previewSection === 'hero') && (
            <FacilitiesHero data={data?.hero} />
          )}

          {/* Pattern Separator */}

          {(!previewSection || previewSection === 'resources') && data?.institutionalResources?.showSection !== false && (
            <InstitutionalResourcesSection
              headerData={data?.institutionalResources}
              libraryData={data?.library}
              otherResourcesData={data?.otherResources}
            />
          )}

        {/* Pattern Separator */}
        {(!previewSection || previewSection === 'clubs') && data?.clubs?.showSection !== false && (
          <>
            <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
              <div className="flex items-center justify-center gap-4 w-full">
                <div className="h-[1.5px] bg-[#CCE2F2]/30 flex-1"></div>
                <img src={watermarkImg} alt="Divider Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-100" />
                <div className="h-[1.5px] bg-[#CCE2F2]/30 flex-1"></div>
              </div>
            </div>

            <ClubsSection data={data?.clubs} />
          </>
        )}
      </main>
    </div>
    </>
  );
};

export default Facilities;
