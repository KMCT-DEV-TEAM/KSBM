import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const InstitutionalResourcesSection = ({ headerData, libraryData, otherResourcesData }) => {
  const [activeResource, setActiveResource] = useState(libraryData);
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    setActiveResource(libraryData);
    setActiveIndex(null);
  }, [libraryData]);

  const { heading, description, description2, mainImage, thumbnails } = activeResource || {};
  const [activeImage, setActiveImage] = useState(mainImage);

  useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  if (!libraryData) return null;

  const handleOtherResourceClick = (item, idx) => {
    if (activeIndex === idx) {
      setActiveIndex(null);
      setActiveResource(libraryData);
    } else {
      setActiveIndex(idx);
      setActiveResource({
        heading: item.title,
        description: item.description || '',
        description2: item.description2 || '',
        mainImage: item.image,
        thumbnails: item.thumbnails || []
      });
    }
    if (sectionRef.current) {
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="institutional-resources-section" ref={sectionRef} className="py-16 sm:py-20 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 w-full"
      >
        <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#2b2b68] tracking-tight mb-4">
          {headerData?.heading || 'Institutional Resources'}
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {headerData?.description || 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.'}
        </p>
      </motion.div>

      {/* Active Resource View (like LibrarySection) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        {/* Left Side: Large Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-md group h-[300px] sm:h-[350px] lg:h-[500px]"
        >
          <img
            src={activeImage}
            alt={heading}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        {/* Right Side: Text & Thumbnails */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 flex flex-col justify-between h-full gap-4 lg:gap-6 pt-0"
        >
          <div>
            <div className="flex items-center gap-4 mb-4 w-full">
              <h3 className="text-[24px] font-semibold text-[#2b2b68] tracking-tight shrink-0">
                {heading}
              </h3>
              <div className="h-[1px] bg-primary/30 flex-1 mt-1"></div>
            </div>

            {(description || description2) && (
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                {description && <p>{description}</p>}
                {description2 && <p>{description2}</p>}
              </div>
            )}
          </div>

          {/* Thumbnails Grid */}
          {thumbnails && thumbnails.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="grid grid-cols-3 gap-3 sm:gap-4 mt-2 lg:mt-4"
            >
              {thumbnails.map((thumb, idx) => (
                thumb && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`rounded-xl overflow-hidden aspect-video shadow-sm relative group cursor-pointer ${activeImage === thumb ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <img
                      src={thumb}
                      alt={`${heading} view ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                  </motion.div>
                )
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Other Resources Grid */}
      {otherResourcesData && otherResourcesData.items && otherResourcesData.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8 w-full">
            <h3 className="text-[20px] font-semibold text-[#2b2b68] tracking-tight shrink-0">
              {otherResourcesData.heading || 'Other Resources'}
            </h3>
            <div className="h-[1px] bg-primary/30 flex-1 mt-1"></div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {otherResourcesData.items.map((item, idx) => {
              const isSwapped = activeIndex === idx;
              const displayItem = isSwapped
                ? { title: libraryData.heading, image: libraryData.mainImage }
                : item;

              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                  key={idx}
                  onClick={() => handleOtherResourceClick(item, idx)}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/3] cursor-pointer"
                >
                  <img
                    src={displayItem.image}
                    alt={displayItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b68]/90 via-[#2b2b68]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-semibold text-lg sm:text-xl tracking-wide">
                      {displayItem.title}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default InstitutionalResourcesSection;
