import React from 'react';
import { Trash2 } from 'lucide-react';

const AdminItemCard = ({ title, onDelete, children, className = "" }) => {
  return (
    <div className={`p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4 relative ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
        <span className="text-xs font-bold uppercase text-gray-500">{title}</span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default AdminItemCard;
