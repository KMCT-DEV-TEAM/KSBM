"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';

const ManagementSection = ({ previewData }) => {
  const [settings, setSettings] = useState({
    subheading: 'OUR MANAGEMENT',
    heading: 'The Architects Of Excellence',
    description: 'Our leadership board combines decades of top-tier industry experience with a profound commitment to academic innovation.',
    members: []
  });

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
    } else {
      const fetchSettings = async () => {
        try {
          const { data } = await api.get('/cms/management');
          if (data) {
            setSettings({
              subheading: data.subheading || 'OUR MANAGEMENT',
              heading: data.heading || 'The Architects Of Excellence',
              description: data.description || 'Our leadership board combines decades of top-tier industry experience with a profound commitment to academic innovation.',
              members: data.members || []
            });
          }
        } catch (error) {
          console.error('Error fetching management settings:', error);
        }
      };
      fetchSettings();
    }
  }, [previewData]);

  const { subheading, heading, description, members } = settings;

  return (
    <section className="w-full bg-white py-20 lg:py-32 relative z-10">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section (Centered) */}
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-gray-500 text-xs md:text-sm tracking-[0.2em] uppercase mb-4"
          >
            {subheading}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2A2B6A] mb-6 leading-tight"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        {/* Cards Grid (Centered, 3 in a row, middle card bigger) */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
          {members.map((member, index) => {
            // Check if it's the center card (assuming exactly 3 members)
            const isCenter = index === 1;
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                key={member.id || member._id}
                className={`relative aspect-[4/5] w-full max-w-[320px] ${isCenter ? 'lg:max-w-[380px] lg:scale-110 z-20' : 'lg:max-w-[320px] z-10'} rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl hover:shadow-[0_25px_50px_rgba(27,37,89,0.4)] transition-all duration-500 hover:-translate-y-4`}
              >
                {/* Background Image */}
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Vertical Text (Left Edge) */}
                {member.verticalText && (
                  <div className={`absolute top-12 left-4 lg:left-6 flex flex-col items-center gap-4 z-20`}>
                    <div className="w-[1px] h-12 bg-white/40"></div>
                    <span
                      className="text-white/80 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {member.verticalText}
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Text Content */}
                <div className={`absolute bottom-0 left-0 w-full z-20 p-5 lg:p-6`}>
                  {member.name && (
                    <h3 className={`font-bold text-white mb-1 lg:mb-2 group-hover:text-white transition-colors duration-300 ${isCenter ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'}`}>
                      {member.name}
                    </h3>
                  )}
                  {member.role && (
                    <p className={`text-gray-200 leading-relaxed max-w-[100%] group-hover:text-gray-100 transition-colors duration-300 text-[10px] tracking-[0.15em] uppercase`}>
                      {member.role}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

export default ManagementSection;

