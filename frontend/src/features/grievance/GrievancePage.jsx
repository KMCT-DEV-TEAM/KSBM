"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import GrievanceHero from './components/GrievanceHero';
import GrievanceInfo from './components/GrievanceInfo';
import GrievanceForm from './components/GrievanceForm';

const GrievancePage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/grievance-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching Grievance Page data:', error);
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
    <div className="font-sans selection:bg-primary/30 selection:text-primary">
      <GrievanceHero heroData={pageData?.hero} />
      <GrievanceInfo infoData={pageData?.infoSection} />
      <GrievanceForm formData={pageData?.formSection} />
    </div>
  );
};

export default GrievancePage;
