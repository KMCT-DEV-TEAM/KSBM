"use client";
import React, { useState, useEffect } from 'react';
import PrivacyPolicy from '../../../features/legal/PrivacyPolicy';

export default function PrivacyPolicyPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-privacy-data') {
        setPreviewData(event.data.payload);
      }
    };
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'privacy-policy' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FCFCFD]">
      {previewData ? (
        <PrivacyPolicy previewData={previewData} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading preview data...
        </div>
      )}
    </div>
  );
}
