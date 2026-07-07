import React from 'react';

const AcademicPrograms = () => {
  const programs = [
    {
      id: 'mba',
      title: 'MBA',
      subtitle: 'Master of Business Administration. 2 - Year Full-time immersive leadership journey.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', // Office/lounge
      tag: 'GRADUATE'
    },
    {
      id: 'bba',
      title: 'BBA',
      subtitle: 'Bachelor of Business Administration. Building the foundation for corporate excellence.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop', // Classroom
      tag: 'UNDERGRADUATE' // Adding tag for symmetry, though hidden in image, looks good. Or we can conditionally render.
    }
  ];

  return (
    <section className="w-full bg-background py-12 lg:py-14">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-text-secondary text-xs  tracking-[0.2em] uppercase mb-4">
            Our Courses
          </p>
          <h2 className="text-4xl lg:text-5xl font-semibold text-primary mb-6">
            Academic Programs
          </h2>
          <p className="text-text-secondary text-[0.95rem] lg:text-base leading-relaxed max-w-3xl mx-auto">
            Discover our MBA and BBA programmes, crafted to develop future-ready professionals through innovative learning, industry engagement, and leadership-focused education.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {programs.map((program) => (
            <div
              key={program.id}
              className="relative h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Background Image */}
              <img
                src={program.image}
                alt={program.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Vertical Tag (Left Edge) */}
              <div className="absolute top-12 left-6 lg:left-8 flex flex-col items-center gap-4 z-20">
                <div className="w-[1px] h-12 bg-background/40"></div>
                <span
                  className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {program.tag}
                </span>
              </div>

              {/* Gradient Overlay */}
              {/* Using a gradient that starts dark blue at bottom and fades to transparent */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2559]/95 via-[#1b2559]/40 to-transparent opacity-90 z-10"></div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 z-20">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-200 text-sm lg:text-[0.95rem] leading-relaxed max-w-[90%]">
                  {program.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AcademicPrograms;
