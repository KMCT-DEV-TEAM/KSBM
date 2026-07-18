"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Award, TrendingUp, Building2, CheckCircle2, X, Sparkles, Briefcase } from 'lucide-react';
import api from '../../../api/axios';

const defaultRecruiters = [
  { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', category: 'IT & Tech', package: '18.5 LPA Highest', badge: 'Day-1 Recruiter', website: 'https://www.infosys.com/careers' },
  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', category: 'IT & Tech', package: '16.0 LPA CTC', badge: 'Global Partner', website: 'https://careers.wipro.com' },
  { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', category: 'Consulting & Finance', package: '20.0 LPA CTC', badge: 'Super Dream', website: 'https://careers.cognizant.com' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', category: 'Core & Strategy', package: '28.0 LPA Highest', badge: 'Top Global Recruiter', website: 'https://careers.google.com' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', category: 'IT & Tech', package: '25.0 LPA CTC', badge: 'Super Dream', website: 'https://careers.microsoft.com' },
  { name: 'Amazon', logo: '', logoText: 'amazon', color: 'text-[#FF9900]', category: 'Operations & Strategy', package: '24.0 LPA CTC', badge: 'E-Commerce Leader', website: 'https://www.amazon.jobs' },
  { name: 'Deloitte', logo: '', logoText: 'Deloitte.', color: 'text-[#86BC25]', category: 'Consulting & Finance', package: '22.0 LPA CTC', badge: 'Big-4 Partner', website: 'https://www2.deloitte.com/careers' }
];

const RecruitersSection = ({ previewData }) => {
  const [data, setData] = useState({
    recruiters: [],
    showRecruiters: true
  });
  const [isLoading, setIsLoading] = useState(!previewData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

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

  if (!showRecruiters && !previewData) {
    return null;
  }

  const displayList = (recruiters && recruiters.length > 0) ? recruiters : defaultRecruiters;

  const categories = ['All', ...Array.from(new Set(displayList.map(item => item.category || 'IT & Tech').filter(Boolean)))];

  const filteredList = selectedCategory === 'All' 
    ? displayList 
    : displayList.filter(item => (item.category || 'IT & Tech') === selectedCategory);

  return (
    <section className="w-full bg-background py-16 lg:py-20 relative overflow-hidden">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-primary uppercase mb-2 block flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5594c0]" />
            OUR CORPORATE NETWORK
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mt-2 font-heading">
            Top Recruiters & Placement Partners
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Our students are recruited by global industry leaders across finance, consulting, technology, and analytics. Click any logo to view placement highlights.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Marquee or Grid View */}
        {selectedCategory === 'All' ? (
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] group/marquee">
            <ul className="flex items-center animate-marquee gap-10 sm:gap-16 lg:gap-24 opacity-95 pr-10 sm:pr-16 lg:pr-24 group-hover/marquee:[animation-play-state:paused]">
              {[...displayList, ...displayList].map((company, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedRecruiter(company)}
                  className="flex flex-col items-center justify-center shrink-0 w-[140px] md:w-[170px] lg:w-[190px] bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-100 hover:border-primary/30 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group/card relative"
                  title={`${company.name} • Click for details`}
                >
                  {company.badge && (
                    <span className="absolute -top-2.5 bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {company.badge}
                    </span>
                  )}
                  <div className="h-10 sm:h-12 w-full flex items-center justify-center my-1">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain max-h-[38px] sm:max-h-[46px] transition-transform duration-300 group-hover/card:scale-105"
                      />
                    ) : (
                      <span className={`text-xl sm:text-2xl font-black tracking-tight ${company.color || 'text-primary'} font-heading`}>
                        {company.logoText || company.name}
                      </span>
                    )}
                  </div>
                  {company.package && (
                    <span className="text-[11px] font-semibold text-emerald-600 mt-2 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {company.package}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto"
          >
            {filteredList.map((company, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedRecruiter(company)}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-between min-h-[140px] cursor-pointer group relative"
              >
                {company.badge && (
                  <span className="absolute -top-2.5 bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {company.badge}
                  </span>
                )}
                <div className="h-12 w-full flex items-center justify-center my-auto pt-2">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain max-h-[44px] transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className={`text-xl sm:text-2xl font-black tracking-tight ${company.color || 'text-primary'} font-heading`}>
                      {company.logoText || company.name}
                    </span>
                  )}
                </div>
                <div className="w-full border-t border-slate-100 pt-2.5 mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 truncate max-w-[90px]">
                    {company.name}
                  </span>
                  {company.package && (
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      {company.package}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Interactive Recruiter Placement Spotlight Modal */}
      <AnimatePresence>
        {selectedRecruiter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecruiter(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 p-6 sm:p-7 text-left"
            >
              <button
                type="button"
                onClick={() => setSelectedRecruiter(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-center shrink-0">
                  {selectedRecruiter.logo ? (
                    <img src={selectedRecruiter.logo} alt={selectedRecruiter.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className={`text-xl font-bold ${selectedRecruiter.color || 'text-primary'}`}>
                      {selectedRecruiter.logoText || selectedRecruiter.name.slice(0, 3)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 font-heading leading-tight">
                      {selectedRecruiter.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedRecruiter.category || 'IT & Tech'} Corporate Partner
                  </span>
                </div>
              </div>

              {selectedRecruiter.badge && (
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-primary border border-blue-100 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <Award className="w-3.5 h-3.5 text-[#5594c0]" />
                  <span>{selectedRecruiter.badge}</span>
                </div>
              )}

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Placement Tier:</span>
                  <span className="font-bold text-slate-900">{selectedRecruiter.badge || 'Elite Campus Partner'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Package Offered:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                    {selectedRecruiter.package || 'Competitive CTC'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Roles Offered:</span>
                  <span className="font-semibold text-slate-800">Management Trainee, Analyst, Consultant</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={selectedRecruiter.website || `https://www.google.com/search?q=${encodeURIComponent(selectedRecruiter.name + ' careers')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary hover:bg-[#162050] text-white font-semibold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-300"
                >
                  <span>Visit Company / Careers Page</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default RecruitersSection;
