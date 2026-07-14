"use client";
import React, { useState, useEffect } from 'react';
import ManagementSection from '../../../features/home/components/ManagementSection';

export default function ManagementPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-management-data') {
        setPreviewData(event.data.payload);
      }
    };
    
    // Send a message to parent to indicate iframe is ready
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'management' }, '*');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FCFCFD]">
      {previewData ? (
        <ManagementSection previewData={previewData} />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading preview data...
        </div>
      )}
    </div>
  );
}
