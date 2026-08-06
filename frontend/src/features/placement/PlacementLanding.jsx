"use client";
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';

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
  const [dataLoaded, setDataLoaded] = useState(!!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setDataLoaded(true);
      return;
    }

    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/placement-page', { hideLoader: true });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching placement page data", error);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  const activeTab = data?.activeTab;
  const isPreview = !!activeTab;

  const shouldRender = (tabName) => {
    return !activeTab || activeTab === tabName;
  };

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <main>
        {shouldRender('hero') && <PlacementHero data={data?.hero} />}
        {shouldRender('overview') && (isPreview || data?.overview?.showSection !== false) && <PlacementOverview data={data?.overview} />}
        {shouldRender('proudAchievers') && (isPreview || data?.proudAchievers?.showSection !== false) && <ProudAchievers data={data?.proudAchievers} />}
        {shouldRender('topRecruiters') && (isPreview || data?.topRecruiters?.showSection !== false) && <TopRecruiters data={data?.topRecruiters} />}
        {shouldRender('excellenceSupport') && (isPreview || data?.excellenceSupport?.showSection !== false) && <ExcellenceSupport data={data?.excellenceSupport} />}
        {shouldRender('facultyInCharge') && (isPreview || data?.facultyInCharge?.showSection !== false) && <FacultyInCharge data={data?.facultyInCharge} />}
        {shouldRender('placementCommittee') && (isPreview || data?.placementCommittee?.showSection !== false) && <PlacementCommittee data={data?.placementCommittee} />}
        {shouldRender('activities') && (isPreview || data?.activities?.showSection !== false) && <PlacementActivities data={data?.activities} />}
        </main>
      </div>
    </>
  );
};

export default PlacementLanding;
