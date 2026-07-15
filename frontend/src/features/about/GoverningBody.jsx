"use client";
import React, { useState, useEffect } from 'react';
import GoverningBodyHero from './components/governing-body/GoverningBodyHero';
import GoverningBodyContent from './components/governing-body/GoverningBodyContent';
import GoverningBodyMembers from './components/governing-body/GoverningBodyMembers';
import api from '../../api/axios';

const GoverningBody = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/governing-body');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Governing Body data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <GoverningBodyHero data={data} />
      <GoverningBodyContent data={data} />
      <GoverningBodyMembers data={data} />
    </div>
  );
};

export default GoverningBody;
