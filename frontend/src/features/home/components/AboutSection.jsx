"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Rotate3d } from 'lucide-react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
const graduateImg = '/assets/Images/Home/graduate.png';
const watermarkImg = '/assets/Images/Home/watermark_logo.png';
import api from '../../../api/axios';


const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    const strValue = String(value);
    const match = strValue.match(/^(\d+)(.*)$/);

    if (isInView && match && ref.current) {
      const numericValue = parseInt(match[1], 10);
      const suffix = match[2];

      const controls = animate(0, numericValue, {
        duration: 3,
        ease: "easeOut",
        onUpdate(val) {
          if (ref.current) {
            ref.current.textContent = Math.round(val) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  const strValue = String(value);
  const match = strValue.match(/^(\d+)(.*)$/);

  if (!match) {
    return <span>{value}</span>;
  }

  return <span ref={ref}>0{match[2]}</span>;
};

const AboutSection = ({ previewData }) => {
  const [cmsData, setCmsData] = useState({
    subheading: 'BUILDING EXCELLENCE SINCE 1995',
    heading: "Shaping Tomorrow's Business Leaders",
    paragraphs: [
      "At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today's evolving business landscape.",
      "Our MBA program equips students with advanced managerial knowledge, strategic thinking, and leadership skills for successful corporate careers, while the BBA program builds a strong foundation in business, communication, and management for higher studies and professional growth. Supported by experienced faculty, modern infrastructure, and strong industry collaborations, KSBM provides an inspiring environment that nurtures critical thinking, entrepreneurship, innovation, and lifelong learning."
    ],
    imageUrl: '',
    stats: [
      { value: '16+', label: 'YEARS OF EXCELLENCE' },
      { value: '991+', label: 'ACTIVE STUDENTS' },
      { value: '196+', label: 'GLOBAL RECRUITERS' },
      { value: '196+', label: 'GLOBAL RECRUITERS' }
    ],
    showSubheading: true,
    showHeading: true,
    showParagraphs: true,
    showImage: true,
    showStats: true
  });

  useEffect(() => {
    if (previewData) {
      setCmsData({
        subheading: previewData.subheading || 'BUILDING EXCELLENCE SINCE 1995',
        heading: previewData.heading || "Shaping Tomorrow's Business Leaders",
        paragraphs: previewData.paragraphs?.length > 0 ? previewData.paragraphs : [],
        imageUrl: previewData.imageUrl || '',
        stats: previewData.stats?.length > 0 ? previewData.stats : [],
        showSubheading: previewData.showSubheading ?? true,
        showHeading: previewData.showHeading ?? true,
        showParagraphs: previewData.showParagraphs ?? true,
        showImage: previewData.showImage ?? true,
        showStats: previewData.showStats ?? true
      });
      return;
    }

    const fetchAboutData = async () => {
      try {
        const { data } = await api.get('/cms/about', { hideLoader: true });
        if (data) {
          setCmsData({
            subheading: data.subheading || cmsData.subheading,
            heading: data.heading || cmsData.heading,
            paragraphs: data.paragraphs?.length > 0 ? data.paragraphs : cmsData.paragraphs,
            imageUrl: data.imageUrl || '',
            stats: data.stats?.length > 0 ? data.stats : cmsData.stats,
            showSubheading: data.showSubheading ?? true,
            showHeading: data.showHeading ?? true,
            showParagraphs: data.showParagraphs ?? true,
            showImage: data.showImage ?? true,
            showStats: data.showStats ?? true
          });
        }
      } catch (error) {
        console.error('Error fetching about CMS data:', error);
      }
    };
    fetchAboutData();
  }, [previewData]);

  // Preview Mode Overrides
  const isPreviewMobile = previewData?.previewDevice === 'mobile';
  const isPreviewTablet = previewData?.previewDevice === 'tablet';
  const forceMobile = isPreviewMobile || isPreviewTablet;

  // Tailwind overrides to force mobile layout even on desktop browsers during Live Preview
  const ptClass = forceMobile ? 'pt-12' : 'pt-12 lg:pt-32';
  const watermarkWidthClass = forceMobile ? 'w-[200px]' : 'w-[200px] md:w-[250px] lg:w-[380px]';
  const topGridClass = forceMobile ? 'grid-cols-1 gap-10' : 'grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16';
  const leftColClass = forceMobile ? 'order-2 justify-center mt-6' : 'order-2 lg:order-1 justify-center mt-6 lg:mt-0';
  const rightColClass = forceMobile ? 'order-1' : 'order-1 lg:order-2';
  const subheadClass = forceMobile ? 'text-xs' : 'text-xs lg:text-sm';
  const headClass = forceMobile ? 'text-3xl' : 'text-3xl md:text-4xl lg:text-5xl';

  const statTextClass = forceMobile ? 'text-3xl' : 'text-3xl md:text-4xl lg:text-5xl';

  const showTopSection = cmsData.showImage || cmsData.showHeading || cmsData.showSubheading || cmsData.showParagraphs;

  return (
    <section className={`relative w-full bg-background ${ptClass} pb-10 overflow-hidden`}>
      {/* Background Logo Watermark */}
      <div className="absolute top-10 left-0 -translate-x-[35%] opacity-80 pointer-events-none z-0">
        <img src={watermarkImg} alt="Background Watermark" className={`${watermarkWidthClass} h-auto object-contain mix-blend-multiply contrast-150`} />
      </div>

      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Split Section */}
        {showTopSection && (
          <div className={`grid ${topGridClass} items-center mb-12 lg:mb-20`}>

            {/* Left: Image Container */}
            {cmsData.showImage && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`relative flex w-full items-center ${leftColClass}`}
              >
                <div className="relative w-[90%] md:w-[70%] lg:w-[80%] max-w-[450px]">
                  <img
                    src={cmsData.imageUrl || graduateImg}
                    alt="Graduating Student"
                    className="w-full h-auto rounded-lg object-cover z-10 relative"
                    style={{ clipPath: 'inset(0 0 0 0 round 1rem)' }}
                  />

                </div>
              </motion.div>
            )}

            {/* Right: Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  }
                }
              }}
              className={`${rightColClass} ${!cmsData.showImage ? 'lg:col-span-2 text-center flex flex-col items-center' : ''}`}
            >
              {cmsData.showSubheading && (
                <motion.h4
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  className={`text-text-secondary ${subheadClass} tracking-widest uppercase mb-4 flex items-center gap-2 ${!cmsData.showImage ? 'justify-center' : ''}`}
                >
                  {cmsData.subheading} <span className="w-2 h-[2px] bg-text-secondary"></span>
                </motion.h4>
              )}

              {cmsData.showHeading && (
                <motion.h2
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  className={`font-semibold text-primary leading-[1.2] mb-8 ${headClass}`}
                  dangerouslySetInnerHTML={{ __html: cmsData.heading }}
                />
              )}

              {cmsData.showParagraphs && (
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  className="text-text-primary space-y-6 text-sm leading-relaxed max-w-4xl mx-auto"
                >
                  {cmsData.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </motion.div>
              )}

              {/* 360 Button under text */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className={`mt-12 flex ${!cmsData.showImage ? 'justify-center' : 'justify-start'}`}
              >
                <button className="group bg-gradient-to-b from-primary/90 to-primary backdrop-blur-sm text-white border border-white/20 px-5 py-3 rounded-lg cursor-pointer hover:!bg-none hover:!bg-white hover:!text-primary hover:border-primary hover:-translate-y-1 transition-all flex items-center gap-2 overflow-hidden">
                  <Rotate3d className="w-5 h-5 shrink-0" />
                  <div className="flex items-center text-sm font-bold tracking-widest uppercase whitespace-nowrap">
                    <span>360°</span>
                    <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out">
                      Visitor Tour
                    </span>
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}

      </div>


      {cmsData.showStats && cmsData.stats.length > 0 && (
        <motion.div
          key={cmsData.stats.length}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.1,
              }
            }
          }}
          className="w-full "
        >
          <div className="w-[98%] max-w-[1440px] bg-[#f4fafe] py-8 md:py-12 mx-auto px-2 sm:px-6 lg:px-8 rounded-xl shadow-sm">
            <div className="flex flex-wrap md:flex-nowrap justify-center items-start gap-y-8 gap-x-2 md:gap-4 w-full">

              {cmsData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
                  className="flex flex-col items-center justify-start text-center w-[47%] sm:w-[45%] md:w-auto md:flex-1 px-1"
                >
                  <span className={`font-serif text-[#4e558e] mb-1 md:mb-2 text-3xl md:text-3xl lg:text-4xl`}>
                    <Counter value={stat.value} />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider md:tracking-widest text-gray-600 uppercase break-words w-full leading-tight">{stat.label}</span>
                </motion.div>
              ))}

            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default AboutSection;

