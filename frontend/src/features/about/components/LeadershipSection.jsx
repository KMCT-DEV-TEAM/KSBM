"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';

const LeadershipSection = () => {
  const [data, setData] = useState({
    subheading: 'OUR VISIONARY LEADER DR. NAVAS K.M',
    heading: 'Leadership Vision',
    name: 'Dr. Navas K.M',
    title: 'MANAGING TRUSTEE - KMCT',
    description: [
      `"The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."`,
      `We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.`,
      `As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."`
    ],
    image: '/assets/Images/Group 164.png',
    signatureImage: '/assets/Images/image 32.png'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/leadership');
        if (response.data) {
          setData(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching Leadership data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="pb-24 w-full bg-transparent overflow-hidden">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Leader 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32 bg-[#f8f9fc] p-8 lg:p-12 rounded-3xl">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12 relative flex justify-center lg:justify-start pt-8"
          >
            <div className="relative w-[85%] max-w-[380px] aspect-[4/5]">
              {/* Background Shape */}
              <div className="absolute inset-x-8 bottom-0 top-35 bg-primary/30 rounded-[3rem] z-0"></div>

              {/* Leader Image */}
              <img
                src={data.image}
                alt={data.name}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[110%] object-contain object-bottom z-10 drop-shadow-xl"
              />

              {/* Floating Name Card */}
              <div className="absolute -bottom-8 -right-4 lg:-right-10 bg-white rounded-2xl shadow-xl p-4 pr-8 flex items-center gap-4 z-20">
                <img
                  src={data.image}
                  alt="Thumbnail"
                  className="w-12 h-9 rounded-full object-cover object-top border-2 border-gray-100"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-[15px]">{data.name}</span>
                  <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">{data.title}</span>
                </div>
              </div>
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
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-5 h-[1px] bg-primary"></div>
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                {data.title}
              </span>
            </motion.div>
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block"
            >
              {data.subheading}
            </motion.span>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl lg:text-4xl font-semibold text-primary mb-8"
            >
              {data.heading}
            </motion.h2>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6"
            >
              {data.description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
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
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-5 h-[1px] bg-primary"></div>
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                {data.leader2Title || 'PRINCIPAL'}
              </span>
            </motion.div>
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block"
            >
              MEET OUR LEADER
            </motion.span>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl lg:text-4xl font-semibold text-primary mb-8"
            >
              {data.leader2Name || 'Dr. James Starlin'}
            </motion.h2>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6"
            >
              {(data.leader2Description && data.leader2Description.length > 0 ? data.leader2Description : [
                "The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds.",
                "We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.",
                "KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."
              ]).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
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
                src={data.leader2Image || "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80"}
                alt={data.leader2Name || 'Leader'}
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
