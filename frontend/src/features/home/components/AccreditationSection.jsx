import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import accredential from "../../../assets/Images/Group 47.png"

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
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
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
            <div className="text-center shrink-0 flex flex-col items-center">
              {showSubheading && (
                <p className="text-text-secondary text-[10px] lg:text-xs tracking-[0.2em] uppercase mb-4">
                  {subheading}
                </p>
              )}
              {showHeading && (
                <h2 className="text-2xl lg:text-[2.5rem] font-semibold text-primary leading-[1.4] whitespace-pre-line">
                  {heading}
                </h2>
              )}
            </div>
          )}

          {/* Vertical Separator (Desktop) / Horizontal (Mobile) */}
          {(showSubheading || showHeading) && showImage && (
            <>
              <div className="hidden lg:block w-[1px] h-32 bg-gray-300/50 mx-12 lg:mx-20 shrink-0"></div>
              <div className="block lg:hidden w-32 h-[1px] bg-gray-300/50 my-10 shrink-0"></div>
            </>
          )}

          {/* Right Logos Content */}
          {showImage && (
            <div className="w-full max-w-xl flex items-center justify-center">
              <img
                src={imageUrl || accredential}
                alt="Accreditations"
                className="w-[90%] md:w-[80%] h-auto object-contain mix-blend-multiply"
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;
