import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  ArrowUpRight, 
  Download, 
  Users, 
  Award, 
  ExternalLink,
  BadgeCheck
} from 'lucide-react';

const Hero = () => {
  const images = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop'
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Image transition interval
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Scroll listener for fixed contact bar
    const handleScroll = () => {
      // Trigger color change when scrolled past 400px
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-[85vh] lg:min-h-[750px] w-full bg-slate-900 overflow-hidden flex items-center">
      {/* Background Images with Transition */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <img 
            src={img} 
            alt="Campus" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-20 flex flex-col justify-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[0.65rem] sm:text-xs font-semibold tracking-widest text-white border border-white/30 uppercase mb-8 self-start shadow-sm">
          <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bce0f0]"></span>
          </span>
          ADMISSIONS OPEN 2024-25
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
          <span className="text-white block">Empowering Future</span>
          <span className="text-[#bce0f0] block">Business Leaders</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-base md:text-lg mt-6 text-gray-200 leading-relaxed font-medium">
          Unlock your potential with India's leading B-School, where traditional academic rigor meets modern industry innovation. Join a network of global visionaries.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-10">
          <button className="bg-[#bce0f0] text-slate-900 font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            Apply Now <ArrowUpRight className="w-5 h-5" />
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <Download className="w-5 h-5" /> Download Brochure
          </button>
        </div>
      </div>

      {/* Glassmorphism Floating Card */}
      <div className="hidden md:block absolute bottom-12 right-12 z-20">
        <div className="relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-7 w-[380px] shadow-2xl">
          {/* Blue Badge Icon Overlap */}
          <div className="absolute -top-4 -right-4 bg-[#2b3990] p-3 rounded-xl shadow-lg border border-white/10 text-white z-30">
            <BadgeCheck className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-6">Batch 2024–26</h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg shrink-0 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold">Limited Seats</p>
                <p className="text-gray-300 text-sm mt-0.5">Last few slots remaining</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg shrink-0 text-white">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold">100% Placement</p>
                <p className="text-gray-300 text-sm mt-0.5">Consistent record over years</p>
              </div>
            </div>
          </div>

          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white mt-8 transition-colors group">
            Read Admission Guidelines 
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Fixed Sidebar Social Icons */}
      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[1px] border-r-0 rounded-l-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors duration-300 ${
          isScrolled 
            ? 'bg-white border border-gray-200 text-[#2b3990]' 
            : 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
        }`}
      >
        <a 
          href="mailto:info@kmct.org" 
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/30'}`} 
          title="Email Us"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noreferrer" 
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/30'}`} 
          title="WhatsApp Us"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a 
          href="tel:+911234567890" 
          className={`p-3.5 block transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/30'}`} 
          title="Call Us"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
