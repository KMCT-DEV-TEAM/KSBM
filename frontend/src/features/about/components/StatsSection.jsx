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
    return <span ref={ref}>{value}</span>;
  }

  return <span ref={ref}>0{match[2]}</span>;
};

const StatsSection = ({ previewData }) => {
  const [statsData, setStatsData] = useState({});
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setStatsData(previewData);
      if (previewData.stats) setStats(previewData.stats);
      return;
    }
    const fetchStats = async () => {
      try {
        const response = await api.get('/cms/about-us-stats', { hideLoader: true });
        if (response.data) {
          setStatsData(response.data);
          if (response.data.stats && response.data.stats.length > 0) {
            setStats(response.data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching Stats data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [previewData]);

  if (isLoading) return null;
  if (statsData?.showSection === false && !previewData) return null;
  if (stats.length === 0 && !previewData) return null;

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
        className="w-[98%] max-w-[1440px] bg-[#f4fafe] py-8 md:py-12 mx-auto px-2 sm:px-6 lg:px-8 rounded-xl shadow-sm"
      >
        <div className="flex flex-wrap md:flex-nowrap justify-center items-start gap-y-8 gap-x-2 md:gap-4 w-full">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
              className="flex flex-col items-center justify-start text-center w-[47%] sm:w-[45%] md:w-auto md:flex-1 px-1"
            >
              <span className="font-serif text-[#4e558e] mb-1 md:mb-2 text-3xl md:text-3xl lg:text-4xl">
                <Counter value={stat.value} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider md:tracking-widest text-gray-600 uppercase break-words w-full leading-tight">
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
