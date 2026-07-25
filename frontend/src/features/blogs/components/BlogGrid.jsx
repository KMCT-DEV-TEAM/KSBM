"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogCard from './BlogCard';

const BlogGrid = ({ blogs = [], activeTopic = 'All Topics', onResetFilter }) => {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedBlogs = blogs.slice(0, visibleCount);
  const hasMore = visibleCount < blogs.length;

  const handleToggleLoad = () => {
    if (hasMore) {
      setVisibleCount(prev => prev + 3);
    } else {
      setVisibleCount(6);
    }
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
            <BlogCard 
              key={blog._id || blog.id || index} 
              blog={blog} 
              index={index} 
              onClick={() => router.push(`/blogs/${blog._id || blog.id}`)}
            />
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
            className="px-6 py-2.5 bg-[#2B3175] text-white font-semibold rounded-lg text-xs sm:text-sm shadow-md hover:bg-[#21265C] transition-all cursor-pointer"
          >
            View All Topics
          </button>
        </motion.div>
      )}

      {/* Load More / Load Less Insights Text Link - Visible only when total items exceed initial 6 */}
      {blogs.length > 6 && (
        <div className="w-full flex justify-center mt-12 sm:mt-16">
          <button
            onClick={handleToggleLoad}
            className="group flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <span>{hasMore ? 'Load More Insights' : 'Load Less Insights'}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${
                hasMore
                  ? 'group-hover:translate-x-1'
                  : 'rotate-180 group-hover:-translate-x-1'
              }`}
            />
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogGrid;
