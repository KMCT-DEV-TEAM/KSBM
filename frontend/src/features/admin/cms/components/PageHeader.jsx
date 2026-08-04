import React, { useState } from 'react';
import { Eye, RefreshCw, Save, Loader2, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const PageHeader = ({ title, description, onPreview, previewUrl, onReset, onSave, isSaving, extraButtons, children }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const handlePreviewClick = () => {
    if (onPreview) {
      onPreview();
    } else if (previewUrl) {
      setIsPreviewModalOpen(true);
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (isSaving) return;

    // Generic validation: Check all visible inputs and textareas (except checkboxes/radios/files)
    // Scope the validation to the current page container to avoid triggering on Navbar/Sidebar search inputs
    const container = e.currentTarget.closest('.space-y-6') || e.currentTarget.closest('.p-6') || document;
    const formElements = Array.from(container.querySelectorAll('input:not([type="checkbox"]):not([type="file"]):not([type="radio"]), textarea'));
    
    const emptyFields = formElements.filter(el => {
      // Check if element is visible
      const isVisible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      if (!isVisible) return false;
      
      // If visible, check if empty
      return !el.value.trim();
    });

    if (emptyFields.length > 0) {
      // Focus the first empty field for user convenience
      emptyFields[0].focus();
      Toast.fire({ icon: 'warning', title: 'Please fill all the fields' });
      return;
    }

    if (onSave) {
      onSave(e);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2869]">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {extraButtons}
          {children}
          {(onPreview || previewUrl) && (
            <button
              onClick={handlePreviewClick}
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
              onClick={handleSaveClick}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {isPreviewModalOpen && previewUrl && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>

            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe
                src={`http://localhost:3000${previewUrl}`}
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageHeader;
