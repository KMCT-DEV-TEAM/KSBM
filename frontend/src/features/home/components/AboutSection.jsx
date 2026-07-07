import React, { useState, useEffect } from 'react';
import { Rotate3d } from 'lucide-react';
import graduateImg from '../../../assets/Images/graduate.png';
import watermarkImg from '../../../assets/Images/watermark_logo.png';
import api from '../../../api/axios';


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
        const { data } = await api.get('/cms/about');
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
  const ptClass = forceMobile ? 'pt-20' : 'pt-20 lg:pt-32';
  const watermarkWidthClass = forceMobile ? 'w-[250px]' : 'w-[250px] lg:w-[380px]';
  const topGridClass = forceMobile ? 'grid-cols-1 gap-12' : 'grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20';
  const leftColClass = forceMobile ? 'order-2 justify-center' : 'order-2 lg:order-1 justify-center lg:justify-start lg:ml-36';
  const rightColClass = forceMobile ? 'order-1' : 'order-1 lg:order-2 lg:-ml-12';
  const subheadClass = forceMobile ? 'text-xs' : 'text-xs lg:text-sm';
  const headClass = forceMobile ? 'text-4xl' : 'text-4xl lg:text-5xl';
  
  const statGridCols = cmsData.stats.length > 4 ? 4 : (cmsData.stats.length || 1);
  const statGridClass = isPreviewMobile 
    ? 'grid-cols-2 gap-6' 
    : `grid-cols-2 md:grid-cols-${statGridCols} gap-6 md:gap-4`;
  const statTextClass = isPreviewMobile ? 'text-4xl' : 'text-4xl md:text-5xl';

  const showTopSection = cmsData.showImage || cmsData.showHeading || cmsData.showSubheading || cmsData.showParagraphs;

  return (
    <section className={`relative w-full bg-background ${ptClass} pb-10 overflow-hidden`}>
      {/* Background Logo Watermark */}
      <div className="absolute top-10 left-0 -translate-x-[35%] opacity-80 pointer-events-none z-0">
        <img src={watermarkImg} alt="Background Watermark" className={`${watermarkWidthClass} h-auto object-contain mix-blend-multiply contrast-150`} />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

        {/* Top Split Section */}
        {showTopSection && (
          <div className={`grid ${topGridClass} items-center`}>

            {/* Left: Image Container */}
            {cmsData.showImage && (
              <div className={`relative flex ${leftColClass}`}>
                <div className="relative w-[80%] max-w-[450px]">
                  <img
                    src={cmsData.imageUrl || graduateImg}
                    alt="Graduating Student"
                    className="w-full h-auto rounded-lg object-cover z-10 relative"
                    style={{ clipPath: 'inset(0 0 0 0 round 1rem)' }}
                  />

                  {/* Floating 360 Button */}
                  <div className="absolute bottom-4 -left-2 bg-primary text-white px-3 py-1.5 rounded-lg shadow-lg z-20 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-0.5">
                    <Rotate3d className="w-6 h-5" />
                    <span className="text-[9px] font-bold">360°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Text Content */}
            <div className={`${rightColClass} ${!cmsData.showImage ? 'lg:col-span-2 text-center flex flex-col items-center' : ''}`}>
              {cmsData.showSubheading && (
                <h4 className={`text-text-secondary ${subheadClass} tracking-widest uppercase mb-4 flex items-center gap-2 ${!cmsData.showImage ? 'justify-center' : ''}`}>
                  {cmsData.subheading} <span className="w-2 h-[2px] bg-text-secondary"></span>
                </h4>
              )}

              {cmsData.showHeading && (
                <h2 className={`font-semibold text-primary leading-[1.2] mb-8 ${headClass}`} dangerouslySetInnerHTML={{ __html: cmsData.heading }} />
              )}

              {cmsData.showParagraphs && (
                <div className="text-text-primary space-y-6 text-sm leading-relaxed max-w-4xl mx-auto">
                  {cmsData.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>


      {cmsData.showStats && cmsData.stats.length > 0 && (
        <div className="w-full mt-10">
          <div className="max-w-[1440px] bg-[#f4fafe] py-10 mx-auto px-4 lg:px-8">
            <div className={`grid ${statGridClass}`}>
              
              {cmsData.stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center px-4">
                  <span className={`font-serif text-[#4e558e] mb-2 ${statTextClass}`}>{stat.value}</span>
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] text-gray-600 uppercase">{stat.label}</span>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
