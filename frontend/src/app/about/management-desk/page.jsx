import React from 'react';
import ManagementDesk from '../../../features/about/ManagementDesk';
import MainLayout from '../../../layouts/MainLayout';

export const metadata = {
  title: 'Management Desk | KMCT School of Business Management',
  description: 'Explore the strategic direction and leadership vision of the Management Desk at KMCT School of Business Management.',
};

export default function ManagementDeskPage() {
  return (
    <MainLayout>
      <ManagementDesk />
    </MainLayout>
  );
}
