"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function AchievementsPageContent() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({ subheading: '', heading: '' });

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data } = await api.get('/cms/achievements');
        if (data) {
          setAchievements(data.achievements || []);
          setSettings({ subheading: data.subheading, heading: data.heading });
        }
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] bg-background py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-background py-20 lg:py-28">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            {settings.subheading || 'College Achievements'}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {settings.heading || 'Awards and Achievements'}
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full mx-auto">
          {achievements.map((item, index) => (
            <motion.div
              key={item.id || item._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-[240px] md:h-[280px] lg:h-[300px] rounded-[1.5rem] overflow-hidden mb-6 shadow-sm relative group-hover:shadow-md transition-shadow duration-500">
                <img
                  src={item.image || 'https://via.placeholder.com/300x200'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Date Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 flex flex-col justify-end">
                  <p className="text-white/90 text-xs font-medium tracking-wide uppercase">
                    {item.date}
                  </p>
                </div>
              </div>
              {/* Meta Info (Category) */}
              <p className="text-[0.65rem] font-semibold text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
                {item.category}
              </p>
              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
