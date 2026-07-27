"use client";
import React, { useState, useEffect } from 'react';
import AdvisoryBoardHero from './components/advisory-board/AdvisoryBoardHero';
import AdvisoryBoardContent from './components/advisory-board/AdvisoryBoardContent';
import AdvisoryBoardMembers from './components/advisory-board/AdvisoryBoardMembers';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const AdvisoryBoard = ({ previewData }) => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(!!previewData);

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
        const response = await api.get('/cms/advisory-board', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Advisory Board data:', error);
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
        {!previewData && <Loader fullScreen={false} />}
      </div>

      <div className="bg-[#fcfcfd] min-h-screen">
        {(!previewData || previewData.previewType !== 'members') && (
          <>
            <AdvisoryBoardHero data={{ ...data, ...previewData }} />
            <AdvisoryBoardContent data={{ ...data, ...previewData }} />
          </>
        )}
        {(!previewData || previewData.previewType !== 'hero') && (
          <AdvisoryBoardMembers data={{ ...data, ...previewData }} />
        )}
      </div>
    </>
  );
};

export default AdvisoryBoard;
