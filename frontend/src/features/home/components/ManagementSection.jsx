import React, { useState } from 'react';
import { motion } from 'framer-motion';

const managementData = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    role: 'MANAGING DIRECTOR',
    verticalText: 'DIRECTOR',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Dr. Adrian Starlin',
    role: 'CHAIRMAN DIRECTOR',
    verticalText: 'CHAIRMAN',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Dr. Elena Rostova',
    role: 'EXECUTIVE DIRECTOR',
    verticalText: 'EXECUTIVE',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const ManagementSection = () => {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-xs md:text-sm tracking-[0.2em] uppercase mb-4"
          >
            OUR MANAGEMENT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2A2B6A] mb-6"
          >
            The Architects Of Excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base leading-relaxed"
          >
            Our leadership board combines decades of top-tier industry experience with a profound
            commitment to academic innovation.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {managementData.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image Container */}
              <div
                className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden mb-2 transition-transform duration-500 scale-100 group-hover:scale-95"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

                {/* Vertical Text with Lines */}
                <div className="absolute top-0 bottom-0 flex flex-col items-center pt-4 pb-8">
                  <div className="w-[1px] flex-grow bg-white/60"></div>
                  <div className="my-8">
                    <span className="inline-block -rotate-90 text-white text-[10px] md:text-xs tracking-[0.3em] uppercase whitespace-nowrap">
                      {member.verticalText}
                    </span>
                  </div>

                </div>
              </div>


              {/* Text Content */}
              <div
                className="px-2 transition-all duration-500 ease-in-out overflow-hidden max-h-0 opacity-0 mt-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4"
              >
                <h3 className="text-xl md:text-xl font-medium text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-[8px] font-sm md:text-xs tracking-[0.2em] uppercase">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;
