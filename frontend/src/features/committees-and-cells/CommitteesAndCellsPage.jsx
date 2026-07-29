"use client";
import React, { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';

import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';

const CommitteesAndCellsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/committees-and-cells', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch Committees and Cells data", error);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'LIVE_PREVIEW_UPDATE' && event.data.data) {
        setData(prev => ({ ...prev, ...event.data.data }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const filteredData = (data?.committees || []).filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="min-h-screen bg-[#fafafa]">

      {/* Hero Section (Matching Blogs Page) */}
      <div className="relative">
        <section className="relative w-full min-h-[70vh] sm:min-h-[78vh] md:min-h-[82vh] lg:min-h-[86vh] flex items-end bg-[#1B2155] overflow-hidden pt-28 sm:pt-32 pb-24 sm:pb-32 lg:pb-36">
          {/* Background Image & Deep Navy Overlay */}
          <div className="absolute inset-0 z-0" style={{ backgroundColor: data?.showHeroBgImage === false ? '#1B2155' : undefined }}>
            {data?.showHeroBgImage !== false && (
              <>
                {data?.heroBgImage ? (
                  <img
                    src={data.heroBgImage}
                    alt="Committees Backdrop"
                    className="w-full h-full object-cover opacity-35 object-center scale-105 transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1B2155]"></div>
                )}
                <div className="absolute inset-0 bg-primary/50"></div>
                <div className="absolute inset-0 bg-primary/40"></div>
              </>
            )}
          </div>

          {/* Decorative Blur Spheres */}
          <div className="absolute -left-20 top-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Full Size Content Container matching Footer width */}
          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-3xl">
              {data?.showHeroHeading !== false && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-md leading-tight">
                  {data?.heroHeading || 'Committees & Cells'}
                </h1>
              )}
              {data?.showHeroSubtext !== false && (
                <p className="text-white/90 text-xs md:text-sm lg:text-base leading-relaxed drop-shadow-sm max-w-2xl whitespace-pre-wrap">
                  {data?.heroSubtext || 'Explore the various statutory committees...'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Floating Search Bar */}
        <div className="absolute -bottom-7 left-0 right-0 px-6 z-20">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search for document names..."
              className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* List Section matching Footer width */}
      {data?.showCommitteesSection !== false && (
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div>
                  <h3 className="text-[#3b4c8a] font-semibold text-lg">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-5 mb-1">COORDINATOR</p>
                  <p className="text-gray-900 font-semibold text-sm md:text-base">{item.coordinator}</p>
                  <p className="text-gray-500 text-xs md:text-sm mt-0.5">{item.designation}</p>
                </div>
                {item.pdfLink && item.pdfLink !== '#' && (
                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b2559] hover:underline justify-end group cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#1b2559] group-hover:scale-110 transition-transform" />
                    <span>View PDF</span>
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No committees found matching your search.</p>
            </div>
          )}
        </div>
      )}

    </div>
    </>
  );
};

export default CommitteesAndCellsPage;
