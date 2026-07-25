"use client";
import React, { useState, useEffect } from 'react';
import GoverningBodyHero from './components/governing-body/GoverningBodyHero';
import GoverningBodyContent from './components/governing-body/GoverningBodyContent';
import GoverningBodyMembers from './components/governing-body/GoverningBodyMembers';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const GoverningBody = () => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';
    let dataLoaded = false;

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

    const fetchData = async () => {
      try {
        const response = await api.get('/cms/governing-body', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Governing Body data:', error);
      } finally {
        dataLoaded = true;
        checkReady();
      }
    };
    fetchData();

    const fallback = setTimeout(() => setIsLoaded(true), 5000);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>

      <div className="bg-[#fcfcfd] min-h-screen">
        <GoverningBodyHero data={data} />
        <GoverningBodyContent data={data} />
        <GoverningBodyMembers data={data} />
      </div>
    </>
  );
};

export default GoverningBody;
