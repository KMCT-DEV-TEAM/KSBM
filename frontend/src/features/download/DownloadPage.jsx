"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import DownloadHero from './components/DownloadHero';
import DownloadContent from './components/DownloadContent';

const DownloadPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/download-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching Download Page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="font-sans selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <DownloadHero heroData={pageData?.hero} />
        <DownloadContent documents={pageData?.documents || []} />
      </div>
      <Footer />
    </div>
  );
};

export default DownloadPage;
