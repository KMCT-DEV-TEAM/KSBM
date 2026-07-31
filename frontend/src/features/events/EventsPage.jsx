"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import EventsFooter from './components/EventsFooter';
import api from '../../api/axios';

// Section Components
import EventsHero from './components/EventsHero';
import EventsAbout from './components/EventsAbout';
import EventsUpcoming from './components/EventsUpcoming';
import EventsCarousel from './components/EventsCarousel';
import EventsEssence from './components/EventsEssence';
import EventsStayConnected from './components/EventsStayConnected';
import EventsMoments from './components/EventsMoments';

import Loader from '../../components/Loader';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/events-page');
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching events page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const hero = pageData?.hero || {
    title: 'THE SPIRIT OF CULTURE',
    subtitle: 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life.',
    backgroundImage: '/assets/Images/Group 250.png'
  };

  const about = pageData?.about || {
    subheading: 'About',
    heading: 'THE SPIRIT OF CULTURE',
    paragraph1: "Discover a celebration where creativity knows no limits and every performance tells a story worth remembering. Kaleido is more than a cultural festival—it's a vibrant platform where passion meets purpose, traditions blend with innovation, and talent shines without boundaries. Bringing together students, artists, performers, and creative minds from diverse backgrounds, the festival transforms the campus into a spectacular stage filled with energy, color, and inspiration.",
    paragraph2: "Immerse yourself in a world of mesmerizing dance performances, soul-stirring music, captivating theatre, expressive fine arts, photography, fashion, literature, and countless cultural experiences that celebrate the richness of artistic expression. Whether you're stepping into the spotlight as a performer, competing to showcase your skills, cheering for your peers, or simply enjoying the electrifying atmosphere, every moment at Kaleido is designed to inspire, connect, and create lasting memories.",
    image: '/assets/Images/image 91.png',
    brochureUrl: '',
    calendarUrl: ''
  };

  const upcomingEvents = pageData?.upcomingEvents || { heading: 'THE UPCOMING EVENTS', events: [] };
  const highlightedPrograms = pageData?.highlightedPrograms || { heading: 'THE HIGHLIGHTED PROGRAMS', images: [] };
  const essenceOfCulture = pageData?.essenceOfCulture || { heading: 'THE ESSENCE OF CULTURE', items: [] };
  const stayConnected = pageData?.stayConnected || { heading: 'STAY CONNECTED', posters: [] };
  const momentsCaptured = pageData?.momentsCaptured || { heading: 'MOMENTS CAPTURED', images: [] };
  const footerGraphic = pageData?.footerGraphic || '/assets/Images/Group 339.png';

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white overflow-x-hidden font-sans">
      <Header />

      <div 
        className={`fixed inset-0 z-[9999] bg-slate-900 transition-opacity duration-1000 flex items-center justify-center ${!isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Loader fullScreen={false} />
      </div>

      {/* ── Hero Banner ── */}
      <EventsHero hero={hero} />

      {/* ── About Section ── */}
      {about?.showSection !== false && <EventsAbout about={about} />}

      {/* ── Upcoming Events ── */}
      {upcomingEvents?.showSection !== false && <EventsUpcoming upcomingEvents={upcomingEvents} />}

      {/* ── Highlighted Programs (Carousel) ── */}
      {highlightedPrograms?.showSection !== false && (
        <EventsCarousel
          highlightedPrograms={highlightedPrograms}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
        />
      )}

      {/* ── Essence of Culture ── */}
      {essenceOfCulture?.showSection !== false && (
        <EventsEssence
          essenceOfCulture={essenceOfCulture}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* ── Stay Connected ── */}
      {stayConnected?.showSection !== false && <EventsStayConnected stayConnected={stayConnected} />}

      {/* ── Moments Captured ── */}
      {momentsCaptured?.showSection !== false && <EventsMoments momentsCaptured={momentsCaptured} />}

      {/* Custom Events Footer */}
      <EventsFooter footerGraphic={footerGraphic} />
    </div>
  );
};

export default EventsPage;
