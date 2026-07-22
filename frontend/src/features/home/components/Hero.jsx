"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../components/Loader';
import api from '../../../api/axios';
import {
  ArrowUpRight,
  Download,
  Users,
  Award,
  ExternalLink,
  BadgeCheck
} from 'lucide-react';


const Hero = ({ previewData }) => {
  const [settings, setSettings] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(!!previewData);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
      return;
    }
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/cms/hero');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchSettings();
  }, [previewData]);

  const images = React.useMemo(() => {
    return settings?.bannerImages?.length > 0 
      ? settings.bannerImages.map(img => img.url)
      : [
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop'
        ];
  }, [settings?.bannerImages]);

  useEffect(() => {
    if (!dataLoaded && !previewData) return;

    let isMounted = true;
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(promises);
      if (isMounted) {
        setTimeout(() => setImagesLoaded(true), 800);
      }
    };
    preloadImages();

    return () => {
      isMounted = false;
    };
  }, [dataLoaded, previewData, images]);

  useEffect(() => {
    if (!imagesLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imagesLoaded]);

  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, imagesLoaded]);



  return (
    <>
      <AnimatePresence>
        {!imagesLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999]"
          >
            <Loader fullScreen={true} theme="dark" text="Loading Experience" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex items-center">
      {/* Background Images with Transition */}
      {images.map((img, index) => (
        <motion.div
          key={img}
          initial={false}
          animate={{
            opacity: index === currentImageIndex ? 1 : 0,
            scale: index === currentImageIndex ? 1 : 1.05,
            zIndex: index === currentImageIndex ? 0 : -1
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={img}
            alt="Campus"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate={imagesLoaded ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
            }
          }
        }}
        className="relative z-10 w-[98%] max-w-[1440px] mx-auto pl-4 pr-16 sm:pl-6 sm:pr-20 lg:px-8 py-20 flex flex-col justify-center"
      >

        {/* Pill Badge */}
        {settings?.pillText?.isVisible !== false && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="inline-flex items-center gap-2.5 bg-background/20 backdrop-blur-md rounded-full pr-5 pl-2 py-1.5 text-[0.60rem] sm:text-[0.65rem] font-semibold tracking-widest text-white border border-white/30 uppercase mb-8 self-start shadow-sm"
          >
            <div className="flex items-center justify-center bg-white/10 rounded-full p-1">
              <svg viewBox="-50 -50 100 100" className="w-5 h-5 text-[#5594c0]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 45})`}>
                    <polygon points="0,-4 -6,-16 6,-16" />
                    <polygon points="0,-32 -8,-18 8,-18" />
                    <polygon points="0,-34 -12,-48 12,-48" />
                    <polygon points="-11,-20 -20,-20 -15,-30" />
                    <polygon points="11,-20 20,-20 15,-30" />
                  </g>
                ))}
              </svg>
            </div>
            {settings?.pillText?.text || 'ADMISSIONS OPEN 2025-26'}
          </motion.div>
        )}

        {/* Heading */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
        >
          {settings?.headingLine1?.isVisible !== false && (
            <span className="text-white block">{settings?.headingLine1?.text || 'Empowering Future'}</span>
          )}
          {settings?.headingLine2?.isVisible !== false && (
            <span className="text-[#bce0f0] block">{settings?.headingLine2?.text || 'Business Leaders'}</span>
          )}
        </motion.h1>

        {/* Description */}
        {settings?.description?.isVisible !== false && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="max-w-2xl text-xs md:text-sm mt-6 text-gray-200 leading-relaxed font-medium"
          >
            {settings?.description?.text || "Unlock your potential with India's leading B-School, where traditional academic rigor meets modern industry innovation. Join a network of global visionaries."}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-10"
        >
          {settings?.primaryButton?.isVisible !== false && (
            <a href={settings?.primaryButton?.link || '#'} className="bg-secondary text-primary text-sm md:text-base font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start">
              {settings?.primaryButton?.text || 'Apply Now'} <ArrowUpRight className="w-5 h-5" />
            </a>
          )}
          {settings?.secondaryButton?.isVisible !== false && (
            <a href={settings?.secondaryButton?.link || '#'} className="bg-background/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start">
              <Download className="w-5 h-5" /> {settings?.secondaryButton?.text || 'Download Brochure'}
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Desktop Glassmorphism Floating Card */}
      {settings?.statsCard?.isVisible !== false && (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={imagesLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="hidden md:block absolute bottom-4 lg:bottom-10 right-6 lg:right-10 z-20"
      >
        <div className="relative bg-background/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 w-[280px] lg:w-[320px] shadow-2xl">
          {/* Blue Badge Icon Overlap */}
          <div className="absolute -top-3 -right-3 bg-primary p-2 rounded-xl shadow-lg border border-white/10 text-white z-30">
            <BadgeCheck className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-bold text-white mb-4">{settings?.statsCard?.batchText || 'Batch 2025–27'}</h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-background/20 p-2 rounded-lg shrink-0 text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{settings?.statsCard?.stat1Title || 'Limited Seats'}</p>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">{settings?.statsCard?.stat1Subtitle || 'Last few slots remaining'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-background/20 p-2 rounded-lg shrink-0 text-white">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{settings?.statsCard?.stat2Title || '100% Placement'}</p>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">{settings?.statsCard?.stat2Subtitle || 'Consistent record over years'}</p>
              </div>
            </div>
          </div>

          <a href={settings?.statsCard?.linkUrl || '#'} className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white mt-5 transition-colors group">
            {settings?.statsCard?.linkText || 'Read Admission Guidelines'}
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
      )}

      {/* Mobile Scrolling Ticker */}
      {settings?.statsCard?.isVisible !== false && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={imagesLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        className="md:hidden absolute bottom-0 left-0 w-full bg-background/20 backdrop-blur-md border-t border-white/20 text-white py-3 z-20 overflow-hidden"
      >
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-xs sm:text-sm">
          {/* First Set */}
          <div className="flex items-center gap-10">
            <span className="font-bold text-secondary flex items-center gap-2"><BadgeCheck className="w-4 h-4"/> {settings?.statsCard?.batchText || 'Batch 2025–27'}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-300"/> {settings?.statsCard?.stat1Title || 'Limited Seats'}</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-300"/> {settings?.statsCard?.stat2Title || '100% Placement'}</span>
            <a href={settings?.statsCard?.linkUrl || '#'} className="flex items-center gap-1.5 hover:text-secondary underline underline-offset-2">{settings?.statsCard?.linkText || 'Read Admission Guidelines'} <ExternalLink className="w-3.5 h-3.5"/></a>
          </div>
          {/* Second Set for seamless infinite scrolling */}
          <div className="flex items-center gap-10">
            <span className="font-bold text-secondary flex items-center gap-2"><BadgeCheck className="w-4 h-4"/> {settings?.statsCard?.batchText || 'Batch 2025–27'}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-300"/> {settings?.statsCard?.stat1Title || 'Limited Seats'}</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-300"/> {settings?.statsCard?.stat2Title || '100% Placement'}</span>
            <a href={settings?.statsCard?.linkUrl || '#'} className="flex items-center gap-1.5 hover:text-secondary underline underline-offset-2">{settings?.statsCard?.linkText || 'Read Admission Guidelines'} <ExternalLink className="w-3.5 h-3.5"/></a>
          </div>
        </div>
      </motion.div>
      )}


    </div>
    </>
  );
};

export default Hero;

