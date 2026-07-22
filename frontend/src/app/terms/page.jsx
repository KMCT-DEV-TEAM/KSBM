import React from 'react';
import TermsAndConditions from '../../features/legal/TermsAndConditions';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'Terms & Conditions | KSBM',
  description: 'Read the official terms and conditions of usage for KMCT School of Business Management platforms.',
};

export default function TermsPage() {
  return (
    <MainLayout>
      <TermsAndConditions />
    </MainLayout>
  );
}
