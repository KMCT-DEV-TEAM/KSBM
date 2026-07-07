import React from 'react';

const FacilitiesSection = () => {
  const facilities = [
    {
      id: 1,
      title: 'Smart Classrooms',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Digital Library',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2030&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Seminar Hall',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Innovation Lab',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Auditorium',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Sports & Fitness',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <section className="w-full bg-background py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-text-secondary text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            College Facilities
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Institutional Resources
          </h2>
          <p className="text-text-secondary text-[0.95rem] lg:text-base leading-relaxed max-w-3xl mx-auto">
            Our state-of-the-art campus offers modern classrooms, advanced learning resources, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {facilities.map((facility) => (
            <div 
              key={facility.id}
              className="relative h-[250px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Background Image */}
              <img 
                src={facility.image} 
                alt={facility.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Title Content */}
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-lg lg:text-xl font-medium text-white">
                  {facility.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FacilitiesSection;
