import React, { useState, useEffect } from 'react';

const VirtualTourButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const footerElement = document.getElementById('main-footer');
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        // If the top of the footer comes up to overlap the button area
        if (footerRect.top < window.innerHeight - 10) {
          setIsOverFooter(true);
        } else {
          setIsOverFooter(false);
        }
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const useSolidTheme = isScrolled && !isOverFooter;

  return (
    <a
      href="#"
      className={`fixed bottom-6 right-2 md:right-2 z-[99] flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${useSolidTheme
        ? 'bg-primary border border-primary text-white hover:opacity-90'
        : 'bg-background/20 backdrop-blur-md border border-white/30 text-white hover:bg-background/30'
        }`}
      title="360° Virtual Tour"
    >
      <span className="font-extrabold text-sm leading-none mt-0.5 tracking-tighter">360&deg;</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="8"
        viewBox="0 0 24 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5"
      >
        <path d="M2 2 Q 12 14 22 2" />
        <path d="M22 2 L 17 1 M22 2 L 20 7" />
      </svg>
    </a>
  );
};

export default VirtualTourButton;
