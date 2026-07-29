import React, { useState, useEffect } from 'react';
import LogoUploader from './LogoUploader';
import SingleDocumentUploader from './SingleDocumentUploader';

const AddItemModal = ({ isOpen, onClose, title, fields, onSave, initialData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && fields) {
      if (initialData) {
        setFormData(initialData);
      } else {
        const initial = {};
        fields.forEach(f => {
          initial[f.name] = f.defaultValue || '';
        });
        setFormData(initial);
      }
    }
  }, [isOpen, fields, initialData]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        alert(`Please fill in the required field: ${field.label}`);
        return;
      }
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title || 'Add Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2 pb-2">
          {fields && fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  maxLength={field.maxLength}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  maxLength={field.maxLength}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary min-h-[100px] resize-y transition-colors"
                />
              )}

              {field.type === 'image' && (
                <LogoUploader
                    currentImage={formData[field.name]}
                    defaultImage={initialData ? initialData[field.name] : ''}
                    onChange={(url, file) => {
                      handleChange(field.name, url);
                    }}
                    deferredMode={true}
                  />
              )}

              {field.type === 'document' && (
                <SingleDocumentUploader
                  fileUrl={formData[field.name] || ''}
                  uploadEndpoint="/upload/committees"
                  defaultFile="#"
                  onUploadComplete={(urlObj) => handleChange(field.name, urlObj)}
                  onUploadStateChange={(isUploading) => {}}
                  label={`Upload ${field.label}`}
                  deferredUpload={false}
                  recommendedSize="PDF up to 10MB"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={formData[field.name] || field.options[0]?.value || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                >
                  {field.options && field.options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {(field.type === 'text' || field.type === 'textarea') && field.maxLength && (
                <div className="text-[10px] text-gray-400 text-right mt-1 font-medium">
                  {(formData[field.name] || '').length}/{field.maxLength}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end gap-3 border-t pt-4 shrink-0">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">{initialData ? 'Save Changes' : 'Add Item'}</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
