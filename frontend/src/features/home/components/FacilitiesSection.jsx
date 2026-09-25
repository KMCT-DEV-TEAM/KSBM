"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_FACILITIES_HOME } from '../../admin/cms/constants/defaultCmsData';

const FacilitiesSection = ({ previewData }) => {
  const [settings, setSettings] = useState(previewData || DEFAULT_FACILITIES_HOME);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const set1Ref = useRef(null);

  // Position refs for continuous smooth animation without React re-render lag
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const isInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isAnimatingButtonRef = useRef(false);
  const pauseTimerRef = useRef(null);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/cms/facilities', { hideLoader: true });
        setSettings(data);
      } catch (error) {
        console.error('Error fetching facilities settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [previewData]);

  // Measure width of one repeating set
  const getSingleSetWidth = useCallback(() => {
    if (!set1Ref.current) return 0;
    const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const isMd = typeof window !== 'undefined' && window.innerWidth >= 768;
    const isSm = typeof window !== 'undefined' && window.innerWidth >= 640;
    const gap = isLg ? 32 : isMd ? 24 : isSm ? 24 : 16;
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
  }, [settings, getSingleSetWidth]);

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
        // Case 2: Smooth easing after clicking navigation button
        else if (isAnimatingButtonRef.current) {
          const diff = targetScrollRef.current - currentScrollRef.current;
          if (Math.abs(diff) > 0.5) {
            currentScrollRef.current += diff * 0.085;
            container.scrollLeft = currentScrollRef.current;
          } else {
            currentScrollRef.current = targetScrollRef.current;
            container.scrollLeft = targetScrollRef.current;
            isAnimatingButtonRef.current = false;
          }
        }
        // Case 3: Idle ambient auto-drift (when not hovered and not interacting)
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

  // Button Click: smoothly moves by 1 card
  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const isMd = typeof window !== 'undefined' && window.innerWidth >= 768;
    const step = isLg ? 412 : isMd ? 324 : 220;

    targetScrollRef.current = currentScrollRef.current + (direction === 'right' ? step : -step);
    isAnimatingButtonRef.current = true;
    isInteractingRef.current = false;
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollRef.current) return;
    setIsMouseDown(true);
    isInteractingRef.current = true;
    isAnimatingButtonRef.current = false;
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
    isAnimatingButtonRef.current = false;
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
      <section className="w-full bg-background py-14 lg:py-20 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-6xl px-4">
          <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const {
    subheading = 'College Facilities',
    heading = 'Institutional Resources',
    description = 'Our state-of-the-art campus offers modern classrooms, advanced learning resources, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.',
    facilitiesList = [],
    showSubheading = true,
    showHeading = true,
    showDescription = true,
    showFacilities = true
  } = settings || {};

  if (!showSubheading && !showHeading && !showDescription && (!showFacilities || facilitiesList.length === 0)) {
    return null;
  }

  if (settings?.showSection === false && !previewData) {
    return null;
  }

  const forceMobile = previewData?.previewDevice === 'mobile';

  // Ensure base set has at least 6 items so setWidth is comfortably wide
  const innerMultiplier = Math.max(1, Math.ceil(6 / Math.max(1, facilitiesList.length)));
  const singleSet = Array(innerMultiplier).fill(facilitiesList).flat();
  const sets = [0, 1, 2, 3];

  return (
    <section className="w-full bg-background py-14 lg:py-20">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        {(showSubheading || showHeading || showDescription) && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            {showSubheading && (
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="text-text-secondary text-xs tracking-[0.2em] uppercase mb-4"
              >
                {subheading}
              </motion.p>
            )}
            {showHeading && (
              <motion.h2
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="text-4xl lg:text-5xl font-semibold text-primary mb-6"
              >
                {heading}
              </motion.h2>
            )}
            {showDescription && (
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-3xl mx-auto"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Facilities Carousel with Left and Right Navigation Buttons */}
        {showFacilities && facilitiesList.length > 0 && (
          <div 
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { 
              isHoveredRef.current = false; 
              handleMouseUp();
            }}
            className="relative w-full overflow-hidden mt-8 group/facilities"
          >
            {/* Left Navigation Button (Desktop) */}
            {!forceMobile && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white hover:bg-primary text-primary hover:text-white shadow-[0_4px_25px_rgba(0,0,0,0.18)] border border-gray-100 items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                aria-label="Previous facilities"
                title="Previous facilities"
              >
                <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Right Navigation Button (Desktop) */}
            {!forceMobile && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white hover:bg-primary text-primary hover:text-white shadow-[0_4px_25px_rgba(0,0,0,0.18)] border border-gray-100 items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                aria-label="Next facilities"
                title="Next facilities"
              >
                <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Horizontal Scroll / Touch-Swipe Container */}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onScroll={handleContainerScroll}
              className={`flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto touch-pan-x select-none py-4 px-2 scrollbar-none [&::-webkit-scrollbar]:hidden ${
                isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {sets.map((setIdx) => (
                <div 
                  key={`facility-set-${setIdx}`} 
                  ref={setIdx === 0 ? set1Ref : null} 
                  className="flex gap-4 sm:gap-6 lg:gap-8 shrink-0"
                >
                  {singleSet.map((facility, index) => (
                    <div
                      key={`facility-${setIdx}-${facility._id || index}-${index}`}
                      className="flex-shrink-0 w-[42vw] sm:w-[40vw] md:w-[300px] lg:w-[380px]"
                    >
                      <div className="relative h-[130px] sm:h-[180px] md:h-[260px] lg:h-[320px] w-full rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_15px_30px_rgba(27,37,89,0.3)] transition-all duration-500 hover:-translate-y-2 select-none">
                        {/* Background Image */}
                        <img
                          src={facility.image}
                          alt={facility.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none select-none"
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

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                        {/* Title Content */}
                        <div className="absolute bottom-0 left-0 w-full z-20 p-2 sm:p-4 lg:p-6 pointer-events-none">
                          <h3 className="font-semibold text-white group-hover:text-white transition-colors duration-300 text-sm sm:text-base md:text-lg lg:text-xl">
                            {facility.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default FacilitiesSection;
