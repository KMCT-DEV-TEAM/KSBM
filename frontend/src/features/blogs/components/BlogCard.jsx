"use client";
import React from 'react';
import { motion } from 'framer-motion';

const BlogCard = ({ blog, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative flex flex-col cursor-pointer pb-2 pr-2"
      onClick={() => onClick?.(blog)}
    >
      {/* Image Banner Container (Aligned to the Left) */}
      <div className="relative w-[85%] sm:w-[84%] h-[230px] sm:h-[260px] mr-auto rounded-[24px] overflow-hidden shadow-sm shrink-0 z-0 transition-transform duration-500 group-hover:scale-[1.015]">
        <img
          src={blog?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
          alt={blog?.title || 'Blog cover'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Overlapping Content Box (Aligned to the Far Right) */}
      <div className="relative z-10 -mt-28 sm:-mt-28 ml-auto w-[88%] sm:w-[86%] bg-white rounded-[20px] p-6 sm:p-7 shadow-[0_15px_40px_rgba(23,28,70,0.08)] border border-gray-100/90 flex flex-col justify-between transition-all duration-300 group-hover:shadow-[0_20px_48px_rgba(23,28,70,0.14)] group-hover:-translate-y-1.5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span className="text-[11px] font-medium tracking-widest text-text-secondary uppercase">
              {blog?.category || 'GENERAL'}
            </span>
          </div>
          <h3 className="text-lg sm:text-[21px] font-bold text-primary leading-snug mb-3 duration-300 line-clamp-2">
            {blog?.title || 'Untitled Blog Article'}
          </h3>
          <p className="text-xs sm:text-[14px] text-text-secondary font-normal leading-relaxed line-clamp-3">
            {blog?.excerpt || 'Click to read more about this topic and discover expert academic insights.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
