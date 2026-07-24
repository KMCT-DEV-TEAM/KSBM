import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../../../api/axios';

const TestimonialsSection = ({ previewData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [settings, setSettings] = useState({
    subheading: 'Testimonials',
    heading: 'Voices of Success',
    testimonials: [
      {
        id: '1',
        name: 'Anjali Menon',
        course: 'MBA (2022-2024)',
        quote: '"KSBM transformed my potential into professional success."',
        body: 'From interactive classroom sessions to industry-oriented projects, every experience prepared me for real business challenges. The faculty, placement team, and supportive learning environment helped me grow both professionally and personally, giving me the confidence to excel in the corporate world.',
        image: '/assets/Images/Home/testimonial_1.jpg',
        avatar: '/assets/Images/Home/testimonial_1.jpg'
      },
      {
        id: '2',
        name: 'Rahul Sharma',
        course: 'BBA (2021-2024)',
        quote: '"The practical approach to learning is unmatched here."',
        body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
        image: '/assets/Images/Home/testimonial_2.jpg',
        avatar: '/assets/Images/Home/testimonial_2.jpg'
      },
      {
        id: '3',
        name: 'Priya Patel',
        course: 'MBA (2021-2023)',
        quote: '"A true stepping stone to global corporate opportunities."',
        body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
        image: '/assets/Images/Home/testimonial_3.jpg',
        avatar: '/assets/Images/Home/testimonial_3.jpg'
      }
    ]
  });

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
    } else {
      const fetchSettings = async () => {
        try {
          const { data } = await api.get('/cms/testimonials', { hideLoader: true });
          if (data) {
            setSettings({
              subheading: data.subheading || 'Testimonials',
              heading: data.heading || 'Voices of Success',
              testimonials: data.testimonials && data.testimonials.length > 0 ? data.testimonials : settings.testimonials
            });
          }
        } catch (error) {
          console.error('Error fetching testimonials settings:', error);
        }
      };
      fetchSettings();
    }
  }, [previewData]);

  const { subheading, heading, testimonials } = settings;
  const displayTestimonials = testimonials?.slice(0, 3) || [];

  useEffect(() => {
    if (displayTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 4000); // cycle every 4 seconds
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  if (displayTestimonials.length === 0) return null;

  return (
    <section className="w-full bg-background py-12 lg:py-16">
      <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          >
            {subheading}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-[2.75rem] font-semibold text-primary"
          >
            {heading}
          </motion.h2>
        </div>

        {/* Desktop Interactive Accordion Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex gap-6 h-[380px] w-full max-w-7xl mx-auto justify-center"
        >
          {displayTestimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`relative flex transition-all duration-1000 ease-in-out cursor-pointer overflow-hidden ${isActive
                  ? 'w-[550px] xl:w-[650px] 2xl:w-[750px] gap-6'
                  : 'w-[200px] xl:w-[240px] 2xl:w-[280px] gap-0'
                  }`}
              >
                {/* Image Section */}
                <div className="h-full shrink-0 w-[200px] xl:w-[240px] 2xl:w-[280px]">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>

                {/* Text Content */}
                <div className={`h-full py-4 flex flex-col justify-center transition-all duration-1000 ease-in-out min-w-[280px] xl:min-w-[320px] ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                  <div className="w-full">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 leading-snug pr-4">
                      {testimonial.quote}
                    </h3>
                    <p className="text-gray-500 text-[0.85rem] leading-[1.8] mb-6 pr-6">
                      {testimonial.body}
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[0.8rem] font-bold text-gray-900">{testimonial.name}</p>
                        <p className="text-[0.6rem] font-medium text-gray-500 uppercase mt-0.5">{testimonial.course}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Mobile / Tablet Layout (Standard Stacked) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="block lg:hidden w-full mx-auto"
        >
          <div className="relative overflow-hidden min-h-[500px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex-col bg-background rounded-3xl shadow-sm overflow-hidden mb-8 flex w-full"
              >
                <div className="w-full h-[250px]">
                  <img
                    src={displayTestimonials[activeIndex]?.image}
                    alt={displayTestimonials[activeIndex]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-text-primary mb-3 leading-snug">
                    {displayTestimonials[activeIndex]?.quote}
                  </h3>
                  <p className="text-text-secondary text-sm leading-[1.8] mb-6">
                    {displayTestimonials[activeIndex]?.body}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img
                      src={displayTestimonials[activeIndex]?.avatar}
                      alt={displayTestimonials[activeIndex]?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{displayTestimonials[activeIndex]?.name}</p>
                      <p className="text-[0.65rem] font-semibold text-text-secondary uppercase tracking-widest mt-0.5">{displayTestimonials[activeIndex]?.course}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Thumbnails for switching */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {displayTestimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`w-14 h-14 transition-all duration-300 rounded-full overflow-hidden border-2 ${activeIndex === index ? 'border-primary opacity-100' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex justify-center mt-12 lg:mt-16"
        >
          <Link href="/testimonials" className="group flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase hover:text-primary/80 transition-colors">
            <span>Read All Testimonials</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default TestimonialsSection;

