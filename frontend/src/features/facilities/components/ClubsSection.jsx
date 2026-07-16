import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
            <Link href={`/facilities/club/${item._id}`} key={idx}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-[350px] sm:h-[400px]"
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
        </motion.div>
      </div>
    </section>
  );
};

export default ClubsSection;
