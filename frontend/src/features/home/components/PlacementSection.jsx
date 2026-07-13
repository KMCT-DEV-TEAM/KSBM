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
        const response = await api.get('/cms/placement');
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
    showSubheading,
    showHeading,
    showDescription,
    showStats,
    previewDevice
  } = displayData;

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
        {showStats && (
          <motion.div
            variants={itemVariants}
            className={`flex items-center justify-center ${isMobilePreview ? 'gap-10 mt-12' : 'gap-10 lg:gap-24 mt-12 lg:mt-20'}`}
          >
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center">
              <span className={`text-primary mb-3 font-serif ${isMobilePreview ? 'text-2xl' : 'text-2xl lg:text-3xl'}`} style={{ fontFamily: 'Georgia, serif' }}>
                {stat1Value}
              </span>
              <span className={`tracking-[0.2em] text-text-secondary uppercase ${isMobilePreview ? 'text-[0.65rem]' : 'text-[0.65rem] lg:text-xs'}`}>
                {stat1Label}
              </span>
            </div>

            {/* Vertical Separator */}
            <div className={`w-[1px] bg-gray-300 ${isMobilePreview ? 'h-12' : 'h-12 lg:h-16'}`}></div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center">
              <span className={`text-primary mb-3 font-serif ${isMobilePreview ? 'text-2xl' : 'text-2xl lg:text-3xl'}`} style={{ fontFamily: 'Georgia, serif' }}>
                {stat2Value}
              </span>
              <span className={`tracking-[0.2em] text-text-secondary uppercase ${isMobilePreview ? 'text-[0.65rem]' : 'text-[0.65rem] lg:text-xs'}`}>
                {stat2Label}
              </span>
            </div>

          </motion.div>
        )}

      </motion.div>
    </section>
  );
};

export default PlacementSection;

