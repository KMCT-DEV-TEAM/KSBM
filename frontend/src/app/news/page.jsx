import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import NewsPageContent from '../../features/news/NewsPageContent';

export const metadata = {
  title: 'News and Events | KSBM',
  description: 'Stay updated with the latest news, events, and announcements from KMCT School of Business Management.',
};

export default function NewsPage() {
  return (
    <MainLayout>
      <NewsPageContent />
    </MainLayout>
  );
}
