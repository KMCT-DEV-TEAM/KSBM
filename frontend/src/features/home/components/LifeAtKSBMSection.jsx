import React from 'react';
import watermarkLogo from '../../../assets/Images/watermark_logo.png';

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
    <section className="relative w-full bg-background py-12 lg:py-14 overflow-hidden">

      {/* Background Watermark Logo (Right) */}
      <div className="absolute top-1/2 right-0 translate-x-[50%] -translate-y-1/2 opacity-80 pointer-events-none z-0">
        <img src={watermarkLogo} alt="Background Watermark" className="w-[250px] lg:w-[380px] h-auto object-contain mix-blend-multiply contrast-150" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 lg:px-8 z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-text-secondary text-[0.65rem] lg:text-xs tracking-[0.25em] uppercase mb-4">
            Life at KSBM
          </p>
          <h2 className="text-3xl lg:text-5xl font-semibold text-primary mb-6">
            Beyond the Classroom
          </h2>
          <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
            Life @ KMCT is a vibrant blend of learning, innovation, culture, and unforgettable campus experiences.
          </p>
        </div>

        {/* Collage Image Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px] grid-flow-row">
          {images.map((img, index) => {
            // 2 rows layout on desktop (6 columns total per row)
            // Row 1: 2 + 1 + 1 + 2 = 6
            // Row 2: 1 + 2 + 2 + 1 = 6
            let spanClass = "col-span-1 row-span-1";
            if (index === 0 || index === 3 || index === 5 || index === 6) {
              spanClass = "col-span-1 md:col-span-2 row-span-1";
            }

            return (
              <div
                key={img.id}
                className={`${spanClass} rounded-[1rem] md:rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 relative`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LifeAtKSBMSection;
