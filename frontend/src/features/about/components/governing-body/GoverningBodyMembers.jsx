"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../../api/axios';

const GoverningBodyMembers = ({ data }) => {
  const [members, setMembers] = useState([
    { id: 1, name: "Dr. Navas K M", title: "Managing Trustee", image: "/assets/Images/image 31.png" },
    { id: 2, name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", image: "/assets/Images/image 31.png" },
    { id: 3, name: "Dr. Sujith Varma", title: "MEMBER SECRETARY", image: "/assets/Images/image 31.png" },
    { id: 4, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 5, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 6, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 7, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 8, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 9, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 10, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 11, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
  ]);

  useEffect(() => {
    if (data && data.members && data.members.length > 0) {
      setMembers(data.members);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/governing-body', { hideLoader: true });
        if (response.data && response.data.members && response.data.members.length > 0) {
          setMembers(response.data.members);
        }
      } catch (error) {
        console.error('Error fetching Governing Body data:', error);
      }
    };
    if (!data) {
      fetchData();
    }
  }, [data]);

  if (data?.showMembers === false && !data?.previewType) return null;

  return (
    <section className="pb-20 w-[98%] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 lg:gap-y-16">
        {members.length > 0 && members.map((member, idx) => (
          <React.Fragment key={member._id || idx}>
            <MemberCard member={member} index={idx} />
            {/* Force a break after the 3rd element on desktop to keep the 3-item top row */}
            {idx === 2 && members.length > 3 && (
              <div className="hidden lg:block w-full h-0 m-0 p-0 -mt-16 pointer-events-none"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

const MemberCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, type: "spring", stiffness: 100 }}
      className="w-[calc(50%-12px)] sm:w-[240px] md:w-[260px] flex flex-col items-center group cursor-pointer pt-8 sm:pt-12"
    >
      {/* Image Container with Custom Shape Background */}
      <div className="relative w-full aspect-[4/5] z-0 transition-transform duration-300 group-hover:-translate-y-2">
        {/* Background Image */}
        <img
          src="/assets/Images/Background.png"
          alt="Card Background"
          className="absolute inset-0 w-full h-full object-contain z-0 transition-all duration-300 group-hover:drop-shadow-xl"
        />

        {/* Member Image - Breaking out of the top */}
        {member.showImage !== false && (
          <div className="absolute bottom-4 sm:bottom-6 -left-6 sm:-left-10 right-0 flex justify-center z-10 pointer-events-none">
            <img
              src={member.image || member.img}
              alt={member.name}
              className="w-[140%] sm:w-[150%] h-auto object-contain object-bottom drop-shadow-md"
            />
          </div>
        )}
      </div>

      {/* Name and Title Bar */}
      <div className="w-[98%] sm:w-[92%] bg-[#3b4179] rounded-[12px] sm:rounded-[16px] py-3 sm:py-4 px-1 sm:px-2 text-center z-20 -mt-10 sm:-mt-14 shadow-lg shadow-black/20">
        {member.showName !== false && (
          <h4 className="text-white font-bold text-xs sm:text-sm md:text-[16px] leading-tight mb-1 sm:mb-0">
            {member.name}
          </h4>
        )}
        {member.showTitle !== false && (
          <p className="text-[#a6adcf] text-[8px] sm:text-[10px] font-bold tracking-widest uppercase sm:mt-1.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-[1.1] sm:leading-normal">
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#a6adcf] shrink-0"></span> {member.title}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GoverningBodyMembers;
