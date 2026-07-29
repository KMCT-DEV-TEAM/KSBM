"use client";
import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const PageTransition = ({ dataLoaded }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

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

    const fallback = setTimeout(() => setIsLoaded(true), 5000);
    
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(fallback);
    };
  }, [dataLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShouldRender(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <Loader fullScreen={false} />
    </div>
  );
};

export default PageTransition;
