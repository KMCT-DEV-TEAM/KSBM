import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

const AcademicPrograms = ({ previewData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/programs');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching academic programs data:', error);
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
      <section className="w-full bg-background py-12 lg:py-14">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-16 bg-gray-200 rounded w-full max-w-3xl mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full max-w-5xl">
              <div className="h-[380px] lg:h-[450px] bg-gray-200 rounded-[2rem]"></div>
              <div className="h-[380px] lg:h-[450px] bg-gray-200 rounded-[2rem]"></div>
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
    programs,
    showSubheading,
    showHeading,
    showDescription,
    showPrograms,
    previewDevice
  } = displayData;

  const isMobilePreview = previewDevice === 'mobile';
  const isTabletPreview = previewDevice === 'tablet';

  return (
    <section className={`w-full bg-background py-12 lg:py-14 ${isMobilePreview ? 'max-w-[375px] mx-auto' : isTabletPreview ? 'max-w-[768px] mx-auto' : ''}`}>
      <div className={`mx-auto px-4 lg:px-8 ${isMobilePreview || isTabletPreview ? 'w-full' : 'max-w-[1440px]'}`}>

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {showSubheading && subheading && (
            <p className="text-text-secondary text-xs tracking-[0.2em] uppercase mb-4">
              {subheading}
            </p>
          )}
          
          {showHeading && heading && (
            <h2 className={`font-semibold text-primary mb-6 ${isMobilePreview ? 'text-3xl' : 'text-4xl lg:text-5xl'}`}>
              {heading}
            </h2>
          )}
          
          {showDescription && description && (
            <p className={`text-text-secondary leading-relaxed max-w-3xl mx-auto ${isMobilePreview ? 'text-sm' : 'text-sm lg:text-base'}`}>
              {description}
            </p>
          )}
        </div>

        {/* Programs Grid */}
        {showPrograms && programs && programs.length > 0 && (
          <div className={`grid gap-8 lg:gap-10 mx-auto ${isMobilePreview ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 md:grid-cols-2 max-w-5xl'}`}>
            {programs.map((program) => (
              <div
                key={program.id || program._id}
                className={`relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500 ${isMobilePreview ? 'h-[320px]' : 'h-[380px] lg:h-[450px]'}`}
              >
                {/* Background Image */}
                {program.image && (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Vertical Tag (Left Edge) */}
                {program.tag && (
                  <div className={`absolute top-12 left-6 lg:left-8 flex flex-col items-center gap-4 z-20 ${isMobilePreview ? 'scale-90 origin-top-left' : ''}`}>
                    <div className="w-[1px] h-12 bg-background/40"></div>
                    <span
                      className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {program.tag}
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10"></div>

                {/* Text Content */}
                <div className={`absolute bottom-0 left-0 w-full z-20 ${isMobilePreview ? 'p-6' : 'p-8 lg:p-12'}`}>
                  {program.title && (
                    <h3 className={`font-bold text-white mb-3 ${isMobilePreview ? 'text-2xl' : 'text-3xl lg:text-4xl'}`}>
                      {program.title}
                    </h3>
                  )}
                  {program.subtitle && (
                    <p className={`text-gray-200 leading-relaxed max-w-[90%] ${isMobilePreview ? 'text-xs' : 'text-sm lg:text-[0.95rem]'}`}>
                      {program.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default AcademicPrograms;
