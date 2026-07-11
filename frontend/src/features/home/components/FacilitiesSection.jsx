import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';

const FacilitiesSection = ({ previewData }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/cms/facilities');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching facilities settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [previewData]);

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

        {/* Facilities Grid */}
        {showFacilities && facilitiesList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto justify-items-center">
            {facilitiesList.map((facility, index) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                key={facility._id || index}
                className="relative aspect-[4/5] w-full max-w-[350px] sm:max-w-none rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_15px_30px_rgba(27,37,89,0.3)] transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Image */}
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-100"></div>

                {/* Title Content */}
                <div className="absolute bottom-0 left-0 w-full z-20 p-5 lg:p-8">
                  <h3 className="font-semibold text-white group-hover:text-white transition-colors duration-300 text-lg md:text-xl lg:text-2xl">
                    {facility.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FacilitiesSection;
