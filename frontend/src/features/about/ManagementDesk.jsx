"use client";
import React, { useState, useEffect } from 'react';
import ManagementDeskHero from './components/management-desk/ManagementDeskHero';
import ManagementDeskIntro from './components/management-desk/ManagementDeskIntro';
import ManagementDeskMembers from './components/management-desk/ManagementDeskMembers';
import api from '../../api/axios';

const ManagementDesk = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cms/management-desk');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Management Desk data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      {(data?.showHero !== false) && <ManagementDeskHero data={data} />}
      {(data?.showIntro !== false) && <ManagementDeskIntro data={data} />}
      {(data?.showMembers !== false) && <ManagementDeskMembers data={data} />}
    </div>
  );
};

export default ManagementDesk;
