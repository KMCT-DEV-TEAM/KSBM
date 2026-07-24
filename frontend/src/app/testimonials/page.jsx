import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import TestimonialsPageContent from '../../features/testimonials/TestimonialsPageContent';

export const metadata = {
  title: 'Testimonials | KSBM',
  description: 'Hear from our successful students and alumni about their experiences, growth, and the journey that shaped their careers at KMCT School of Business Management.',
};

export default function TestimonialsPage() {
  return (
    <MainLayout>
      <TestimonialsPageContent />
    </MainLayout>
  );
}
