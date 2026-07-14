"use client";
import React from 'react';
import GoverningBodyHero from './components/governing-body/GoverningBodyHero';
import GoverningBodyContent from './components/governing-body/GoverningBodyContent';
import GoverningBodyMembers from './components/governing-body/GoverningBodyMembers';

const GoverningBody = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <GoverningBodyHero />
      <GoverningBodyContent />
      <GoverningBodyMembers />
    </div>
  );
};

export default GoverningBody;
