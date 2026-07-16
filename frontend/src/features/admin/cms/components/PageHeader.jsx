import React from 'react';
import { Eye, RefreshCw, Save, Loader2 } from 'lucide-react';

const PageHeader = ({ title, description, onPreview, onReset, onSave, isSaving }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-[#1e2869]">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {onPreview && (
          <button
            onClick={onPreview}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-semibold text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
