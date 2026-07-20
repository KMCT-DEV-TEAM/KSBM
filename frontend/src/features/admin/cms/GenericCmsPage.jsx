"use client";
import React from 'react';
import PageHeader from './components/PageHeader';

const GenericCmsPage = ({ title }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`${title} CMS`}
        description={`Manage content and media for the ${title} section of the website.`}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Editor under construction</h3>
        <p className="text-gray-500 max-w-md">
          The Content Management System for the <strong>{title}</strong> is currently being built. Soon you will be able to edit text, upload images, and manage data here.
        </p>
      </div>
    </div>
  );
};

export default GenericCmsPage;

