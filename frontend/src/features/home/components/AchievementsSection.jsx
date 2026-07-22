"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

import { motion } from 'framer-motion';

const AchievementsSection = ({ previewData }) => {
  const [data, setData] = useState({
    subheading: 'College Achievements',
    heading: 'Awards and Achievements',
    achievements: [],
    showSubheading: true,
    showHeading: true,
    showAchievements: true
  });
  const [isLoading, setIsLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      fetchAchievementsData();
    }
  }, [previewData]);

  const fetchAchievementsData = async () => {
    try {
      const response = await api.get('/cms/achievements', { hideLoader: true });
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching achievements data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-background py-12 lg:py-14 animate-pulse">
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col">
                <div className="w-full h-[240px] md:h-[280px] lg:h-[300px] bg-gray-200 rounded-[1.5rem] mb-6"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const { subheading, heading, achievements, showSubheading, showHeading, showAchievements } = data;

  if (!showAchievements && !previewData) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full bg-background py-12 lg:py-14 overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        {(showSubheading || showHeading) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            {showSubheading && (
              <p className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                {subheading}
              </p>
            )}
            {showHeading && (
              <h2 className="text-3xl lg:text-5xl font-semibold text-primary">
                {heading}
              </h2>
            )}
          </motion.div>
        )}

        {/* Cards Grid */}
        {showAchievements && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full mx-auto"
          >
            {achievements && achievements.map((item) => (
              <motion.div
                key={item.id || item._id}
                variants={cardVariants}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-[240px] md:h-[280px] lg:h-[300px] rounded-[1.5rem] overflow-hidden mb-6 shadow-sm relative group-hover:shadow-md transition-shadow duration-500">
                  <img
                    src={item.image || 'https://via.placeholder.com/300x200'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Date Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 flex flex-col justify-end">
                    <p className="text-white/90 text-xs font-medium tracking-wide uppercase">
                      {item.date}
                    </p>
                  </div>
                </div>
                {/* Meta Info (Category) */}
                <p className="text-[0.65rem] font-semibold text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
                  {item.category}
                </p>
                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default AchievementsSection;
