"use client";
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import AdmissionHero from './components/AdmissionHero';
import EliteAdvantageSection from './components/EliteAdvantageSection';
import AdmissionJourneySection from './components/AdmissionJourneySection';
import EligibilityStandardsSection from './components/EligibilityStandardsSection';
import AdmissionCtaSection from './components/AdmissionCtaSection';
import AdmissionFaqSection from './components/AdmissionFaqSection';

const AdmissionLanding = () => {
  const [data, setData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAdmissionData = async () => {
      try {
        const res = await api.get('/cms/admissions-page', { hideLoader: true });
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching admission page data:', err);
      } finally {
        setDataLoaded(true);
      }
    };

    const handleMessage = (event) => {
      if (event.data?.type === 'preview-admissions-data') {
        setData(event.data.payload);
        setDataLoaded(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'admissions' }, '*');
    } else {
      fetchAdmissionData();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const activeTab = data?.activeTab;
  const isPreview = Boolean(activeTab);

  const showHero = !isPreview || activeTab === 'hero';
  const showElite = (!isPreview || activeTab === 'elite') && data?.showSections?.elite !== false;
  const showJourney = (!isPreview || activeTab === 'journey') && data?.showSections?.journey !== false;
  const showEligibility = (!isPreview || activeTab === 'eligibility') && data?.showSections?.eligibility !== false;
  const showCta = (!isPreview || activeTab === 'cta') && data?.showSections?.cta !== false;
  const showFaq = (!isPreview || activeTab === 'faq') && data?.showSections?.faq !== false;

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="bg-white flex flex-col justify-between overflow-x-hidden">
        {showHero && <AdmissionHero data={data} showText={data?.showSections?.heroText !== false} />}
        {dataLoaded && showElite && <EliteAdvantageSection data={data} />}
        {dataLoaded && showJourney && <AdmissionJourneySection data={data} />}
        {dataLoaded && showEligibility && <EligibilityStandardsSection data={data} />}
        {dataLoaded && showCta && <AdmissionCtaSection data={data} />}
        {dataLoaded && showFaq && <AdmissionFaqSection data={data} />}
      </div>
    </>
  );
};

export default AdmissionLanding;
