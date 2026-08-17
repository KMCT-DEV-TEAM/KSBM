"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye } from 'lucide-react';
import api from '../../../api/axios';

const VisionMissionSection = ({ previewData }) => {
  const visionScrollRef = useRef(null);
  const visionFloatScrollRef = useRef(0);
  
  const missionScrollRef = useRef(null);
  const missionFloatScrollRef = useRef(0);
  
  const sectionRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);
  
  const [data, setData] = useState({
    visionTitle: 'Our Vision',
    visionContent: ['"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."'],
    visionImage: '/assets/Images/image 27.png',
    missionTitle: 'Our Mission',
    missionContent: [
      'To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.',
      'To provide high-quality healthcare education that integrates academic excellence with clinical practice.',
      'To foster a culture of continuous learning, ethical practice, and compassionate patient care.',
      'To contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.'
    ],
    missionImage: '/assets/Images/image 28.png',
    showSection: true
  });

  const { scrollYProgress: visionScrollYProgress } = useScroll({ container: visionScrollRef });
  const visionIndicatorY = useTransform(visionScrollYProgress, [0, 1], [0, 110]);

  const { scrollYProgress: missionScrollYProgress } = useScroll({ container: missionScrollRef });
  const missionIndicatorY = useTransform(missionScrollYProgress, [0, 1], [0, 110]);

  useEffect(() => {
    if (previewData) {
      setData(prev => ({ ...prev, ...previewData }));
      return;
    }
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/vision-mission', { hideLoader: true });
        if (response.data) {
          setData(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching Vision Mission data:', error);
      }
    };
    fetchData();
  }, [previewData]);

  // Vision Auto-scroll
  useEffect(() => {
    const el = visionScrollRef.current;
    if (!el) return;

    visionFloatScrollRef.current = el.scrollTop;
    let animationId;
    const scroll = () => {
      visionFloatScrollRef.current += 0.1;
      el.scrollTop = visionFloatScrollRef.current;

      if (Math.abs(el.scrollTop - visionFloatScrollRef.current) > 2) {
        visionFloatScrollRef.current = el.scrollTop;
      }

      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        el.scrollTop = 0;
        visionFloatScrollRef.current = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Mission Auto-scroll
  useEffect(() => {
    const el = missionScrollRef.current;
    if (!el) return;

    missionFloatScrollRef.current = el.scrollTop;
    let animationId;
    const scroll = () => {
      missionFloatScrollRef.current += 0.1;
      el.scrollTop = missionFloatScrollRef.current;

      if (Math.abs(el.scrollTop - missionFloatScrollRef.current) > 2) {
        missionFloatScrollRef.current = el.scrollTop;
      }

      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        el.scrollTop = 0;
        missionFloatScrollRef.current = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setActiveCard(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (data?.showSection === false && !previewData) return null;

  return (
    <section ref={sectionRef} className="py-20 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >


        {/* Mission Card */}


        {/* Vision Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } } }}
          className="flex items-stretch"
        >
          {/* Left Vertical Text */}
          <div className="hidden md:flex flex-col items-center mr-4 lg:mr-8 justify-center">
            <span className="text-[#454e7d] font-semibold tracking-widest text-sm uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              OUR VISION
            </span>
            <div className="w-[1px] h-24 bg-[#454e7d] mt-4 opacity-50"></div>
          </div>

          <div 
            className="flex-1 relative rounded-2xl shadow-lg p-10 lg:p-14 flex flex-col min-h-[300px] overflow-hidden cursor-pointer group"
            onClick={() => {
              if (window.innerWidth < 768) setActiveCard(activeCard === 'vision' ? null : 'vision');
            }}
          >
            {/* Background Image */}
            <img
              src={data.visionImage}
              alt="Vision Background"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 z-0 ${activeCard === 'vision' ? 'scale-105' : 'md:group-hover:scale-105'}`}
            />
            
            {/* View Icon (Visible when not active) */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 md:hidden ${activeCard === 'vision' ? 'opacity-0 pointer-events-none' : 'opacity-100 md:group-hover:opacity-0 md:group-hover:pointer-events-none'}`}>
              <div className="bg-white/30 p-4 rounded-full backdrop-blur-sm group-hover:bg-white/40 transition-colors">
                <Eye size={32} className="text-white" />
              </div>
            </div>

            {/* Purple Overlay */}
            <div className={`absolute inset-0 bg-[#454e7d]/90 z-0 transition-opacity duration-500 ${activeCard === 'vision' ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>

            <div className={`transition-all duration-500 w-full h-full flex flex-col relative z-10 ${activeCard === 'vision' ? 'opacity-100' : 'opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto'}`}>
              {/* Top Center Title */}
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold text-center mb-16">
                {data.visionTitle}
              </h3>

              {/* Content Section */}
              <div className="flex flex-col pr-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-[2px] h-6 bg-white shrink-0"></div>
                  <h4 className="text-white text-lg font-bold tracking-wide">{data.visionTitle}</h4>
                </div>

                {/* Scrollable Container */}
                <div
                  ref={visionScrollRef}
                  className="overflow-y-auto pr-2 h-[120px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-6"
                >
                  {data.visionContent.map((para, idx) => (
                    <p key={idx} className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Custom Scroll Indicator (Right Edge) */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-[150px] w-[2px] bg-white/10 rounded-full">
                <motion.div
                  className="w-full bg-gradient-to-b from-white to-transparent rounded-full"
                  style={{ height: '40px', y: visionIndicatorY }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } } }}
          className="flex items-stretch"
        >
          {/* Left Vertical Text */}
          <div className="hidden md:flex flex-col items-center mr-4 lg:mr-8 justify-center">
            <span className="text-[#454e7d] font-semibold tracking-widest text-sm uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              OUR MISSION
            </span>
            <div className="w-[1px] h-24 bg-[#454e7d] mt-4 opacity-50"></div>
          </div>

          <div 
            className="flex-1 relative rounded-2xl shadow-lg p-10 lg:p-14 flex flex-col min-h-[300px] overflow-hidden cursor-pointer group"
            onClick={() => {
              if (window.innerWidth < 768) setActiveCard(activeCard === 'mission' ? null : 'mission');
            }}
          >
            {/* Background Image */}
            <img
              src={data.missionImage}
              alt="Mission Background"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 z-0 ${activeCard === 'mission' ? 'scale-105' : 'md:group-hover:scale-105'}`}
            />

            {/* View Icon (Visible when not active) */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 md:hidden ${activeCard === 'mission' ? 'opacity-0 pointer-events-none' : 'opacity-100 md:group-hover:opacity-0 md:group-hover:pointer-events-none'}`}>
              <div className="bg-white/30 p-4 rounded-full backdrop-blur-sm group-hover:bg-white/40 transition-colors">
                <Eye size={32} className="text-white" />
              </div>
            </div>

            {/* Purple Overlay */}
            <div className={`absolute inset-0 bg-[#454e7d]/90 z-0 transition-opacity duration-500 ${activeCard === 'mission' ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>

            <div className={`transition-all duration-500 w-full h-full flex flex-col relative z-10 ${activeCard === 'mission' ? 'opacity-100' : 'opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto'}`}>
              {/* Top Center Title */}
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold text-center mb-16">
                {data.missionTitle}
              </h3>

              {/* Content Section */}
              <div className="flex flex-col pr-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-[2px] h-6 bg-white shrink-0"></div>
                  <h4 className="text-white text-lg font-bold tracking-wide">{data.missionTitle}</h4>
                </div>

                {/* Scrollable Container */}
                <div
                  ref={missionScrollRef}
                  className="overflow-y-auto pr-2 h-[120px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-6"
                >
                  {data.missionContent.map((para, idx) => (
                    <p key={idx} className="text-white/90 text-sm md:text-base leading-relaxed italic pl-1 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Custom Scroll Indicator (Right Edge) */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-[150px] w-[2px] bg-white/10 rounded-full">
                <motion.div
                  className="w-full bg-gradient-to-b from-white to-transparent rounded-full"
                  style={{ height: '40px', y: missionIndicatorY }}
                />
              </div>
            </div>
          </div>
        </motion.div>


      </motion.div>
    </section>
  );
};

export default VisionMissionSection;
