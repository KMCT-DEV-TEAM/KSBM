import React from 'react';

const RecruitersSection = () => {
  const recruiters = [
    {
      name: 'Infosys',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
    },
    {
      name: 'Wipro',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
    },
    {
      name: 'Cognizant',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg'
    },
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
    },
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
    }
  ];

  return (
    <section className="w-full bg-background py-12 lg:py-16 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 overflow-hidden">
        
        {/* Logos Container */}
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-12 lg:gap-8 opacity-90">
          {recruiters.map((company, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center w-[120px] md:w-[150px] lg:w-[180px] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
              title={company.name}
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="w-full h-auto object-contain max-h-[40px] lg:max-h-[50px]"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecruitersSection;
