"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../api/axios';
import { useGlobalLinks } from '../../../hooks/useGlobalLinks';
const watermarkImg = '/assets/Images/watermark_logo.png';

const AboutCtaSection = ({ previewData }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/about-us-cta', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching About CTA data:', error);
      }
    };
    fetchData();
  }, [previewData]);

  const watermarkWidthClass = 'w-[200px] md:w-[250px] lg:w-[380px] #2B2F66';
  const heading = data?.heading || 'Begin Your Leadership Journey at KSBM';
  const subtext = data?.subtext || 'Applications for the academic year 2024-25 are now open. Secure your seat in the cohort of the future.';
  const buttonText = data?.buttonText || 'Apply Now Online';
  const globalLinks = useGlobalLinks();
  const buttonLink = globalLinks['global_apply']?.link || data?.buttonLink || '/apply';
  const bgColor = data?.backgroundColor || '#2B2F66';

  if (data?.showSection === false && !previewData) return null;

  return (
    <section className="relative overflow-hidden w-full pb-16 pt-6 bg-[#fcfcfd]">
      {/* Watermark in the white background section */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
        <img src={watermarkImg} alt="Background Watermark" className={`${watermarkWidthClass} h-auto object-contain`} />
      </div>

      <div
        className="relative z-10 w-[98%] max-w-[1370px] mx-auto rounded-2xl md:rounded-[1.5rem] px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <div className="relative z-10 flex-1 space-y-3 text-center lg:text-left">
          <h2 className="text-2xl md:text-[1.8rem] font-semibold text-white tracking-tight leading-tight">
            {heading.split('KSBM').map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && <span className="mx-1.5">KSBM</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto lg:mx-0 font-light">
            {subtext}
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-auto mt-4 lg:mt-0 flex justify-center lg:justify-end">
          <a href={buttonLink}
            target={buttonLink.startsWith('http') ? '_blank' : undefined}
            rel={buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex h-[42px] items-center justify-center rounded bg-white px-6 text-sm md:text-base font-semibold text-[#1a235c] transition-all hover:shadow-[0_4px_12px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[#c5e1ff] focus:ring-offset-2 w-full sm:w-auto hover:-translate-y-0.5"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutCtaSection;
