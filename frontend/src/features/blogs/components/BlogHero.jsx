"use client";
import React from 'react';
import { motion } from 'framer-motion';

const BlogHero = ({ heroData, fullScreen = false }) => {
  const title = heroData?.title || 'Insights & Blogs';
  const subtitle = heroData?.subtitle || 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.';
  const backgroundImage = heroData?.backgroundImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className={`relative w-full ${fullScreen ? 'min-h-screen h-[100vh]' : 'min-h-[70vh] sm:min-h-[78vh] md:min-h-[82vh] lg:min-h-[86vh]'} flex items-end bg-[#1B2155] overflow-hidden pt-28 sm:pt-32 pb-24 sm:pb-32 lg:pb-36`}>
      {/* Background Image & Deep Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Analytics and Executive Discussion Backdrop"
          className="w-full h-full object-cover opacity-35 object-center scale-105 transform duration-1000"
        />
        <div className="absolute inset-0 bg-primary/50"></div>
        <div className="absolute inset-0 bg-primary/40"></div>
      </div>

      {/* Decorative Blur Spheres */}
      <div className="absolute -left-20 top-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Full Size Content Container */}
      <div className="relative z-10 w-[94%] max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-7 drop-shadow-md leading-tight">
            {title}
          </h1>
          <p className="text-[15px] text-white/80 leading-relaxed drop-shadow-sm max-w-2xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;
