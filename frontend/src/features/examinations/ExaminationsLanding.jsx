"use client";
import React, { useState, useEffect } from 'react';

import ExaminationsHero from './components/ExaminationsHero';
import ExaminationsOverview from './components/ExaminationsOverview';
import ExamCalendarBanner from './components/ExamCalendarBanner';
import ExamNotifications from './components/ExamNotifications';
import ExamResultsTable from './components/ExamResultsTable';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';

const ExaminationsLanding = ({ previewData }) => {
  const [data, setData] = useState(previewData || null);
  const [dataLoaded, setDataLoaded] = useState(!!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setDataLoaded(true);
      return;
    }
    
    window.scrollTo(0, 0);
    const fetchExaminationsData = async () => {
      try {
        const res = await api.get('/cms/examinations-page', { hideLoader: true });
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching examinations page data:', err);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchExaminationsData();
  }, []);

  const isPreview = Boolean(previewData || data?.activeTab);

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div>
        <main>
          {(!data?.activeTab || data.activeTab === 'hero') && <ExaminationsHero data={{ ...data, isPreview }} />}
          {(!data?.activeTab || data.activeTab === 'overview') && (isPreview || data?.showOverviewSection !== false) && <ExaminationsOverview data={{ ...data, isPreview }} />}
          {(!data?.activeTab || data.activeTab === 'calendar') && (isPreview || data?.showCalendarSection !== false) && <ExamCalendarBanner data={{ ...data, isPreview }} />}
          {(!data?.activeTab || data.activeTab === 'notifications') && (isPreview || data?.showNotificationsSection !== false) && <ExamNotifications data={{ ...data, isPreview }} />}
          {(!data?.activeTab || data.activeTab === 'results') && (isPreview || data?.showResultsSection !== false) && <ExamResultsTable data={{ ...data, isPreview }} />}
        </main>
        </div>
      </div>
    </>
  );
};

export default ExaminationsLanding;
