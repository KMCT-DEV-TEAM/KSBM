import React from 'react';
import ManageEventsPage from '../../../../../features/admin/cms/ManageEventsPage';

export const metadata = {
  title: 'Manage Events Page | KSBM Admin',
  description: 'Customize the events landing page content.',
};

export default function ManageEventsAppRoute() {
  return <ManageEventsPage />;
}
