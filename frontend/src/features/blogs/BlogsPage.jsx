"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogHero from './components/BlogHero';
import BlogFilter from './components/BlogFilter';
import BlogGrid from './components/BlogGrid';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';
import Loader from '../../components/Loader';

const BlogsPage = () => {
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isPreview) {
        setIsLoaded(true);
        return;
      }
      const handleLoad = () => {
        setTimeout(() => setIsLoaded(true), 400);
      };
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        const fallback = setTimeout(handleLoad, 3000);
        return () => {
          window.removeEventListener('load', handleLoad);
          clearTimeout(fallback);
        };
      }
    }
  }, [loading, isPreview]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-blogs-data') {
        setIsPreview(true);
        setPageData(event.data.payload);
        setLoading(false);
        
        // Auto-scroll to the correct section based on activeTab
        setTimeout(() => {
          if (event.data.payload.activeTab === 'blogs') {
            document.getElementById('blogs-grid')?.scrollIntoView({ behavior: 'smooth' });
          } else if (event.data.payload.activeTab === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 300);
      }
    };

    window.addEventListener('message', handleMessage);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'iframe-ready', source: 'blogs' }, '*');
    }

    const fetchBlogsPageData = async () => {
      if (isPreview) return;
      try {
        const { data } = await api.get('/cms/blogs-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching blogs page data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if not already in preview mode via early message
    const timer = setTimeout(() => {
      if (!isPreview) fetchBlogsPageData();
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [isPreview]);

  const heroData = pageData?.hero || {
    title: 'Insights & Blogs',
    subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
    backgroundImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop'
  };

  const allBlogs = pageData?.blogs || [];

  const filteredBlogs = useMemo(() => {
    if (activeTopic === 'All Topics') return allBlogs;
    return allBlogs.filter(
      blog => blog.filterCategory === activeTopic || blog.category.toLowerCase() === activeTopic.toLowerCase()
    );
  }, [activeTopic, allBlogs]);

  return (
    <>
      {!isPreview && (
        <div 
          className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Loader fullScreen={false} />
        </div>
      )}
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-pink-500 selection:text-white">
        {!isPreview && <Header />}

      {/* Full Size Hero Section */}
      <BlogHero heroData={heroData} />

      {/* Floating Category Topic Filters */}
      <BlogFilter
        activeTopic={activeTopic}
        onTopicChange={(newTopic) => setActiveTopic(newTopic)}
      />

      {/* Main Blog Cards Grid & Pagination */}
      <BlogGrid
        blogs={filteredBlogs}
        activeTopic={activeTopic}
        onResetFilter={(topic) => setActiveTopic(topic)}
      />
      {!isPreview && <Footer />}
    </div>
    </>
  );
};

export default BlogsPage;
