"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';

const SingleImageUploader = ({ imageUrl, onUploadComplete, onUploadStateChange, label = "Drag & drop image, or click to select" }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Only take the first file
    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);

    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        hideLoader: true
      });
      onUploadComplete(response.data.url);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Image uploaded successfully!',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: `Failed to upload image`,
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  }, [onUploadComplete, onUploadStateChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading,
    multiple: false
  });

  const removeImage = (e) => {
    e.stopPropagation();
    onUploadComplete('');
  };

  return (
    <div className="w-full space-y-4">
      {imageUrl ? (
        <div className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2 h-48 w-full max-w-sm">
          <img src={imageUrl} alt="Uploaded" className="max-w-full max-h-full object-contain drop-shadow-sm rounded" />
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
                onClick={removeImage}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors transform hover:scale-110"
                title="Remove Image"
             >
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors max-w-sm
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-primary/10 text-primary rounded-full">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? "Drop here..." : label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleImageUploader;
