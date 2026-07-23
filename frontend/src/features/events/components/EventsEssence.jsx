"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventsEssence = ({ essenceOfCulture, activeTab, setActiveTab }) => {
  const essenceCategories = ['All', ...new Set(essenceOfCulture.items.map(i => i.category).filter(Boolean))];
  const filteredEssence = activeTab === 'All' ? essenceOfCulture.items : essenceOfCulture.items.filter(i => i.category === activeTab);

  return (
    <section className="w-full py-20 px-6 relative">
      <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-widest text-pink-500 mb-12">
        {essenceOfCulture.heading}
      </h2>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {essenceCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === cat
                    ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]'
                    : 'bg-transparent border-pink-500/30 text-gray-400 hover:border-pink-500/60 hover:text-pink-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredEssence.map((item, idx) => (
                <motion.div
                  key={item.img + idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl overflow-hidden border border-white/10 ${idx % 3 === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                >
                  <img src={item.img} alt={item.category} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex justify-center items-center">
           <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-2 border-pink-500/20 shadow-[0_0_40px_rgba(219,39,119,0.15)] hidden lg:block">
             <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop" alt="Singer" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default EventsEssence;
