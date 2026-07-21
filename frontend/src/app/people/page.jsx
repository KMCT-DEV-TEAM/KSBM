import React from 'react';
import Faculty from '../../features/faculty/Faculty';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'Faculty | KMCT School of Business Management (KSBM)',
  description: 'Explore our distinguished faculty members, academic leaders, and institutional boards.',
};

export default function PeoplePage() {
  return (
    <MainLayout>
      <Faculty />
    </MainLayout>
  );
}
