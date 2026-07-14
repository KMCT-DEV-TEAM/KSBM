"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';

export default function HeaderPreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-header-data') {
        setPreviewData(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-900 overflow-hidden relative">
      <Header previewData={previewData} />
    </div>
  );
}
