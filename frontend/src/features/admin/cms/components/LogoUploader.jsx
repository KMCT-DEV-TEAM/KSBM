"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';
import confirmAction from '../../../../utils/confirmAction';

const LogoUploader = ({ currentLogoUrl, value, onUploadSuccess, onChange, onUploadStateChange, label, uploadEndpoint = '/upload', disableDelete = false, layout = 'vertical', deferredMode = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const displayUrl = currentLogoUrl || value;

  const handleSuccess = useCallback(async (url, file = null) => {
    if (!deferredMode) {
      // If we are clearing the image (url === ''), delete the old image from server
      if (url === '' && displayUrl && !displayUrl.startsWith('blob:')) {
        try {
          await api.delete('/upload', { data: { fileUrl: displayUrl }, hideLoader: true });
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }
    if (onUploadSuccess) onUploadSuccess(url, file);
    if (onChange) onChange(url, file);
  }, [onUploadSuccess, onChange, displayUrl, deferredMode]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    if (deferredMode) {
      const objectUrl = URL.createObjectURL(file);
      handleSuccess(objectUrl, file);
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      if (displayUrl && !displayUrl.startsWith('blob:')) {
        try {
          await api.delete('/upload', { data: { fileUrl: displayUrl }, hideLoader: true });
        } catch (error) {
          console.error('Failed to delete old image before replacing:', error);
        }
      }

      const response = await api.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        hideLoader: true
      });

      const { url } = response.data;
      handleSuccess(url);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Image uploaded successfully!',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Upload failed',
        text: error.response?.data?.message || 'Something went wrong while uploading.',
        showConfirmButton: false,
        timer: 4000
      });
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  }, [handleSuccess, onUploadStateChange, displayUrl, uploadEndpoint]);

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
      {label && <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>}
      <div className={`${layout === 'horizontal' && displayUrl ? 'flex gap-4' : ''}`}>
        <div className={`${layout === 'horizontal' && displayUrl ? 'flex-1' : 'w-full'}`}>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors h-full flex flex-col justify-center items-center
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
                      {isDragActive ? "Drop image here..." : (label ? `Drag & drop ${label.toLowerCase()}, or click to select` : "Drag & drop a new image/logo, or click to select")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, SVG, WEBP up to 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {displayUrl && (
          <div className={`${layout === 'horizontal' ? 'flex-1 m-0' : 'mt-4'} p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between`}>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center p-1 shadow-sm">
                <img src={displayUrl} alt="Uploaded Image" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{label || "Current Image"}</p>
              </div>
            </div>
            {!disableDelete && (
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  await confirmAction({
                    title: 'Are you sure?',
                    message: 'You want to remove this image?',
                    confirmText: 'Yes, remove it!',
                    variant: 'danger',
                    action: async () => {
                      if (!deferredMode) {
                        if (displayUrl && !displayUrl.includes('placeholder') && !displayUrl.startsWith('blob:')) {
                          try {
                            await api.delete('/upload', { data: { fileUrl: displayUrl }, hideLoader: true });
                          } catch (deleteErr) {
                            console.error('Failed to delete physical file:', deleteErr);
                          }
                        }
                      }
                      handleSuccess('');
                    }
                  });
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoUploader;

