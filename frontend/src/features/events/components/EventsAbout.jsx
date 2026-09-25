"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const EventsAbout = ({ about }) => {
  const router = useRouter();

  const defaultData = {
    subheading: 'About',
    heading: 'THE SPIRIT OF CULTURE',
    paragraph1: "Discover a celebration where creativity knows no limits and every performance tells a story worth remembering. Kaleido is more than a cultural festival—it's a vibrant platform where passion meets purpose, traditions blend with innovation, and talent shines without boundaries. Bringing together students, artists, performers, and creative minds from diverse backgrounds, the festival transforms the campus into a spectacular stage filled with energy, color, and inspiration.",
    paragraph2: "Immerse yourself in a world of mesmerizing dance performances, soul-stirring music, captivating theatre, expressive fine arts, photography, fashion, literature, and countless cultural experiences that celebrate the richness of artistic expression. Whether you're stepping into the spotlight as a performer, competing to showcase your skills, cheering for your peers, or simply enjoying the electrifying atmosphere, every moment at Kaleido is designed to inspire, connect, and create lasting memories.",
    image: '/assets/Images/image 91.png',
    brochureUrl: '',
    calendarUrl: ''
  };
  const data = about || defaultData;

  return (
    <section className="relative w-full px-6 md:px-12 lg:px-24 overflow-hidden z-0">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex justify-center md:justify-start order-2 md:order-1"
        >
          <img
            src={data.image || '/assets/Images/image 91.png'}
            alt="Events About"
            className="w-full max-w-[70%] md:max-w-sm lg:max-w-md object-contain rounded-[24px] relative z-10"
          />
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:gap-6 relative z-10 order-1 md:order-2"
        >
          {/* Background Radial Glow/Shade */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-[-1] pointer-events-none opacity-35 blur-[60px]"
            style={{ backgroundImage: 'radial-gradient(circle at center, #2B2F66 20%, rgba(115, 115, 115, 0) 100%)' }}
          ></div>
          {/* Subheading */}
          <h5 className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-1 md:mb-2 text-text-secondary">
            {data.subheading || 'About'}
          </h5>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-primary tracking-wide uppercase leading-tight drop-shadow-sm break-words">
            {data.heading || 'THE SPIRIT OF CULTURE'}
          </h2>

          {/* Paragraphs */}
          <div className="text-text-primary text-sm md:text-[15px] leading-relaxed space-y-4 md:space-y-6 font-medium whitespace-pre-line break-words text-justify">
            {data.paragraph1 && <p>{data.paragraph1}</p>}
            {data.paragraph2 && <p>{data.paragraph2}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-4 md:mt-6 relative z-10">
            {data.brochureUrl ? (
              <button onClick={() => router.push(`/pdf-viewer?url=${encodeURIComponent(data.brochureUrl)}&title=${encodeURIComponent(data.brochureBtnText || 'Event Brochure')}`)} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md bg-primary text-white font-semibold text-xs sm:text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(43,47,102,0.4)] cursor-pointer">
                {data.brochureBtnText || 'Event Brochure'}
              </button>
            ) : (
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md bg-primary text-white font-semibold text-xs sm:text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(43,47,102,0.4)] opacity-70 cursor-not-allowed">
                {data.brochureBtnText || 'Event Brochure'}
              </button>
            )}
            {data.calendarUrl ? (
              <button onClick={() => router.push(`/pdf-viewer?url=${encodeURIComponent(data.calendarUrl)}&title=${encodeURIComponent(data.calendarBtnText || 'Download Calendar')}`)} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md border-[1.5px] border-primary text-primary font-semibold text-xs sm:text-sm hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer">
                {data.calendarBtnText || 'Download Calendar'}
              </button>
            ) : (
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md border-[1.5px] border-primary text-primary font-semibold text-xs sm:text-sm hover:bg-primary/10 transition-colors duration-300 opacity-70 cursor-not-allowed">
                {data.calendarBtnText || 'Download Calendar'}
              </button>
            )}
          </div>



        </motion.div>
      </div>
    </section>
  );
};

export default EventsAbout;
