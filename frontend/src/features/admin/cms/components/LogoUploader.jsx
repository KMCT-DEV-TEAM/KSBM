import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';

const LogoUploader = ({ currentLogoUrl, onUploadSuccess, onUploadStateChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        hideLoader: true
      });

      const { url } = response.data;
      onUploadSuccess(url);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Logo uploaded successfully!',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to upload logo',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#696CFF] bg-[#696CFF]/5' : 'border-gray-300 hover:border-[#696CFF]/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#696CFF] animate-spin" />
              <p className="text-sm font-medium text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-[#E7E7FF] text-[#696CFF] rounded-full">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? "Drop the logo here..." : "Drag & drop a new logo, or click to select"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, SVG, WEBP up to 5MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {currentLogoUrl && (
        <div className="mt-4 p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white border border-gray-200 rounded flex items-center justify-center p-1 shadow-sm">
              <img src={currentLogoUrl} alt="Current Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Current Logo</p>
              <a href={currentLogoUrl} target="_blank" rel="noreferrer" className="text-xs text-[#696CFF] hover:underline truncate block max-w-xs">
                {currentLogoUrl}
              </a>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onUploadSuccess('');
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Remove Custom Logo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
