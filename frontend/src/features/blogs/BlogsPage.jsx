"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogHero from './components/BlogHero';
import BlogFilter from './components/BlogFilter';
import BlogGrid from './components/BlogGrid';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const BlogsPage = () => {
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsPageData = async () => {
      try {
        const { data } = await api.get('/cms/blogs-page');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching blogs page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogsPageData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-pink-500 selection:text-white">
      <Header />

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

      <Footer />
    </div>
  );
};

export default BlogsPage;
