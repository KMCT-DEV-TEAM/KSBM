"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGlobalLinks } from '../../../hooks/useGlobalLinks';

const AdmissionCtaSection = ({ data }) => {
  const globalLinks = useGlobalLinks();
  const applyBtn = globalLinks['global_apply'];
  const enquiryBtn = globalLinks['global_enquire'] || globalLinks['global_enquiry'];
  const heading = data?.ctaHeading || 'Begin Your Leadership Journey at KSBM';
  const desc = data?.ctaDesc || 'Applications for the upcoming academic year are now open. Take the first step towards a transformative management education under a community of vibrant peers, experienced faculty, and industry leaders.';
  const image = data?.ctaImage || '/assets/Images/admissions/image 78.png';

  return (
    <section className="bg-white relative">
      <div className="w-[98%] max-w-[1440px] mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[18px] p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden relative"
        >
          {/* Decorative Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text & Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary mb-3.5 leading-tight font-heading">
              {heading}
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-normal mb-6 max-w-xl font-normal">
              {desc}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href={data?.ctaApplyBtnUrl || applyBtn?.link || '#'}
                target={(data?.ctaApplyBtnUrl || applyBtn?.link || '').startsWith('http') ? '_blank' : undefined}
                rel={(data?.ctaApplyBtnUrl || applyBtn?.link || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex h-[46px] items-center justify-center rounded-lg bg-primary px-6 text-sm md:text-base font-semibold text-white transition-all hover:bg-[#151c48] shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {data?.ctaApplyBtnText || applyBtn?.label || 'Apply Now'} <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href={data?.ctaEnquiryBtnUrl || enquiryBtn?.link || '#'}
                target={(data?.ctaEnquiryBtnUrl || enquiryBtn?.link || '').startsWith('http') ? '_blank' : undefined}
                rel={(data?.ctaEnquiryBtnUrl || enquiryBtn?.link || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex h-[46px] items-center justify-center rounded-lg border-2 border-primary px-6 text-sm md:text-base font-semibold text-primary bg-white transition-all hover:bg-gray-50 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {data?.ctaEnquiryBtnText || enquiryBtn?.label || 'Enquire Now'} <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-10">
            <div className="relative w-full max-w-[360px] lg:max-w-none rounded-[18px] overflow-hidden group">
              <img
                src={image}
                alt="KSBM Admissions & Leadership"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = '/assets/Images/admissions/image 78.png';
                }}
              />
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default AdmissionCtaSection;
