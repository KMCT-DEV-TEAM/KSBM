import React from 'react';
import Faculty from '../../features/faculty/Faculty';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'Faculty Members | KMCT School of Business Management (KSBM)',
  description: 'Meet our distinguished faculty and adjunct professors at KMCT School of Business Management (KSBM), committed to delivering quality education and mentorship.',
};

export default function FacultyPage() {
  return (
    <MainLayout>
      <Faculty />
    </MainLayout>
  );
}
