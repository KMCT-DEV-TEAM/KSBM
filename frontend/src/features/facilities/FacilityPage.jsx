"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { useGlobalLinks } from '../../hooks/useGlobalLinks';

const buildGalleryColumns = (items) => {
  const columns = [];
  if (!items || !Array.isArray(items)) return columns;
  let i = 0;
  let colIndex = 0;

  while (i < items.length) {
    const pattern = colIndex % 5;

    if (pattern === 0) {
      columns.push({ type: 'tall', items: [items[i]] });
      i += 1;
    } else if (pattern === 1) {
      const top = items[i];
      const bottom = items[i + 1];
      if (bottom) {
        columns.push({ type: 'split-top-small', items: [top, bottom] });
        i += 2;
      } else {
        columns.push({ type: 'tall', items: [top] });
        i += 1;
      }
    } else if (pattern === 2) {
      columns.push({ type: 'tall', items: [items[i]] });
      i += 1;
    } else if (pattern === 3) {
      const top = items[i];
      const bottom = items[i + 1];
      if (bottom) {
        columns.push({ type: 'split-top-large', items: [top, bottom] });
        i += 2;
      } else {
        columns.push({ type: 'tall', items: [top] });
        i += 1;
      }
    } else {
      columns.push({ type: 'tall', items: [items[i]] });
      i += 1;
    }
    colIndex++;
  }
  return columns;
};

const GalleryImage = ({ item, className = '' }) => {
  if (!item) return null;
  const imgSrc = typeof item === 'string' ? item : item?.image || item?.url || '';
  const imgTitle = typeof item === 'object' && item !== null ? (item.title || '') : '';
  if (!imgSrc) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl group ${className}`}>
      <img
        src={imgSrc}
        alt={imgTitle || 'Gallery image'}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {imgTitle && (
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-semibold text-sm tracking-wide line-clamp-1">{imgTitle}</p>
        </div>
      )}
    </div>
  );
};

const FacilityPage = () => {
  const searchParams = useSearchParams();
  const clubId = searchParams?.get('clubId');
  const globalLinks = useGlobalLinks();
  const applyLink = globalLinks['global_apply']?.link || '/contact';

  const [facilityData, setFacilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewSection, setPreviewSection] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(window.self !== window.top);
    }
    const handleMessage = (event) => {
      if (event.data?.type === 'LIVE_PREVIEW_UPDATE' && event.data.data) {
        setFacilityData(event.data.data);
        setIsPreviewMode(true);
        if (event.data.activeTab) {
          setPreviewSection(event.data.activeTab);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    if (window.parent) {
      window.parent.postMessage({ type: 'iframe-ready' }, '*');
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isIframe) {
      setIsLoading(false);
      return;
    }
    const fetchFacilityData = async () => {
      try {
        const response = await api.get('/cms/facilities-page', { hideLoader: true });
        const data = response.data;
        
        if (clubId && data?.clubs?.items) {
          const club = data.clubs.items.find(c => c._id === clubId);
          if (club) {
            setFacilityData(club);
            return;
          }
        }
        
        // Fallback to template if no clubId found
        if (data && data.facilityDetails) {
          setFacilityData(data.facilityDetails);
        }
      } catch (error) {
        console.error('Failed to fetch facility details data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilityData();
  }, [isIframe, clubId]);

  if (isLoading) {
    if (isIframe) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#FCFCFD] text-gray-500">
          Loading preview data...
        </div>
      );
    }
    return <Loader fullScreen={true} />;
  }

  if (!facilityData) {
    if (isIframe) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#FCFCFD] text-gray-500">
          Loading preview data...
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Facility not found</h1>
          <Link href="/facilities" className="text-primary hover:underline">
            Return to Home Page
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { hero, about, activities, faculty, gallery } = facilityData;

  // Fallbacks if data is missing
  const heroBg = hero?.backgroundImage || '/assets/Images/fecilities/facility_details_hero.jpg';
  const heroTitle = hero?.title || facilityData.title;
  const heroSubtitle = hero?.subtitle || 'Explore our world-class facilities and modern infrastructure.';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {!isPreviewMode && <Header />}

      <main className="flex-1">
        {/* 1. Hero Section */}
        {(!previewSection || previewSection === 'hero') && (
        <section className="relative h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32 bg-[#0b1238]">
          <img
            src={heroBg}
            alt={heroTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1238]/60 mix-blend-multiply" />
          {hero?.showTextContent !== false && (
            <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
                  {heroTitle}
                </h1>
                <p className="text-xs md:text-sm lg:text-base text-gray-200 font-medium leading-relaxed max-w-3xl">
                  {heroSubtitle}
                </p>
              </motion.div>
            </div>
          )}
        </section>
        )}

        {/* 2. About Section */}
        {(!previewSection || previewSection === 'about') && about?.showSection !== false && (about?.heading || about?.paragraphs?.length > 0 || about?.image) && (
          <section className="py-20 bg-white relative overflow-hidden">
            {/* Pattern Top Right */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
                <circle cx="20" cy="20" r="3" /><circle cx="40" cy="20" r="3" /><circle cx="60" cy="20" r="3" /><circle cx="80" cy="20" r="3" />
                <circle cx="20" cy="40" r="3" /><circle cx="40" cy="40" r="3" /><circle cx="60" cy="40" r="3" /><circle cx="80" cy="40" r="3" />
                <circle cx="20" cy="60" r="3" /><circle cx="40" cy="60" r="3" /><circle cx="60" cy="60" r="3" /><circle cx="80" cy="60" r="3" />
                <circle cx="20" cy="80" r="3" /><circle cx="40" cy="80" r="3" /><circle cx="60" cy="80" r="3" /><circle cx="80" cy="80" r="3" />
              </svg>
            </div>

            <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-semibold text-[#2b2b68] tracking-tight">
                  {about.heading || 'About the Club'}
                </h2>
                {about.paragraphs?.length > 0 ? (
                  about.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    Join our vibrant community where students come together to share their passion and grow their skills.
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                {about.image && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                    <img src={about.image} alt="About" className="w-full h-auto object-cover" />
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* 3. Activities Section */}
        {(!previewSection || previewSection === 'activities') && activities?.showSection !== false && activities?.items?.length > 0 && (
          <section className="py-20 bg-gray-50/80">
            <div className="w-[90%] max-w-[1440px] mx-auto text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-12"
              >
                {activities.heading || 'Our Activities'}
              </motion.h3>

              {activities.items.length >= 5 ? (
                <div className="overflow-hidden relative w-full -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="animate-marquee gap-6 py-4">
                    {[...activities.items, ...activities.items].map((item, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl overflow-hidden aspect-[3/4] group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer shrink-0 w-[260px] sm:w-[300px]"
                      >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1238]/90 via-[#1e2869]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 p-6 text-left transform group-hover:-translate-y-2 transition-transform duration-500">
                          <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                          {item.subtitle && <p className="text-sm text-gray-300">{item.subtitle}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activities.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative rounded-2xl overflow-hidden aspect-[3/4] group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1238]/90 via-[#1e2869]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 p-6 text-left transform group-hover:-translate-y-2 transition-transform duration-500">
                        <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                        {item.subtitle && <p className="text-sm text-gray-300">{item.subtitle}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Faculty Section */}
        {(!previewSection || previewSection === 'faculty') && faculty?.showSection !== false && faculty?.members?.length > 0 && (
          <section className="py-20 bg-white relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] h-[1px] bg-gray-200/50 -z-10" />

            <div className="w-[90%] max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/3"
              >
                {faculty.subheading && (
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    {faculty.subheading}
                  </p>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-[#2b2b68] tracking-tight mb-6 leading-tight">
                  {faculty.heading || 'Faculty In Charge'}
                </h2>
                {faculty.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {faculty.description}
                  </p>
                )}
              </motion.div>

              <div className="lg:w-2/3 flex flex-wrap justify-center lg:justify-end gap-6">
                {faculty.members.map((member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative rounded-2xl overflow-hidden w-64 aspect-[3/4] group shadow-lg"
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-0 bg-white py-2 pl-4 pr-5 rounded-r-xl  max-w-[90%]">
                      <h4 className="font-bold text-[#2b2b68] text-base mb-0.5 whitespace-nowrap">{member.name}</h4>
                      <p className="text-xs text-gray-600 font-medium whitespace-nowrap">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Gallery Section */}
        {(!previewSection || previewSection === 'gallery') && gallery?.showSection !== false && gallery?.images?.length > 0 && (
          <section
            className="py-24 bg-[#0b1238] relative text-white overflow-hidden"
            style={{
              backgroundImage: "url('/assets/Images/fecilities/image_55.png')",
              backgroundSize: '400px auto',
              backgroundPosition: 'left 5% center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#0b1238]/25" />
            <div className="w-[95%] max-w-[1440px] mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/30" />
                  <p className="text-xs tracking-[0.3em] font-semibold text-white/70 uppercase">Gallery</p>
                  <div className="h-[1px] w-12 bg-white/30" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {gallery.heading || 'Captured in Culture'}
                </h2>
              </motion.div>

              <div className="overflow-hidden relative w-full -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="animate-marquee gap-3 sm:gap-4 pb-6 flex">
                  {[...buildGalleryColumns(gallery.images), ...buildGalleryColumns(gallery.images)].map((col, colIdx) => {
                    if (col.type === 'tall') {
                      return (
                        <div key={colIdx} className="shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] snap-center">
                          <GalleryImage 
                            item={col.items[0]} 
                            className="h-[280px] sm:h-[340px] lg:h-[400px]"
                          />
                        </div>
                      );
                    }

                    if (col.type === 'split-top-small') {
                      return (
                        <div key={colIdx} className="shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] flex flex-col gap-3 sm:gap-4 snap-center">
                          <GalleryImage 
                            item={col.items[0]} 
                            className="h-[120px] sm:h-[145px] lg:h-[170px]"
                          />
                          <GalleryImage 
                            item={col.items[1]} 
                            className="h-[148px] sm:h-[183px] lg:h-[218px]"
                          />
                        </div>
                      );
                    }

                    if (col.type === 'split-top-large') {
                      return (
                        <div key={colIdx} className="shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] flex flex-col gap-3 sm:gap-4 snap-center">
                          <GalleryImage 
                            item={col.items[0]} 
                            className="h-[148px] sm:h-[183px] lg:h-[218px]"
                          />
                          <GalleryImage 
                            item={col.items[1]} 
                            className="h-[120px] sm:h-[145px] lg:h-[170px]"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {!isPreviewMode && (
        <section className="py-20 bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2b2b68] mb-4">
              Ready to lead the future?
            </h2>
            <p className="text-gray-600 mb-8">
              Explore opportunities to engage, learn, and grow. Join our vibrant community and become part of something greater.
            </p>
            <Link href={applyLink} className="inline-block bg-[#2b2b68] text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Apply Now
            </Link>
          </div>
        </section>
        )}

      </main>

      {!isPreviewMode && <Footer />}
    </div>
  );
};

export default FacilityPage;
