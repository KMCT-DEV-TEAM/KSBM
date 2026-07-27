"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';
import confirmAction from '../../../../utils/confirmAction';

const SingleImageUploader = ({ 
  imageUrl, 
  onUploadComplete, 
  onUploadStateChange, 
  label = "Drag & drop image, or click to select",
  uploadEndpoint = "/upload",
  allowDelete = true,
  deferredUpload = false,
  defaultImage = "",
  recommendedSize = "PNG, JPG, WEBP up to 5MB"
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
      onUploadComplete({ file, previewUrl });
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
      message: 'Are you sure you want to remove this image and revert to the default image setup?',
      confirmText: 'Yes, revert to default',
      variant: 'danger',
      action: async () => {
        if (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultImage) {
          try {
            await api.delete('/upload', { data: { fileUrl: currentDisplayUrl }, hideLoader: true });
          } catch (err) {
            console.warn('Skipped deleting physical image:', err);
          }
        }
        onUploadComplete(defaultImage);
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/5 cursor-pointer' : 'border-gray-300 hover:border-primary/50 cursor-pointer'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-500">Uploading Image...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? "Drop the image here..." : label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{recommendedSize}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {currentDisplayUrl && (
        <div className="mt-4">
          <h4 className="text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-2">
            Active Image
          </h4>
          
          <div className="max-w-md">
            <div className="relative group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-[16/9] w-full bg-gray-50 relative flex items-center justify-center p-2">
                <img src={currentDisplayUrl} alt="Uploaded" className="max-w-full max-h-full object-contain rounded drop-shadow-sm" />
                
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {currentDisplayUrl === defaultImage ? "Default Image" : "Current Image"}
                </div>

                {/* Remove Button if allowDelete is true and it's not the default image */}
                {allowDelete && currentDisplayUrl !== defaultImage && (
                  <button 
                    onClick={removeImage}
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                    title="Revert to Default Image"
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

export default SingleImageUploader;
