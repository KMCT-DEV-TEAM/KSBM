import React from 'react';
import GrievancePage from '../../features/grievance/GrievancePage';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Grievance Form | KSBM',
  description: 'Submit your concerns securely through our Grievance Portal.',
};

export default function GrievanceRoute() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1">
        <GrievancePage />
      </main>
      <Footer />
    </div>
  );
}
