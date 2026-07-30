"use client";
import React, { useEffect, useState } from 'react';
import ContactHero from './components/ContactHero';
import Loader from '../../components/Loader';

const ContactLanding = ({ previewData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(!!previewData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';

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

    if (dataLoaded) {
      checkReady();
    }

    const fallback = setTimeout(() => setIsLoaded(true), 5000);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(fallback);
    };
  }, [dataLoaded]);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>
      <div className="min-h-screen bg-[#111836] flex flex-col justify-between">
        <main>
          <ContactHero previewData={previewData} onDataLoaded={() => setDataLoaded(true)} />
        </main>
      </div>
    </>
  );
};

export default ContactLanding;
