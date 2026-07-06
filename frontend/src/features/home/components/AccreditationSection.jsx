import React from 'react';

const AccreditationSection = () => {
  const logos = [
    {
      id: 'naac',
      alt: 'NAAC A+ Accreditation',
      src: '/naac-logo.png', // Replace with actual path in public/ or assets/
      fallbackText: 'NAAC A+'
    },
    {
      id: 'iso',
      alt: 'ISO Certification',
      src: '/iso-logo.png',
      fallbackText: 'ISO'
    },
    {
      id: 'ktu',
      alt: 'APJ Abdul Kalam Technological University (KTU)',
      src: '/ktu-logo.png',
      fallbackText: 'KTU'
    }
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-16 lg:py-20 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between lg:justify-start">
          
          {/* Left Text Content */}
          <div className="text-center lg:text-left lg:w-[35%] shrink-0">
            <p className="text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Institutional Credentials
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2b3990] leading-tight">
              Accreditation &<br className="hidden lg:block" /> Affiliations
            </h2>
          </div>

          {/* Vertical Separator (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:block w-[1px] h-24 bg-gray-200 mx-8 lg:mx-12 shrink-0"></div>
          <div className="block lg:hidden w-24 h-[1px] bg-gray-200 my-8 shrink-0"></div>

          {/* Right Logos Content */}
          <div className="flex-1 w-full flex flex-wrap items-center justify-center lg:justify-around gap-10 lg:gap-8">
            {logos.map((logo) => (
              <div key={logo.id} className="relative group flex items-center justify-center">
                {/* 
                  Note: Using an img tag here. If the image doesn't exist, it will show the alt text.
                  You should place 'naac-logo.png', 'iso-logo.png', and 'ktu-logo.png' in your 'public' folder.
                */}
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-20 lg:h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out opacity-80 hover:opacity-100"
                  onError={(e) => {
                    // Fallback if image not found to display a placeholder box
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback UI if image is missing */}
                <div 
                  className="hidden w-24 h-24 bg-white border border-gray-200 rounded-full flex-col items-center justify-center text-[#2b3990] font-bold text-sm shadow-sm"
                  style={{ display: 'none' }} // Hidden by default, shown by onError above
                >
                  {logo.fallbackText}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;
