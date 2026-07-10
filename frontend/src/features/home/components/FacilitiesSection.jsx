import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

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
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

        {/* Header Section */}
        {(showSubheading || showHeading || showDescription) && (
          <div className="text-center max-w-4xl mx-auto mb-16">
            {showSubheading && (
              <p className="text-text-secondary text-xs tracking-[0.2em] uppercase mb-4">
                {subheading}
              </p>
            )}
            {showHeading && (
              <h2 className="text-4xl lg:text-5xl font-semibold text-primary mb-6">
                {heading}
              </h2>
            )}
            {showDescription && (
              <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Facilities Grid */}
        {showFacilities && facilitiesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {facilitiesList.map((facility, index) => (
              <div
                key={facility._id || index}
                className="relative h-[200px] md:h-[240px] lg:h-[280px] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Background Image */}
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>

                {/* Title Content */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-white font-semibold">
                    {facility.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FacilitiesSection;
