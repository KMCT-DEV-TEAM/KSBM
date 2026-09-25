"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DEFAULT_LIFE_AT_KSBM } from '../../admin/cms/constants/defaultCmsData';

const LifeAtKSBMSection = ({ previewData }) => {
  const [data, setData] = useState(previewData || DEFAULT_LIFE_AT_KSBM);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile swipe state
  const mobileScrollRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      const fetchLifeAtKsbm = async () => {
        try {
          const response = await api.get('/cms/life-at-ksbm', { hideLoader: true });
          if (response.data) setData(response.data);
        } catch (error) {
          console.error('Error fetching Life at KSBM section data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLifeAtKsbm();
    }
  }, [previewData]);

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#f4f7f9] py-12 lg:py-14 overflow-hidden animate-pulse">
        <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6" />
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto" />
          </div>
          <div className="flex gap-3 md:gap-4 overflow-hidden mt-8">
            {[1,2,3,4,5].map((i, idx) => {
              const isWide = idx % 4 === 0 || idx % 4 === 3;
              return <div key={i} className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[260px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} bg-gray-300 rounded-[1rem] md:rounded-[1.5rem]`} />;
            })}
          </div>
        </div>
      </section>
    );
  }

  const {
    subheading,
    heading,
    description,
    images,
    showSubheading = true,
    showHeading = true,
    showDescription = true,
    showImages = true,
    showSection
  } = data;

  const isPreview = !!previewData;
  const forceMobile = isPreview && previewData.previewDevice === 'mobile';
  const forceTablet = isPreview && previewData.previewDevice === 'tablet';

  const sm = (cls) => (forceMobile ? '' : cls);
  const md = (cls) => (forceMobile ? '' : cls);
  const lg = (cls) => (forceMobile || forceTablet ? '' : cls);

  if (showSection === false && !previewData) return null;

  const rawImages = images && images.length > 0 ? images : [];
  const half = Math.max(1, Math.ceil(rawImages.length / 2));
  const topImages = rawImages.slice(0, half);
  const botImages = rawImages.length > 1 ? rawImages.slice(half) : topImages;

  // For seamless CSS marquee we need the content duplicated exactly once.
  // Pad to at least 5 items so the marquee stripe is always wider than viewport.
  const padToMin = (arr, min) => {
    let out = [...arr];
    while (out.length < min) out = [...out, ...arr];
    return out;
  };
  const topPadded = padToMin(topImages, 6);
  const botPadded = padToMin(botImages, 6);

  const renderCard = (img, idx, rowKey, keyPrefix) => {
    const isWide = rowKey === 'top'
      ? (idx % 4 === 0 || idx % 4 === 3)
      : (idx % 4 === 1 || idx % 4 === 2);

    return (
      <div
        key={`${keyPrefix}-${idx}`}
        className={`h-[160px] ${md('md:h-[240px]')} shrink-0 ${
          isWide
            ? `w-[260px] ${md('md:w-[500px]')}`
            : `w-[160px] ${md('md:w-[300px]')}`
        } rounded-[1rem] ${md('md:rounded-[1.5rem]')} overflow-hidden group cursor-pointer shadow-sm relative`}
      >
        <img
          src={img.src}
          alt={img.alt || 'Campus Life'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0 bg-gray-100"
          loading="lazy"
          draggable="false"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>
    );
  };

  // Speed strings (customize as needed)
  const topSpeed = `${Math.max(40, topPadded.length * 8)}s`;
  const botSpeed = `${Math.max(45, botPadded.length * 9)}s`;

  // For mobile: show a horizontally scrollable grid instead of auto-scrolling
  const showMobileScroll = (isMobile || forceMobile) && !isPreview;

  return (
    <section className={`relative w-full bg-[#f4f7f9] py-12 ${lg('lg:py-14')} overflow-hidden`}>
      <div className={`relative w-[98%] max-w-[1440px] mx-auto px-4 ${sm('sm:px-6')} ${lg('lg:px-8')} z-10`}>
        {/* Header */}
        {(showSubheading || showHeading || showDescription) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-10 lg:mb-14"
          >
            {showSubheading && (
              <p className={`text-text-secondary text-[0.65rem] ${lg('lg:text-xs')} font-semibold tracking-[0.25em] uppercase mb-4`}>
                {subheading}
              </p>
            )}
            {showHeading && (
              <h2 className={`text-3xl ${lg('lg:text-5xl')} font-semibold text-primary mb-6`}>
                {heading}
              </h2>
            )}
            {showDescription && (
              <p className={`text-text-secondary text-sm ${lg('lg:text-base')} leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap`}>
                {description}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {showImages && rawImages.length > 0 && (
        <>
          {/* ── MOBILE: horizontal touch-swipe scroll ── */}
          {showMobileScroll ? (
            <div
              ref={mobileScrollRef}
              className="flex flex-col gap-3 overflow-x-auto touch-pan-x select-none mt-8 pb-2 scrollbar-none"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Top row */}
              <div className="flex gap-3 shrink-0 w-max px-4">
                {topPadded.map((img, idx) => renderCard(img, idx, 'top', 'mob-top'))}
              </div>
              {/* Bottom row staggered */}
              <div className="flex gap-3 shrink-0 w-max px-4 -ml-8">
                {botPadded.map((img, idx) => renderCard(img, idx, 'bot', 'mob-bot'))}
              </div>
            </div>
          ) : (
            /* ── DESKTOP / PREVIEW: pure CSS marquee (zero JS, GPU-composited) ── */
            <div className={`${isPreview ? 'w-full' : 'w-[100vw] left-1/2 -translate-x-1/2 relative'} overflow-hidden mt-8 flex flex-col gap-3 md:gap-4`}>
              {/* Top row scrolls LEFT */}
              <div
                className="animate-marquee gap-3 md:gap-4 pr-3 md:pr-4 will-change-transform"
                style={{ animationDuration: topSpeed }}
              >
                {/* Two copies for seamless loop */}
                {[0, 1].map((copy) => (
                  <div key={`top-copy-${copy}`} className="flex gap-3 md:gap-4 shrink-0">
                    {topPadded.map((img, idx) => renderCard(img, idx, 'top', `top-${copy}`))}
                  </div>
                ))}
              </div>

              {/* Bottom row scrolls RIGHT */}
              <div
                className="animate-marquee-reverse gap-3 md:gap-4 pr-3 md:pr-4 will-change-transform"
                style={{ animationDuration: botSpeed }}
              >
                {[0, 1].map((copy) => (
                  <div key={`bot-copy-${copy}`} className="flex gap-3 md:gap-4 shrink-0">
                    {botPadded.map((img, idx) => renderCard(img, idx, 'bot', `bot-${copy}`))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* View Gallery Link */}
      {showImages && rawImages.length > 0 && (
        <div className="flex justify-center mt-12 md:mt-16 relative z-20">
          <Link 
            href="/gallery" 
            className="group flex items-center gap-3 text-primary font-bold text-sm md:text-base uppercase tracking-[0.2em] hover:text-primary/80 transition-colors border-b-2 border-primary/20 pb-1 hover:border-primary"
          >
            View Gallery
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
};

export default LifeAtKSBMSection;
