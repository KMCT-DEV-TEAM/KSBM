"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';

const defaultRecruiters = [
  { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', logoText: 'Infosys', color: 'text-[#007cc3]' },
  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', logoText: 'wipro', color: 'text-[#002855]' },
  { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', logoText: 'Cognizant', color: 'text-[#0033a0]' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', logoText: 'Google', color: 'text-[#4285F4]' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', logoText: 'Microsoft', color: 'text-[#F25022]' }
];

const RecruitersSection = ({ previewData }) => {
  const [data, setData] = useState({
    recruiters: [],
    showRecruiters: true
  });
  const [isLoading, setIsLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
    } else {
      fetchRecruitersData();
    }
  }, [previewData]);

  const fetchRecruitersData = async () => {
    try {
      const response = await api.get('/cms/recruiters');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching recruiters data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-background py-12 lg:py-16">
        <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden animate-pulse">
          <div className="w-full inline-flex flex-nowrap overflow-hidden">
            <ul className="flex items-center gap-12 lg:gap-24 opacity-90 pr-12 lg:pr-24">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center justify-center shrink-0 w-[120px] md:w-[150px] lg:w-[180px]">
                  <div className="w-full h-10 bg-gray-200 rounded"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  const { recruiters, showRecruiters } = data;

  if (showRecruiters === false && !previewData) {
    return null;
  }

  const displayList = (recruiters && recruiters.length > 0) ? recruiters : defaultRecruiters;

  return (
    <section className="w-full bg-background py-12 lg:py-16 border-t border-gray-100">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden text-center">


        {/* Logos Container - Marquee Loop */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center animate-marquee gap-12 lg:gap-24 opacity-90 pr-12 lg:pr-24">
            {[...displayList, ...displayList].map((company, index) => (
              <li
                key={index}
                className="flex items-center justify-center shrink-0 w-[120px] md:w-[150px] lg:w-[180px] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                title={company.name}
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-auto object-contain max-h-[40px] lg:max-h-[50px]"
                  />
                ) : (
                  <span className={`text-2xl sm:text-3xl font-black tracking-tight ${company.color || 'text-primary'} font-heading`}>
                    {company.logoText || company.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default RecruitersSection;
