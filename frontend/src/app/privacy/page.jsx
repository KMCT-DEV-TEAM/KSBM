import React from 'react';
import PrivacyPolicy from '../../features/legal/PrivacyPolicy';
import MainLayout from '../../layouts/MainLayout';

export const metadata = {
  title: 'Privacy Policy | KSBM',
  description: 'Read the official privacy policy and institutional disclaimer for KMCT School of Business Management.',
};

export default function PrivacyPage() {
  return (
    <MainLayout>
      <PrivacyPolicy />
    </MainLayout>
  );
}
