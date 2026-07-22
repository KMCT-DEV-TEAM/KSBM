import React from 'react';
import { motion } from 'framer-motion';

const ProudAchievers = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;
  const achievers = data.items;
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/95 to-primary/50 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'linear-gradient(to right, black 0%, transparent 15%, transparent 85%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 15%, transparent 85%, black 100%)'
        }}>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >

        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{data.title}</h2>
          <div className="flex-1 h-px bg-white/20"></div>
        </motion.div>

        {/* Infinite Scroll Container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden w-full relative -mx-4 px-4 sm:mx-0 sm:px-0"
        >

          {/* Line 1 - Moving Left */}
          <motion.div
            className="flex w-max gap-6 md:gap-8 py-4 mb-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {[...achievers, ...achievers, ...achievers, ...achievers].map((achiever, index) => (
              <div
                key={`l1-${achiever.id}-${index}`}
                className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0 group flex flex-col gap-4"
              >
                {/* Image Card Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={achiever.image}
                      alt={achiever.name}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Overlay Box matching screenshot */}
                    <div className="absolute bottom-6 left-0 bg-white/70 backdrop-blur-md py-3 px-5 pr-12 rounded-r-[18px] shadow-lg border border-white/50 border-l-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-semibold text-[14px] leading-tight">Placed at</h4>
                        <img src={achiever.companyLogo} alt={achiever.company} className="h-4 max-w-[80px] object-contain" />
                      </div>
                      <p className="text-gray-500 text-[12px] font-medium leading-tight">{achiever.role}</p>
                    </div>
                  </div>
                </div>

                {/* Text underneath the image (on blue background) */}
                <div className="text-center px-2">
                  <h3 className="text-lg font-medium text-white">{achiever.name}</h3>
                  <p className="text-[12px] font-medium text-gray-200 mt-0.5">{achiever.program}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Line 2 - Moving Right */}
          <motion.div
            className="flex w-max gap-6 md:gap-8 py-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {[...achievers, ...achievers, ...achievers, ...achievers].map((achiever, index) => (
              <div
                key={`l2-${achiever.id}-${index}`}
                className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0 group flex flex-col gap-4"
              >
                {/* Image Card Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={achiever.image}
                      alt={achiever.name}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Overlay Box matching screenshot */}
                    <div className="absolute bottom-6 left-0 bg-white/70 backdrop-blur-md py-3 px-5 pr-12 rounded-r-[18px] shadow-lg border border-white/50 border-l-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-semibold text-[14px] leading-tight">Placed at</h4>
                        <img src={achiever.companyLogo} alt={achiever.company} className="h-4 max-w-[80px] object-contain" />
                      </div>
                      <p className="text-gray-500 text-[12px] font-medium leading-tight">{achiever.role}</p>
                    </div>
                  </div>
                </div>

                {/* Text underneath the image (on blue background) */}
                <div className="text-center px-2">
                  <h3 className="text-lg font-medium text-white">{achiever.name}</h3>
                  <p className="text-[12px] font-medium text-gray-200 mt-0.5">{achiever.program}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default ProudAchievers;
