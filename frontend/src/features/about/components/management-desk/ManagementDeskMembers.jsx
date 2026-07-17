"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ManagementDeskMembers = ({ data }) => {
  const defaultMembers = [
    {
      id: '1',
      name: 'Dr. Navas K. M',
      badgeRole: 'Chairman',
      tag: 'MESSAGE FROM OUR CHAIRMAN',
      title: 'Leadership Vision',
      image: '/assets/Images/Group 164.png',
      thumbnail: '/assets/Images/image 32.png',
      description: [
        "The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge — they reveal the defining nature of KSBM.",
        "We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and at KSBM, this is our overarching commitment to shaping a transformative future.",
        "As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."
      ]
    },
    {
      id: '2',
      name: 'Dr. Ayisha Nazreen',
      badgeRole: 'Vice Chairman',
      tag: 'MESSAGE FROM OUR VICE CHAIRMAN',
      title: 'Leadership Vision',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: [
        "The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds.",
        "We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.",
        "KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."
      ]
    },
    {
      id: '3',
      name: 'Dr. James Starlin',
      badgeRole: 'Executive Director',
      tag: 'MESSAGE FROM OUR DIRECTOR',
      title: 'Leadership Vision',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: [
        "In an era defined by rapid technological shifts and global transformation, management education must remain adaptive and innovative. At KSBM, we prepare our graduates to not only respond to industry evolution but to actively drive change and foster sustainable enterprises.",
        "Our commitment to academic excellence and industrial synergy empowers students with deep analytical rigor, strategic foresight, and hands-on leadership capabilities. We invite ambitious minds to embark on this transformative journey with us."
      ]
    }
  ];

  const members = data?.members && data.members.length > 0 ? data.members : defaultMembers;

  return (
    <section className="pb-28 relative w-full overflow-hidden">
      {/* Primary Color Line Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: '150px 150px',
          backgroundPosition: '75px 75px',
          maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
        }}
      />


      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 100, ease: "linear", repeat: Infinity }}
        className="absolute bottom-[20%] left-0 -translate-x-1/2 w-[320px] md:w-[360px] h-[320px] md:h-[360px] opacity-50 pointer-events-none select-none z-0"
      >
        <div
          className="w-full h-full bg-primary"
          style={{
            maskImage: `url('/assets/Images/watermark_logo.png')`,
            WebkitMaskImage: `url('/assets/Images/watermark_logo.png')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      </motion.div>

      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32 relative z-10">
        {members.map((member, index) => {
          const isEven = index % 2 === 0; // Even: Image Left, Content Right. Odd: Content Left, Image Right.

          return (
            <div
              key={member.id || index}
              id={`member-${index}`}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 relative z-10`}
            >
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-5/12 flex flex-col items-center relative"
              >
                <div className="relative w-full max-w-[315px] aspect-[4/5] flex justify-center items-end bg-gradient-to-b from-gray-50/80 to-primary/5 rounded-3xl overflow-hidden shadow-sm">
                  <img
                    src={member.image || 'https://via.placeholder.com/400x500'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Floating Name & Role Badge */}
                <div className="bg-white rounded-2xl shadow-xl p-3 pr-6 flex items-center gap-3.5 -mt-8 relative z-20 max-w-[320px] w-full mx-auto">
                  <img
                    src={member.thumbnail || member.image || 'https://via.placeholder.com/100'}
                    alt={member.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h4>
                    <span className="text-[11px] text-gray-500 font-semibold tracking-wide truncate">{member.badgeRole || member.role}</span>
                  </div>
                </div>
              </motion.div>

              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-7/12 flex flex-col relative"
              >
                {/* Giant Quotation Watermark */}
                <div className={`absolute ${index === 1 || !isEven ? '-top-12 sm:-top-16' : '-top-6'} ${isEven ? 'right-0' : 'left-0'} opacity-90 pointer-events-none select-none`}>
                  <img
                    src="/assets/Images/quote 1.png"
                    alt="Quotation mark"
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-contain ${index === 1 || !isEven ? 'scale-x-[-1]' : ''}`}
                  />
                </div>

                {/* Tag with horizontal line */}
                <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                  {member.tag || 'MESSAGE FROM LEADER'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2b2b68] mb-4 relative z-10 tracking-tight">
                {member.title || 'Leadership Vision'}
              </h3>

              {/* Description Paragraphs */}
              <div className="space-y-4 text-gray-600 text-xs sm:text-sm leading-relaxed relative z-10 font-normal">
                {(Array.isArray(member.description) && member.description.length > 0
                  ? member.description
                  : [typeof member.description === 'string' ? member.description : '']
                ).map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </motion.div>
          </div>
        );
      })}
      </div>
    </section>
  );
};

export default ManagementDeskMembers;
