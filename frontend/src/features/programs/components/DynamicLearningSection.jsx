"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Trophy, Briefcase, Sparkles, BookOpen, Globe, Target, TrendingUp, Zap, Shield, Heart } from 'lucide-react';

const iconMap = {
  Users, Award, Trophy, Briefcase, Sparkles, BookOpen, Globe, Target, TrendingUp, Zap, Shield, Heart
};

const defaultFeatures = [
  {
    title: 'Management Clubs',
    desc: 'Specialized student-led clubs in Finance, Marketing, HR, and Entrepreneurship.',
    icon: 'Users'
  },
  {
    title: 'Leadership Conclaves',
    desc: 'Annual summits bringing top business leaders and innovators to campus.',
    icon: 'Award'
  },
  {
    title: 'Cultural & Sports',
    desc: 'National-level fests, athletic tournaments, and vibrant community celebrations.',
    icon: 'Trophy'
  },
  {
    title: 'Corporate Workshops',
    desc: 'Intensive bootcamps on AI in business, advanced Excel, and executive presence.',
    icon: 'Briefcase'
  }
];

const DynamicLearningSection = ({ program }) => {
  const badgeText = program?.dynamicLearning?.badgeText || 'ABOUT THE IV';
  const title = program?.dynamicLearning?.title || 'Experience Dynamic Learning';
  const desc1 = program?.dynamicLearning?.desc1 || 'Beyond the classroom, KSBM offers an electrifying campus ecosystem packed with management clubs, national-level conclaves, cultural extravaganzas, and executive workshops.';
  const desc2 = program?.dynamicLearning?.desc2 || 'We believe true leadership is forged through holistic development, peer collaboration, and continuous exposure to diverse real-world scenarios.';
  const images = program?.dynamicLearning?.images && program.dynamicLearning.images.length > 0
    ? program.dynamicLearning.images
    : ['/assets/Images/image 49.png', '/assets/Images/image 60.png'];
  const features = program?.dynamicLearning?.features && program.dynamicLearning.features.length > 0
    ? program.dynamicLearning.features
    : defaultFeatures;

  const renderIcon = (iconProp) => {
    if (React.isValidElement(iconProp)) {
      return iconProp;
    }
    const IconComponent = iconMap[iconProp] || Sparkles;
    return <IconComponent className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />;
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#303580]/95 via-[#303580]/80 to-[#303580]/60 relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Perfectly Aligned IV Badge & Accent Line */}
            <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold tracking-[0.25em] text-blue-200 uppercase mb-4">
              <span className="w-10 sm:w-14 h-[2px] bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shrink-0" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-white mb-6 leading-[1.2] font-heading">
              {title}
            </h2>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed mb-5 font-normal">
              {desc1}
            </p>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed font-normal">
              {desc2}
            </p>
          </motion.div>

          {/* Right Images Collage - Neatly Aligned Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex justify-center w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full items-center">
              <div className="w-full">
                <div className="rounded-[2.2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/20 h-[320px] sm:h-[380px] bg-gray-900 relative group">
                  <img
                    src={images[0] || '/assets/Images/image 49.png'}
                    alt="Industrial Visit & Campus Life 1"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              </div>

              <div className="w-full sm:mt-8">
                <div className="rounded-[2.2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/20 h-[320px] sm:h-[380px] bg-gray-900 relative group">
                  <img
                    src={images[1] || images[0] || '/assets/Images/image 60.png'}
                    alt="Industrial Visit & Campus Life 2"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Feature Cards - Perfectly Aligned Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300 text-primary shrink-0 shadow-sm">
                  {renderIcon(feat.icon)}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-300 mb-2.5 font-heading">
                  {feat.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/80 font-normal leading-relaxed mt-1">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DynamicLearningSection;
