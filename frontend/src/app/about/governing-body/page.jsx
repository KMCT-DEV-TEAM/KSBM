import React from 'react';
import GoverningBody from '../../../features/about/GoverningBody';

import MainLayout from '../../../layouts/MainLayout';

export const metadata = {
  title: 'Governing Body | KMCT School of Business Management',
  description: 'Learn about the governance and leadership of KMCT School of Business Management.',
};

export default function GoverningBodyPage() {
  return (
    <MainLayout>
      <GoverningBody />
    </MainLayout>
  );
}
