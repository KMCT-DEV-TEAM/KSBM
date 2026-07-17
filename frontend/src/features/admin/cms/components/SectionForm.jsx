import React from 'react';

const SectionForm = ({ title, actionButton, children, className = "" }) => {
  return (
    <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-3 mb-4">
          <h2 className="text-lg font-bold text-[#1e2869] flex items-center gap-2">{title}</h2>
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SectionForm;
