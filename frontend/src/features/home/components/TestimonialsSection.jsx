import React, { useState } from 'react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Anjali Menon',
      course: 'MBA (2022-2024)',
      quote: '"KSBM transformed my potential into professional success."',
      body: 'From interactive classroom sessions to industry-oriented projects, every experience prepared me for real business challenges. The faculty, placement team, and supportive learning environment helped me grow both professionally and personally, giving me the confidence to excel in the corporate world.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      course: 'BBA (2021-2024)',
      quote: '"The practical approach to learning is unmatched here."',
      body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Priya Patel',
      course: 'MBA (2021-2023)',
      quote: '"A true stepping stone to global corporate opportunities."',
      body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop'
    }
  ];

  return (
    <section className="w-full bg-white py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-gray-400 text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#2b3990]">
            Voices of Success
          </h2>
        </div>

        {/* Desktop Interactive Accordion Layout */}
        <div className="hidden lg:flex gap-6 h-[500px]">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`relative rounded-3xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer shadow-sm hover:shadow-md ${
                  isActive ? 'w-[75%] bg-white flex' : 'w-[12.5%]'
                }`}
              >
                {/* Image Section */}
                <div className={`${isActive ? 'w-1/2 h-full p-4' : 'w-full h-full'}`}>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'rounded-2xl' : 'rounded-3xl'}`}
                  />
                </div>

                {/* Text Content (Only visible when active) */}
                {isActive && (
                  <div className="w-1/2 h-full p-12 flex flex-col justify-center animate-fade-in">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 leading-snug pr-4">
                      {testimonial.quote}
                    </h3>
                    <p className="text-gray-400 text-sm leading-[1.8] mb-10 pr-8">
                      {testimonial.body}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                        <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">{testimonial.course}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Layout (Standard Stacked) */}
        <div className="block lg:hidden">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 ${activeIndex === index ? 'flex' : 'hidden'}`}
            >
              <div className="w-full h-[350px]">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
                  {testimonial.quote}
                </h3>
                <p className="text-gray-500 text-sm leading-[1.8] mb-8">
                  {testimonial.body}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">{testimonial.course}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mobile Thumbnails for switching */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {testimonials.map((testimonial, index) => (
              <button 
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeIndex === index ? 'border-[#2b3990] scale-110 opacity-100' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
