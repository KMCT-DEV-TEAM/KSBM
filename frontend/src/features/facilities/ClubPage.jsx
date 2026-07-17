"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';

const ClubPage = () => {
  const { clubId } = useParams();
  const [clubData, setClubData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const response = await api.get('/cms/facilities-page');
        const data = response.data;
        if (data && data.clubs && data.clubs.items) {
          const club = data.clubs.items.find((item) => item._id === clubId);
          if (club) {
            setClubData(club);
          }
        }
      } catch (error) {
        console.error('Failed to fetch club data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubData();
  }, [clubId]);

  if (isLoading) return <Loader theme="light" text="Loading Club Details..." />;

  if (!clubData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Club not found</h1>
          <Link href="/facilities" className="text-primary hover:underline">
            Return to Facilities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { hero, about, activities, faculty, gallery } = clubData;

  // Fallbacks if data is missing
  const heroBg = hero?.backgroundImage || clubData.image || 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1974&auto=format&fit=crop';
  const heroTitle = hero?.title || clubData.title;
  const heroSubtitle = hero?.subtitle || 'Explore our club activities and connect with peers.';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32">
          <img
            src={heroBg}
            alt={heroTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1238]/60 mix-blend-multiply" />
          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.1] tracking-tight">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm lg:text-base text-gray-200 font-medium leading-relaxed max-w-3xl">
                {heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. About Section */}
        {(about?.heading || about?.paragraphs?.length > 0 || about?.image) && (
          <section className="py-20 bg-white relative overflow-hidden">
            {/* Pattern Top Right */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
                <circle cx="20" cy="20" r="3" /><circle cx="40" cy="20" r="3" /><circle cx="60" cy="20" r="3" /><circle cx="80" cy="20" r="3" />
                <circle cx="20" cy="40" r="3" /><circle cx="40" cy="40" r="3" /><circle cx="60" cy="40" r="3" /><circle cx="80" cy="40" r="3" />
                <circle cx="20" cy="60" r="3" /><circle cx="40" cy="60" r="3" /><circle cx="60" cy="60" r="3" /><circle cx="80" cy="60" r="3" />
                <circle cx="20" cy="80" r="3" /><circle cx="40" cy="80" r="3" /><circle cx="60" cy="80" r="3" /><circle cx="80" cy="80" r="3" />
              </svg>
            </div>

            <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-semibold text-[#2b2b68] tracking-tight">
                  {about.heading || 'About the Club'}
                </h2>
                {about.paragraphs?.length > 0 ? (
                  about.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    Join our vibrant community where students come together to share their passion and grow their skills.
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                {about.image && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                    <img src={about.image} alt="About" className="w-full h-auto object-cover" />
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* 3. Activities Section */}
        {activities?.items?.length > 0 && (
          <section className="py-20 bg-gray-50/80">
            <div className="w-[90%] max-w-[1440px] mx-auto text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-12"
              >
                {activities.heading || 'Our Activities'}
              </motion.h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1238]/90 via-[#1e2869]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 p-6 text-left transform group-hover:-translate-y-2 transition-transform duration-500">
                      <h4 className="text-xl font-semibold text-white mb-1">{item.title}</h4>
                      {item.subtitle && <p className="text-sm text-gray-300">{item.subtitle}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Faculty Section */}
        {faculty?.members?.length > 0 && (
          <section className="py-20 bg-white relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] h-[1px] bg-gray-200/50 -z-10" />

            <div className="w-[90%] max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/3"
              >
                {faculty.subheading && (
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    {faculty.subheading}
                  </p>
                )}
                <h2 className="text-3xl md:text-4xl font-semibold text-[#2b2b68] tracking-tight mb-6 leading-tight">
                  {faculty.heading || 'Faculty In Charge'}
                </h2>
                {faculty.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {faculty.description}
                  </p>
                )}
              </motion.div>

              <div className="lg:w-2/3 flex flex-wrap justify-center lg:justify-end gap-6">
                {faculty.members.map((member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative rounded-2xl overflow-hidden w-64 aspect-[3/4] group shadow-lg"
                  >
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5 text-white">
                      <h4 className="font-semibold text-lg mb-0.5">{member.name}</h4>
                      <p className="text-sm text-gray-300 font-light">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Gallery Section */}
        {gallery?.images?.length > 0 && (
          <section
            className="py-24 bg-[#0b1238] relative text-white overflow-hidden"
            style={{
              backgroundImage: "url('/assets/Images/image 55.png')",
              backgroundSize: '400px auto',
              backgroundPosition: 'left 5% center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#0b1238]/25" />
            <div className="w-[95%] max-w-[1440px] mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/30" />
                  <p className="text-xs tracking-[0.3em] font-semibold text-white/70 uppercase">Gallery</p>
                  <div className="h-[1px] w-12 bg-white/30" />
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                  {gallery.heading || 'Captured in Culture'}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-4 md:gap-6 grid-flow-dense">
                {gallery.images.map((img, idx) => {
                  const pattern = idx % 6;
                  let spanClasses = 'sm:col-span-1 sm:row-span-1';
                  if (pattern === 0 || pattern === 5) spanClasses = 'sm:col-span-2 sm:row-span-2';
                  else if (pattern === 1) spanClasses = 'sm:col-span-1 sm:row-span-2';
                  else if (pattern === 4) spanClasses = 'sm:col-span-2 sm:row-span-1';

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10 ${spanClasses}`}
                    >
                      <img src={img.image} alt={img.title || `Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {img.title && (
                        <div className="absolute bottom-0 inset-x-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="font-semibold text-base md:text-lg drop-shadow-md line-clamp-1">{img.title}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-20 bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2b2b68] mb-4">
              Ready to lead the future?
            </h2>
            <p className="text-gray-600 mb-8">
              Explore opportunities to engage, learn, and grow. Join our vibrant community and become part of something greater.
            </p>
            <Link href="/contact" className="inline-block bg-[#2b2b68] text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Apply Now
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ClubPage;
