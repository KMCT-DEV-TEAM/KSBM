"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';

const NewsSection = ({ previewData }) => {
  const [data, setData] = useState({
    subheading: 'News and Events',
    heading: 'Latest From KSBM',
    featuredArticle: null,
    sideArticles: [],
    showSubheading: true,
    showHeading: true,
    showSection: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      const fetchNews = async () => {
        try {
          const response = await api.get('/cms/news');
          if (response.data) {
            setData(response.data);
          }
        } catch (error) {
          console.error("Error fetching News section data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNews();
    }
  }, [previewData]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#f4f7f9] py-10 lg:py-12 animate-pulse">
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-5xl mx-auto">
            <div className="w-full lg:w-[55%] h-[400px] bg-gray-300 rounded-[1.5rem]"></div>
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-5 items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-300 rounded-[1rem] shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                    <div className="h-5 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { subheading, heading, featuredArticle, sideArticles, showSubheading, showHeading, showSection } = data;

  if (!showSection && !previewData) {
    return null;
  }

  return (
    <section className="w-full bg-[#f4f7f9] py-10 lg:py-12">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        {(showSubheading || showHeading) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 lg:mb-12"
          >
            {showSubheading && (
              <p className="text-text-secondary text-[0.65rem] lg:text-xs tracking-[0.25em] uppercase mb-3">
                {subheading}
              </p>
            )}
            {showHeading && (
              <h2 className="text-3xl lg:text-[2.75rem] font-semibold text-primary">
                {heading}
              </h2>
            )}
          </motion.div>
        )}

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-5xl mx-auto">

          {/* Left Column: Featured Article */}
          {featuredArticle && featuredArticle.image && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-[55%] group cursor-pointer"
            >
              {/* Image Wrapper */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 lg:mb-0 shadow-sm">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end">
                  {featuredArticle.tag && (
                    <span className="bg-primary/90 text-white text-[0.65rem] font-semibold tracking-wider px-3 py-1 rounded-sm w-max mb-4 uppercase">
                      {featuredArticle.tag}
                    </span>
                  )}
                  {featuredArticle.date && (
                    <p className="text-white/80 text-xs font-medium tracking-wide mb-2 uppercase">
                      {featuredArticle.date}
                    </p>
                  )}
                  {featuredArticle.title && (
                    <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3 group-hover:text-gray-200 transition-colors">
                      {featuredArticle.title}
                    </h3>
                  )}
                  {featuredArticle.description && (
                    <p className="text-white/70 text-sm line-clamp-2 md:line-clamp-3">
                      {featuredArticle.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Column: Side Articles */}
          {sideArticles && sideArticles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full lg:w-[45%] flex flex-col gap-6 lg:gap-0 lg:justify-between py-2"
            >
              {sideArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex gap-5 items-center group cursor-pointer rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 lg:-ml-3 lg:w-[calc(100%+1.5rem)] w-full"
                >
                  {/* Small Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1rem] overflow-hidden shrink-0 shadow-sm relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 py-1 pr-2">
                    {article.date && (
                      <p className="text-text-secondary text-[0.65rem] sm:text-xs font-medium tracking-wider mb-2 uppercase">
                        {article.date}
                      </p>
                    )}
                    {article.title && (
                      <h4 className="text-base sm:text-lg font-bold text-primary leading-snug group-hover:text-[#1e2869] transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default NewsSection;
