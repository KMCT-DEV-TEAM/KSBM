import React from 'react';
import { motion } from 'framer-motion';

const PlacementCommittee = ({ data }) => {
  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Side - Vector Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-5/12 flex justify-center"
          >
            <img
              src={data.image || "/assets/Images/placement.png"}
              alt="Placement Committee Illustration"
              className="w-full max-w-md mix-blend-multiply"
            />
          </motion.div>

          {/* Right Side - Content & Profiles */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-7/12 flex flex-col gap-10"
          >

            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                {data.title}
              </h2>
              <p className="text-text-secondary text-[15px] mb-8 leading-relaxed max-w-xl">
                {data.description}
              </p>
              <button className="px-6 py-2 rounded-[18px] border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                {data.buttonText}
              </button>
            </div>

            {data.items && data.items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {data.items.map((member, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-gray-900 font-semibold text-[15px]">{member.name}</h4>
                    <p className="text-primary text-[13px] font-medium">{member.role}</p>
                  </div>
                ))}
              </div>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PlacementCommittee;
