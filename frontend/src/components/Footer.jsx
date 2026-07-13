"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
const watermarkLogo = '/assets/Images/watermark_logo.png';

const Footer = ({ previewData }) => {
  const [data, setData] = useState({
    description: 'Empowering global leaders through intellectual rigor and strategic excellence since 1998.',
    socialLinks: { instagram: '#', facebook: '#', whatsapp: '#' },
    programs: [],
    quickLinks: [],
    contactInfo: { address: '', email: '', phone: '' },
    copyrightText: '© 2024 KMCT School of Business. All rights reserved. Accredited by AACSB & AMBA.'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      const fetchFooter = async () => {
        try {
          const response = await api.get('/cms/footer');
          if (response.data) {
            setData(response.data);
          }
        } catch (error) {
          console.error("Error fetching Footer data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFooter();
    }
  }, [previewData]);

  if (isLoading) {
    return (
      <footer className="relative bg-primary pt-20 pb-8 overflow-hidden animate-pulse">
        <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col gap-4">
                <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  const { description, socialLinks, programs, quickLinks, contactInfo, copyrightText } = data;

  return (
    <footer className="relative bg-primary text-white pt-20 pb-8 overflow-hidden">

      {/* Background Geometric Pattern */}
      {/* Left Pattern */}
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] opacity-[0.50] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-secondary"
        style={{
          maskImage: `url(${watermarkLogo})`,
          WebkitMaskImage: `url(${watermarkLogo})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center'
        }}
      ></div>
      {/* Right Pattern */}
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] opacity-[0.50] pointer-events-none transform translate-x-1/2 -translate-y-1/2 bg-secondary"
        style={{
          maskImage: `url(${watermarkLogo})`,
          WebkitMaskImage: `url(${watermarkLogo})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center'
        }}
      ></div>

      <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Main Footer Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20"
        >

          {/* Column 1: About & Social */}
          <div className="flex flex-col pr-4">
            <h3 className="text-2xl font-semibold mb-6 tracking-wide text-white">KSBM</h3>
            {description && (
              <p className="text-secondary text-sm leading-relaxed mb-8 max-w-[90%] whitespace-pre-wrap">
                {description}
              </p>
            )}

            <h4 className="text-xs font-medium tracking-[0.15em] uppercase mb-4 text-white">
              CONNECT US
            </h4>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {/* Facebook */}
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#1877F2] hover:text-white hover:border-transparent hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {/* WhatsApp */}
              {socialLinks?.whatsapp && (
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#25D366] hover:text-white hover:border-transparent hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Programs */}
          <div className="flex flex-col">
            <h4 className="text-sm font-medium tracking-[0.15em] uppercase mb-8 text-white">
              PROGRAMS
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-secondary ">
              {programs && programs.map((prog, idx) => (
                <li key={idx}><a href={prog.url} className="hover:text-white transition-colors">{prog.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-medium tracking-[0.15em] uppercase mb-8 text-white">
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-secondary">
              {quickLinks && quickLinks.map((link, idx) => (
                <li key={idx}><a href={link.url} className="hover:text-white transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col">
            <h4 className="text-sm font-medium tracking-[0.15em] uppercase mb-8 text-white">
              CONTACT INFORMATION
            </h4>
            <ul className="flex flex-col gap-5 text-sm text-secondary">
              {contactInfo?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 opacity-80" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 opacity-80" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </motion.div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.65rem] text-secondary border-t border-white/10">
          <p>
            {copyrightText}
          </p>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
