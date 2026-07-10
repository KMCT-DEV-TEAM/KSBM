import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
import accredential from "../../../assets/Images/Group 47.png"
import Loader from '../../../components/Loader';

const AccreditationSection = ({ previewData }) => {
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
        const { data } = await api.get('/cms/accreditation');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching accreditation settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [previewData]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#f4fafe] py-16 lg:py-20 flex justify-center">
        <Loader theme="light" />
      </section>
    );
  }

  const {
    subheading = 'Institutional Credentials',
    heading = 'Accreditation &\nAffiliations',
    imageUrl = '',
    showSubheading = true,
    showHeading = true,
    showImage = true
  } = settings || {};

  if (!showSubheading && !showHeading && !showImage) {
    return null;
  }
  return (
    <section className="w-full bg-[#f4fafe] py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto">

          {/* Left Text Content */}
          {(showSubheading || showHeading) && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center shrink-0 flex flex-col items-center px-4 lg:px-0"
            >
              {showSubheading && (
                <p className="text-text-secondary text-[10px] lg:text-xs tracking-[0.2em] uppercase mb-4">
                  {subheading}
                </p>
              )}
              {showHeading && (
                <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold text-primary leading-[1.3] whitespace-pre-line">
                  {heading}
                </h2>
              )}
            </motion.div>
          )}

          {/* Vertical Separator (Desktop) / Horizontal (Mobile) */}
          {(showSubheading || showHeading) && showImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <div className="hidden lg:block w-[1px] h-32 bg-gray-300/50 mx-12 lg:mx-20 shrink-0"></div>
              <div className="block lg:hidden w-32 h-[1px] bg-gray-300/50 my-10 shrink-0"></div>
            </motion.div>
          )}

          {/* Right Logos Content */}
          {showImage && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl flex items-center justify-center"
            >
              <img
                src={imageUrl || accredential}
                alt="Accreditations"
                className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-xl h-auto object-contain mix-blend-multiply"
              />
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;
