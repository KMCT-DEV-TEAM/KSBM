"use client";
import React, { useEffect } from 'react';
import ContactHero from './components/ContactHero';

const ContactLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#111836] flex flex-col justify-between">
      <main>
        <ContactHero />
      </main>
    </div>
  );
};

export default ContactLanding;
