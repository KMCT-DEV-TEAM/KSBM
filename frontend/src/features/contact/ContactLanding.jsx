"use client";
import React from 'react';
import ContactHero from './components/ContactHero';

const ContactLanding = ({ previewData }) => {
  return (
    <div className="min-h-screen bg-[#111836] flex flex-col justify-between">
      <main>
        <ContactHero previewData={previewData} />
      </main>
    </div>
  );
};

export default ContactLanding;
