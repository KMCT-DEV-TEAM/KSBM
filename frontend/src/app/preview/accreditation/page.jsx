"use client";
import React, { useState, useEffect } from 'react';
import AccreditationSection from '../../../features/home/components/AccreditationSection';

export default function AccreditationPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-accreditation-data') {
        setPreviewData(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-hidden relative">
      <AccreditationSection previewData={previewData} />
    </div>
  );
}
