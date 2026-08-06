"use client";
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import AlumniHero from './components/AlumniHero';
import LegacySection from './components/LegacySection';
import AlumniEvents from './components/AlumniEvents';
import NotableAlumni from './components/NotableAlumni';
import AlumniGallery from './components/AlumniGallery';
import AlumniCTA from './components/AlumniCTA';

const Alumni = ({ previewData }) => {
  const [data, setData] = useState(previewData || null);
  const [dataLoaded, setDataLoaded] = useState(!!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      return;
    }

    const fetchAlumniData = async () => {
      try {
        const { data: res } = await api.get('/cms/alumni-page', { hideLoader: true });
        if (res && res.hero) {
          setData(res);
        }
      } catch (err) {
        console.warn('Using default alumni page data:', err.message);
      }
      finally {
        setDataLoaded(true);
      }
    };
    fetchAlumniData();
  }, [previewData]);

  const isPreview = !!previewData;
  const activeTab = previewData?.activeTab;

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="bg-[#fcfcfd] min-h-screen flex flex-col pb-6 sm:pb-8">
        {(!isPreview || activeTab === 'hero') && <div id="alumni-hero"><AlumniHero data={data?.hero} previewDevice={previewData?.previewDevice} /></div>}
        {(!isPreview || activeTab === 'legacy') && (isPreview || data?.legacy?.showSection !== false) && <div id="alumni-legacy"><LegacySection data={data?.legacy} previewDevice={previewData?.previewDevice} /></div>}
        {(!isPreview || activeTab === 'events') && (isPreview || data?.events?.showSection !== false) && <div id="alumni-events"><AlumniEvents data={data?.events} previewDevice={previewData?.previewDevice} /></div>}
        {(!isPreview || activeTab === 'notable') && (isPreview || data?.notableAlumni?.showSection !== false) && <div id="alumni-notable"><NotableAlumni data={data?.notableAlumni} previewDevice={previewData?.previewDevice} /></div>}
        {(!isPreview || activeTab === 'gallery') && (isPreview || data?.gallery?.showSection !== false) && <div id="alumni-gallery"><AlumniGallery data={data?.gallery} previewDevice={previewData?.previewDevice} /></div>}
        {(!isPreview || activeTab === 'cta') && (isPreview || data?.cta?.showSection !== false) && <div id="alumni-cta"><AlumniCTA data={data?.cta} previewDevice={previewData?.previewDevice} /></div>}
      </div>
    </>
  );
};

export default Alumni;
