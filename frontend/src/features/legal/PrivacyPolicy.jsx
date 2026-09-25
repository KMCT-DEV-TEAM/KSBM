"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { DEFAULT_PRIVACY_POLICY } from '../admin/cms/constants/defaultCmsData';

const PrivacyPolicy = () => {
  const [data, setData] = useState(DEFAULT_PRIVACY_POLICY);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      try {
        const res = await api.get('/cms/privacy-policy');
        if (res.data) {
          setData(prev => ({
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            mainContent: { ...prev.mainContent, ...(res.data.mainContent || {}) }
          }));
        }
      } catch (err) {
        console.error('Failed to fetch privacy policy settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const hero = data.hero || {};
  const mainContent = data.mainContent || {};
  const bulletPoints = Array.isArray(mainContent.bulletPoints) && mainContent.bulletPoints.length > 0
    ? mainContent.bulletPoints
    : [
      'The information provided on the KMCT Group of Colleges website is for general informational purposes only.',
      'While efforts are made to ensure accuracy, the institution does not guarantee the completeness, reliability, or timeliness of the content.',
      'KMCT Group of Colleges reserves the right to modify or update courses, fees, policies, and other details without prior notice.',
      'Users are advised to verify all information directly with the institution before making any decisions.'
    ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        {/* Top Hero Section */}
        <section className="relative min-h-[520px] sm:min-h-[620px] md:min-h-[680px] flex flex-col justify-center overflow-hidden bg-[#111836] pt-32 pb-16 px-4">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage || "/assets/Images/image 73.png"}
              alt="Privacy Policy Background"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-primary/75" />
          </div>

          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight mt-8">
                {hero.title || 'Privacy Policy'}
              </h1>

              <p className="font-medium text-white/80 leading-relaxed text-[16px] sm:text-[18px] max-w-2xl mb-4 text-justify">
                {hero.subtitle || 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Privacy Policy Content */}
        <section className="py-16 md:py-24 bg-white text-gray-800">
          <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary tracking-tight border-b border-gray-100 pb-4">
                {mainContent.heading || 'Privacy Policy'}
              </h2>

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed text-justify">
                {mainContent.paragraph1 && <p>{mainContent.paragraph1}</p>}
                {mainContent.paragraph2 && <p>{mainContent.paragraph2}</p>}
                {mainContent.paragraph3 && <p>{mainContent.paragraph3}</p>}
                {mainContent.paragraph4 && <p>{mainContent.paragraph4}</p>}
                {mainContent.paragraph5 && <p>{mainContent.paragraph5}</p>}
                {mainContent.paragraph6 && <p>{mainContent.paragraph6}</p>}
              </div>

              {/* Bullet Points */}
              <div className="bg-gray-50/80 rounded-2xl p-6 sm:p-8 border border-gray-200/80 my-8">
                <ul className="space-y-3.5 text-[15px] text-text-primary font-medium">
                  {bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed text-justify">
                {mainContent.closingParagraph1 && <p>{mainContent.closingParagraph1}</p>}
                {mainContent.closingParagraph2 && <p>{mainContent.closingParagraph2}</p>}
                {mainContent.closingBoldText1 && <p>{mainContent.closingBoldText1}</p>}
                {mainContent.closingBoldText2 && <p>{mainContent.closingBoldText2}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
