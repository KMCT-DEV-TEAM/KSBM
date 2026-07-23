import React from 'react';

const AdminSkeleton = () => {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-3 w-1/3">
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Content Block 1 Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-6">
        <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
             <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div className="space-y-2">
             <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
             <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
        </div>
      </div>

      {/* Content Block 2 Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-md w-32"></div>
        </div>
        <div className="space-y-4">
           {[1, 2].map(i => (
             <div key={i} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 h-40 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded-md w-full"></div>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkeleton;
