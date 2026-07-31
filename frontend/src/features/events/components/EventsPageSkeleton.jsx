"use client";
import React from 'react';

/* Shimmer styles injected once */
const shimmerStyle = `
  @keyframes skeletonShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .sk-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(200,55,171,0.12) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: skeletonShimmer 1.8s ease-in-out infinite;
    border-radius: 8px;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('sk-shimmer-style')) {
  const tag = document.createElement('style');
  tag.id = 'sk-shimmer-style';
  tag.textContent = shimmerStyle;
  document.head.appendChild(tag);
}

const S = ({ className = '', style = {} }) => (
  <div className={`sk-shimmer ${className}`} style={style} />
);

/* ─── HERO ─── */
export const HeroSkeleton = () => (
  <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-[#050505]">
    <div className="absolute left-[-10%] bottom-0 translate-y-[35%] w-64 sm:w-80 md:w-96 lg:w-[32rem] aspect-square z-20 pointer-events-none opacity-10">
      <S className="w-full h-full" style={{ borderRadius: '50%' }} />
    </div>
    <div className="absolute inset-0 z-0 flex items-center justify-center pt-10">
      <S className="w-[55%] max-w-3xl opacity-25" style={{ height: '60vh', borderRadius: '24px' }} />
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col gap-3 pr-2" style={{ width: '256px', height: '480px' }}>
      {[0, 1, 2].map(i => <S key={i} className="flex-1 opacity-30" style={{ borderRadius: '12px' }} />)}
    </div>
  </section>
);

/* ─── ABOUT ─── */
export const AboutSkeleton = () => (
  <section className="relative w-full px-6 md:px-12 lg:px-24 py-16 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <S className="w-full max-w-lg mx-auto" style={{ height: '420px', borderRadius: '16px' }} />
      <div className="flex flex-col gap-4">
        <S style={{ height: '16px', width: '96px' }} />
        <S style={{ height: '40px', width: '80%' }} />
        {[100, 90, 95, 80, 85, 70].map((w, i) => <S key={i} style={{ height: '14px', width: `${w}%` }} />)}
        <div style={{ height: '12px' }} />
        {[100, 88, 92, 78].map((w, i) => <S key={i} style={{ height: '14px', width: `${w}%` }} />)}
        <div className="flex gap-4 mt-4">
          <S style={{ height: '44px', width: '160px' }} />
          <S style={{ height: '44px', width: '176px' }} />
        </div>
      </div>
    </div>
  </section>
);

/* ─── UPCOMING EVENTS ─── */
export const UpcomingSkeleton = () => (
  <section className="w-full px-6 relative py-12">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-14 gap-3">
        <S style={{ height: '16px', width: '96px' }} />
        <S style={{ height: '36px', width: '256px' }} />
      </div>
      <div className="space-y-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="relative flex flex-col md:flex-row bg-[#0d0d0d] rounded-[2rem] overflow-hidden border border-white/5 p-4 md:p-5 gap-6 md:gap-8">
            <S className="shrink-0" style={{ width: '35%', height: '192px', borderRadius: '16px' }} />
            <div className="flex-1 flex flex-col justify-center gap-3 pr-28">
              <S style={{ height: '24px', width: '192px' }} />
              <S style={{ height: '14px', width: '100%' }} />
              <S style={{ height: '14px', width: '83%' }} />
              <S style={{ height: '14px', width: '66%' }} />
            </div>
            <div className="absolute top-0 right-6 overflow-hidden" style={{ width: '85px', height: '115px', borderRadius: '0 0 20px 20px' }}>
              <S className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── CAROUSEL (HIGHLIGHTED PROGRAMS) ─── */
export const CarouselSkeleton = () => (
  <section className="w-full py-24 overflow-hidden relative bg-black/90">
    <div className="flex flex-col items-center mb-16 gap-3">
      <S style={{ height: '16px', width: '96px' }} />
      <S style={{ height: '36px', width: '288px' }} />
    </div>
    <div className="relative w-full flex items-center justify-center gap-6 overflow-hidden" style={{ height: '520px' }}>
      <S style={{ width: '300px', height: '100%', opacity: 0.3 }} />
      <S style={{ width: '300px', height: '100%', opacity: 0.7 }} />
      <S style={{ width: '300px', height: '100%', opacity: 0.3 }} />
    </div>
  </section>
);

/* ─── ESSENCE OF CULTURE ─── */
export const EssenceSkeleton = () => (
  <section className="w-full px-6 relative py-10">
    <div className="flex flex-col items-center mb-12 gap-3">
      <S style={{ height: '16px', width: '80px' }} />
      <S style={{ height: '36px', width: '256px' }} />
    </div>
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col gap-4 shrink-0 pl-6" style={{ width: '350px' }}>
        {[0, 1, 2, 3, 4].map(i => <S key={i} style={{ height: '220px', width: '100%' }} />)}
      </div>
      <div className="flex-1 flex flex-col gap-4 px-8">
        <S style={{ height: '32px', width: '192px' }} />
        <S style={{ height: '1px', width: '100%', opacity: 0.3 }} />
        {[100, 92, 88, 95, 80, 85].map((w, i) => <S key={i} style={{ height: '14px', width: `${w}%` }} />)}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => <S key={i} style={{ height: '48px' }} />)}
        </div>
      </div>
    </div>
  </section>
);

/* ─── STAY CONNECTED ─── */
export const StayConnectedSkeleton = () => (
  <section className="w-full pt-20 pb-0 px-6 overflow-hidden relative bg-black">
    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
      <div className="flex-1 w-full flex flex-col gap-4 px-4 lg:px-0">
        <S style={{ height: '16px', width: '112px' }} />
        <S style={{ height: '40px', width: '256px' }} />
        {[100, 90, 95, 82, 75].map((w, i) => <S key={i} style={{ height: '14px', width: `${w}%` }} />)}
      </div>
      <div className="flex-1 w-full flex flex-col items-center gap-6">
        <div className="relative w-full max-w-[500px] mx-auto flex items-center justify-center gap-4" style={{ height: '440px' }}>
          <S style={{ width: '240px', height: '100%', opacity: 0.4, borderRadius: '16px' }} />
          <S style={{ width: '320px', height: '100%', opacity: 0.8, borderRadius: '16px' }} />
          <S style={{ width: '240px', height: '100%', opacity: 0.4, borderRadius: '16px' }} />
        </div>
        <div className="flex gap-4">
          <S style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
          <S style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  </section>
);

/* ─── MOMENTS CAPTURED ─── */
export const MomentsSkeleton = () => (
  <section className="w-full py-16 px-6 relative bg-black">
    <div className="flex flex-col items-center mb-16 gap-3">
      <S style={{ height: '16px', width: '80px' }} />
      <S style={{ height: '36px', width: '240px' }} />
    </div>
    <div className="w-full max-w-[1440px] mx-auto overflow-hidden" style={{ height: '800px' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {[0, 1, 2].map(col => (
          <div key={col} className={`flex flex-col gap-6 ${col > 0 ? 'hidden md:flex' : ''}`}>
            {[0, 1, 2].map(row => (
              <S key={row} className="mx-auto" style={{ width: '85%', height: '320px' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default {
  HeroSkeleton,
  AboutSkeleton,
  UpcomingSkeleton,
  CarouselSkeleton,
  EssenceSkeleton,
  StayConnectedSkeleton,
  MomentsSkeleton,
};
