"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Users, UserCheck } from 'lucide-react';

const defaultSteps = [
  {
    step: '01',
    title: 'Entrance Score',
    desc: 'CAT / MAT / CMAT / KMAT / ATMA eligibility',
    icon: <FileCheck className="w-7 h-7 text-white" />
  },
  {
    step: '02',
    title: 'Group Discussion',
    desc: 'Demonstrate leadership and communication skills in interactive sessions',
    icon: <Users className="w-7 h-7 text-white" />
  },
  {
    step: '03',
    title: 'Personal Interview',
    desc: 'One-on-one interview assessing passion, aptitude, and career alignment.',
    icon: <UserCheck className="w-7 h-7 text-white" />
  }
];

const renderIcon = (iconObj) => {
  if (!iconObj) return <FileCheck className="w-7 h-7 text-white" />;
  if (typeof iconObj !== 'string') return iconObj;
  
  switch (iconObj) {
    case 'Users': return <Users className="w-7 h-7 text-white" />;
    case 'UserCheck': return <UserCheck className="w-7 h-7 text-white" />;
    case 'FileCheck':
    default: return <FileCheck className="w-7 h-7 text-white" />;
  }
};

const AdmissionJourneySection = ({ data }) => {
  const heading = data?.journeyHeading || 'The Admission Journey';
  const subtitle = data?.journeySubtitle || 'A rigorous, transparent evaluation process designed to identify top talent and build dynamic student cohorts.';
  
  const rawSteps = (data?.journeySteps && data.journeySteps.length > 0) ? data.journeySteps : defaultSteps;
  const stepsList = rawSteps.map((s, idx) => ({
    step: s.step || String(idx + 1).padStart(2, '0'),
    title: s.title || '',
    desc: s.desc || s.description || '',
    icon: renderIcon(s.icon)
  }));

  return (
    <section className="py-20 sm:py-28 bg-[#2a316a] text-white relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight text-white mb-4 font-heading">
            {heading}
          </h2>
          <p className="text-gray-300 text-[15px] sm:text-base font-normal">
            {subtitle}
          </p>
        </motion.div>

        {/* Steps Timeline Container */}
        <div className="relative w-full max-w-5xl mx-auto mt-16 sm:mt-24">
          {/* Horizontal Line - only visible on md and up */}
          <div className="hidden md:block absolute top-[28px] left-1/2 -translate-x-1/2 w-[100vw] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
          
          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-12 md:gap-4">
            {stepsList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center relative flex-1"
              >
                {/* Step Icon Box */}
                <div className="w-[56px] h-[56px] rounded-full bg-[#2a316a] border border-white/60 flex items-center justify-center mb-5 relative z-10">
                  {React.cloneElement(item.icon, { className: 'w-5 h-5 text-white' })}
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-semibold text-white mb-2.5 font-heading">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-gray-300 font-normal leading-relaxed max-w-[220px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdmissionJourneySection;
