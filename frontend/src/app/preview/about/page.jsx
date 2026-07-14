"use client";
import React, { useState, useEffect } from 'react';
import AboutSection from '../../../features/home/components/AboutSection';

export default function AboutPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-about-data') {
        setPreviewData(event.data.payload);
      }
    };
    
    // Send a message to parent to indicate iframe is ready
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'about' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FCFCFD]">
      {previewData ? (
        <AboutSection previewData={previewData} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading preview data...
        </div>
      )}
    </div>
  );
}
