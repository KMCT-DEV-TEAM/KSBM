import React from 'react';
import { motion } from 'framer-motion';

const GrievanceInfo = ({ infoData }) => {
  const title = infoData?.title || 'Grievance Redressal';
  const description = infoData?.description || 'Our Grievance Redressal System is committed to fostering a safe, inclusive, and respectful campus environment where every student, faculty member, and staff member can voice their concerns with confidence. Through a transparent, fair, and confidential grievance resolution process, we ensure that issues related to academics, administration, campus facilities, student welfare, workplace conduct, and other institutional matters are addressed promptly and impartially. Managed by dedicated grievance committees, the system encourages open communication, accountability, and timely resolution while upholding the principles of integrity, equality, and justice. By listening to every concern and taking meaningful action, we strive to strengthen trust, enhance campus well-being, and create a supportive learning environment for the entire academic community.';
  const image = infoData?.image || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop';

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap">
                {title}
              </h2>
              <div className="w-full h-[1px] bg-gray-200 rounded-full"></div>
            </div>
            
            <p className="text-gray-500 leading-[1.8] text-[15px] md:text-[16px] text-justify">
              {description}
            </p>
          </motion.div>

          {/* Right Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default GrievanceInfo;
