"use client";
import React, { useState, useEffect } from 'react';
import ManagementDeskHero from './components/management-desk/ManagementDeskHero';
import ManagementDeskIntro from './components/management-desk/ManagementDeskIntro';
import ManagementDeskMembers from './components/management-desk/ManagementDeskMembers';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const ManagementDesk = ({ previewData }) => {
  const [data, setData] = useState(previewData || null);
  const [isLoaded, setIsLoaded] = useState(!!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      return;
    }

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
        const response = await api.get('/cms/management-desk', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Management Desk data:', error);
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
  }, [previewData]);

  return (
    <>
      {!previewData && (
        <div
          className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Loader fullScreen={false} />
        </div>
      )}

      <div className="bg-[#fcfcfd] min-h-screen">
        {(!!previewData || data?.showHero !== false) && <ManagementDeskHero data={data} />}
        {(!!previewData || data?.showIntro !== false) && <ManagementDeskIntro data={data} />}
        {(!!previewData || data?.showMembers !== false) && <ManagementDeskMembers data={data} />}
      </div>
    </>
  );
};

export default ManagementDesk;
