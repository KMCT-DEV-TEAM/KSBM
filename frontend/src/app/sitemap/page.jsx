"use client";
import React from 'react';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';

const SitemapPage = () => {
  const sitemapLinks = [
    {
      title: 'About Us',
      links: [
        { label: 'Overview', url: '/about' },
        { label: 'Management', url: '/people?tab=management' },
        { label: 'Faculty', url: '/people?tab=faculty' },
        { label: 'Advisory Board', url: '/people?tab=advisory' },
        { label: 'Committees & Cells', url: '/committees-and-cells' },
        { label: 'Mandatory Disclosure', url: '/mandatory-disclosure' },
      ],
    },
    {
      title: 'Programs',
      links: [
        { label: 'MBA', url: '/programs/mba' },
        { label: 'BBA ', url: '/programs/bba' },
      ],
    },
    {
      title: 'Student Life',
      links: [
        { label: 'Facilities', url: '/facilities' },
        { label: 'Events', url: '/events' },
        { label: 'Clubs', url: '/facilities-details?tab=clubs' },
        { label: 'Gallery', url: '/gallery' },
        { label: 'News & Achievements', url: '/news' },
      ],
    },
    {
      title: 'Placements & Alumni',
      links: [
        { label: 'Placements', url: '/placement' },
        { label: 'Top Recruiters', url: '/placement?tab=recruiters' },
        { label: 'Alumni Network', url: '/alumni' },
      ],
    },
    {
      title: 'Admissions & Support',
      links: [
        { label: 'Admissions Info', url: '/admissions' },
        { label: 'Examinations', url: '/examinations' },
        { label: 'Downloads', url: '/download' },
        { label: 'FAQ', url: '/faq' },
        { label: 'Grievance', url: '/grievance' },
        { label: 'Contact Us', url: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms & Conditions', url: '/terms-and-conditions' },
      ],
    },
  ];

  return (
    <MainLayout>
      <main className="min-h-screen bg-gray-50/50">

        {/* Hero Section */}
        <div className="relative w-full h-[40vh] min-h-[300px] bg-primary flex items-center justify-center overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wide">
              Site<span className="text-secondary">map</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
              Navigate through KMCT School of Business Management. Find links to all pages and resources available on our website.
            </p>
          </motion.div>
        </div>

        {/* Sitemap Grid */}
        <div className="w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {sitemapLinks.map((section, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 group-hover:text-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {section.title}
                </h2>
                <ul className="space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.url}
                        className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium group/link"
                      >
                        <span className="text-secondary opacity-0 group-hover/link:opacity-100 transition-opacity transform -translate-x-2 group-hover/link:translate-x-0">
                          →
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </MainLayout>
  );
};

export default SitemapPage;
