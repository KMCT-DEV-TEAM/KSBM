"use client";
import React from 'react';
import { motion } from 'framer-motion';

const AlumniGallery = ({ data }) => {
  const defaultItems = [
    { title: 'Graduation', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
    { title: 'Convocation', image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop' },
    { title: 'Celebration', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop' },
    { title: 'Campus Reunion', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
    { title: 'Ceremony', image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=800&auto=format&fit=crop' }
  ];
  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section className="py-13 md:py-21 bg-white relative overflow-hidden">

      {/* Decorative Dotted Grid Patterns on Corners */}
      <div className="absolute top-44 left-2 sm:left-6 opacity-30 pointer-events-none hidden sm:block z-0">
        <div className="grid grid-cols-4 gap-2.5">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 right-4 sm:right-8 opacity-30 pointer-events-none hidden sm:block z-0">
        <div className="grid grid-cols-4 gap-2.5">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-between w-full gap-4 sm:gap-6 mb-3">
            <div className="flex-1 h-[1px] bg-primary/30"></div>
            <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase shrink-0">
              GALLERY
            </span>
            <div className="flex-1 h-[1px] bg-primary/30"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2b2b68] tracking-tight">
            {data?.heading || 'Captured in Events'}
          </h2>
        </motion.div>

        {/* Collage Layout Matching input_file_0.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Vertical Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 h-[360px] lg:h-[460px] rounded-3xl overflow-hidden relative group shadow-xl border border-gray-100 cursor-pointer"
          >
            <img
              src={items[0]?.image || defaultItems[0].image}
              alt={items[0]?.title || defaultItems[0].title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-semibold text-xs sm:text-sm tracking-wide">{items[0]?.title || defaultItems[0].title}</p>
            </div>
          </motion.div>

          {/* Middle Column Block */}
          <div className="lg:col-span-6 flex flex-col gap-6 justify-between">

            {/* Top Row: 2 Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-[215px] rounded-3xl overflow-hidden relative group shadow-xl border border-gray-100 cursor-pointer"
              >
                <img
                  src={items[1]?.image || defaultItems[1].image}
                  alt={items[1]?.title || defaultItems[1].title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-semibold text-xs sm:text-sm tracking-wide">{items[1]?.title || defaultItems[1].title}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[215px] rounded-3xl overflow-hidden relative group shadow-xl border border-gray-100 cursor-pointer"
              >
                <img
                  src={items[2]?.image || defaultItems[2].image}
                  alt={items[2]?.title || defaultItems[2].title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-semibold text-xs sm:text-sm tracking-wide">{items[2]?.title || defaultItems[2].title}</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: 1 Wide Landscape Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-[220px] rounded-3xl overflow-hidden relative group shadow-xl border border-gray-100 cursor-pointer"
            >
              <img
                src={items[3]?.image || defaultItems[3].image}
                alt={items[3]?.title || defaultItems[3].title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <p className="font-semibold text-xs sm:text-sm tracking-wide">{items[3]?.title || defaultItems[3].title}</p>
              </div>
            </motion.div>

          </div>

          {/* Right Vertical Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3 h-[360px] lg:h-[460px] rounded-3xl overflow-hidden relative group shadow-xl border border-gray-100 cursor-pointer"
          >
            <img
              src={items[4]?.image || defaultItems[4].image}
              alt={items[4]?.title || defaultItems[4].title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-semibold text-xs sm:text-sm tracking-wide">{items[4]?.title || defaultItems[4].title}</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AlumniGallery;
