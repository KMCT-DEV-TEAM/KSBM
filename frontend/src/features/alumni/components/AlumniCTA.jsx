"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AlumniCTA = ({ data }) => {
  return (
    <section className="relative overflow-hidden w-full pb-16 pt-6 bg-[#fcfcfd]">
      <div className="relative z-10 w-[98%] max-w-[1370px] mx-auto rounded-2xl md:rounded-[1.5rem] px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg bg-[#2b2b68] text-white overflow-hidden border border-white/10">
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full pointer-events-none blur-2xl" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 flex-1 space-y-3 text-center lg:text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-tight">
            {data?.title || 'Join the KMCT Alumni Network'}
          </h2>
          <p className="text-white/80 text-[11px] md:text-xs max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            {data?.subtitle || 'Stay connected with your alma mater, network with fellow peers, and participate in exclusive leadership and mentoring initiatives.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 flex-shrink-0 lg:mr-8 xl:mr-12"
        >
          <Link
            href={data?.buttonLink || "#register"}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#2b2b68] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            {data?.buttonText || 'View Details'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AlumniCTA;
