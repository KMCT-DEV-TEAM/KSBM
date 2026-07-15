"use client";
import React, { useState, useEffect } from 'react';
import AdvisoryBoardHero from './components/advisory-board/AdvisoryBoardHero';
import AdvisoryBoardContent from './components/advisory-board/AdvisoryBoardContent';
import AdvisoryBoardMembers from './components/advisory-board/AdvisoryBoardMembers';
import api from '../../api/axios';

const AdvisoryBoard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/advisory-board');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Advisory Board data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <AdvisoryBoardHero data={data} />
      <AdvisoryBoardContent data={data} />
      <AdvisoryBoardMembers data={data} />
    </div>
  );
};

export default AdvisoryBoard;
