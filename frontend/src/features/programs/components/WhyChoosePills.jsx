"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Briefcase, Globe, Award, Sparkles, Trophy, Target, TrendingUp, Zap, Shield, Heart } from 'lucide-react';

const iconMap = {
  BookOpen, Users, Briefcase, Globe, Award, Sparkles, Trophy, Target, TrendingUp, Zap, Shield, Heart
};

const defaultPillItems = [
  {
    title: 'Management',
    description: 'Strategic Execution.',
    icon: 'BookOpen'
  },
  {
    title: 'Leadership',
    description: 'Visionary Guidance.',
    icon: 'Users'
  },
  {
    title: 'Analytics',
    description: 'Data-Driven Insights.',
    icon: 'Briefcase'
  },
  {
    title: 'Collaboration',
    description: 'Cross-Functional Teams.',
    icon: 'Globe'
  },
  {
    title: 'Innovation',
    description: 'Futuristic Innovation.',
    icon: 'Award'
  }
];

const WhyChoosePills = ({ program }) => {
  const badgeText = program?.whyChoosePills?.badgeText || 'LEARNING GOALS';
  const titleText = program?.whyChoosePills?.title || 'Key Learning Dimensions';
  const items = program?.whyChoosePills?.items && program.whyChoosePills.items.length > 0
    ? program.whyChoosePills.items
    : defaultPillItems;

  const renderIcon = (iconProp) => {
    if (React.isValidElement(iconProp)) {
      return iconProp;
    }
    const IconComponent = iconMap[iconProp] || Sparkles;
    return <IconComponent className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />;
  };

  return (
    <section className="py-20 lg:py-24 bg-[#fcfcfd] relative border-y border-gray-100">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-text-secondary uppercase mb-3 px-3.5 py-1.5">
            {badgeText}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold tracking-tight text-primary mt-2 font-heading">
            {titleText}
          </h2>
        </motion.div>

        {/* Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(27,37,89,0.15)] border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300 text-primary">
                {renderIcon(item.icon)}
              </div>
              <h3 className="text-[18px] font-medium text-black group-hover:text-primary transition-colors duration-300 mb-2 leading-snug font-heading">
                {item.title}
              </h3>
              <p className="text-[16px] sm:text-sm text-text-secondary font-normal leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoosePills;
