"use client";
import React, { useState } from 'react';
import ProgramPage from './ProgramPage';

const ProgramsLanding = () => {
  const [activeTab] = useState('mba');

  return (
    <div className="relative">
      <ProgramPage programType={activeTab} />
    </div>
  );
};

export default ProgramsLanding;
