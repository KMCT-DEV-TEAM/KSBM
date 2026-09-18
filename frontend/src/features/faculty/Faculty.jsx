"use client";
import React, { useState, useEffect } from 'react';
import FacultyHero from './components/FacultyHero';
import FacultyIntro from './components/FacultyIntro';
import FacultyGridSection from './components/FacultyGridSection';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import { DEFAULT_FACULTIES } from '../admin/cms/constants/defaultCmsData';

const Faculty = () => {
  const [data, setData] = useState(DEFAULT_FACULTIES);
  const [dataLoaded, setDataLoaded] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await api.get('/cms/faculty', { hideLoader: true });
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Faculty data, using defaults:', error);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchFacultyData();
  }, []);

  return (
    <>
      <PageTransition dataLoaded={dataLoaded} />
      <div className="bg-[#fcfcfd] min-h-screen">
        <FacultyHero data={data} />
        {data?.showIntro !== false && (
          <FacultyIntro data={data} />
        )}
        {data?.showKsbmFaculty !== false && (
          <FacultyGridSection id="ksbm-faculty" title={data?.ksbmFacultyHeading || "KSBM Faculty"} members={data?.ksbmFaculty} />
        )}
        {data?.showAdjunctFaculty !== false && (
          <FacultyGridSection id="adjunct-faculty" title={data?.adjunctFacultyHeading || "Adjunct Faculty"} members={data?.adjunctFaculty} />
        )}
      </div>
    </>
  );
};

export default Faculty;
