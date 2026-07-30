"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';
import confirmAction from '../../../../utils/confirmAction';

const HeroImageUploader = ({ 
  imageUrl, 
  onUploadComplete, 
  onUploadStateChange, 
  label = "Drag & drop hero background image, or click to select",
  uploadEndpoint = "/upload",
  recommendedSize = "1920 × 1080 px (16:9 aspect ratio)",
  allowDelete = false,
  deferredUpload = false,
  defaultImage = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const currentDisplayUrl = typeof imageUrl === 'object' && imageUrl?.previewUrl 
    ? imageUrl.previewUrl 
    : (imageUrl || defaultImage);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Only take the first file
    
    if (deferredUpload) {
      const previewUrl = URL.createObjectURL(file);
      onUploadComplete({ 
        file, 
        previewUrl,
        oldUrl: (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultImage) ? currentDisplayUrl : null 
      });
      return;
    }

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);

    // If there is an old image and we are replacing it, request backend to delete old image
    if (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultImage) {
      try {
        await api.delete('/upload', { data: { fileUrl: currentDisplayUrl }, hideLoader: true });
      } catch (err) {
        console.warn('Skipped deleting previous image:', err);
      }
    }

    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.post(uploadEndpoint, formData, {
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
  }, [onUploadComplete, onUploadStateChange, currentDisplayUrl, defaultImage, uploadEndpoint, deferredUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading,
    multiple: false
  });

  const removeImage = async (e) => {
    if (e) e.stopPropagation();
    await confirmAction({
      title: 'Revert to Default?',
      message: 'Are you sure you want to remove this hero image and revert to the default background?',
      confirmText: 'Yes, revert to default',
      variant: 'danger',
      action: async () => {
        if (deferredUpload) {
          onUploadComplete({ 
            isDeleted: true, 
            oldUrl: (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultImage) ? currentDisplayUrl : null,
            previewUrl: defaultImage 
          });
        } else {
          if (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultImage) {
            try {
              await api.delete('/upload', { data: { fileUrl: currentDisplayUrl }, hideLoader: true });
            } catch (err) {
              console.warn('Skipped deleting physical image:', err);
            }
          }
          onUploadComplete(defaultImage);
        }
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/5 cursor-pointer' : 'border-gray-300 hover:border-primary/50 cursor-pointer'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-500">Uploading Image...</p>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">
                  {isDragActive ? "Drop the image here..." : label}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended size: {recommendedSize}. Supports PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {currentDisplayUrl && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wide mb-3">
            Active Hero Background Image
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            This image is currently active and displayed as the hero background on the website. Drag & drop or select a new image above to replace it.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="relative group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-[16/9] w-full bg-gray-100 relative">
                <img src={currentDisplayUrl} alt="Active Hero Banner" className="w-full h-full object-cover" />
                
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded">
                  {currentDisplayUrl === defaultImage ? "Default Hero" : "Current Hero"}
                </div>

                {/* Remove Button if allowDelete is true */}
                {allowDelete && (
                  <button 
                    onClick={removeImage}
                    disabled={currentDisplayUrl === defaultImage}
                    type="button"
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all shadow-md z-10 
                      ${currentDisplayUrl === defaultImage 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-white text-red-500 hover:bg-red-500 hover:text-white'
                      }`}
                    title={currentDisplayUrl === defaultImage ? "Default image cannot be deleted" : "Revert to Default Hero"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImageUploader;
