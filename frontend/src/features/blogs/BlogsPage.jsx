"use client";
import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogHero from './components/BlogHero';
import BlogFilter from './components/BlogFilter';
import BlogGrid from './components/BlogGrid';

const initialBlogs = [
  {
    id: 1,
    category: 'LEADERSHIP',
    filterCategory: 'All Topics',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'July 2026'
  },
  {
    id: 2,
    category: 'LEADERSHIP',
    filterCategory: 'Industry Trends',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    date: 'July 2026'
  },
  {
    id: 3,
    category: 'LEADERSHIP',
    filterCategory: 'Career Advice',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    readTime: '4 min read',
    date: 'June 2026'
  },
  {
    id: 4,
    category: 'LEADERSHIP',
    filterCategory: 'Skill Development',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'June 2026'
  },
  {
    id: 5,
    category: 'LEADERSHIP',
    filterCategory: 'Student Success',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'May 2026'
  },
  {
    id: 6,
    category: 'LEADERSHIP',
    filterCategory: 'Industry Trends',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    readTime: '7 min read',
    date: 'May 2026'
  },
  {
    id: 7,
    category: 'LEADERSHIP',
    filterCategory: 'Career Advice',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    readTime: '4 min read',
    date: 'April 2026'
  },
  {
    id: 8,
    category: 'LEADERSHIP',
    filterCategory: 'Skill Development',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    date: 'April 2026'
  },
  {
    id: 9,
    category: 'LEADERSHIP',
    filterCategory: 'Student Success',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'March 2026'
  },
];

const BlogsPage = ({ pageData }) => {
  const [activeTopic, setActiveTopic] = useState('All Topics');

  const heroData = pageData?.hero || {
    title: 'Insights & Blogs',
    subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
    backgroundImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop'
  };

  const allBlogs = pageData?.blogs || initialBlogs;

  const filteredBlogs = useMemo(() => {
    if (activeTopic === 'All Topics') return allBlogs;
    return allBlogs.filter(
      blog => blog.filterCategory === activeTopic || blog.category.toLowerCase() === activeTopic.toLowerCase()
    );
  }, [activeTopic, allBlogs]);

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
