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

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PlacementCommittee;
