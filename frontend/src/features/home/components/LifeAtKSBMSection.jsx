import React from 'react';

const LifeAtKSBMSection = () => {
  // Ordered to flow nicely in a CSS columns layout (top-to-bottom, then left-to-right)
  const images = [
    // Column 1
    { id: 1, src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', alt: 'Students in cafe' },
    { id: 2, src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1973&auto=format&fit=crop', alt: 'Students jumping' },
    // Column 2
    { id: 3, src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop', alt: 'Campus festival' },
    { id: 4, src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop', alt: 'Meeting room' },
    // Column 3
    { id: 5, src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', alt: 'Selfie' },
    { id: 6, src: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop', alt: 'Dining hall' },
    // Column 4
    { id: 7, src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop', alt: 'Outdoor gathering' },
    { id: 8, src: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=2070&auto=format&fit=crop', alt: 'Campus gate' }
  ];

  return (
    <section className="relative w-full bg-background py-20 lg:py-24 overflow-hidden">
      
      {/* Abstract Background Pattern (Top Right) */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 lg:w-[500px] lg:h-[500px] opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e2e8f0 3px, transparent 3px)',
          backgroundSize: '30px 30px',
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)' 
        }}
      ></div>

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Life at KSBM
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6">
            Beyond the Classroom
          </h2>
          <p className="text-text-secondary text-[0.95rem] lg:text-base leading-relaxed max-w-2xl mx-auto">
            Life @ KMCT is a vibrant blend of learning, innovation, culture, and unforgettable campus experiences.
          </p>
        </div>

        {/* Masonry Image Gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="break-inside-avoid rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LifeAtKSBMSection;
