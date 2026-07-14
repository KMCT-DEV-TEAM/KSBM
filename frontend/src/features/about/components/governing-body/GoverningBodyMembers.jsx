"use client";
import React from 'react';
import { motion } from 'framer-motion';

const membersData = [
  // First Row
  { id: 1, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 2, name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", img: "/assets/Images/hhh.png" },
  { id: 3, name: "Dr. Sujith Varma", title: "MEMBER SECRETARY", img: "/assets/Images/hhh.png" },
  // Second Row
  { id: 4, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 5, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 6, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 7, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  // Third Row
  { id: 8, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 9, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 10, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
  { id: 11, name: "Dr. Navas K M", title: "CHAIRMAN", img: "/assets/Images/hhh.png" },
];

const GoverningBodyMembers = () => {
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="w-full sm:w-[240px] md:w-[260px] flex flex-col items-center group cursor-pointer"
    >
      {/* Image Container with Custom Shape Background */}
      <div className="relative w-full aspect-[4/5] bg-[#f4fafe] rounded-t-[100px] rounded-b-3xl overflow-hidden flex items-end justify-center mb-[-20px] z-0 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg border border-gray-100">
        {/* Using a placeholder for headshots until provided */}
        <img 
          src={member.img} 
          alt={member.name} 
          className="w-[90%] h-auto object-contain object-bottom pointer-events-none mix-blend-multiply"
        />
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

export default GoverningBodyMembers;
