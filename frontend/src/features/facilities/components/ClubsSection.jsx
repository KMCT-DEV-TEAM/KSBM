import React from 'react';
import { motion } from 'framer-motion';

const watermarkImg = '/assets/Images/watermark_logo.png';

const ClubsSection = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;

  const { heading, description, items } = data;

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20">

      <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 lg:mb-16 w-full"
        >
          {heading && (
            <h2 className="text-3xl font-semibold text-[#2b2b68] tracking-tight mb-6">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-4xl mb-10">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 w-full">
            <h3 className="text-[24px] font-semibold text-[#2b2b68] tracking-tight shrink-0">
              Clubs
            </h3>
            <div className="h-[1px] bg-primary/30 flex-1 mt-1"></div>
          </div>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {items.map((item, idx) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-[350px] sm:h-[400px]"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1238]/90 via-[#1e2869]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform transition-transform duration-500">
                <h3 className="text-white font-bold text-xl sm:text-2xl tracking-wide group-hover:-translate-y-2 transition-transform duration-300">
                  {item.title}
                </h3>

                {/* Optional animated line on hover */}
                <div className="w-0 h-[2px] bg-white mt-3 group-hover:w-12 transition-all duration-500 ease-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClubsSection;
