"use client";
import React from 'react';
import AdvisoryBoardHero from './components/advisory-board/AdvisoryBoardHero';
import AdvisoryBoardContent from './components/advisory-board/AdvisoryBoardContent';
import AdvisoryBoardMembers from './components/advisory-board/AdvisoryBoardMembers';

const AdvisoryBoard = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <AdvisoryBoardHero />
      <AdvisoryBoardContent />
      <AdvisoryBoardMembers />
    </div>
  );
};

export default AdvisoryBoard;
