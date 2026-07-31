"use client";
import React, { useState, useEffect } from 'react';
import FaqPage from '../../../features/faq/FaqPage';

export default function FaqPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-faq-data') {
        setPreviewData(event.data.payload);
      }
    };
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'faq' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FCFCFD]">
      {previewData ? (
        <FaqPage previewData={previewData} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading preview data...
        </div>
      )}
    </div>
  );
}
