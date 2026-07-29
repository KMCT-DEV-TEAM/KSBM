"use client";
import React, { useState, useEffect } from 'react';

import ExaminationsHero from './components/ExaminationsHero';
import ExaminationsOverview from './components/ExaminationsOverview';
import ExamCalendarBanner from './components/ExamCalendarBanner';
import ExamNotifications from './components/ExamNotifications';
import ExamResultsTable from './components/ExamResultsTable';
import api from '../../api/axios';

const ExaminationsLanding = ({ previewData }) => {
  const [data, setData] = useState(previewData || null);
  const [isLoading, setIsLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setIsLoading(false);
      return;
    }
    
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
        <main>
          {(!data?.activeTab || data.activeTab === 'hero') && <ExaminationsHero data={data} />}
          {(!data?.activeTab || data.activeTab === 'overview') && <ExaminationsOverview data={data} />}
          {(!data?.activeTab || data.activeTab === 'calendar') && <ExamCalendarBanner data={data} />}
          {(!data?.activeTab || data.activeTab === 'notifications') && <ExamNotifications data={data} />}
          {(!data?.activeTab || data.activeTab === 'results') && <ExamResultsTable data={data} />}
        </main>
      </div>
    </div>
  );
};

export default ExaminationsLanding;
