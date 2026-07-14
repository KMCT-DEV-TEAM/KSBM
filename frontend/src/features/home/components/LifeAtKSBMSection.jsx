"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
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
      <section className="relative w-full bg-[#f4f7f9] py-12 lg:py-14 overflow-hidden animate-pulse">
        <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
          </div>
          <div className="relative w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden mt-8 flex flex-col gap-3 md:gap-4">
            <div className="flex gap-3 md:gap-4 w-max px-3 md:px-4">
              {[1,2,3,4].map((i, index) => {
                const isWide = index % 4 === 0 || index % 4 === 3;
                return <div key={i} className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} bg-gray-300 rounded-[1rem] md:rounded-[1.5rem]`}></div>;
              })}
            </div>
            <div className="flex gap-3 md:gap-4 w-max px-3 md:px-4 -ml-[100px] md:-ml-[200px]">
              {[5,6,7,8].map((i, index) => {
                const isWide = index % 4 === 1 || index % 4 === 2;
                return <div key={i} className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} bg-gray-300 rounded-[1rem] md:rounded-[1.5rem]`}></div>;
              })}
            </div>
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
    <section className="relative w-full bg-[#f4f7f9] py-12 lg:py-14 overflow-hidden">

      {/* Background Watermark Logo (Right) */}
      <div className="absolute top-1/2 right-0 translate-x-[50%] -translate-y-1/2 opacity-80 pointer-events-none z-0">
        <img src={watermarkLogo} alt="Background Watermark" className="w-[250px] lg:w-[380px] h-auto object-contain mix-blend-multiply contrast-150" />
      </div>

      <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Header Section */}
        {(showSubheading || showHeading || showDescription) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {showSubheading && (
              <p className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
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
          </motion.div>
        )}

        {/* Looping Collage Image Gallery */}
        {showImages && images && images.length > 0 && (
          <div className="relative w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden mt-8 flex flex-col gap-3 md:gap-4">
            
            {/* Top Row (Scrolls Left) */}
            <motion.div 
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="flex gap-3 md:gap-4 w-max pr-3 md:pr-4"
            >
              {[...Array(3)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-3 md:gap-4 shrink-0">
                  {images.slice(0, Math.ceil(images.length / 2)).map((img, index) => {
                    const isWide = index % 4 === 0 || index % 4 === 3;
                    return (
                      <div
                        key={index}
                        className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} rounded-[1rem] md:rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm relative`}
                      >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0 bg-gray-100" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </motion.div>

            {/* Bottom Row (Scrolls Right) */}
            <motion.div 
              animate={{ x: ["-33.333%", "0%"] }}
              transition={{ ease: "linear", duration: 45, repeat: Infinity }}
              className="flex gap-3 md:gap-4 w-max pr-3 md:pr-4"
            >
              {[...Array(3)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-3 md:gap-4 shrink-0">
                  {images.slice(Math.ceil(images.length / 2)).map((img, index) => {
                    const isWide = index % 4 === 1 || index % 4 === 2;
                    return (
                      <div
                        key={index}
                        className={`h-[160px] md:h-[240px] shrink-0 ${isWide ? 'w-[280px] md:w-[500px]' : 'w-[160px] md:w-[300px]'} rounded-[1rem] md:rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm relative`}
                      >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0 bg-gray-100" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
};

export default LifeAtKSBMSection;
