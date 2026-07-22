import React from 'react';
import { motion } from 'framer-motion';

const FacultyInCharge = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;
  const facultyMembers = data.items;

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
            <h2 className="text-[18px] font-medium text-text-secondary mb-3">{data.badge}</h2>
            <h1 className='text-primary text-[28px] font-semibold mb-4'>{data.title}</h1>
            <p className="text-text-secondary text-[15px] leading-relaxed max-w-lg">
              {data.description}
            </p>
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
              <div key={index} className="relative rounded-2xl overflow-hidden shadow-lg w-full sm:w-[220px] lg:w-[260px] aspect-[3/4]">
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating Info Box */}
                <div className="absolute bottom-4 left-0 right-15 bg-white/55 backdrop-blur-sm rounded-r-[18px] p-4 shadow-sm">
                  <h3 className="text-[#2b2b68] font-bold text-[15px] mb-1 leading-tight">{faculty.name}</h3>
                  <p className="text-gray-700 text-xs font-semibold">{faculty.designation}</p>
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
