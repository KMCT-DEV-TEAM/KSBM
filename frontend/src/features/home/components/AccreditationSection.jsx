"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../../api/axios";
import Loader from "../../../components/Loader";

const accredential = "/assets/Images/Group 47.png";

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
        const { data } = await api.get("/cms/accreditation");
        setSettings(data);
      } catch (error) {
        console.error("Error fetching accreditation settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [previewData]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#f4fafe] py-12 sm:py-16 lg:py-20 flex justify-center items-center">
        <Loader theme="light" />
      </section>
    );
  }

  const {
    subheading = "Institutional Credentials",
    heading = "Accreditation &\nAffiliations",
    imageUrl = "",
    showSubheading = true,
    showHeading = true,
    showImage = true,
  } = settings || {};

  if (!showSubheading && !showHeading && !showImage) {
    return null;
  }

  return (
    <section className="w-full bg-[#f4fafe] py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-evenly gap-10 lg:gap-8 w-full max-w-7xl mx-auto">

          {/* Left Content */}
          {(showSubheading || showHeading) && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left px-4 lg:px-0"
            >
              {showSubheading && (
                <p className="uppercase tracking-[0.25em] text-[10px] sm:text-xs md:text-sm text-text-secondary mb-4">
                  {subheading}
                </p>
              )}

              {showHeading && (
                <h2 className="whitespace-pre-line text-primary font-semibold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                  {heading}
                </h2>
              )}
            </motion.div>
          )}

          {/* Divider */}
          {(showSubheading || showHeading) && showImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center shrink-0"
            >
              <div className="hidden lg:block w-px h-40 xl:h-52 bg-gray-300 mx-4 lg:mx-8"></div>
              <div className="block lg:hidden h-px w-40 sm:w-52 bg-gray-300 my-4"></div>
            </motion.div>
          )}

          {/* Right Image */}
          {showImage && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex-[1.5] flex justify-center lg:justify-end w-full"
            >
              <img
                src={imageUrl || accredential}
                alt="Accreditations"
                className="
                  w-full
                  max-w-[220px]
                  sm:max-w-[320px]
                  md:max-w-[450px]
                  lg:max-w-[550px]
                  xl:max-w-[650px]
                  2xl:max-w-[750px]
                  h-auto
                  object-contain
                  mix-blend-multiply
                  select-none
                "
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;