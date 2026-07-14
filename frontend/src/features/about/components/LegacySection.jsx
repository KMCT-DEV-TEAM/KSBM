"use client";
import React from 'react';
import { motion } from 'framer-motion';

const LegacySection = () => {
  return (
    <section className="py-20 bg-transparent">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-[450px]"
          >
            <img 
              src="/assets/Images/image 2.png" 
              alt="KSBM Legacy" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="flex flex-col"
          >
            <motion.span 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              OUR IDENTITY
            </motion.span>
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl lg:text-4xl font-bold text-primary mb-8 leading-snug"
            >
              A Legacy of Strategic Excellence.
            </motion.h2>
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6"
            >
              <p>
                Founded with a vision to revolutionize business leadership in the region, KSBM has consistently pushed the boundaries of traditional management education. We are not merely an institution; it is a transformative space where students are not just participants in commerce, but leaders of it.
              </p>
              <p>
                Our curriculum is meticulously crafted to reflect the complexities of the global economy, emphasizing critical thinking, strategic foresight, and an entrepreneurial mindset. We empower our students to see beyond immediate numbers and shape the architects of commerce.
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
