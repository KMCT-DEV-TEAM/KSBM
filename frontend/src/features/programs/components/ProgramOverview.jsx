"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, CheckCircle, ShieldCheck, Sparkles, GraduationCap, X, Send, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const ProgramOverview = ({ program }) => {
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

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

  const badgeText = program.overviewBadgeText || (program.id === 'bba' ? 'UNDERGRADUATE EXCELLENCE' : 'POSTGRADUATE EXCELLENCE');
  const floatingBadgeText = program.overviewFloatingBadgeText || (program.id === 'bba' ? '3-Year Foundation' : '100% Case-Study Driven');
  const primaryBtnText = program.overviewPrimaryBtnText || 'Apply Now';
  const secondaryBtnText = program.overviewSecondaryBtnText || 'Download Brochure';

  return (
    <section id="overview" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="w-[94%] max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase mb-3 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-[#5594c0]" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-semibold text-primary tracking-tight leading-[1.2] mb-6 font-heading">
              {program.overviewTitle || program.title}
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6 font-normal">
              {program.overviewText}
            </p>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 font-normal">
              {program.overviewSubtext}
            </p>


            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="#admission"
                className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-primary text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(27,37,89,0.25)] hover:bg-[#162050] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setIsBrochureModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-white border-2 border-primary/20 text-primary font-semibold text-sm tracking-wide hover:bg-blue-50/50 hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Download className="w-4 h-4 text-primary group-hover:-translate-y-0.5 transition-transform" />
                <span>{secondaryBtnText}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border-8 border-white bg-gray-100 aspect-[4/3]">
                <img
                  src={program.overviewImage || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"}
                  alt={`${program.shortTitle} Overview`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge 1 - Bottom Left Border */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-5 sm:-bottom-6 left-2 sm:-left-6 lg:-left-10 bg-white p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center gap-3.5 z-20"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                    {floatingBadgeText}
                  </h4>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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
    </section>
  );
};

export default ProgramOverview;
