"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../api/axios';

const watermarkLogo = '/assets/Images/watermark_logo.png';

const ContactHero = () => {
  const [heroData, setHeroData] = useState({
    title: 'Stay Connected. \nStart Your Journey With KSBM.',
    subtitle: 'Reach out to our admissions office, placement cell, or general inquiry desk. We are here to answer your questions and guide you toward a transformative management education experience.',
    badge: 'CONTACT INFORMATION',
    backgroundImage: '/assets/Images/image 73.png'
  });

  const [contactBoxData, setContactBoxData] = useState({
    badge: 'CONTACT US',
    title: 'Start Your Journey',
    subtitle: 'Whether you are seeking admission to our flagship management programs or exploring corporate collaboration, our doors are always open to support your ambitions.',
    phoneLabel: 'Call us for inquiry',
    phoneNumber: '+91 495 2211 444',
    phoneSecondary: '/ +1 (212) 555-0198',
    emailLabel: 'Email anytime',
    emailPrimary: 'admissions@ksbm.ac.in',
    emailSecondary: 'solutions@lumina.com',
    addressLabel: 'Visit Our Office',
    addressText: 'KMCT Hills, Mampara, Pazhur P.O., Kuttippuram, Kerala - 679571',
    bottomBadgeText: 'Admissions Open 2025–27',
    bottomBadgeDesk: 'KSBM Desk'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/cms/contact-page');
        if (response.data?.hero) setHeroData(prev => ({ ...prev, ...response.data.hero }));
        if (response.data?.contactBox) setContactBoxData(prev => ({ ...prev, ...response.data.contactBox }));
      } catch (error) {
        console.error('Failed to fetch contact page settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in your Name, Email, and Message before submitting.',
        confirmButtonColor: '#111836'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        icon: 'success',
        title: 'Message Sent Successfully!',
        text: 'Thank you for reaching out. Our team will get back to you within 24 hours.',
        confirmButtonColor: '#111836'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Could not send your message right now. Please try again later.',
        confirmButtonColor: '#111836'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative text-white pt-36 pb-32 sm:pt-48 sm:pb-44 lg:pt-52 lg:pb-48 overflow-hidden min-h-[125vh] flex flex-col justify-center">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.backgroundImage || "/assets/Images/image 73.png"}
          alt="KSBM Campus Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      {/* Background Geometric Pattern */}
      <div
        className="absolute top-1/3 left-0 w-[500px] h-[500px] opacity-[0.22] pointer-events-none transform -translate-x-1/3 -translate-y-1/2 bg-secondary"
        style={{
          maskImage: `url(${watermarkLogo})`,
          WebkitMaskImage: `url(${watermarkLogo})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center'
        }}
      ></div>
      <div
        className="absolute bottom-1/3 right-0 w-[500px] h-[500px] opacity-[0.22] pointer-events-none transform translate-x-1/3 translate-y-1/2 bg-secondary"
        style={{
          maskImage: `url(${watermarkLogo})`,
          WebkitMaskImage: `url(${watermarkLogo})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center'
        }}
      ></div>

      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Top Hero Heading in same section */}
        <div className="text-start max-w-5xl pt-10 sm:pt-16 mb-24 sm:mb-32">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[40px] font-semibold tracking-tight text-white mb-8 sm:mb-10 leading-tight whitespace-pre-line"
          >
            {heroData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[15px] sm:text-base text-white/80 max-w-3xl leading-relaxed font-normal mb-12 sm:mb-16"
          >
            {heroData.subtitle}
          </motion.p>


        </div>

        {/* Centered Contact Information Divider Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-4 sm:gap-6 w-full mb-10 sm:mb-14"
        >
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-white/60"></div>
          <span className="text-sm sm:text-base font-bold tracking-[0.25em] text-white uppercase whitespace-nowrap px-2">
            {heroData.badge}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/40 to-white/60"></div>
        </motion.div>

        {/* Contact Form & Info Grid right below inside single section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Box: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white/90 text-sm focus:outline-none focus:border-white/50 transition-all shadow-inner cursor-pointer"
                  >
                    <option value="">Select Service</option>
                    <option value="MBA Admissions Inquiry">MBA Admissions Inquiry</option>
                    <option value="Placement & Corporate Relations">Placement & Corporate Relations</option>
                    <option value="Campus Visit & Tour">Campus Visit & Tour</option>
                    <option value="Examination & Academic Records">Examination & Academic Records</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message"
                    rows="5"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all shadow-inner resize-none"
                    required
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Box: Contact Info / Start Your Journey */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col justify-between space-y-8"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-2">
                {contactBoxData.badge}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight leading-tight">
                {contactBoxData.title}
              </h2>
              <p className="text-[14px] text-white/80 leading-relaxed font-normal">
                {contactBoxData.subtitle}
              </p>
            </div>

            <div className="space-y-4 pt-3 border-t border-white/10">
              {/* Phone */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-md">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-white/60 font-medium mb-0.5">{contactBoxData.phoneLabel}</p>
                  <a
                    href={`tel:${contactBoxData.phoneNumber?.replace(/\s+/g, '') || '+914952211444'}`}
                    className="text-[13px] font-medium text-white tracking-wide hover:underline"
                  >
                    {contactBoxData.phoneNumber}
                  </a>
                  {contactBoxData.phoneSecondary && (
                    <span className="block text-xs text-white/70 sm:inline sm:ml-1.5">{contactBoxData.phoneSecondary}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-md">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-white/60 font-medium mb-0.5">{contactBoxData.emailLabel}</p>
                  <a
                    href={`mailto:${contactBoxData.emailPrimary || 'admissions@ksbm.ac.in'}`}
                    className="text-[13px] font-medium text-white tracking-wide hover:underline block"
                  >
                    {contactBoxData.emailPrimary}
                  </a>
                  {contactBoxData.emailSecondary && (
                    <a
                      href={`mailto:${contactBoxData.emailSecondary}`}
                      className="text-xs text-white/70 hover:underline block"
                    >
                      {contactBoxData.emailSecondary}
                    </a>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-md">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-white/60 font-medium mb-0.5">{contactBoxData.addressLabel}</p>
                  <p className="text-[13px] font-medium text-white leading-snug">
                    {contactBoxData.addressText}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom quick badge */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {contactBoxData.bottomBadgeText}
              </span>
              <span className="font-semibold tracking-wider uppercase text-white/80">{contactBoxData.bottomBadgeDesk}</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ContactHero;
