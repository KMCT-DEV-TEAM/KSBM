import React from 'react';
import { Eye, RefreshCw, Save } from 'lucide-react';

const PageHeader = ({ title, description, onPreview, onReset, onSave, isSaving }) => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">{title}</h1>
        {description && <p className="text-[#697A8D] mt-1 text-sm">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {onPreview && (
          <button
            onClick={onPreview}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-md font-semibold text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-white text-[#697A8D] px-4 py-2.5 rounded-md font-semibold text-sm border border-[#D9DEE3] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
