import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import AchievementsPageContent from '../../features/achievements/AchievementsPageContent';

export const metadata = {
  title: 'Achievements | KSBM',
  description: 'Explore the awards and achievements earned by students and faculty at KMCT School of Business Management.',
};

export default function AchievementsPage() {
  return (
    <MainLayout>
      <AchievementsPageContent />
    </MainLayout>
  );
}
