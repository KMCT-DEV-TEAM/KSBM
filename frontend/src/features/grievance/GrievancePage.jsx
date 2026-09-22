"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import GrievanceHero from './components/GrievanceHero';
import GrievanceInfo from './components/GrievanceInfo';
import GrievanceForm from './components/GrievanceForm';
import { DEFAULT_GRIEVANCE_PAGE } from '../admin/cms/constants/defaultCmsData';

const GrievancePage = ({ previewData }) => {
  const [pageData, setPageData] = useState(previewData || DEFAULT_GRIEVANCE_PAGE);
  const [loading, setLoading] = useState(false);

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

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (previewData) {
        setIsLoaded(true);
        return;
      }
      const handleLoad = () => {
        setTimeout(() => setIsLoaded(true), 400);
      };
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        const fallback = setTimeout(handleLoad, 3000);
        return () => {
          window.removeEventListener('load', handleLoad);
          clearTimeout(fallback);
        };
      }
    }
  }, [loading, previewData]);

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
