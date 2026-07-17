"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import api from '../../../api/axios';

const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  useEffect(() => {
    const strValue = String(value);
    const match = strValue.match(/^(\d+)(.*)$/);
    
    if (isInView && match && ref.current) {
      const numericValue = parseInt(match[1], 10);
      const suffix = match[2];
      
      const controls = animate(0, numericValue, {
        duration: 3,
        ease: "easeOut",
        onUpdate(val) {
          if (ref.current) {
            ref.current.textContent = Math.round(val) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  const strValue = String(value);
  const match = strValue.match(/^(\d+)(.*)$/);
  
  if (!match) {
    return <span>{value}</span>;
  }

  return <span ref={ref}>0{match[2]}</span>;
};

const StatsSection = () => {
  const [stats, setStats] = useState([
    { value: '16+', label: 'YEARS OF EXCELLENCE' },
    { value: '991+', label: 'ACTIVE STUDENTS' },
    { value: '196+', label: 'GLOBAL RECRUITERS' },
    { value: '196+', label: 'GLOBAL RECRUITERS' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/cms/about-us-stats');
        if (response.data && response.data.stats && response.data.stats.length > 0) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching Stats data:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="w-full pb-10">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              staggerChildren: 0.1,
            }
          }
        }}
        className="w-[98%] max-w-[1440px] bg-[#f4fafe] py-12 mx-auto px-4 sm:px-6 lg:px-8 rounded-xl shadow-sm"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 w-full">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
              className="flex flex-col items-center justify-center text-center px-2"
            >
              <span className="font-serif text-[#4e558e] mb-2 text-3xl md:text-4xl lg:text-5xl">
                <Counter value={stat.value} />
              </span>
              <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
