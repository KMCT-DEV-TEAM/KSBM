"use client";
import React from 'react';
import { motion } from 'framer-motion';

const defaultTopics = [
  'All Topics',
  'Career Advice',
  'Industry Trends',
  'Skill Development',
  'Student Success',
];

const BlogFilter = ({ activeTopic = 'All Topics', onTopicChange, topics = defaultTopics }) => {
  return (
    <div className="relative z-20 -mt-8 sm:-mt-9 px-4 flex justify-center mb-10 sm:mb-14">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-[0_15px_35px_rgba(20,25,65,0.09)] border border-gray-100/90 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 lg:gap-6"
      >
        {topics.map((topic) => {
          const isActive = activeTopic === topic;
          return (
            <button
              key={topic}
              onClick={() => onTopicChange?.(topic)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#2B3175] text-white shadow-md shadow-[#2B3175]/30 -translate-y-0.5'
                  : 'text-gray-600 hover:text-[#2B3175] hover:bg-gray-50/90'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BlogFilter;
