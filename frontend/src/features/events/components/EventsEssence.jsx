"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventsEssence = ({ essenceOfCulture }) => {
  const [selectedDetail, setSelectedDetail] = useState('Music');

  const displayItems = [
    { category: 'Music', img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop' },
    { category: 'Dance', img: 'https://images.unsplash.com/photo-1540039155732-6761b3464195?q=80&w=800&auto=format&fit=crop' },
    { category: 'Fine Arts', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop' },
    { category: 'Drama', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop' },
    { category: 'Litrecy', img: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop' }
  ];

  const getMockPrograms = (category) => {
    if (category.toLowerCase() === 'music') {
      return [
        'Solo Light Music', 'Solo Singing Classical', 'Solo Singing Western',
        'Group Song Malayalam', 'Group Song Western', 'Naadan Pattu',
        'Recitation - Malayalam', 'Recitation - English', 'Recitation - Hindi'
      ];
    }
    return [
      `Solo ${category} 1`, `Solo ${category} 2`, `Group ${category}`,
      `Contemporary ${category}`, `Classical ${category}`, `Folk ${category}`,
      `${category} Workshop`, `${category} Battle`, `Special Performance`
    ];
  };

  return (
    <section className="w-full  px-6 relative">
      <div className="flex flex-col items-center mb-12">
        <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
          style={{
            background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Events</h5>
        <h2 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest text-[#ffccf0] drop-shadow-[0_0_15px_rgba(219,39,119,0.8)]">
          {essenceOfCulture.heading}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">

        {/* Center Floating Decorative Image (image 112) */}
        <div className="absolute bottom-35 left-[50%] lg:left-[50%] xl:left-[50%] transform -translate-x-1/2 pointer-events-none z-0 hidden md:block">
          <img src="/assets/Images/image 112.png" alt="Decoration" className="w-64 lg:w-80 xl:w-[450px] h-auto object-contain opacity-90" />
        </div>

        {/* Secondary Musical Decor (image 117) */}
        <div className="absolute bottom-44 left-[60%] lg:left-[60%] xl:left-[60%] transform -translate-x-1/2 pointer-events-none z-0 hidden md:block">
          <img src="/assets/Images/image 117.png" alt="Decoration" className="w-8 lg:w-18 h-auto object-contain opacity-60" />
        </div>

        {/* Thumbnails Column */}
        <div className="flex flex-col gap-4 w-full md:w-[250px] lg:w-[350px] shrink-0 pl-6 z-10">
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, idx) => (
              <div key={item.img + idx} className="relative w-full">
                {/* Active State Indicator Line (OUTSIDE THE IMAGE) */}
                {selectedDetail === item.category && (
                  <motion.div
                    layoutId="activeThumbnailIndicator"
                    className="absolute -left-3 top-0 w-1.5 md:w-2 h-full z-10"
                    style={{ background: "linear-gradient(to bottom, #C837AB 0%, #FFDD55 40%, #FF543E 100%)" }}
                  />
                )}
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  onClick={() => setSelectedDetail(item.category)}
                  className={`relative w-full h-[120px] md:h-[180px] shrink-0 rounded-[10px] overflow-hidden shadow-[0_0_15px_rgba(219,39,119,0.1)] cursor-pointer group border-2 transition-colors duration-300 border-transparent hover:border-pink-500/50`}
                >
                  <img src={item.img} alt={item.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-3 left-4 pointer-events-none z-10">
                    <h3 className={`text-sm md:text-base font-semibold uppercase tracking-wider ${selectedDetail === item.category ? 'text-pink-400' : 'text-white'}`}>{item.category}</h3>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Details Column */}
        <div className="flex-1 flex flex-col justify-start text-white pt-0 px-6 md:px-8 pb-6 md:pb-8 relative">

          {/* Light Background Radial Glow/Shade */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-[-1] pointer-events-none opacity-15 blur-[80px]"
            style={{ backgroundImage: 'radial-gradient(circle at center, #C837AB 0%, rgba(115, 115, 115, 0) 70%)' }}
          ></div>

          {/* Decorative Polygon */}
          <div className="absolute right-0 top-12 md:top-24 pointer-events-none hidden md:block opacity-80">
            <img src="/assets/Images/Polygon 7.png" alt="" className="w-16 md:w-24 lg:w-32 object-contain" />
          </div>

          <motion.div
            key={selectedDetail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Heading Row */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl md:text-3xl font-bold uppercase tracking-widest whitespace-nowrap leading-none">
                <span style={{
                  background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{selectedDetail}</span>{' '}
                <span style={{
                  background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  STAGE
                </span>
              </h3>
              <div className="flex-1 h-[1px] bg-pink-500/30"></div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-sm leading-loose mb-10">
              Feel the rhythm, embrace the energy, and immerse yourself in the electrifying world of {selectedDetail.toLowerCase()} at Kaleido. From soulful melodies and classical performances to high-energy bands, fusion acts, and live concerts, the {selectedDetail} Stage brings together talented performers who create unforgettable moments through every note. Whether you're performing under the spotlight or cheering from the crowd, experience the power of {selectedDetail.toLowerCase()} as it unites voices, ignites emotions, and transforms the festival into a celebration of harmony, passion, and creativity. Join us for performances that resonate long after the final encore.
            </p>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {getMockPrograms(selectedDetail).map((prog, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 hover:bg-[#3A1D25] border border-pink-500/20 rounded-[10px] px-4 py-3 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-pink-500 rotate-45 shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                  <span className="text-gray-300 text-xs md:text-xs font-medium tracking-wide">{prog}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured Image (Under Details) */}
          <div className="-mt-25 flex justify-end w-full">
            <img src="/assets/Images/image 110.png" alt="Featured Event" className="max-w-[350px] lg:max-w-[500px] w-full h-auto object-contain" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsEssence;
