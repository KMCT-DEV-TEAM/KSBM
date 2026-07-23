"use client";
import React from 'react';

const Loader = ({ fullScreen = false, transparent = false }) => {
  const containerClasses = fullScreen
    ? `fixed inset-0 z-[9999] flex flex-col items-center justify-center ${transparent ? 'bg-transparent' : 'bg-slate-900'}`
    : `w-full min-h-[400px] flex flex-col items-center justify-center ${transparent ? 'bg-transparent' : 'bg-slate-900 rounded-xl'}`;

  const textColorClass = transparent ? "text-primary" : "text-white";
  const imageFilterClass = transparent ? "brightness-0" : ""; // Makes it dark if on light background

  return (
    <div className={containerClasses}>
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <img
          src="/assets/Images/Home/watermark_logo1.png"
          alt="Loading..."
          className={`w-full h-full object-contain will-change-transform ${imageFilterClass}`}
          style={{ animation: 'spin 6s linear infinite' }}
        />
      </div>
      <p className={`${textColorClass} font-bold tracking-widest uppercase text-sm animate-pulse`}>
        KSBM LOADING..
      </p>
    </div>
  );
};

export default Loader;

