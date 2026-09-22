"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';

const PdfViewerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'Document Viewer';

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title.replace(/\s+/g, '_')}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">No PDF URL provided</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#1b2559] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white px-4 sm:px-6 py-3 shadow-sm z-10 shrink-0 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm sm:text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="font-bold text-[#1b2559] text-base sm:text-lg truncate max-w-[200px] sm:max-w-md hidden sm:block">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#151c48] transition-colors font-medium text-sm sm:text-base shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF iframe container */}
      <div className="flex-1 w-full bg-gray-100 relative">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="absolute inset-0 w-full h-full border-none"
          title={title}
        />
      </div>
    </div>
  );
};

export default function PdfViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PdfViewerContent />
    </Suspense>
  );
}
