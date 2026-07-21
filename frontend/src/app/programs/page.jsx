import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProgramsLanding from '../../features/programs/ProgramsLanding';

export const metadata = {
  title: 'Academic Programs | KSBM',
  description: 'Explore our Master of Business Administration (MBA) and Bachelor of Business Administration (BBA) programs designed to build future corporate leaders.',
};

export default function ProgramsPage() {
  return (
    <MainLayout>
      <ProgramsLanding />
    </MainLayout>
  );
}
