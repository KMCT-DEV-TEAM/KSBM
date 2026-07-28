import React from 'react';
import CommitteesAndCellsPage from '../../features/committees-and-cells/CommitteesAndCellsPage';

export const metadata = {
  title: 'Committees & Cells | KSBM',
  description: 'Explore the various statutory committees and institutional cells established to ensure transparency, student welfare, academic excellence, and regulatory compliance.',
};

export default function CommitteesAndCellsRoute() {
  return <CommitteesAndCellsPage />;
}
