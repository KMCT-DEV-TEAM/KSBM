"use client";
import React from 'react';
import { motion } from 'framer-motion';

const defaultGalleryItems = [
  {
    title: 'Industrial Visit 2025',
    subtitle: 'Corporate Tour & Leadership Insights',
    image: '/assets/Images/image 67.png',
    span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[260px] sm:h-[280px]'
  },
  {
    title: 'Leadership Camp',
    subtitle: 'Outbound Team Building',
    image: '/assets/Images/image 27.png',
    span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[260px] sm:h-[280px]'
  },
  {
    title: 'Outbound Learning',
    subtitle: 'Nature & Strategic Reflection',
    image: '/assets/Images/image 28.png',
    span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[260px] sm:h-[280px]'
  },
  {
    title: 'Global Immersion',
    subtitle: 'Cross-Cultural Case Discussions',
    image: '/assets/Images/image 2.png',
    span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]'
  },
  {
    title: 'Corporate Night Tour',
    subtitle: 'Metropolitan Industry Networking',
    image: '/assets/Images/image 58.png',
    span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]'
  }
];

const MomentsGallery = ({ program }) => {
  const badgeText = program?.momentsGallery?.badgeText || 'GALLERY';
  const titleText = program?.momentsGallery?.title || 'Moments Captured in Trip';
  const bgImage = program?.momentsGallery?.bgImage || '';
  const items = program?.momentsGallery?.items && program.momentsGallery.items.length > 0
    ? program.momentsGallery.items
    : defaultGalleryItems;

  const getSpan = (item, idx) => {
    const defaultSpans = [
      'col-span-1 md:col-span-2 lg:col-span-4 h-[260px] sm:h-[280px]',
      'col-span-1 md:col-span-1 lg:col-span-4 h-[260px] sm:h-[280px]',
      'col-span-1 md:col-span-1 lg:col-span-4 h-[260px] sm:h-[280px]',
      'col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]',
      'col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]'
    ];
    let spanStr = item.span || defaultSpans[idx % defaultSpans.length] || defaultSpans[0];
    if (spanStr.includes('h-[')) {
      spanStr = spanStr.replace(/h-\[\d+px\]/g, 'h-[260px] sm:h-[280px]');
    } else {
      spanStr += ' h-[260px] sm:h-[280px]';
    }
    return spanStr;
  };

  const getCardDimensions = (item, idx, rowNum = 1) => {
    const spanStr = item.span || '';
    const shapeIndex = (idx + (rowNum === 2 ? 2 : 0)) % 5;

    if (spanStr.includes('col-span-12')) {
      return 'w-[380px] sm:w-[480px] md:w-[540px] h-[250px] sm:h-[280px] shrink-0';
    }
    if (spanStr.includes('col-span-6')) {
      return shapeIndex % 2 === 0
        ? 'w-[350px] sm:w-[430px] md:w-[480px] h-[220px] sm:h-[240px] shrink-0'
        : 'w-[340px] sm:w-[420px] md:w-[460px] h-[250px] sm:h-[270px] shrink-0';
    }

    const shapes = [
      'w-[320px] sm:w-[390px] md:w-[440px] h-[220px] sm:h-[240px] shrink-0', // Wide rectangle
      'w-[230px] sm:w-[260px] md:w-[280px] h-[250px] sm:h-[280px] shrink-0', // Tall portrait
      'w-[250px] sm:w-[290px] md:w-[330px] h-[230px] sm:h-[250px] shrink-0', // Square-ish
      'w-[350px] sm:w-[430px] md:w-[490px] h-[240px] sm:h-[270px] shrink-0', // Panoramic collage
      'w-[220px] sm:w-[250px] md:w-[270px] h-[210px] sm:h-[230px] shrink-0'  // Compact bento
    ];

    return shapes[shapeIndex];
  };

  return (
    <section className="py-20 lg:py-28 bg-[#111836] relative overflow-hidden text-white">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Gallery Background" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-primary/55" />
        </div>
      )}
      {/* Starry subtle pattern */}
      <div className="absolute inset-0" />

      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex w-full items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-[0.25em] text-white uppercase mb-3">
            <span className="w-full h-[1px] bg-white rounded-[18px] shrink-0" />
            <span>
              {badgeText}
            </span>
            <span className="w-full h-[1px] bg-white rounded-[18px] shrink-0" />
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold tracking-tight text-white mt-3 font-heading">
            {titleText}
          </h2>
        </motion.div>
      </div>

      {/* 2-Line Infinite Moving Gallery */}
      <style jsx>{`
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-row1 {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee-rtl ${Math.max(items.length * 6, 25)}s linear infinite;
        }
        .animate-marquee-row2 {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee-rtl ${Math.max(items.length * 6.5, 28)}s linear infinite;
        }
        .animate-marquee-row1:hover,
        .animate-marquee-row2:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative w-full overflow-hidden py-4 z-10 space-y-5 sm:space-y-6">
        {/* Line 1: Right to Left */}
        <div className="animate-marquee-row1 gap-5 sm:gap-6 px-4">
          {[...items, ...items, ...items, ...items].map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className={`${getCardDimensions(item, idx, 1)} relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border-2 border-white/15 bg-gray-900`}
            >
              <img
                src={item.image || '/assets/Images/image 67.png'}
                alt={item.title || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 z-10 flex flex-col justify-end">
                <h3 className="text-md sm:text-sm font-medium text-white leading-snug font-heading">
                  {item.title || item.subtitle}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Line 2: Right to Left */}
        <div className="animate-marquee-row2 gap-3 sm:gap-3 px-4">
          {[...items.slice().reverse(), ...items.slice().reverse(), ...items.slice().reverse(), ...items.slice().reverse()].map((item, idx) => (
            <div
              key={`row2-${idx}`}
              className={`${getCardDimensions(item, idx, 2)} relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border-2 border-white/15 bg-gray-900`}
            >
              <img
                src={item.image || '/assets/Images/image 67.png'}
                alt={item.title || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 z-10 flex flex-col justify-end">
                <h3 className="text-md sm:text-sm font-medium text-white leading-snug font-heading">
                  {item.title || item.subtitle}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MomentsGallery;
