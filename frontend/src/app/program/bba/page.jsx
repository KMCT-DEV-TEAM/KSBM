import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import BbaPage from '../../../features/programs/BbaPage';

export const metadata = {
  title: 'Bachelor of Business Administration (BBA) | KSBM',
  description: 'A dynamic three-year undergraduate program building strong foundational business skills, entrepreneurship capabilities, and leadership excellence.',
};

export default function ProgramBbaAliasRoute() {
  return (
    <MainLayout>
      <BbaPage />
    </MainLayout>
  );
}
