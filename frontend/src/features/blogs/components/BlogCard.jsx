"use client";
import React from 'react';
import { motion } from 'framer-motion';

const BlogCard = ({ blog, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group flex flex-col cursor-pointer"
      onClick={() => onClick?.(blog)}
    >
      {/* Image Banner Container */}
      <div className="relative w-full h-[230px] sm:h-[255px] rounded-[24px] overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        <img
          src={blog?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
          alt={blog?.title || 'Blog cover'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Overlapping Content Box */}
      <div className="relative z-10 -mt-16 mx-4 sm:mx-6 bg-white rounded-[20px] p-6 sm:p-7 shadow-[0_12px_35px_rgba(23,28,70,0.07)] border border-gray-100/90 flex flex-col justify-between flex-1 transition-all duration-300 group-hover:shadow-[0_18px_45px_rgba(23,28,70,0.13)] group-hover:-translate-y-1.5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span className="text-[11px] font-extrabold tracking-widest text-gray-400 uppercase">
              {blog?.category || 'GENERAL'}
            </span>
            {blog?.readTime && (
              <span className="text-[11px] font-medium text-gray-400">
                {blog.readTime}
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-[21px] font-bold text-[#202658] leading-snug mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
            {blog?.title || 'Untitled Blog Article'}
          </h3>
          <p className="text-xs sm:text-[14px] text-gray-500 font-normal leading-relaxed line-clamp-3">
            {blog?.excerpt || 'Click to read more about this topic and discover expert academic insights.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
