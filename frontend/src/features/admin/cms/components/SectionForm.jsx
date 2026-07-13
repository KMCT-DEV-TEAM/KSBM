import React from 'react';

const SectionForm = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] overflow-hidden">
      {title && (
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F]">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SectionForm;
