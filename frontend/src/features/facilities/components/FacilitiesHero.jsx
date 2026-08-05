import React from 'react';
import { motion } from 'framer-motion';

const FacilitiesHero = ({ data }) => {
  if (!data) return null;

  const { heading, subtext, backgroundImage } = data;

  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh] lg:h-screen min-h-[500px] flex items-end justify-center overflow-hidden mb-8 sm:mb-16 pb-16 md:pb-32 group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        {/* Dark Overlay matching AboutHero style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      {data.showTextContent !== false && data.showTextContent !== 'false' && (
        <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-snug tracking-tight">
              {heading}
            </h1>
            <p className="text-[11px] md:text-sm lg:text-base text-gray-200 font-medium leading-relaxed max-w-3xl">
              {subtext}
            </p>
          </motion.div>
        </div>
      )}

    </section>
  );
};

export default FacilitiesHero;
