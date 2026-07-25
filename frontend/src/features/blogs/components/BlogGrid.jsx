"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import BlogCard from './BlogCard';

const BlogGrid = ({ blogs = [], activeTopic = 'All Topics', onResetFilter }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedBlogs = blogs.slice(0, visibleCount);
  const hasMore = visibleCount < blogs.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <section className="flex-1 w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTopic}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 sm:gap-y-16"
        >
          {displayedBlogs.map((blog, index) => (
            <BlogCard key={blog.id || index} blog={blog} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {blogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400 font-bold text-2xl">
            ?
          </div>
          <p className="text-lg font-semibold text-[#202658] mb-2">No Insights Found</p>
          <p className="text-sm text-gray-500 mb-6">
            We currently do not have articles published under the "{activeTopic}" filter category.
          </p>
          <button
            onClick={() => {
              onResetFilter?.('All Topics');
              setVisibleCount(6);
            }}
            className="px-6 py-2.5 bg-[#2B3175] text-white font-semibold rounded-lg text-xs sm:text-sm shadow-md hover:bg-[#21265C] transition-all"
          >
            View All Topics
          </button>
        </motion.div>
      )}

      {/* Load More Insights Button */}
      {hasMore && (
        <div className="flex justify-center mt-14 sm:mt-20">
          <button
            onClick={handleLoadMore}
            className="bg-[#2B3175] hover:bg-[#21265C] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold shadow-[0_12px_28px_rgba(43,49,117,0.28)] transition-all duration-300 hover:shadow-[0_16px_35px_rgba(43,49,117,0.38)] hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer group"
          >
            <span>Load More Insights</span>
            <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogGrid;
