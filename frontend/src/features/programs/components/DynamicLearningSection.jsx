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

const FeatureCard = ({ feat, idx, renderIcon, disableAnimation }) => (
  <motion.div
    initial={disableAnimation ? false : { opacity: 0, y: 30 }}
    whileInView={disableAnimation ? undefined : { opacity: 1, y: 0 }}
    viewport={disableAnimation ? undefined : { once: true, margin: "-30px" }}
    transition={disableAnimation ? undefined : { duration: 0.5, delay: idx * 0.1 }}
    className="bg-[#666B9F] rounded-[10px] p-6 shadow-md flex flex-col justify-start group h-full w-full"
  >
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-5 shrink-0">
      <span className="text-[#666B9F]">{renderIcon(feat.icon)}</span>
    </div>
    <h3 className="text-[15px] font-bold text-white mb-2 leading-tight">
      {feat.title}
    </h3>
    <p className="text-xs text-white/80 font-normal leading-relaxed">
      {feat.desc}
    </p>
  </motion.div>
);

const DynamicLearningSection = ({ program }) => {
  const badgeText = program?.dynamicLearning?.badgeText || 'ABOUT THE IV';
  const title = program?.dynamicLearning?.title || 'Experience Dynamic Learning';
  const desc1 = program?.dynamicLearning?.desc1 || 'Beyond the classroom, KSBM offers an electrifying campus ecosystem packed with management clubs, national-level conclaves, cultural extravaganzas, and executive workshops.';
  const desc2 = program?.dynamicLearning?.desc2 || 'We believe true leadership is forged through holistic development, peer collaboration, and continuous exposure to diverse real-world scenarios.';
  const images = program?.dynamicLearning?.images && program.dynamicLearning.images.length > 0
    ? program.dynamicLearning.images
    : ['/assets/Images/mba/dynamic_49.png', '/assets/Images/mba/dynamic_60.png'];
  const features = program?.dynamicLearning?.features && program.dynamicLearning.features.length > 0
    ? program.dynamicLearning.features
    : defaultFeatures;

  const renderIcon = (iconProp) => {
    if (React.isValidElement(iconProp)) {
      return iconProp;
    }
    const IconComponent = iconMap[iconProp] || Sparkles;
    return <IconComponent className="w-5 h-5 transition-colors duration-300" />;
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-primary via-primary/80 to-primary/40 relative overflow-hidden font-sans">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Centered ABOUT THE IV */}
        <div className="flex items-center justify-center mb-16 w-full">
          <div className="flex-1 h-[1px] bg-white/30"></div>
          <span className="px-8 text-sm font-semibold tracking-widest text-white uppercase shrink-0">
            {badgeText}
          </span>
          <div className="flex-1 h-[1px] bg-white/30"></div>
        </div>

        {/* Top Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 relative">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start text-left relative z-10"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[35px] font-semibold tracking-normal text-white mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-white/90 text-[15px] sm:text-[15px] leading-relaxed mb-4">
              {desc1}
            </p>
            <p className="text-white/90 text-[15px] sm:text-[15px] leading-relaxed">
              {desc2}
            </p>
          </motion.div>

          {/* Right Images Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center lg:justify-end w-full relative min-h-[300px] sm:min-h-[350px]"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-[280px] sm:h-[340px]">
              <img
                src={images[0] || '/assets/Images/mba/dynamic_49.png'}
                alt="Industrial Visit 1"
                className="absolute top-0 left-0 w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] rounded-[10px] object-cover shadow-2xl z-10"
              />
              <img
                src={images[1] || images[0] || '/assets/Images/mba/dynamic_60.png'}
                alt="Industrial Visit 2"
                className="absolute bottom-0 right-0 w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] rounded-[10px] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
              />

              {/* Image 68 positioned in the empty space between images */}
              <div className="absolute -bottom-10 sm:-bottom-16 left-1 lg:left-1 w-[120px] sm:w-[180px] hidden sm:block opacity-100 z-[15] pointer-events-none">
                <img src="/assets/Images/image 68.png" alt="Decorative element" className="w-full h-auto object-contain" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* What Included Title */}
        <div className="flex items-center mb-8 relative">
          <h3 className="text-[30px] font-semibold text-white pr-4 whitespace-nowrap z-10 relative">
            What Included
          </h3>
          <div className="flex-1 h-[1px] border-t border-dashed border-white/40"></div>
        </div>

        {/* Bottom Feature Cards */}
        {features.length <= 4 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pb-10">
            {features.map((feat, idx) => (
              <FeatureCard key={idx} feat={feat} idx={idx} renderIcon={renderIcon} />
            ))}
          </div>
        ) : (
          <div className="relative w-full overflow-hidden pb-10">
            <style jsx>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                align-items: stretch;
                width: max-content;
                animation: marquee ${Math.max(features.length * 6, 25)}s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="animate-marquee gap-6">
              {[...features, ...features, ...features].map((feat, idx) => (
                <div key={idx} className="w-[280px] shrink-0">
                  <FeatureCard feat={feat} idx={idx} renderIcon={renderIcon} disableAnimation={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicLearningSection;
