import React from 'react';
import { resolveImage } from '../../../utils/resolveImage';
import { motion } from 'framer-motion';

const defaultFaculty = [
  { name: 'Faculty In Charge', designation: 'Placement Officer', image: '/assets/Images/placements/achiever_1.png' }
];

const FacultyInCharge = ({ data }) => {
  if (data?.showSection === false && !data?.isPreview) return null;
  const facultyMembers = (data?.items && data.items.length > 0) ? data.items : defaultFaculty;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            {data?.showBadge !== false && (
              <h2 className="text-[18px] font-medium text-text-secondary mb-3">{data.badge}</h2>
            )}
            {data?.showTitle !== false && (
              <h1 className='text-primary text-[28px] font-semibold mb-4'>{data.title}</h1>
            )}
            {data?.showDescription !== false && (
              <p className="text-text-secondary text-[15px] leading-relaxed max-w-lg">
                {data.description}
              </p>
            )}
          </motion.div>

          {/* Right Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 flex flex-col sm:flex-row gap-6 justify-end"
          >
            {facultyMembers.map((faculty, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden shadow-lg w-full sm:w-[220px] lg:w-[260px] aspect-[3/4] group">
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Info Box */}
                <div style={{ borderRadius: "0 12px 12px 0" }} className="absolute bottom-6 left-0 bg-white/60 backdrop-blur-md py-3 pl-4 pr-5 max-w-[90%] shadow-md transition-all duration-300 hover:max-w-[95%] z-10 group/box hover:bg-white/80">
                  <h3 title={faculty.name} className="font-bold text-[#2b2b68] text-[15px] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis group-hover/box:whitespace-normal">{faculty.name}</h3>
                  <p title={faculty.designation} className="text-xs text-gray-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis group-hover/box:whitespace-normal">{faculty.designation}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FacultyInCharge;
