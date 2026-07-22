import React from 'react';
import { motion } from 'framer-motion';

const PlacementActivities = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;
  const activities = data.items;
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-primary">{data.title}</h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </motion.div>

        {/* Infinite Scroll Container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden w-full relative -mx-4 px-4 sm:mx-0 sm:px-0"
        >

          <motion.div
            className="flex w-max gap-8 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25 // 25 seconds for half scroll (adjust for speed)
            }}
          >
            {[...activities, ...activities, ...activities, ...activities].map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                className="w-[280px] sm:w-[350px] md:w-[450px] flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-[14px] leading-relaxed mb-4">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default PlacementActivities;
