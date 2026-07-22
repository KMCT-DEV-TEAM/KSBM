import React from 'react';
import FaqPage from '../../features/faq/FaqPage';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'FAQ | Everything You Need to Know | KSBM',
  description: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
};

export default function FaqsAppRoute() {
  return (
    <MainLayout>
      <FaqPage />
    </MainLayout>
  );
}
