import React from 'react';
import { motion } from 'framer-motion';

const GrievanceHero = ({ heroData }) => {
  const title = heroData?.title || 'Grievance Form';
  const subtitle = heroData?.subtitle || 'Submit your concerns securely through our Grievance Portal. Whether your grievance is related to academics, administration, facilities, or campus services, your feedback is handled with confidentiality, fairness, and transparency. Our dedicated grievance cells ensure every concern is reviewed promptly to foster a safe, supportive, and student-centric learning environment.';
  const bgImage = heroData?.backgroundImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-[#2B2F66]/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-[17px] leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GrievanceHero;
