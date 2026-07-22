"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const TermsAndConditions = () => {
  const [data, setData] = useState({
    hero: {
      title: 'Terms & Conditions',
      subtitle: 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Terms of Use',
      introParagraph: 'By accessing and using the official website and online portals of KMCT Group of Colleges (KSBM), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our platforms immediately.',
      sections: [
        {
          title: '1. Use of Website Content',
          content: 'All content provided on this website, including course schedules, fee details, academic curricula, faculty profiles, and news updates, is for educational and informational purposes. While we endeavor to maintain up-to-date and accurate information, KSBM reserves the right to modify academic offerings and policies without prior notice.'
        },
        {
          title: '2. User Conduct & Obligations',
          content: 'Users agree to access and use this website solely for lawful purposes. You must not transmit any malicious code, attempt unauthorized access to restricted portals or student information systems, or disrupt normal server operations.'
        },
        {
          title: '3. Intellectual Property Rights',
          content: 'All institutional logos, emblems, written documentation, imagery, and design layouts hosted on this site are registered trademarks or copyrighted assets of KMCT Group of Colleges. Any reproduction or distribution without explicit written consent is prohibited.'
        },
        {
          title: '4. Limitation of Liability',
          content: 'KSBM shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or reliance upon any content published herein.'
        },
        {
          title: '5. Governing Law',
          content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts in Kerala.'
        }
      ],
      bulletPoints: [
        'All website content, course details, and fee structures are subject to periodic review and modification without prior notice.',
        'Unauthorized usage of institutional branding, emblems, or student data is strictly prohibited and subject to legal recourse.',
        'Accessing restricted student or faculty portals requires authorized credentials issued by the institution.',
        'All disputes regarding website usage and institutional policies fall strictly under the jurisdiction of the courts in Kerala.'
      ],
      closingParagraph1: 'KMCT Group of Colleges reserves the right to update or amend these Terms and Conditions at any time. Your continued use of the website following the posting of any modifications constitutes your formal acceptance of the updated guidelines.',
      closingParagraph2: 'If you have any questions or concerns regarding our terms of service, please contact our administrative desk or reach out via our general inquiry channels.'
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      try {
        const res = await api.get('/cms/terms-and-conditions');
        if (res.data) {
          setData(prev => ({
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            mainContent: { ...prev.mainContent, ...(res.data.mainContent || {}) }
          }));
        }
      } catch (err) {
        console.error('Failed to fetch terms and conditions settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const hero = data.hero || {};
  const mainContent = data.mainContent || {};
  const sections = Array.isArray(mainContent.sections) && mainContent.sections.length > 0
    ? mainContent.sections
    : [
        {
          title: '1. Use of Website Content',
          content: 'All content provided on this website, including course schedules, fee details, academic curricula, faculty profiles, and news updates, is for educational and informational purposes. While we endeavor to maintain up-to-date and accurate information, KSBM reserves the right to modify academic offerings and policies without prior notice.'
        },
        {
          title: '2. User Conduct & Obligations',
          content: 'Users agree to access and use this website solely for lawful purposes. You must not transmit any malicious code, attempt unauthorized access to restricted portals or student information systems, or disrupt normal server operations.'
        },
        {
          title: '3. Intellectual Property Rights',
          content: 'All institutional logos, emblems, written documentation, imagery, and design layouts hosted on this site are registered trademarks or copyrighted assets of KMCT Group of Colleges. Any reproduction or distribution without explicit written consent is prohibited.'
        },
        {
          title: '4. Limitation of Liability',
          content: 'KSBM shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or reliance upon any content published herein.'
        },
        {
          title: '5. Governing Law',
          content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts in Kerala.'
        }
      ];

  const bulletPoints = Array.isArray(mainContent.bulletPoints) && mainContent.bulletPoints.length > 0
    ? mainContent.bulletPoints
    : [
        'All website content, course details, and fee structures are subject to periodic review and modification without prior notice.',
        'Unauthorized usage of institutional branding, emblems, or student data is strictly prohibited and subject to legal recourse.',
        'Accessing restricted student or faculty portals requires authorized credentials issued by the institution.',
        'All disputes regarding website usage and institutional policies fall strictly under the jurisdiction of the courts in Kerala.'
      ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        {/* Top Hero Section */}
        <section className="relative min-h-[400px] sm:min-h-[480px] md:min-h-[540px] flex items-center justify-center overflow-hidden bg-[#111836] py-16 sm:py-20 px-4">
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage || "/assets/Images/image 73.png"}
              alt="Terms and Conditions Background"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-primary/75" />
          </div>

          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                {hero.title || 'Terms & Conditions'}
              </h1>

              <p className="font-medium text-white/80 leading-relaxed text-[18px] max-w-2xl">
                {hero.subtitle || 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pt-8 pb-16 md:pt-10 md:pb-24 bg-white text-gray-800">
          <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary tracking-tight border-b border-gray-100 pb-4">
                {mainContent.heading || 'Terms of Use'}
              </h2>

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed">
                {mainContent.introParagraph && <p>{mainContent.introParagraph}</p>}

                {sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    {sec.title && <p className="font-semibold text-primary pt-2">{sec.title}</p>}
                    {sec.content && <p>{sec.content}</p>}
                  </div>
                ))}
              </div>

              {/* Highlights Box for Consistency with Privacy Policy */}
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

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed">
                {mainContent.closingParagraph1 && <p>{mainContent.closingParagraph1}</p>}
                {mainContent.closingParagraph2 && <p>{mainContent.closingParagraph2}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsAndConditions;
