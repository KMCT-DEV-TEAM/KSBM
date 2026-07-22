"use client";
import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center"
    : "w-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900 rounded-xl";

  const logoFilter = "brightness-1 invert contrast-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"; // Maximum brightness with a glowing effect

  return (
    <div className={containerClasses}>
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <img
          src="/assets/Images/Home/watermark_logo1.png"
          alt="Loading..."
          className={`w-full h-full object-contain will-change-transform`}
          style={{ animation: 'spin 6s linear infinite' }}
        />
      </div>
      <p className="text-white font-bold tracking-widest uppercase text-sm animate-pulse">
        KSBM LOADING..
      </p>
    </div>
  );
};

export default Loader;

