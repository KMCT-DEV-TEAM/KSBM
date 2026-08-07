"use client";
import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const FacilitiesSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 animate-pulse">
        {/* Hero Skeleton */}
        <section className="relative h-screen flex items-end justify-center overflow-hidden pb-24 md:pb-32 bg-gray-200">
          <div className="absolute inset-0 bg-gray-300" />
          <div className="relative z-10 w-[98%] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
            <div className="max-w-4xl w-full">
              <div className="h-12 md:h-16 bg-gray-400 rounded w-3/4 mb-4"></div>
              <div className="h-4 md:h-5 bg-gray-400 rounded w-1/2"></div>
            </div>
          </div>
        </section>

        {/* Resources Skeleton */}
        <section className="py-24 bg-white relative">
          <div className="w-[90%] max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-24 w-full bg-gray-200 rounded"></div>
              <div className="flex gap-4 pt-6">
                <div className="h-12 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-12 w-40 bg-gray-200 rounded-md"></div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] rounded-2xl bg-gray-200 w-full shadow-lg"></div>
            </div>
          </div>
        </section>

        {/* Clubs Skeleton */}
        <section className="py-24 bg-gray-50 relative">
          <div className="w-[95%] max-w-[1440px] mx-auto">
            <div className="flex flex-col items-center mb-16 space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-64 bg-gray-200 rounded"></div>
              <div className="h-16 w-3/4 max-w-2xl bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm h-[400px]">
                  <div className="h-56 bg-gray-200 w-full"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-16 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FacilitiesSkeleton;
