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

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pageData, setPageData] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/events-page');
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching events page data:', error);
      }
    };
    fetchData();
  }, []);

  const hero = pageData?.hero || {
    title: 'THE SPIRIT OF CULTURE',
    subtitle: 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life.',
    backgroundImage: '/assets/Images/Group 250.png'
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

      <EventsHero hero={hero} />
      <EventsAbout />
      <EventsUpcoming upcomingEvents={upcomingEvents} />
      <EventsCarousel
        highlightedPrograms={highlightedPrograms}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
      />
      <EventsEssence
        essenceOfCulture={essenceOfCulture}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <EventsStayConnected stayConnected={stayConnected} />
      <EventsMoments momentsCaptured={momentsCaptured} />

      {/* Custom Events Footer */}
      <EventsFooter footerGraphic={footerGraphic} />
    </div>
  );
};

export default EventsPage;
