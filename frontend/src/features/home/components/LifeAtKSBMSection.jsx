"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
import { DEFAULT_LIFE_AT_KSBM } from '../../admin/cms/constants/defaultCmsData';

const LifeAtKSBMSection = ({ previewData }) => {
  const [data, setData] = useState(previewData || DEFAULT_LIFE_AT_KSBM);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const set1Ref = useRef(null);

  // Position refs for continuous smooth animation without React re-render lag
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const isInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const pauseTimerRef = useRef(null);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      const fetchLifeAtKsbm = async () => {
        try {
          const response = await api.get('/cms/life-at-ksbm', { hideLoader: true });
          if (response.data) {
            setData(response.data);
          }
        } catch (error) {
          console.error("Error fetching Life at KSBM section data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLifeAtKsbm();
    }
  }, [previewData]);

  // Measure width of one repeating set
  const getSingleSetWidth = useCallback(() => {
    if (!set1Ref.current) return 0;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const gap = isDesktop ? 16 : 12;
    return set1Ref.current.offsetWidth + gap;
  }, []);

  // Initialize initial scroll position to 1 setWidth so left/right infinite scroll works instantly
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (scrollRef.current && set1Ref.current) {
        const setWidth = getSingleSetWidth();
        if (setWidth > 0 && currentScrollRef.current === 0) {
          scrollRef.current.scrollLeft = setWidth;
          currentScrollRef.current = setWidth;
          targetScrollRef.current = setWidth;
        }
      }
    }, 150);

    return () => clearTimeout(initTimer);
  }, [data, getSingleSetWidth]);

  // Main animation frame loop (smooth auto-drift + buttery button lerp easing)
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = Math.min(now - lastTime, 64);
      lastTime = now;

      if (scrollRef.current) {
        const container = scrollRef.current;
        const setWidth = getSingleSetWidth();

        // Case 1: User is manually dragging or touch-swiping
        if (isInteractingRef.current) {
          currentScrollRef.current = container.scrollLeft;
          targetScrollRef.current = container.scrollLeft;
        }
        // Case 2: Idle ambient auto-drift (when not hovered and not interacting)
        else if (!isHoveredRef.current) {
          // Gentle ambient drift: ~22px per second
          const speed = 0.022;
          currentScrollRef.current += speed * delta;
          targetScrollRef.current = currentScrollRef.current;
          container.scrollLeft = currentScrollRef.current;
        } else {
          // Hovered: keep track of scroll position
          currentScrollRef.current = container.scrollLeft;
          targetScrollRef.current = container.scrollLeft;
        }

        // Seamless infinite wrap using setWidth
        if (setWidth > 0) {
          if (currentScrollRef.current >= setWidth * 2) {
            currentScrollRef.current -= setWidth;
            targetScrollRef.current -= setWidth;
            container.scrollLeft = currentScrollRef.current;
          } else if (currentScrollRef.current < setWidth * 0.4) {
            currentScrollRef.current += setWidth;
            targetScrollRef.current += setWidth;
            container.scrollLeft = currentScrollRef.current;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [getSingleSetWidth]);

  // Global mouseup listener for drag release
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          isInteractingRef.current = false;
        }, 800);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollRef.current) return;
    setIsMouseDown(true);
    isInteractingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    const newPos = dragStartScrollRef.current - walk;
    scrollRef.current.scrollLeft = newPos;
    currentScrollRef.current = newPos;
    targetScrollRef.current = newPos;
  };

  const handleMouseUp = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 800);
  };

  // Mobile Touch Handlers
  const handleTouchStart = () => {
    isInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    if (scrollRef.current) {
      currentScrollRef.current = scrollRef.current.scrollLeft;
      targetScrollRef.current = scrollRef.current.scrollLeft;
    }
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1200);
  };

  const handleContainerScroll = () => {
    if (isInteractingRef.current && scrollRef.current) {
      currentScrollRef.current = scrollRef.current.scrollLeft;
      targetScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#f4f7f9] py-12 lg:py-14 overflow-hidden animate-pulse">
        <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
          </div>
          <div className="relative w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden mt-8 flex flex-col gap-3 md:gap-4">
            <div className="flex gap-3 md:gap-4 w-max px-3 md:px-4">
              {[1, 2, 3, 4].map((i, index) => {
                const isWide = index % 4 === 0 || index % 4 === 3;
                return <div key={i} className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} bg-gray-300 rounded-[1rem] md:rounded-[1.5rem]`}></div>;
              })}
            </div>
            <div className="flex gap-3 md:gap-4 w-max px-3 md:px-4 -ml-[100px] md:-ml-[200px]">
              {[5, 6, 7, 8].map((i, index) => {
                const isWide = index % 4 === 1 || index % 4 === 2;
                return <div key={i} className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} bg-gray-300 rounded-[1rem] md:rounded-[1.5rem]`}></div>;
              })}
            </div>
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

  const sm = (desktopClass) => (forceMobile ? '' : desktopClass);
  const md = (desktopClass) => (forceMobile ? '' : desktopClass);
  const lg = (desktopClass) => (forceMobile || forceTablet ? '' : desktopClass);

  if (showSection === false && !previewData) {
    return null;
  }

  const rawImages = images && images.length > 0 ? images : [];
  const half = Math.max(1, Math.ceil(rawImages.length / 2));
  const baseTop = rawImages.slice(0, half);
  const baseBottom = rawImages.length > 1 ? rawImages.slice(half) : baseTop;

  // Replicate to have at least 6 items per set so setWidth is comfortably wide
  const innerMultiplier = Math.max(1, Math.ceil(6 / Math.max(1, baseTop.length)));
  const singleTopSet = Array(innerMultiplier).fill(baseTop).flat();
  const singleBottomSet = Array(innerMultiplier).fill(baseBottom).flat();

  // 4 identical sets for seamless continuous wrapping
  const sets = [0, 1, 2, 3];

  const renderCard = (img, index, rowKey, setIndex) => {
    const isWide = rowKey === 'top' 
      ? (index % 4 === 0 || index % 4 === 3)
      : (index % 4 === 1 || index % 4 === 2);

    return (
      <div
        key={`${rowKey}-${setIndex}-${index}`}
        className={`h-[160px] ${md('md:h-[240px]')} shrink-0 ${
          isWide ? `w-[260px] ${md('md:w-[500px]')}` : `w-[160px] ${md('md:w-[300px]')}`
        } rounded-[1rem] ${md('md:rounded-[1.5rem]')} overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow relative select-none`}
      >
        <img
          src={img.src}
          alt={img.alt || 'Campus Life'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0 bg-gray-100 pointer-events-none select-none"
          loading="lazy"
          draggable="false"
          onLoad={() => {
            if (scrollRef.current && set1Ref.current && currentScrollRef.current === 0) {
              const sw = getSingleSetWidth();
              if (sw > 0) {
                scrollRef.current.scrollLeft = sw;
                currentScrollRef.current = sw;
                targetScrollRef.current = sw;
              }
            }
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>
    );
  };

  return (
    <section className={`relative w-full bg-[#f4f7f9] py-12 ${lg('lg:py-14')} overflow-hidden`}>
      <div className={`relative w-[98%] max-w-[1440px] mx-auto px-4 ${sm('sm:px-6')} ${lg('lg:px-8')} z-10`}>
        {/* Header Section */}
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

      {/* Collage Image Gallery (Swipable on mobile, with desktop navigation buttons & gentle auto-move) */}
      {showImages && rawImages.length > 0 && (
        <div 
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { 
            isHoveredRef.current = false; 
            handleMouseUp();
          }}
          className={`relative ${isPreview ? 'w-full' : 'w-[100vw] left-1/2 -translate-x-1/2'} overflow-hidden mt-8 group/gallery`}
        >
          {/* Horizontal Scroll / Touch-Swipe Container (No side blur) */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onScroll={handleContainerScroll}
            className={`flex flex-col gap-3 ${md('md:gap-4')} overflow-x-auto touch-pan-x select-none py-2 px-4 ${md('md:px-8')} scrollbar-none [&::-webkit-scrollbar]:hidden ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Top Row */}
            <div className={`flex gap-3 ${md('md:gap-4')} shrink-0 w-max`}>
              {sets.map((setIdx) => (
                <div 
                  key={`top-set-${setIdx}`} 
                  ref={setIdx === 0 ? set1Ref : null} 
                  className={`flex gap-3 ${md('md:gap-4')} shrink-0`}
                >
                  {singleTopSet.map((img, idx) => renderCard(img, idx, 'top', setIdx))}
                </div>
              ))}
            </div>

            {/* Bottom Row (staggered with offset) */}
            <div className={`flex gap-3 ${md('md:gap-4')} shrink-0 w-max -ml-8 ${md('md:-ml-16')}`}>
              {sets.map((setIdx) => (
                <div 
                  key={`bot-set-${setIdx}`} 
                  className={`flex gap-3 ${md('md:gap-4')} shrink-0`}
                >
                  {singleBottomSet.map((img, idx) => renderCard(img, idx, 'bot', setIdx))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LifeAtKSBMSection;
