import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const watermarkImg = '/assets/Images/watermark_logo.png';

const ClubsSection = ({ data }) => {
  const sliderRef = useRef(null);

  if (!data || !data.items || data.items.length === 0) return null;

  const { heading, description, items } = data;

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-20">

      <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 lg:mb-16 w-full"
        >
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#2b2b68] tracking-tight mb-4 sm:mb-6">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 text-xs sm:text-base leading-relaxed max-w-4xl mb-6 sm:mb-10">
              {description}
            </p>
          )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <h3 className="text-xl sm:text-[24px] font-semibold text-[#2b2b68] tracking-tight shrink-0">
                Clubs
              </h3>
              <div className="h-[1px] bg-primary/30 w-16 sm:w-auto sm:flex-1 mt-1"></div>
            </div>
          </motion.div>

          {/* Clubs Slider */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="relative -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {items.length > 3 ? (
              <div className="overflow-hidden relative w-full pt-4 pb-8">
                <div className="animate-marquee gap-6 lg:gap-8 flex">
                  {[...items, ...items].map((item, idx) => (
                    <Link href={`/facilities/club/${item._id}`} key={idx} className="shrink-0 w-[280px] sm:w-[350px] lg:w-[400px]">
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.95 },
                          visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                        className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-[350px] sm:h-[400px] w-full"
                      >
                        {/* Image */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Primary Half Color Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary via-primary/85 to-transparent opacity-85 group-hover:h-full group-hover:from-primary/95 group-hover:via-primary/90 group-hover:to-primary/75 transition-all duration-500" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end transform transition-all duration-500 z-10">
                          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className="text-white font-bold text-base sm:text-2xl tracking-wide">
                              {item.title}
                            </h3>

                            {/* Description revealed on hover */}
                            <p className="text-white/90 text-[10px] sm:text-sm mt-3 leading-relaxed opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-48 transition-all duration-500 line-clamp-4">
                              {item.description || "Engage in dynamic activities, leadership workshops, and collaborative events designed to build practical business acumen and lifelong peer networks."}
                            </p>

                            {/* Animated line on hover */}
                            <div className="w-0 h-[2px] bg-white mt-4 group-hover:w-16 transition-all duration-500 ease-out" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4 pb-8">
                {items.map((item, idx) => (
                  <Link href={`/facilities/club/${item._id}`} key={idx} className="w-full">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
                      }}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-[350px] sm:h-[400px] w-full"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Primary Half Color Gradient Overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary via-primary/85 to-transparent opacity-85 group-hover:h-full group-hover:from-primary/95 group-hover:via-primary/90 group-hover:to-primary/75 transition-all duration-500" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end transform transition-all duration-500 z-10">
                        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                          <h3 className="text-white font-bold text-xl sm:text-2xl tracking-wide">
                            {item.title}
                          </h3>

                          {/* Description revealed on hover */}
                          <p className="text-white/90 text-xs sm:text-sm mt-3 leading-relaxed opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-48 transition-all duration-500 line-clamp-4">
                            {item.description || "Engage in dynamic activities, leadership workshops, and collaborative events designed to build practical business acumen and lifelong peer networks."}
                          </p>

                          {/* Animated line on hover */}
                          <div className="w-0 h-[2px] bg-white mt-4 group-hover:w-16 transition-all duration-500 ease-out" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
        </motion.div>
      </div>
    </section>
  );
};

export default ClubsSection;
