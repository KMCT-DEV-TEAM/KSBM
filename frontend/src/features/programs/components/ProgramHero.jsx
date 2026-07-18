"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, X, Send, User, Mail, Phone } from 'lucide-react';
import Swal from 'sweetalert2';

const ProgramHero = ({ program }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const isBba = program.id === 'bba';

  useEffect(() => {
    const img = new Image();
    img.src = program.heroImage || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop";
    img.onload = () => setImagesLoaded(true);
    img.onerror = () => setImagesLoaded(true);
  }, [program.heroImage]);

  const handleBrochureSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please fill out your Name, Email, and Phone Number to download the brochure.',
        confirmButtonColor: '#1b2559'
      });
      return;
    }

    setIsBrochureModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Brochure Sent Successfully!',
      text: `The official ${program.shortTitle} Curriculum & Brochure PDF has been emailed to ${formData.email}.`,
      confirmButtonColor: '#1b2559',
      timer: 4000,
      timerProgressBar: true
    });
    setFormData({ name: '', email: '', phone: '' });
  };

  const line1 = program.heroTitleLine1 || (isBba ? "Bachelor of Business" : "Master of Business");
  const line2 = program.heroTitleLine2 || (isBba ? "Administration (BBA)" : "Administration (MBA)");
  const primaryBtnText = program.heroPrimaryBtnText || "EXPLORE PROGRAM";
  const secondaryBtnText = program.heroSecondaryBtnText || "DOWNLOAD BROCHURE";

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex items-center">
      {/* Background Image with Transition */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <img
          src={program.heroImage || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"}
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
      </motion.div>

      {/* Main Content exact match with Home Hero container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
          }
        }}
        className="relative z-10 w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:py-32"
      >
        {/* Pill Badge */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="inline-flex items-center gap-2.5 bg-background/20 backdrop-blur-md rounded-full pr-5 pl-2 py-1.5 text-[0.60rem] sm:text-[0.65rem] font-semibold tracking-widest text-white border border-white/30 uppercase mb-8 self-start shadow-sm"
        >
          <div className="flex items-center justify-center bg-white/10 rounded-full p-1">
            <svg viewBox="-50 -50 100 100" className="w-5 h-5 text-[#5594c0]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 8 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 45})`}>
                  <polygon points="0,-4 -6,-16 6,-16" />
                  <polygon points="0,-32 -8,-18 8,-18" />
                  <polygon points="0,-34 -12,-48 12,-48" />
                  <polygon points="-11,-20 -20,-20 -15,-30" />
                  <polygon points="11,-20 20,-20 15,-30" />
                </g>
              ))}
            </svg>
          </div>
          {`ACADEMIC PROGRAM • ${program.shortTitle}`}
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white"
        >
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="max-w-2xl text-xs md:text-sm mt-6 text-gray-200 leading-relaxed font-medium"
        >
          {program.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-10"
        >
          <Link href="#overview" className="bg-secondary text-primary text-sm md:text-base font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start">
            <span>{primaryBtnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsBrochureModalOpen(true)}
            className="bg-background/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-background/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto justify-center lg:justify-start cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{secondaryBtnText}</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Interactive Brochure Request Modal */}
      <AnimatePresence>
        {isBrochureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBrochureModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
            >
              <div className="bg-primary px-6 py-6 text-white relative">
                <button
                  type="button"
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/15 px-2.5 py-1 rounded-full text-blue-100">
                  OFFICIAL CURRICULUM
                </span>
                <h3 className="text-xl font-bold mt-3 leading-snug">
                  Download {program.shortTitle} Brochure & Syllabus
                </h3>
                <p className="text-xs text-blue-200 mt-1">
                  Enter your details to receive the comprehensive course guide instantly.
                </p>
              </div>

              <form onSubmit={handleBrochureSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-[#162050] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Get Instant PDF & Curriculum</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramHero;
