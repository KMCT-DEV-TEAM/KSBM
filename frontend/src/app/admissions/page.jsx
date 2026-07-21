import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import AdmissionLanding from '../../features/admission/AdmissionLanding';

export const metadata = {
  title: 'Admissions & Process | KSBM',
  description: 'Explore merit-based MBA & BBA admissions at KSBM. Your path to corporate leadership starts here.',
};

export default function AdmissionsPage() {
  return (
    <MainLayout>
      <AdmissionLanding />
    </MainLayout>
  );
}
