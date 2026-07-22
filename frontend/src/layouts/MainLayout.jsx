"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import VirtualTourButton from '../components/VirtualTourButton';
import SideContact from '../components/SideContact';
import Loader from '../components/Loader';

const MainLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (e) => {
      setIsLoading(e.detail);
    };

    window.addEventListener('axios-loading', handleLoading);
    return () => {
      window.removeEventListener('axios-loading', handleLoading);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {isLoading && (
        <div className="fixed inset-0 z-[10000]">
          <Loader fullScreen={true} theme="light" text="Loading KSBM..." />
        </div>
      )}
      
      {/* Global Header */}
      <Header />
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
      
      {/* Global Floating Buttons */}
      <VirtualTourButton />
      <SideContact />
    </div>
  );
};

export default MainLayout;

