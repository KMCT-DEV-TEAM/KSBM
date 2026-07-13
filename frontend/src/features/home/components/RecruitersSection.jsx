"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

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
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden animate-pulse">
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

  if (!showRecruiters && !previewData) {
    return null;
  }

  return (
    <section className="w-full bg-background py-12 lg:py-16 ">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Logos Container - Marquee Loop */}
        {recruiters && recruiters.length > 0 && (
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center animate-marquee gap-12 lg:gap-24 opacity-90 pr-12 lg:pr-24">
              {[...recruiters, ...recruiters].map((company, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center shrink-0 w-[120px] md:w-[150px] lg:w-[180px] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                  title={company.name}
                >
                  <img
                    src={company.logo || 'https://via.placeholder.com/150x50?text=Logo'}
                    alt={`${company.name} logo`}
                    className="w-full h-auto object-contain max-h-[40px] lg:max-h-[50px]"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  );
};

export default RecruitersSection;
