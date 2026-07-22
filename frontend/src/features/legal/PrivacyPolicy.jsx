"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const PrivacyPolicy = () => {
  const [data, setData] = useState({
    hero: {
      title: 'Privacy Policy',
      subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Privacy Policy',
      paragraph1: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website.',
      paragraph2: 'KMCT Group of Colleges reserves the right to modify, update, or discontinue any aspect of the website, including academic programs, admission criteria, fee structures, policies, facilities, and services, at any time without prior notice. The content published should not be considered as a binding commitment, and users are encouraged to verify specific details directly with the institution\'s official representatives before making decisions.',
      paragraph3: 'The institution shall not be liable for any loss or damage, including but not limited to indirect or consequential loss, arising from the use of or reliance on information available on this website. This includes any interruptions, errors, or omissions in the content.',
      paragraph4: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.',
      paragraph5: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.',
      paragraph6: 'By accessing and using this website, users agree to the terms outlined in this disclaimer.',
      bulletPoints: [
        'The information provided on the KMCT Group of Colleges website is for general informational purposes only.',
        'While efforts are made to ensure accuracy, the institution does not guarantee the completeness, reliability, or timeliness of the content.',
        'KMCT Group of Colleges reserves the right to modify or update courses, fees, policies, and other details without prior notice.',
        'Users are advised to verify all information directly with the institution before making any decisions.'
      ],
      closingParagraph1: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website. This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites. All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.',
      closingParagraph2: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.',
      closingBoldText1: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated.',
      closingBoldText2: 'Unauthorized use, reproduction, or distribution of any content is strictly prohibited.'
    }
  });

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
        <section className="relative min-h-[400px] sm:min-h-[480px] md:min-h-[540px] flex items-center justify-center overflow-hidden bg-[#111836] py-16 sm:py-20 px-4">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage || "/assets/Images/image 73.png"}
              alt="Privacy Policy Background"
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
                {hero.title || 'Privacy Policy'}
              </h1>

              <p className="font-medium text-white/80 leading-relaxed text-[18px] max-w-2xl">
                {hero.subtitle || 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Privacy Policy Content */}
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
                {mainContent.heading || 'Privacy Policy'}
              </h2>

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed">
                {mainContent.paragraph1 && <p>{mainContent.paragraph1}</p>}
                {mainContent.paragraph2 && <p>{mainContent.paragraph2}</p>}
                {mainContent.paragraph3 && <p>{mainContent.paragraph3}</p>}
                {mainContent.paragraph4 && <p>{mainContent.paragraph4}</p>}
                {mainContent.paragraph5 && <p>{mainContent.paragraph5}</p>}
                {mainContent.paragraph6 && <p>{mainContent.paragraph6}</p>}
                {mainContent.paragraph1 && <p>{mainContent.paragraph1}</p>}
                {mainContent.paragraph2 && <p>{mainContent.paragraph2}</p>}
                {mainContent.paragraph3 && <p>{mainContent.paragraph3}</p>}
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

              <div className="space-y-6 text-[15px] text-text-primary leading-relaxed ">
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
