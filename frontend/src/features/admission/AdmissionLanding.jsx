"use client";
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdmissionHero from './components/AdmissionHero';
import EliteAdvantageSection from './components/EliteAdvantageSection';
import AdmissionJourneySection from './components/AdmissionJourneySection';
import EligibilityStandardsSection from './components/EligibilityStandardsSection';
import AdmissionCtaSection from './components/AdmissionCtaSection';
import AdmissionFaqSection from './components/AdmissionFaqSection';

const AdmissionLanding = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAdmissionData = async () => {
      try {
        const res = await api.get('/cms/admissions-page');
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching admission page data:', err);
      }
    };
    fetchAdmissionData();
  }, []);

  return (
    <div className="bg-white flex flex-col justify-between overflow-x-hidden">
      <AdmissionHero data={data} />
      <EliteAdvantageSection data={data} />
      <AdmissionJourneySection data={data} />
      <EligibilityStandardsSection data={data} />
      <AdmissionCtaSection data={data} />
      <AdmissionFaqSection data={data} />
    </div>
  );
};

export default AdmissionLanding;
