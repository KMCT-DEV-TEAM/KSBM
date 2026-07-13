"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../components/Loader';
import api from '../../../api/axios';
import {
  Mail,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Download,
  Users,
  Award,
  ExternalLink,
  BadgeCheck
} from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Hero = ({ previewData }) => {
  const [settings, setSettings] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(!!previewData);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    // Scroll listener for fixed contact bar
    const handleScroll = () => {
      // Trigger color change when scrolled past 400px
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center"
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
          className="flex flex-wrap items-center gap-4 mt-10"
        >
          {settings?.primaryButton?.isVisible !== false && (
            <a href={settings?.primaryButton?.link || '#'} className="bg-secondary text-primary text-sm md:text-base font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              {settings?.primaryButton?.text || 'Apply Now'} <ArrowUpRight className="w-5 h-5" />
            </a>
          )}
          {settings?.secondaryButton?.isVisible !== false && (
            <a href={settings?.secondaryButton?.link || '#'} className="bg-background/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <Download className="w-5 h-5" /> {settings?.secondaryButton?.text || 'Download Brochure'}
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Glassmorphism Floating Card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={imagesLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="hidden md:block absolute bottom-10 right-10 z-20"
      >
        <div className="relative bg-background/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 w-[280px] lg:w-[320px] shadow-2xl">
          {/* Blue Badge Icon Overlap */}
          <div className="absolute -top-3 -right-3 bg-primary p-2 rounded-xl shadow-lg border border-white/10 text-white z-30">
            <BadgeCheck className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-bold text-white mb-4">Batch 2025–27</h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-background/20 p-2 rounded-lg shrink-0 text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Limited Seats</p>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">Last few slots remaining</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-background/20 p-2 rounded-lg shrink-0 text-white">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">100% Placement</p>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">Consistent record over years</p>
              </div>
            </div>
          </div>

          <a href="#" className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white mt-5 transition-colors group">
            Read Admission Guidelines
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>

      {/* Fixed Sidebar Social Icons */}
      <motion.div
        initial={{ x: 100 }}
        animate={imagesLoaded ? { x: 0 } : { x: 100 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[1px] border-r-0 rounded-l-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors duration-300 ${isScrolled
          ? 'bg-background border border-gray-200 text-primary'
          : 'bg-background/20 backdrop-blur-md border border-white/30 text-white'
          }`}
      >
        <a
          href="mailto:info@kmct.org"
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-background/30'}`}
          title="Email Us"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noreferrer"
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-background/30'}`}
          title="WhatsApp Us"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
        <a
          href="tel:+911234567890"
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-background/30'}`}
          title="Call Us"
        >
          <Phone className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
    </>
  );
};

export default Hero;

