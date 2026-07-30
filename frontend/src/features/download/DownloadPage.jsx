"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import DownloadHero from './components/DownloadHero';
import DownloadContent from './components/DownloadContent';

const DownloadPage = ({ previewData }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setPageData(previewData);
      setLoading(false);
      return;
    }

    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/download-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching Download Page data:', error);
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

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>
    <div className="font-sans selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col bg-white">
      {!previewData && <Header />}
      <div className="flex-grow">
        <DownloadHero heroData={pageData?.hero} />
        <DownloadContent documents={pageData?.documents || []} />
      </div>
      {!previewData && <Footer />}
    </div>
    </>
  );
};

export default DownloadPage;
