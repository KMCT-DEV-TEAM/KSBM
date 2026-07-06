import React from 'react';

const PlacementSection = () => {
  return (
    <section className="w-full bg-[#f4f7f9] py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-gray-400 text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Placement Highlights
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#2b3990] mb-6">
            Building Careers That Matter
          </h2>
          <p className="text-slate-600 text-[0.95rem] lg:text-[1.05rem] leading-[1.8] max-w-4xl mx-auto font-medium">
            Our dedicated Placement Cell equips students with the skills, confidence, and industry exposure needed to excel in the corporate world. Through strategic industry partnerships, career guidance, and recruitment opportunities, we help transform academic potential into professional success.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="flex items-center justify-center gap-10 lg:gap-24 mt-12 lg:mt-20">
          
          {/* Stat 1: Placement Rate */}
          <div className="flex flex-col items-center text-center">
            {/* Using a serif-style font representation to match the image's numbers */}
            <span className="text-4xl lg:text-5xl text-[#2b3990] mb-3 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              99%
            </span>
            <span className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] text-gray-600 uppercase">
              Placement Rate
            </span>
          </div>

          {/* Vertical Separator */}
          <div className="w-[1px] h-12 lg:h-16 bg-gray-300"></div>

          {/* Stat 2: Highest Package */}
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl lg:text-5xl text-[#2b3990] mb-3 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              12 LPA
            </span>
            <span className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] text-gray-600 uppercase">
              Highest Package
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlacementSection;
