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

const PlacementLanding = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main>
        <PlacementHero data={data.hero} />
        <PlacementOverview data={data.overview} />
        <ProudAchievers data={data.proudAchievers} />
        <TopRecruiters data={data.topRecruiters} />
        <ExcellenceSupport data={data.excellenceSupport} />
        <FacultyInCharge data={data.facultyInCharge} />
        <PlacementCommittee data={data.placementCommittee} />
        <PlacementActivities data={data.activities} />
      </main>
    </div>
  );
};

export default PlacementLanding;
