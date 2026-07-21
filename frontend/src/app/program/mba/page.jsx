import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import MbaPage from '../../../features/programs/MbaPage';

export const metadata = {
  title: 'Master of Business Administration (MBA) | KSBM',
  description: 'A rigorous two-year postgraduate program designed to mold visionary business leaders, strategic thinkers, and dynamic corporate innovators.',
};

export default function ProgramMbaAliasRoute() {
  return (
    <MainLayout>
      <MbaPage />
    </MainLayout>
  );
}
