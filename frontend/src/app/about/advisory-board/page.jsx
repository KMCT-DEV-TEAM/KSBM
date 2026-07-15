import React from 'react';
import AdvisoryBoard from '../../../features/about/AdvisoryBoard';
import MainLayout from '../../../layouts/MainLayout';

export const metadata = {
  title: 'Advisory Board | KMCT School of Business Management',
  description: 'Learn about the Institutional Advisory Board of KMCT School of Business Management.',
};

export default function AdvisoryBoardPage() {
  return (
    <MainLayout>
      <AdvisoryBoard />
    </MainLayout>
  );
}
