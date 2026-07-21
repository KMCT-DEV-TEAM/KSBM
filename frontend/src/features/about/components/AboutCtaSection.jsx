"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../api/axios';
const watermarkImg = '/assets/Images/watermark_logo.png';

const AboutCtaSection = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/about-us-cta');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching About CTA data:', error);
      }
    };
    fetchData();
  }, []);

  const watermarkWidthClass = 'w-[200px] md:w-[250px] lg:w-[380px] #2B2F66';
  const heading = data?.heading || 'Begin Your Leadership Journey at KSBM';
  const subtext = data?.subtext || 'Applications for the academic year 2024-25 are now open. Secure your seat in the cohort of the future.';
  const buttonText = data?.buttonText || 'Apply Now Online';
  const buttonLink = data?.buttonLink || '/apply';
  const bgColor = data?.backgroundColor || '#2B2F66';

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
        <div className="relative z-10 flex-shrink-0 lg:mr-12 xl:mr-20">
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            style={{ color: bgColor }}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutCtaSection;
