import React from 'react';
import Alumni from '../../features/alumni/Alumni';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'Alumni Network | KMCT School of Business Management (KSBM)',
  description: 'Explore the KMCT School of Business Management (KSBM) global alumni network, distinguished leaders, reunion events, and lifelong community.',
};

export default function AlumniPage() {
  return (
    <MainLayout>
      <Alumni />
    </MainLayout>
  );
}
