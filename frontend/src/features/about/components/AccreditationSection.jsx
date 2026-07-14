"use client";
import React from 'react';
import { motion } from 'framer-motion';
const accredential = "/assets/Images/Group 47.png";

const AccreditationSection = () => {
  return (
    <section className="py-20 w-full bg-transparent overflow-hidden mt-10">
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
        className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        
        <motion.span 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block"
        >
          INSTITUTIONAL CREDENTIALS
        </motion.span>
        <motion.h2 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          className="text-3xl lg:text-4xl font-bold text-primary mb-16"
        >
          Accreditation & Affiliations
        </motion.h2>
        
        <motion.div 
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }}
          className="flex justify-center items-center"
        >
          <img 
            src={accredential} 
            alt="Accreditations" 
            className="w-full max-w-[500px] lg:max-w-[700px] h-auto object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AccreditationSection;
