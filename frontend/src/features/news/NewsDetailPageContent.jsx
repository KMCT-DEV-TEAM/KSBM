"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewsDetailPageContent({ id }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsArticle = async () => {
      try {
        const { data } = await api.get('/cms/news');
        if (data) {
          const combinedArticles = [];
          if (data.featuredArticle) combinedArticles.push(data.featuredArticle);
          if (data.sideArticles) combinedArticles.push(...data.sideArticles);
          
          // Try finding by _id first, then fallback to finding by title encoded as URI, or just index
          let foundArticle = combinedArticles.find(a => a._id === id || a.title === decodeURIComponent(id) || a.id === id);
          
          // If id is a number index
          if (!foundArticle && !isNaN(parseInt(id))) {
             foundArticle = combinedArticles[parseInt(id)];
          }

          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            // Not found
            router.push('/news');
          }
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchNewsArticle();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f4f7f9] py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <section className="w-full bg-[#f4f7f9] py-20 lg:py-28 min-h-screen">
      <div className="w-[98%] max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
        >
          <div className="w-full h-64 sm:h-80 md:h-[400px] shrink-0 relative bg-gray-100">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 left-0 w-full p-6 sm:p-10">
              {article.tag && (
                <span className="bg-primary/90 text-white text-[0.65rem] sm:text-xs font-semibold tracking-wider px-3 py-1 rounded-sm w-max mb-3 uppercase inline-block">
                  {article.tag}
                </span>
              )}
              {article.date && (
                <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide uppercase shadow-sm">
                  {article.date}
                </p>
              )}
            </div>
          </div>
          
          <div className="p-6 sm:p-10 flex flex-col">
            <div className="flex flex-col md:hidden mb-4">
              {article.tag && (
                <span className="bg-primary/10 text-primary text-[0.65rem] sm:text-xs font-semibold tracking-wider px-2 py-1 rounded-sm w-max mb-2 uppercase inline-block">
                  {article.tag}
                </span>
              )}
              {article.date && (
                <p className="text-text-secondary text-xs sm:text-sm font-medium tracking-wide uppercase shadow-sm">
                  {article.date}
                </p>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8 leading-tight">
              {article.title}
            </h1>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
              {article.description}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
