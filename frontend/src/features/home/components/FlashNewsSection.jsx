"use client";
import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import api from '../../../api/axios';
import { DEFAULT_HERO } from '../../admin/cms/constants/defaultCmsData';

const FlashNewsSection = ({ previewData }) => {
  const [settings, setSettings] = useState(previewData?.flashNews || DEFAULT_HERO.flashNews);

  useEffect(() => {
    if (previewData) {
      setSettings(previewData.flashNews || DEFAULT_HERO.flashNews);
      return;
    }
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/cms/hero', { hideLoader: true });
        if (data && data.flashNews) {
          setSettings(data.flashNews);
        }
      } catch (error) {
        console.error('Error fetching flash news settings:', error);
      }
    };
    fetchSettings();
  }, [previewData]);

  if (!settings?.isVisible || !settings?.newsItems || settings.newsItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative z-20 -mt-1 shadow-md bg-primary text-white border-b border-white/10">
      <div className="flex h-10 sm:h-12 items-stretch overflow-hidden">
        
        {/* Flash News Label Box */}
        <div className="flex items-center justify-center bg-white/10 font-semibold px-4 sm:px-6 z-10 shrink-0 border-r border-white/10">
          <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse text-white" />
          <span className="text-xs sm:text-sm whitespace-nowrap text-white">Flash News</span>
        </div>

        {/* Scrolling Marquee Area */}
        <div className="flex-1 flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)]">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 sm:gap-24 hover:[animation-play-state:paused]">
            
            {/* We duplicate the content to make the loop seamless */}
            <div className="flex items-center gap-12 sm:gap-24 shrink-0 pl-12 sm:pl-24">
              {settings.newsItems.map((item, idx) => (
                <div key={`set1-${idx}`} className="flex items-center group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  <a 
                    href={item.url && item.url !== '#' ? item.url : undefined} 
                    className={`text-xs sm:text-sm text-gray-200 font-medium ${item.url && item.url !== '#' ? 'hover:text-white transition-colors cursor-pointer' : 'cursor-default'}`}
                  >
                    {item.text}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-12 sm:gap-24 shrink-0 pl-12 sm:pl-24">
              {settings.newsItems.map((item, idx) => (
                <div key={`set2-${idx}`} className="flex items-center group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  <a 
                    href={item.url && item.url !== '#' ? item.url : undefined} 
                    className={`text-xs sm:text-sm text-gray-200 font-medium ${item.url && item.url !== '#' ? 'hover:text-white transition-colors cursor-pointer' : 'cursor-default'}`}
                  >
                    {item.text}
                  </a>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FlashNewsSection;
