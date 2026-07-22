import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ExcellenceSupport = ({ data }) => {
  if (!data) return null;

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${data.backgroundImage || '/assets/Images/Rectangle 67.png'}')` }}
    >
      {/* Dark blue overlay to ensure text is readable over the image */}
      <div className="absolute inset-0 bg-primary/90"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >

        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">{data.title}</motion.h2>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-16 leading-relaxed">
          {data.description}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* Card 1 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="bg-white/15 border border-white/30 backdrop-blur-sm rounded-[18px] p-8 md:p-12 text-left shadow-2xl transition-transform duration-300 hover:-translate-y-1">
            <ul className="space-y-6">
              {data.listOne?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                  <span className="text-[15px] font-small">{item.title || item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }} className="bg-white/15  border border-white/30 backdrop-blur-sm rounded-[18px] p-8 md:p-12 text-left shadow-2xl transition-transform duration-300 hover:-translate-y-1">
            <ul className="space-y-6">
              {data.listTwo?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                  <span className="text-[15px] font-small">{item.title || item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default ExcellenceSupport;
