"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

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

  if (loading) return <Loader />;
  if (!data) return null;

  const activeTab = data?.activeTab;

  const shouldRender = (tabName) => {
    return !activeTab || activeTab === tabName;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        {shouldRender('hero') && <PlacementHero data={data.hero} />}
        {shouldRender('overview') && <PlacementOverview data={data.overview} />}
        {shouldRender('proudAchievers') && <ProudAchievers data={data.proudAchievers} />}
        {shouldRender('topRecruiters') && <TopRecruiters data={data.topRecruiters} />}
        {shouldRender('excellenceSupport') && <ExcellenceSupport data={data.excellenceSupport} />}
        {shouldRender('facultyInCharge') && <FacultyInCharge data={data.facultyInCharge} />}
        {shouldRender('placementCommittee') && <PlacementCommittee data={data.placementCommittee} />}
        {shouldRender('activities') && <PlacementActivities data={data.activities} />}
      </main>
    </div>
  );
};

export default PlacementLanding;
