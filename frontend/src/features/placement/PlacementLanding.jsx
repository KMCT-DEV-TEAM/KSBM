"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

import PlacementHero from './components/PlacementHero';
import PlacementOverview from './components/PlacementOverview';
import ProudAchievers from './components/ProudAchievers';
import TopRecruiters from './components/TopRecruiters';
import ExcellenceSupport from './components/ExcellenceSupport';
import FacultyInCharge from './components/FacultyInCharge';
import PlacementCommittee from './components/PlacementCommittee';
import PlacementActivities from './components/PlacementActivities';

const PlacementLanding = ({ previewData }) => {
  const [data, setData] = useState(previewData || null);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setLoading(false);
      return;
    }

    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/placement-page');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching placement page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeTab = data?.activeTab;

  const shouldRender = (tabName) => {
    return !activeTab || activeTab === tabName;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        {shouldRender('hero') && <PlacementHero data={data?.hero} />}
        {shouldRender('overview') && <PlacementOverview data={data?.overview} />}
        {shouldRender('proudAchievers') && data?.proudAchievers?.showSection !== false && <ProudAchievers data={data?.proudAchievers} />}
        {shouldRender('topRecruiters') && data?.topRecruiters?.showSection !== false && <TopRecruiters data={data?.topRecruiters} />}
        {shouldRender('excellenceSupport') && data?.excellenceSupport?.showSection !== false && <ExcellenceSupport data={data?.excellenceSupport} />}
        {shouldRender('facultyInCharge') && data?.facultyInCharge?.showSection !== false && <FacultyInCharge data={data?.facultyInCharge} />}
        {shouldRender('placementCommittee') && data?.placementCommittee?.showSection !== false && <PlacementCommittee data={data?.placementCommittee} />}
        {shouldRender('activities') && data?.activities?.showSection !== false && <PlacementActivities data={data?.activities} />}
      </main>
    </div>
  );
};

export default PlacementLanding;
