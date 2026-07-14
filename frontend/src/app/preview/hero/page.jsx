"use client";
import React, { useState, useEffect } from 'react';
import Hero from '../../../features/home/components/Hero';

export default function HeroPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-hero-data') {
        setPreviewData(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-hidden relative">
      <Hero previewData={previewData} />
    </div>
  );
}
