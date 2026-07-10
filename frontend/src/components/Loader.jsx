import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, theme = 'dark', text = 'Loading' }) => {
  const isDark = theme === 'dark';
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center"
    : "w-full min-h-[400px] flex items-center justify-center";

  const textColor = isDark ? "text-white" : "text-primary";
  const subtextColor = isDark ? "text-[#bce0f0]/70" : "text-primary/70";
  const spinnerBorder = isDark ? "border-white/10 border-t-[#bce0f0]" : "border-primary/10 border-t-primary";
  const innerPulse = isDark ? "bg-white/5" : "bg-primary/5";

  return (
    <div className={containerClasses}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-20 h-20">
          <div className={`absolute inset-0 rounded-full border-[3px] ${spinnerBorder} animate-spin`}></div>
          <div className={`absolute inset-2 rounded-full ${innerPulse} animate-pulse`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${textColor} font-serif font-bold text-2xl tracking-tighter`}>K</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className={`${textColor} text-lg font-semibold tracking-widest uppercase`}>KSBM</h2>
          <p className={`${subtextColor} text-xs tracking-[0.3em] uppercase animate-pulse`}>{text}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;
