"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../../api/axios';

const AdvisoryBoardMembers = () => {
  const [members, setMembers] = useState([
    { id: 1, name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
    { id: 2, name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", image: "/assets/Images/image 31.png" },
    { id: 3, name: "Dr. Shmmon M", title: "MEMBER SECRETARY", image: "/assets/Images/image 31.png" },
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
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/advisory-board');
        if (response.data && response.data.members && response.data.members.length > 0) {
          setMembers(response.data.members);
        }
      } catch (error) {
        console.error('Error fetching Advisory Board data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <section className="pb-20 w-[98%] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-12 lg:gap-y-16">
        {members.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-12">
            {members.slice(0, 3).map((member, idx) => (
              <MemberCard key={member._id || idx} member={member} index={idx} />
            ))}
          </div>
        )}
        
        {members.length > 3 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-12">
            {members.slice(3).map((member, idx) => (
              <MemberCard key={member._id || (idx + 3)} member={member} index={idx + 3} />
            ))}
          </div>
        )}
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
      className="w-full sm:w-[240px] md:w-[260px] flex flex-col items-center group cursor-pointer pt-12"
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
        <div className="absolute bottom-6 -left-10 right-0 flex justify-center z-10 pointer-events-none">
          <img
            src={member.image || member.img}
            alt={member.name}
            className="w-[150%] h-auto object-contain object-bottom drop-shadow-md"
          />
        </div>
      </div>

      {/* Name and Title Bar */}
      <div className="w-[92%] bg-[#3b4179] rounded-[16px] py-4 px-2 text-center z-20 -mt-14 shadow-lg shadow-black/20">
        <h4 className="text-white font-bold text-sm md:text-[16px]">
          {member.name}
        </h4>
        <p className="text-[#a6adcf] text-[10px] font-bold tracking-widest uppercase mt-1.5 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a6adcf]"></span> {member.title}
        </p>
      </div>
    </motion.div>
  );
};

export default AdvisoryBoardMembers;
