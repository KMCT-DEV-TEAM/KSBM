"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
const watermarkLogo = '/assets/Images/watermark_logo.png';

const LifeAtKSBMSection = ({ previewData }) => {
  const [data, setData] = useState({
    subheading: 'Life at KSBM',
    heading: 'Beyond the Classroom',
    description: 'Life @ KMCT is a vibrant blend of learning, innovation, culture, and unforgettable campus experiences.',
    images: [],
    showSubheading: true,
    showHeading: true,
    showDescription: true,
    showImages: true,
    showSection: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      const fetchLifeAtKsbm = async () => {
        try {
          const response = await api.get('/cms/life-at-ksbm');
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

  if (isLoading) {
    return (
      <section className="relative w-full bg-background py-12 lg:py-14 overflow-hidden animate-pulse">
        <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px]">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-[1rem] col-span-1"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const { subheading, heading, description, images, showSubheading, showHeading, showDescription, showImages, showSection } = data;

  if (!showSection && !previewData) {
    return null;
  }

  return (
    <section className="relative w-full bg-background py-12 lg:py-14 overflow-hidden">

      {/* Background Watermark Logo (Right) */}
      <div className="absolute top-1/2 right-0 translate-x-[50%] -translate-y-1/2 opacity-80 pointer-events-none z-0">
        <img src={watermarkLogo} alt="Background Watermark" className="w-[250px] lg:w-[380px] h-auto object-contain mix-blend-multiply contrast-150" />
      </div>

      <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Header Section */}
        {(showSubheading || showHeading || showDescription) && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {showSubheading && (
              <p className="text-text-secondary text-[0.65rem] lg:text-xs tracking-[0.25em] uppercase mb-4">
                {subheading}
              </p>
            )}
            {showHeading && (
              <h2 className="text-3xl lg:text-5xl font-semibold text-primary mb-6">
                {heading}
              </h2>
            )}
            {showDescription && (
              <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Collage Image Gallery */}
        {showImages && images && images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px] grid-flow-row">
            {images.map((img, index) => {
              // 2 rows layout on desktop (6 columns total per row)
              // Row 1: 2 + 1 + 1 + 2 = 6
              // Row 2: 1 + 2 + 2 + 1 = 6
              let spanClass = "col-span-1 row-span-1";
              if (index === 0 || index === 3 || index === 5 || index === 6) {
                spanClass = "col-span-1 md:col-span-2 row-span-1";
              }

              return (
                <div
                  key={index}
                  className={`${spanClass} rounded-[1rem] md:rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 relative`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0 bg-gray-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default LifeAtKSBMSection;
