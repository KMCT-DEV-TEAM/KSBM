import React from 'react';
import accredential from "../../../assets/Images/Group 47.png"

const AccreditationSection = () => {


  return (
    <section className="w-full bg-[#f4fafe] py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto">

          {/* Left Text Content */}
          <div className="text-center shrink-0 flex flex-col items-center">
            <p className="text-text-secondary text-[10px] lg:text-xs tracking-[0.2em] uppercase mb-4">
              Institutional Credentials
            </p>
            <h2 className="text-2xl lg:text-[2.5rem] font-semibold text-primary leading-[1.4]">
              Accreditation &<br />Affiliations
            </h2>
          </div>

          {/* Vertical Separator (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:block w-[1px] h-32 bg-gray-300/50 mx-12 lg:mx-20 shrink-0"></div>
          <div className="block lg:hidden w-32 h-[1px] bg-gray-300/50 my-10 shrink-0"></div>

          {/* Right Logos Content */}
          <div className="w-full max-w-xl flex items-center justify-center">
            <img
              src={accredential}
              alt="Accreditations: NAAC A+, ISO, KTU"
              className="w-[90%] md:w-[80%] h-auto object-contain mix-blend-multiply"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;
