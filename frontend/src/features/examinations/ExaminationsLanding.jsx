"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ExaminationsHero from './components/ExaminationsHero';
import ExaminationsOverview from './components/ExaminationsOverview';
import ExamCalendarBanner from './components/ExamCalendarBanner';
import ExamNotifications from './components/ExamNotifications';
import ExamResultsTable from './components/ExamResultsTable';
import api from '../../api/axios';

const ExaminationsLanding = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchExaminationsData = async () => {
      try {
        const res = await api.get('/cms/examinations-page');
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching examinations page data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExaminationsData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <main>
          <ExaminationsHero data={data} />
          <ExaminationsOverview data={data} />
          <ExamCalendarBanner data={data} />
          <ExamNotifications data={data} />
          <ExamResultsTable data={data} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ExaminationsLanding;
