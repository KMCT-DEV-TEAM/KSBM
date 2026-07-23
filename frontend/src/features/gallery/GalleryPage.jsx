"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../api/axios';
const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [galleryData, setGalleryData] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await api.get('/cms/gallery-page');
        setGalleryData(response.data);
      } catch (error) {
        console.error('Error fetching gallery page data:', error);
      }
    };
    fetchGalleryData();
  }, []);

  const items = galleryData?.gallery?.items || [];
  const hero = galleryData?.hero || {
    title: 'KSBM Sports Club:\nWhere Leaders Compete',
    subtitle: 'Forging the next generation of global leaders through the crucible of competitive sports.',
    backgroundImage: '/assets/Images/image 53.png'
  };
  const gallery = galleryData?.gallery || { badge: 'Gallery', heading: 'Moments Captured in Campus' };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Sports') return item.type === 'video';
    if (activeTab === 'Cultural') return item.type === 'image';
    return true;
  });

  const getCardDimensions = (item, idx, rowNum = 1) => {
    const shapeIndex = (idx + (rowNum === 2 ? 2 : rowNum === 3 ? 4 : 0)) % 5;
    const shapes = [
      'w-[320px] sm:w-[390px] md:w-[440px] h-[220px] sm:h-[240px] shrink-0', // Wide rectangle
      'w-[230px] sm:w-[260px] md:w-[280px] h-[250px] sm:h-[280px] shrink-0', // Tall portrait
      'w-[250px] sm:w-[290px] md:w-[330px] h-[230px] sm:h-[250px] shrink-0', // Square-ish
      'w-[350px] sm:w-[430px] md:w-[490px] h-[240px] sm:h-[270px] shrink-0', // Panoramic collage
      'w-[220px] sm:w-[250px] md:w-[270px] h-[210px] sm:h-[230px] shrink-0'  // Compact bento
    ];
    return shapes[shapeIndex];
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111836] overflow-x-hidden">
      <Header />

      <main className="flex-1 relative">
        {/* Unified Background for entire page, matching Contact page model */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={hero.backgroundImage}
            alt="KSBM Gallery Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        {/* 1. Hero Section (KSBM Sports Club) */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex items-center justify-center z-10">
          <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.15] tracking-tight whitespace-pre-line">
                {hero.title}
              </h1>
              <p className="text-[16px] text-white/80 font-medium leading-relaxed max-w-2xl">
                {hero.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Gallery Section */}
        <section className="pb-32 pt-8 relative z-10 w-full overflow-hidden">
          <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4 opacity-70">
                <div className="h-[1px] w-16 bg-white/40" />
                <p className="text-xs tracking-[0.2em] font-semibold text-white uppercase">{gallery.badge}</p>
                <div className="h-[1px] w-16 bg-white/40" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-10">
                {gallery.heading}
              </h2>

              {/* Filter Tabs */}
              <div className="flex items-center justify-center gap-3">
                {['All', 'Sports', 'Cultural'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-7 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeTab === tab
                      ? 'bg-white/20 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                      : 'bg-transparent border-white/30 text-white/70 hover:border-white/60 hover:text-white'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>


            {/* Full-width Moving Marquee */}
            <style>{`
              @keyframes marquee-rtl {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              @keyframes marquee-ltr {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0%); }
              }
              .animate-marquee-row1 {
                display: flex;
                align-items: center;
                width: max-content;
                animation: marquee-rtl 40s linear infinite;
              }
              .animate-marquee-row2 {
                display: flex;
                align-items: center;
                width: max-content;
                animation: marquee-ltr 45s linear infinite;
              }
              .animate-marquee-row3 {
                display: flex;
                align-items: center;
                width: max-content;
                animation: marquee-rtl 42s linear infinite;
              }
              .animate-marquee-row1:hover,
              .animate-marquee-row2:hover,
              .animate-marquee-row3:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden py-4 space-y-5 sm:space-y-6 mt-12">
              {filteredItems.length > 0 ? (
                <>
                  {/* Line 1: Right to Left */}
                  <div className="animate-marquee-row1 gap-5 sm:gap-6 px-4" style={{ animationDuration: `${Math.max(filteredItems.length * 6, 25)}s` }}>
                    {[...filteredItems, ...filteredItems, ...filteredItems, ...filteredItems, ...filteredItems, ...filteredItems].map((item, idx) => (
                      <div
                        key={`row1-${item.id}-${idx}`}
                        onClick={() => setSelectedMedia(item)}
                        className={`${getCardDimensions(item, idx, 1)} relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/10`}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111836]/90 via-[#111836]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {item.type === 'video' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7 z-10 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <h3 className="text-md sm:text-lg font-semibold text-white drop-shadow-md leading-snug">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Line 2: Left to Right */}
                  <div className="animate-marquee-row2 gap-3 sm:gap-5 px-4" style={{ animationDuration: `${Math.max(filteredItems.length * 6.5, 28)}s` }}>
                    {[...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse()].map((item, idx) => (
                      <div
                        key={`row2-${item.id}-${idx}`}
                        onClick={() => setSelectedMedia(item)}
                        className={`${getCardDimensions(item, idx, 2)} relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/10`}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111836]/90 via-[#111836]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {item.type === 'video' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7 z-10 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <h3 className="text-md sm:text-lg font-semibold text-white drop-shadow-md leading-snug">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Line 3: Right to Left (Offset) */}
                  <div className="animate-marquee-row3 gap-4 sm:gap-6 px-4" style={{ animationDuration: `${Math.max(filteredItems.length * 5.5, 26)}s` }}>
                    {[...filteredItems.slice(1), filteredItems[0], ...filteredItems.slice(1), filteredItems[0], ...filteredItems.slice(1), filteredItems[0], ...filteredItems.slice(1), filteredItems[0], ...filteredItems.slice(1), filteredItems[0], ...filteredItems.slice(1), filteredItems[0]].map((item, idx) => (
                      <div
                        key={`row3-${item?.id || idx}-${idx}`}
                        onClick={() => setSelectedMedia(item)}
                        className={`${getCardDimensions(item, idx, 3)} relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/10`}
                      >
                        <img
                          src={item?.img || ''}
                          alt={item?.title || 'Gallery image'}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111836]/90 via-[#111836]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {item?.type === 'video' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7 z-10 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <h3 className="text-md sm:text-lg font-semibold text-white drop-shadow-md leading-snug">
                            {item?.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-white/70 py-20">
                  <p>No gallery items found for this category.</p>
                </div>
              )}
            </div>
            
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[85vh] rounded-xl overflow-hidden flex items-center justify-center"
            >
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.img}
                  controls
                  autoPlay
                  className="w-full max-h-[85vh] rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={selectedMedia.img}
                  alt={selectedMedia.title}
                  className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-xl">
                <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-md">
                  {selectedMedia.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;
