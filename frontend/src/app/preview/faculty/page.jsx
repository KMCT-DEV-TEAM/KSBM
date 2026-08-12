"use client";
import React, { useState, useEffect } from 'react';
import FacultyHero from '../../../features/faculty/components/FacultyHero';
import FacultyIntro from '../../../features/faculty/components/FacultyIntro';
import FacultyGridSection from '../../../features/faculty/components/FacultyGridSection';

export default function FacultyPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-faculty-data') {
        setPreviewData(event.data.payload);
      }
    };

    // Send a message to parent to indicate iframe is ready
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'faculty' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading preview data...
      </div>
    );
  }

  const data = {
    showHeroTextContent: previewData.showHeroTextContent,
    heroHeading: previewData.heroHeading,
    heroSubtext: previewData.heroSubtext,
    heroBgImage: previewData.heroBgImage,
    showIntro: previewData.showIntro,
    introSubheading: previewData.introSubheading,
    introHeading: previewData.introHeading,
    introText: previewData.introText,
    showKsbmFaculty: previewData.showKsbmFaculty,
    showAdjunctFaculty: previewData.showAdjunctFaculty,
    ksbmFaculty: previewData.ksbmFaculty,
    adjunctFaculty: previewData.adjunctFaculty,
    ksbmFacultyHeading: previewData.ksbmFacultyHeading,
    adjunctFacultyHeading: previewData.adjunctFacultyHeading,
  };

  const activeTab = previewData.activeTab || 'hero';

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd]">
      {activeTab === 'hero' && <FacultyHero data={data} />}
      {activeTab === 'intro' && <FacultyIntro data={data} />}
      {activeTab === 'ksbm' && <FacultyGridSection id="ksbm-faculty" title={data.ksbmFacultyHeading || "KSBM Faculty"} members={data.ksbmFaculty} />}
      {activeTab === 'adjunct' && <FacultyGridSection id="adjunct-faculty" title={data.adjunctFacultyHeading || "Adjunct Faculty"} members={data.adjunctFaculty} />}
    </div>
  );
}
