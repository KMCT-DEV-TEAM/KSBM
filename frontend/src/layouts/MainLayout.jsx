"use client";
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import VirtualTourButton from '../components/VirtualTourButton';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Global Header */}
      <Header />
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
      
      {/* Global Floating Buttons */}
      <VirtualTourButton />
    </div>
  );
};

export default MainLayout;

