"use client";
import React from 'react';
import ExaminationsLanding from '../../features/examinations/ExaminationsLanding';
import MainLayout from '../../layouts/MainLayout';

export default function ExaminationsRoute() {
  return (
    <MainLayout>
      <ExaminationsLanding />
    </MainLayout>
  );
}
