"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function NewsPageContent() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({ subheading: '', heading: '' });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get('/cms/news');
        if (data) {
          const combinedArticles = [];
          if (data.featuredArticle) combinedArticles.push(data.featuredArticle);
          if (data.sideArticles) combinedArticles.push(...data.sideArticles);
          
          setArticles(combinedArticles);
          setSettings({ subheading: data.subheading, heading: data.heading });
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] bg-[#f4f7f9] py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f4f7f9] py-20 lg:py-28">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-text-secondary text-[0.65rem] lg:text-xs tracking-[0.25em] uppercase mb-4"
          >
            {settings.subheading || 'News and Events'}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-semibold text-primary mb-6"
          >
            {settings.heading || 'Latest From KSBM'}
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full mx-auto">
          {articles.map((item, index) => (
            <motion.div
              key={item.id || item._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="w-full h-[200px] md:h-[240px] rounded-[1rem] overflow-hidden mb-4 relative">
                <img
                  src={item.image || 'https://via.placeholder.com/300x200'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              
              <div className="px-2 flex flex-col flex-1">
                {/* Meta Info */}
                <div className="flex justify-between items-center mb-3">
                  {item.tag && (
                    <span className="bg-primary/10 text-primary text-[0.65rem] font-semibold tracking-wider px-2 py-1 rounded-sm uppercase">
                      {item.tag}
                    </span>
                  )}
                  {item.date && (
                    <p className="text-text-secondary text-xs font-medium uppercase">
                      {item.date}
                    </p>
                  )}
                </div>
                
                {/* Title */}
                <h3 className="text-lg lg:text-xl font-semibold text-text-primary mb-2 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>
                
                {/* Description */}
                {item.description && (
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
