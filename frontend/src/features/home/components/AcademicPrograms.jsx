import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '../../../components/Loader';

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
        <Loader theme="light" />
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
      const isMobile = window.innerWidth < 768;
      const scrollAmount = scrollRef.current.clientWidth / (isMobile ? 1 : 2);
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const hasMultiplePages = programs && programs.length > 2;

  const renderProgramCard = (program, index, extraClasses = '') => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      key={program.id || program._id}
      className={`relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_15px_30px_rgba(27,37,89,0.3)] transition-all duration-500 hover:-translate-y-2 ${extraClasses}`}
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
        <div className={`absolute top-12 left-6 lg:left-8 flex flex-col items-center gap-4 z-20`}>
          <div className="w-[1px] h-12 bg-background/40"></div>
          <span
            className="text-white/80 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {program.tag}
          </span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Text Content */}
      <div className={`absolute bottom-0 left-0 w-full z-20 p-5 lg:p-12`}>
        {program.title && (
          <h3 className={`font-bold text-white mb-2 md:mb-3 group-hover:text-white transition-colors duration-300 text-lg md:text-2xl lg:text-3xl`}>
            {program.title}
          </h3>
        )}
        {program.subtitle && (
          <p className={`text-gray-200 leading-relaxed max-w-[100%] group-hover:text-gray-100 transition-colors duration-300 text-[11px] md:text-xs lg:text-[0.95rem]`}>
            {program.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <section className={`w-full bg-background py-12 lg:py-14`}>
      <div className={`w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8`}>

        {/* Header Section */}
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
          className="text-center max-w-4xl mx-auto mb-12"
        >
          {showSubheading && subheading && (
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-text-secondary text-xs tracking-[0.2em] uppercase mb-4">
              {subheading}
            </motion.p>
          )}

          {showHeading && heading && (
            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className={`font-semibold text-primary mb-6 text-3xl md:text-4xl lg:text-5xl`}>
              {heading}
            </motion.h2>
          )}

          {showDescription && description && (
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className={`text-text-secondary leading-relaxed max-w-3xl mx-auto text-sm lg:text-base`}>
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Dynamic Programs Display */}
        {showPrograms && programs && programs.length > 0 && (
          <>
            {/* 1 or 2 Programs Layout (Centered Flex) */}
            {programs.length <= 2 && (
              <div className={`flex flex-col md:flex-row justify-center gap-6 lg:gap-8 max-w-4xl mx-auto`}>
                {programs.map((program, index) =>
                  renderProgramCard(program, index, `flex-none w-full md:w-[calc(50%-1rem)] h-[340px] lg:h-[380px]`)
                )}
              </div>
            )}

            {/* 3 Programs Layout (3-Column Flex) */}
            {programs.length === 3 && (
              <div className={`flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto`}>
                {programs.map((program, index) =>
                  renderProgramCard(program, index, `flex-none w-full md:w-[calc(33.333%-1rem)] h-[340px] md:h-[340px] lg:h-[380px]`)
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
                      className="absolute top-1/2 -translate-y-1/2 left-4 md:left-[calc(50%-416px)] lg:left-[calc(50%-620px)] z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.15)] text-primary items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 focus:opacity-100 hidden md:flex"
                    >
                      <ChevronLeft className="w-6 h-6 ml-[-2px]" />
                    </button>
                    <button 
                      onClick={() => scroll('right')}
                      className="absolute top-1/2 -translate-y-1/2 right-4 md:right-[calc(50%-416px)] lg:right-[calc(50%-620px)] z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.15)] text-primary items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 focus:opacity-100 hidden md:flex"
                    >
                      <ChevronRight className="w-6 h-6 mr-[-2px]" />
                    </button>
                  </>
                )}

                <div
                  ref={scrollRef}
                  className={`flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 px-4 md:px-0`}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {/* Padding div to center content on desktop start */}
                  <div className="hidden md:block shrink-0" style={{ width: 'max(0px, calc(50% - 416px))' }}></div>
                  
                  {programs.map((program, index) =>
                    renderProgramCard(
                      program,
                      index,
                      `flex-none snap-center md:snap-start w-[85vw] md:w-[400px] h-[340px] md:h-[340px] lg:h-[380px]`
                    )
                  )}

                  {/* Padding div to center content on desktop end */}
                  <div className="hidden md:block shrink-0" style={{ width: 'max(0px, calc(50% - 416px))' }}></div>
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
