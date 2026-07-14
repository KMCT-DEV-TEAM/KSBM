"use client";
import React from 'react';
import Loader from '../../../components/Loader';

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
      <Loader fullScreen={false} theme="light" text="Loading..." />
    </div>
  );
}
