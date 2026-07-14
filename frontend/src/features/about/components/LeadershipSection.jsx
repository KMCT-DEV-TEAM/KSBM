"use client";
import React from 'react';
import { motion } from 'framer-motion';

const LeadershipSection = () => {
  return (
    <section className="py-24 w-full bg-transparent overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Leader 1: Dr. Navas K.M */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32 bg-[#f8f9fc] p-8 lg:p-12 rounded-3xl">
          {/* Left Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12 relative"
          >
            <div className="relative w-full h-auto">
              <img 
                src="/assets/Images/Group 164.png" 
                alt="Dr. Navas K.M" 
                className="w-full h-auto object-contain"
              />
            </div>

          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="w-full lg:w-7/12 flex flex-col"
          >
            <motion.span 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4"
            >
              OUR VISIONARY LEADER DR. NAVAS K.M
            </motion.span>
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl lg:text-4xl font-bold text-primary mb-8"
            >
              Leadership Vision
            </motion.h2>
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6"
            >
              <p>
                "The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."
              </p>
              <p>
                We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.
              </p>
              <p>
                As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Leader 2: Dr. James Starlin */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="w-full lg:w-7/12 flex flex-col"
          >
            <motion.span 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4"
            >
              PRINCIPAL
            </motion.span>
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl lg:text-4xl font-bold text-primary mb-8"
            >
              Dr. James Starlin
            </motion.h2>
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6"
            >
              <p>
                "The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."
              </p>
              <p>
                We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.
              </p>
              <p>
                KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."
              </p>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl h-[450px]">
              <img 
                src="https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80" 
                alt="Dr. James Starlin" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default LeadershipSection;
