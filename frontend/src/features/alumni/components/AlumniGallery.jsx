"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AlumniGallery = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultItems = [
    { title: 'Graduation', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
    { title: 'Convocation', image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop' },
    { title: 'Celebration', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop' },
    { title: 'Campus Reunion', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
    { title: 'Ceremony', image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=800&auto=format&fit=crop' },
    { title: 'Annual Day', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop' },
    { title: 'Sports Day', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop' },
    { title: 'Cultural Fest', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
    { title: 'Workshop', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop' },
    { title: 'Seminar', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop' }
  ];
  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  // Build a masonry-style column layout from items
  const buildColumns = () => {
    const columns = [];
    let i = 0;
    let colIndex = 0;

    while (i < items.length) {
      const pattern = colIndex % 5;

      if (pattern === 0) {
        columns.push({ type: 'tall', items: [items[i]] });
        i += 1;
      } else if (pattern === 1) {
        const top = items[i];
        const bottom = items[i + 1];
        if (bottom) {
          columns.push({ type: 'split-top-small', items: [top, bottom] });
          i += 2;
        } else {
          columns.push({ type: 'tall', items: [top] });
          i += 1;
        }
      } else if (pattern === 2) {
        columns.push({ type: 'tall', items: [items[i]] });
        i += 1;
      } else if (pattern === 3) {
        const top = items[i];
        const bottom = items[i + 1];
        if (bottom) {
          columns.push({ type: 'split-top-large', items: [top, bottom] });
          i += 2;
        } else {
          columns.push({ type: 'tall', items: [top] });
          i += 1;
        }
      } else {
        columns.push({ type: 'tall', items: [items[i]] });
        i += 1;
      }
      colIndex++;
    }
    // Duplicate columns to allow for seamless infinite scrolling
    return [...columns, ...columns];
  };

  const columns = buildColumns();

  const GalleryImage = ({ item, className = '' }) => (
    <div 
      className={`relative overflow-hidden rounded-2xl group cursor-pointer ${className}`}
      onClick={() => setSelectedImage(item.image)}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-semibold text-sm tracking-wide">{item.title}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-14 md:py-20 relative overflow-hidden bg-white">

      {/* Decorative Dotted Grid Patterns */}
      <div className="absolute top-16 left-2 sm:left-6 opacity-30 pointer-events-none hidden sm:block z-0">
        <div className="grid grid-cols-4 gap-2.5">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 right-4 sm:right-8 opacity-30 pointer-events-none hidden sm:block z-0">
        <div className="grid grid-cols-4 gap-2.5">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header */}
        {data?.showHeading !== false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto"
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
        )}

        {/* Gallery Collage with Scroll */}
        <div 
          className="relative px-0 py-4 overflow-hidden w-full"
        >
          {/* Scrollable Container */}
          <motion.div
            className="flex gap-3 sm:gap-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {columns.map((col, colIdx) => {
              if (col.type === 'tall') {
                return (
                  <div key={colIdx} className="shrink-0 w-[160px] sm:w-[260px] lg:w-[300px]">
                    <GalleryImage 
                      item={col.items[0]} 
                      className="h-[280px] sm:h-[460px] lg:h-[520px]"
                    />
                  </div>
                );
              }

              if (col.type === 'split-top-small') {
                return (
                  <div key={colIdx} className="shrink-0 w-[160px] sm:w-[260px] lg:w-[300px] flex flex-col gap-3 sm:gap-4">
                    <GalleryImage 
                      item={col.items[0]} 
                      className="h-[110px] sm:h-[185px] lg:h-[210px]"
                    />
                    <GalleryImage 
                      item={col.items[1]} 
                      className="h-[158px] sm:h-[259px] lg:h-[294px]"
                    />
                  </div>
                );
              }

              if (col.type === 'split-top-large') {
                return (
                  <div key={colIdx} className="shrink-0 w-[160px] sm:w-[260px] lg:w-[300px] flex flex-col gap-3 sm:gap-4">
                    <GalleryImage 
                      item={col.items[0]} 
                      className="h-[168px] sm:h-[275px] lg:h-[310px]"
                    />
                    <GalleryImage 
                      item={col.items[1]} 
                      className="h-[100px] sm:h-[169px] lg:h-[194px]"
                    />
                  </div>
                );
              }

              return null;
            })}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 cursor-zoom-out"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer z-10"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Gallery Fullscreen"
              className="max-w-[95vw] max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default AlumniGallery;
