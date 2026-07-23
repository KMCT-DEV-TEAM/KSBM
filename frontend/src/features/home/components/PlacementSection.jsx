"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';

const PlacementSection = ({ previewData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/placement', { hideLoader: true });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching placement data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!previewData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [previewData]);

  const displayData = previewData || data;

  if (loading) {
    return (
      <section className="w-full bg-[#f4f7f9] py-16 lg:py-20">
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded w-96 mb-6"></div>
            <div className="h-20 bg-gray-300 rounded w-full max-w-4xl mb-16"></div>
            <div className="flex gap-24 mt-12">
              <div className="h-16 bg-gray-300 rounded w-32"></div>
              <div className="h-16 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!displayData) return null;

  const {
    subheading,
    heading,
    description,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    statistics,
    showSubheading,
    showHeading,
    showDescription,
    showStats,
    previewDevice
  } = displayData;

  const displayStats = statistics && statistics.length > 0 
    ? statistics 
    : (stat1Value || stat2Value) 
      ? [{ value: stat1Value, label: stat1Label }, { value: stat2Value, label: stat2Label }].filter(s => s.value)
      : [];

  const isMobilePreview = previewDevice === 'mobile';
  const isTabletPreview = previewDevice === 'tablet';

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } 
    },
  };

  return (
    <section className={`w-full bg-[#f4f7f9] py-16 lg:py-20 ${isMobilePreview ? 'max-w-[375px] mx-auto' : isTabletPreview ? 'max-w-[768px] mx-auto' : ''}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${isMobilePreview || isTabletPreview ? 'w-full' : 'w-[98%] max-w-[1440px]'}`}
      >

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {showSubheading && subheading && (
            <motion.p
              variants={itemVariants}
              className={`text-text-secondary tracking-[0.25em] uppercase mb-4 ${isMobilePreview ? 'text-[0.65rem]' : 'text-[0.65rem] lg:text-xs'}`}
            >
              {subheading}
            </motion.p>
          )}
          
          {showHeading && heading && (
            <motion.h2
              variants={itemVariants}
              className={`font-semibold text-primary mb-6 ${isMobilePreview ? 'text-3xl' : 'text-3xl lg:text-5xl'}`}
            >
              {heading}
            </motion.h2>
          )}
          
          {showDescription && description && (
            <motion.p
              variants={itemVariants}
              className={`text-text-secondary leading-[1.8] max-w-4xl mx-auto ${isMobilePreview ? 'text-sm' : 'text-sm lg:text-[0.95rem]'}`}
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Statistics Section */}
        {showStats && displayStats.length > 0 && (
          <motion.div
            variants={itemVariants}
            className={
              isMobilePreview
                ? `grid ${displayStats.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-y-8 gap-x-2 mt-10 w-full`
                : isTabletPreview
                ? 'flex flex-wrap items-center justify-center gap-8 mt-12 w-full'
                : `grid ${displayStats.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-y-8 gap-x-4 mt-10 md:flex md:flex-wrap md:items-center md:justify-center md:gap-10 lg:gap-24 md:mt-12 lg:mt-20 w-full`
            }
          >
            {displayStats.map((stat, index) => (
              <React.Fragment key={index}>
                {/* Stat Item */}
                <div className={`flex flex-col items-center text-center px-2 ${displayStats.length === 3 && index === 2 ? (isMobilePreview ? 'col-span-2' : 'col-span-2 md:col-span-1') : ''}`}>
                  <span className={`text-primary mb-2 md:mb-3 font-serif ${isMobilePreview ? 'text-2xl' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: 'Georgia, serif' }}>
                    {stat.value}
                  </span>
                  <span className={`tracking-[0.15em] md:tracking-[0.2em] text-text-secondary uppercase ${isMobilePreview ? 'text-[0.6rem]' : 'text-[0.65rem] md:text-xs text-center'}`}>
                    {stat.label}
                  </span>
                </div>

                {/* Vertical Separator (only show on desktop to avoid weird wrapping) */}
                {index < displayStats.length - 1 && (
                  <div 
                    className={
                      isMobilePreview || isTabletPreview
                        ? 'hidden'
                        : 'hidden lg:block w-[1px] bg-gray-300 h-12 lg:h-16'
                    }
                  ></div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

      </motion.div>
    </section>
  );
};

export default PlacementSection;

