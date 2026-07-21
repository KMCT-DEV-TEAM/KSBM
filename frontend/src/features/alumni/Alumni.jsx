"use client";
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AlumniHero from './components/AlumniHero';
import LegacySection from './components/LegacySection';
import AlumniEvents from './components/AlumniEvents';
import NotableAlumni from './components/NotableAlumni';
import AlumniGallery from './components/AlumniGallery';
import AlumniCTA from './components/AlumniCTA';

const Alumni = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const { data: res } = await api.get('/cms/alumni-page');
        if (res && res.hero) {
          setData(res);
        }
      } catch (err) {
        console.warn('Using default alumni page data:', err.message);
      }
    };
    fetchAlumniData();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col pb-6 sm:pb-8">
      <AlumniHero data={data?.hero} />
      <LegacySection data={data?.legacy} />
      <AlumniEvents data={data?.events} />
      <NotableAlumni data={data?.notableAlumni} />
      <AlumniGallery data={data?.gallery} />
      <AlumniCTA data={data?.cta} />
    </div>
  );
};

export default Alumni;
