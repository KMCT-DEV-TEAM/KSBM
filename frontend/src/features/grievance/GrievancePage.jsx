"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import GrievanceHero from './components/GrievanceHero';
import GrievanceInfo from './components/GrievanceInfo';
import GrievanceForm from './components/GrievanceForm';

const GrievancePage = ({ previewData }) => {
  const [pageData, setPageData] = useState(previewData || null);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setPageData(previewData);
      return;
    }

    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/grievance-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching Grievance Page data:', error);
      }
    };
    fetchPageData();
  }, [previewData]);

  // Handle transition loader
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';
    let dataLoaded = !!pageData;

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

    if (pageData) {
      dataLoaded = true;
      checkReady();
    }

    const fallback = setTimeout(() => setIsLoaded(true), 5000);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(fallback);
    };
  }, [pageData]);

  const isPreview = !!previewData;
  const activeTab = previewData?.activeTab;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>

      <div className="font-sans selection:bg-primary/30 selection:text-primary min-h-screen">
        {(!isPreview || activeTab === 'hero') && (
          <GrievanceHero heroData={pageData?.hero} />
        )}
        {(!isPreview || activeTab === 'info') && (
          <GrievanceInfo infoData={pageData?.infoSection} />
        )}
        {(!isPreview || activeTab === 'form') && (
          <GrievanceForm formData={pageData?.formSection} />
        )}
      </div>
    </>
  );
};

export default GrievancePage;
