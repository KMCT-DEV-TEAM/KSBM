"use client";
import React, { useState, useEffect } from 'react';
import ContactLanding from '../../../features/contact/ContactLanding';

export default function ContactPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-contact-data') {
        setPreviewData(event.data.payload);
      }
    };
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'contact' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#111836]">
      {previewData ? (
        <ContactLanding previewData={previewData} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-400">
          Loading preview data...
        </div>
      )}
    </div>
  );
}
