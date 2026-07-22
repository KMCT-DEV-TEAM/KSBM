"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

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

const SideContact = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Trigger color change when scrolled past 400px
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  // We check if it is not the home page to always use the scrolled state if the page doesn't have a dark background.
  // Actually, we can use the same styling globally, but a solid primary background is safer for visibility on all pages.
  // Let's use bg-primary to keep it visible on white backgrounds unless on home page where bg-white/20 is used.
  const isHomePage = pathname === '/';
  
  const getStyleClasses = () => {
    if (isScrolled) {
      return 'bg-background border border-gray-200 text-primary';
    }
    // Universal style for first section (not scrolled) on all pages
    return 'bg-background/20 backdrop-blur-md border border-white/30 text-white';
  };

  const getHoverClasses = () => {
    if (isScrolled) {
      return 'hover:bg-gray-100';
    }
    return 'hover:bg-background/30';
  };

  return (
    <motion.div
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[1px] border-r-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors duration-300 ${getStyleClasses()}`}
      style={{ borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
    >
      <a
        href="mailto:info@kmct.org"
        className={`p-3.5 block transition-colors ${getHoverClasses()}`}
        title="Email Us"
      >
        <Mail className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noreferrer"
        className={`p-3.5 block transition-colors ${getHoverClasses()}`}
        title="WhatsApp Us"
      >
        <WhatsAppIcon className="w-5 h-5" />
      </a>
      <a
        href="tel:+911234567890"
        className={`p-3.5 block transition-colors ${getHoverClasses()}`}
        title="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>
    </motion.div>
  );
};

export default SideContact;
