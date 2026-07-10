import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const AcademicPrograms = ({ previewData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);

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
            <div className="flex gap-8 w-full max-w-5xl justify-center">
              <div className="h-[380px] lg:h-[450px] bg-gray-200 rounded-[2rem] w-[50%]"></div>
              <div className="h-[380px] lg:h-[450px] bg-gray-200 rounded-[2rem] w-[50%]"></div>
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / (isMobilePreview ? 1 : 2);
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const hasMultiplePages = programs && programs.length > (isMobilePreview ? 1 : 2);

  const renderProgramCard = (program, extraClasses = '', customWidth = null) => (
    <div
      key={program.id || program._id}
      className={`relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_15px_30px_rgba(27,37,89,0.3)] transition-all duration-500 hover:-translate-y-2 ${extraClasses}`}
      style={customWidth ? { width: customWidth } : {}}
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Text Content */}
      <div className={`absolute bottom-0 left-0 w-full z-20 ${isMobilePreview ? 'p-6' : 'p-8 lg:p-12'}`}>
        {program.title && (
          <h3 className={`font-bold text-white mb-3 group-hover:text-white transition-colors duration-300 ${isMobilePreview ? 'text-2xl' : 'text-3xl lg:text-4xl'}`}>
            {program.title}
          </h3>
        )}
        {program.subtitle && (
          <p className={`text-gray-200 leading-relaxed max-w-[95%] group-hover:text-gray-100 transition-colors duration-300 ${isMobilePreview ? 'text-xs' : 'text-sm lg:text-[0.95rem]'}`}>
            {program.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section className={`w-full bg-background py-12 lg:py-14 ${isMobilePreview ? 'max-w-[375px] mx-auto' : isTabletPreview ? 'max-w-[768px] mx-auto' : ''}`}>
      <div className={`mx-auto px-4 lg:px-8 ${isMobilePreview || isTabletPreview ? 'w-full' : 'max-w-[1440px]'}`}>

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
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

        {/* Dynamic Programs Display */}
        {showPrograms && programs && programs.length > 0 && (
          <>
            {/* 1 or 2 Programs Layout (Centered Flex) */}
            {programs.length <= 2 && (
              <div className={`flex flex-col md:flex-row justify-center gap-6 lg:gap-8 max-w-4xl mx-auto ${isMobilePreview ? 'px-0' : 'px-4'}`}>
                {programs.map((program) =>
                  renderProgramCard(program, `flex-none ${isMobilePreview ? 'w-full h-[280px]' : 'w-full md:w-[calc(50%-1rem)] h-[320px] lg:h-[380px]'}`)
                )}
              </div>
            )}

            {/* 3 Programs Layout (3-Column Flex) */}
            {programs.length === 3 && (
              <div className={`flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto ${isMobilePreview ? 'px-0' : 'px-4'}`}>
                {programs.map((program) =>
                  renderProgramCard(program, `flex-none ${isMobilePreview ? 'w-full h-[280px]' : 'w-full md:w-[calc(33.333%-1rem)] h-[280px] md:h-[320px] lg:h-[380px]'}`)
                )}
              </div>
            )}

            {/* 4+ Programs Layout (Slider) */}
            {programs.length >= 4 && (
              <div className="relative w-full overflow-hidden group/slider">



                {/* Navigation Arrows for Slider */}
                {hasMultiplePages && (
                  <>
                    <button 
                      onClick={() => scroll('left')}
                      className="absolute top-1/2 -translate-y-1/2 left-4 md:left-[calc(50%-620px)] z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.15)] text-primary flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 focus:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6 ml-[-2px]" />
                    </button>
                    <button 
                      onClick={() => scroll('right')}
                      className="absolute top-1/2 -translate-y-1/2 right-4 md:right-[calc(50%-620px)] z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.15)] text-primary flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 focus:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6 mr-[-2px]" />
                    </button>
                  </>
                )}

                <div
                  ref={scrollRef}
                  className={`flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4`}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: isMobilePreview ? '7.5vw' : 'max(1rem, calc(50% - 416px))',
                    paddingRight: isMobilePreview ? '7.5vw' : 'max(1rem, calc(50% - 416px))'
                  }}
                >
                  {programs.map((program) =>
                    renderProgramCard(
                      program,
                      `flex-none snap-center md:snap-start h-[280px] md:h-[320px] lg:h-[380px]`,
                      isMobilePreview ? '85vw' : '400px'
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

export default AcademicPrograms;
