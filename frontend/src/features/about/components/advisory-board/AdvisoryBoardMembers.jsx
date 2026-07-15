"use client";
import React from 'react';
import { motion } from 'framer-motion';

const membersData = [
  // First Row
  { id: 1, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 2, name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", img: "/assets/Images/image 31.png" },
  { id: 3, name: "Dr. Shmmon M", title: "MEMBER SECRETARY", img: "/assets/Images/image 31.png" },
  // Second Row
  { id: 4, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 5, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 6, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 7, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  // Third Row
  { id: 8, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 9, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 10, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
  { id: 11, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/image 31.png" },
];

const AdvisoryBoardMembers = () => {
  return (
    <section className="pb-20 w-[98%] max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Row 1 (3 items) */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {membersData.slice(0, 3).map((member, idx) => (
          <MemberCard key={member.id} member={member} index={idx} />
        ))}
      </div>

      {/* Row 2 (4 items) */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {membersData.slice(3, 7).map((member, idx) => (
          <MemberCard key={member.id} member={member} index={idx + 3} />
        ))}
      </div>

      {/* Row 3 (4 items) */}
      <div className="flex flex-wrap justify-center gap-6">
        {membersData.slice(7, 11).map((member, idx) => (
          <MemberCard key={member.id} member={member} index={idx + 7} />
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
      className="w-full sm:w-[240px] md:w-[260px] flex flex-col items-center group cursor-pointer"
    >
      {/* Image Container with Custom Shape Background */}
      <div className="relative w-full aspect-[4/5] mb-[-20px] z-0 transition-transform duration-300 group-hover:-translate-y-2">
        {/* Layered Background Effect */}
        <div className="absolute inset-0 bg-[#f6f7f9] rounded-[45px] z-0 border border-gray-100 group-hover:shadow-xl transition-shadow duration-300"></div>
        <div className="absolute inset-0 bg-[#eaeaef]/70 rounded-[45px] -z-10 translate-y-3 -translate-x-3 scale-[0.98]"></div>

        {/* Member Image */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-[45px]">
          <img 
            src={member.img} 
            alt={member.name} 
            className="w-[90%] h-auto object-contain object-bottom pointer-events-none mix-blend-multiply"
          />
        </div>
      </div>

      {/* Name and Title Bar */}
      <div className="w-full bg-[#454e7d] rounded-lg py-3 px-2 text-center z-10 shadow-md">
        <h4 className="text-white font-bold text-sm md:text-[15px]">
          {member.name}
        </h4>
        <p className="text-white/70 text-[9px] font-bold tracking-widest uppercase mt-1 flex items-center justify-center gap-1">
          <span className="text-[7px]">♦</span> {member.title}
        </p>
      </div>
    </motion.div>
  );
};

export default AdvisoryBoardMembers;
