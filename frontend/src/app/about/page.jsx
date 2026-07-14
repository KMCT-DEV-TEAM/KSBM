import React from 'react';
import AboutUs from '../../features/about/AboutUs';

export const metadata = {
  title: 'About Us | KSBM',
  description: 'Learn about the legacy of strategic excellence at KMCT School of Business Management.',
};

import MainLayout from '../../layouts/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutUs />
    </MainLayout>
  );
}
