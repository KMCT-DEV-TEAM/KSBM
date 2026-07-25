"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';


const defaultInitialEvents = [
  {
    title: 'CELEBRITY VISIT',
    description: 'Join us for an exclusive evening with renowned personalities. Experience an inspiring session filled with insights, interactions, and memorable moments.',
    date: '12',
    month: 'OCT',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'DJ PARTY & DANCE',
    description: 'Get ready to groove to the electrifying beats! A night of non-stop music, spectacular lighting, and an unforgettable dance floor experience.',
    date: '15',
    month: 'NOV',
    img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'SPORTS FESTIVAL',
    description: 'Witness the ultimate display of athleticism and team spirit. Cheer for your favorite teams in this high-energy, action-packed sports extravaganza.',
    date: '04',
    month: 'DEC',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop'
  }
];

const EventsUpcoming = ({ upcomingEvents }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const eventsList = (upcomingEvents?.events && upcomingEvents.events.length > 0)
    ? upcomingEvents.events
    : defaultInitialEvents;

  const heading = upcomingEvents?.heading || 'THE UPCOMING EVENTS';
  const hasMoreThanThree = eventsList.length > 3;

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const children = Array.from(container.children);
    const containerTop = container.getBoundingClientRect().top + 60;
    let closestIdx = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const distance = Math.abs(child.getBoundingClientRect().top - containerTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = index;
      }
    });

    setActiveIndex(closestIdx);
  };

  const scrollToItem = (index) => {
    if (containerRef.current && containerRef.current.children[index]) {
      containerRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="w-full px-6 relative z-0 py-12">
      {/* Decorative Glow */}
      <div className="absolute left-10 top-10 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full z-[-1]"></div>

      {/* Decorative Curves (Right Edge) */}
      <div className="absolute right-0 top-24 w-14 md:w-24 h-auto pointer-events-none opacity-80 z-[-1]">
        <img src="/assets/Images/Group 254 (1).png" alt="Decorative Curves" className="w-full h-full object-contain" />
      </div>

      {/* Decorative Curves (Left Bottom Edge) */}
      <div className="absolute left-0 bottom-24 w-14 md:w-24 h-auto pointer-events-none opacity-80 z-[-1] scale-x-[-1]">
        <img src="/assets/Images/Group 254 (1).png" alt="Decorative Curves" className="w-full h-full object-contain" />
      </div>

      {/* Decorative Polygon (Left Side) */}
      <div className="absolute left-10 md:left-24 top-[40%] w-12 md:w-16 h-auto pointer-events-none opacity-80 z-0 animate-pulse drop-shadow-[0_0_15px_rgba(200,55,171,0.5)]">
        <img src="/assets/Images/Polygon 7.png" alt="Decorative Polygon" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h5 className="text-center text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-2"
          style={{
            background: "linear-gradient(to right, #C837AB 0%, #FFDD55 40%, #FF543E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Coming Soon</h5>
        <h2 className="text-center text-xl md:text-3xl font-extrabold uppercase tracking-widest mb-14 leading-tight drop-shadow-[0_0_15px_rgba(249,73,180,0.6)]">
          {heading}
        </h2>

        {/* Flex layout with Events list on left/center and Thin Line Indicators on the Right Side */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 md:gap-8">
          {/* Main Events Cards Container */}
          <div
            ref={containerRef}
            onScroll={hasMoreThanThree ? handleScroll : undefined}
            className={`flex-1 space-y-6 w-full transition-all ${hasMoreThanThree
              ? 'max-h-[720px] lg:max-h-[820px] overflow-y-auto scroll-smooth py-2 pr-2'
              : ''
              }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {eventsList.map((event, idx) => (
              <motion.div
                key={event.title + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.08, 0.3) }}
                className="relative flex flex-col md:flex-row bg-[#050505] rounded-[2rem] overflow-hidden shadow-2xl p-4 md:p-5 gap-6 md:gap-8 border border-[#c837ab]/40 hover:border-[#c837ab] transition-colors duration-500 group shrink-0"
              >
                {/* Image Section */}
                <div className="w-full md:w-[35%] shrink-0 h-44 md:h-48 lg:h-52 overflow-hidden rounded-2xl">
                  <img
                    src={event.img || "/assets/Images/image 94.png"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_0_15px_rgba(200,55,171,0.2)]"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-center pr-4 md:pr-28 py-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2.5 uppercase tracking-wide group-hover:text-pink-400 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                    {event.description}
                  </p>
                </div>

                {/* Date Ribbon */}
                <div className="absolute top-0 right-6 bg-gradient-to-b from-[#C837AB] to-[#FF543E] w-[75px] md:w-[85px] h-[105px] md:h-[115px] rounded-b-[20px] flex flex-col items-center justify-center z-10 shadow-lg shadow-pink-500/20">
                  <span className="text-white text-xs md:text-sm font-semibold mb-0.5 uppercase tracking-wider">{event.month}</span>
                  <span className="text-white text-xl md:text-3xl font-extrabold">{event.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side Thin White Line Indicators - Visible ONLY when events exceed 3 */}
          {hasMoreThanThree && (
            <div className="flex flex-row lg:flex-col items-center justify-center gap-2.5 py-2 shrink-0 self-center">
              {eventsList.map((_, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => scrollToItem(i)}
                    className={`rounded-full transition-all duration-500 cursor-pointer ${isActive
                      ? 'w-1 lg:w-1 h-1 lg:h-10 bg-white '
                      : 'w-1 lg:w-1 h-1 lg:h-4 bg-white/35 hover:bg-white/75'
                      }`}
                    aria-label={`Scroll to event ${i + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsUpcoming;
