import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import NewsDetailPageContent from '../../../features/news/NewsDetailPageContent';

export const metadata = {
  title: 'News Details | KSBM',
  description: 'Read full details about this news article from KMCT School of Business Management.',
};

export default function NewsDetailPage({ params }) {
  return (
    <MainLayout>
      <NewsDetailPageContent id={params.id} />
    </MainLayout>
  );
}
