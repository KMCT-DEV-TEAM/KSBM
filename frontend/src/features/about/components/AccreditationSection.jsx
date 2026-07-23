"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';
import Loader from '../../../components/Loader';

const defaultImages = [
  "/assets/Images/Home/Component 86.png",
  "/assets/Images/Home/Component 87.png",
  "/assets/Images/Home/Component 88.png"
];

const AccreditationSection = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/cms/accreditation', { hideLoader: true });
        setSettings(data);
      } catch (error) {
        console.error("Error fetching accreditation settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 w-full bg-[#f4fafe] flex justify-center items-center">
        <Loader theme="light" />
      </section>
    );
  }

  const {
    subheading = "Institutional Credentials",
    heading = "Accreditation & Affiliations",
    imageUrl = "",
    showSubheading = true,
    showHeading = true,
    showImage = true,
  } = settings || {};

  if (!showSubheading && !showHeading && !showImage) {
    return null;
  }

  return (
    <section className="py-20 w-full bg-[#f4fafe] overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {showSubheading && (
          <motion.span
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block"
          >
            {subheading}
          </motion.span>
        )}
        
        {showHeading && (
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="text-3xl lg:text-4xl font-bold text-primary mb-16 whitespace-pre-line"
          >
            {heading}
          </motion.h2>
        )}

        {showImage && (
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }}
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12"
          >
            {settings?.images && settings.images.length > 0 ? (
              settings.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`Accreditation ${idx + 1}`}
                  className="w-auto h-20 sm:h-24 md:h-28 lg:h-32 object-contain mix-blend-multiply select-none"
                />
              ))
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Accreditations"
                className="w-full max-w-4xl h-auto object-contain mix-blend-multiply select-none"
              />
            ) : (
              defaultImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Accreditation ${idx + 1}`}
                  className="w-auto h-20 sm:h-24 md:h-28 lg:h-32 object-contain mix-blend-multiply select-none"
                />
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default AccreditationSection;
