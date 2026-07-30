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
  
  const currentDisplayUrl = (typeof imageUrl === 'object' && imageUrl !== null && 'previewUrl' in imageUrl) 
    ? (imageUrl.previewUrl || defaultImage) 
    : (typeof imageUrl === 'string' ? imageUrl : defaultImage);

  const isProtectedImage = (url) => {
    if (!url || typeof url !== 'string') return false;
    const protectedImages = [
      'hero_banner_1.png', 'hero_banner_2.png', 'hero_banner_3.png',
      'academic_mba.jpg', 'academic_bba.jpg', 'graduate.png',
      'Component 86.png', 'Component 87.png', 'Component 88.png',
      'watermark_logo.png', 'watermark_logo1.png',
      'management_1.jpg', 'management_2.jpg', 'management_3.jpg',
      'facility_1.jpg', 'facility_2.jpg', 'facility_3.jpg',
      'facility_4.jpg', 'facility_5.jpg', 'facility_6.jpg',
      'facilities_hero.png', 'life_1.jpg', 'facility_details_hero.jpg', 'image_55.png',
      'infosys_logo.svg', 'wipro_logo.svg', 'cognizant_logo.svg',
      'google_logo.svg', 'microsoft_logo.svg',
      'testimonial_1.jpg', 'testimonial_2.jpg', 'testimonial_3.jpg',
      'about-hero-bg.jpg',
      'default-management-hero.jpg', 'default-management-leader.jpg', 'default-management-badge.png',
      'mba_hero_bg.png', 'mba_main.png', 'mba_feature_1.png', 'mba_feature_2.png',
      'internship_2.png', 'internship_27.png', 'internship_28.png', 
      'dynamic_49.png', 'dynamic_60.png', 'calendar_64.png',
      'gallery_67.png', 'gallery_58.png', 'gallery_69.png', 'gallery_70.png',
      'gallery_71.png', 'gallery_72.png', 'gallery_73.png', 'gallery_74.png',
      'gallery_75.png', 'gallery_76.png', 'gallery_77.png', 'gallery_78.png',
      'default-faculty-hero.jpg', 'default-faculty-leader.jpg'
    ];
    return protectedImages.some(img => url.endsWith(img));
  };
  const isDefaultOrProtected = currentDisplayUrl === defaultImage || isProtectedImage(currentDisplayUrl);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Only take the first file
    
    if (deferredUpload) {
      const previewUrl = URL.createObjectURL(file);
      onUploadComplete({ 
        file, 
        previewUrl, 
        oldUrl: (typeof currentDisplayUrl === 'string' && currentDisplayUrl !== defaultImage && !currentDisplayUrl.startsWith('blob:')) ? currentDisplayUrl : null 
      });
      return;
    }

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);

    // If there is an old image and we are replacing it, request backend to delete old image
    if (typeof currentDisplayUrl === 'string' && currentDisplayUrl !== defaultImage && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http')) {
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
        if (deferredUpload) {
          onUploadComplete({ 
            isDeleted: true, 
            oldUrl: (typeof currentDisplayUrl === 'string' && currentDisplayUrl !== defaultImage && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http')) ? currentDisplayUrl : null,
            previewUrl: defaultImage 
          });
        } else {
          if (typeof currentDisplayUrl === 'string' && currentDisplayUrl !== defaultImage && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http')) {
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
                  {isDefaultOrProtected ? "Default Image" : "Current Image"}
                </div>

                {/* Remove Button */}
                {allowDelete && (
                  <button 
                    onClick={removeImage}
                    disabled={isDefaultOrProtected}
                    type="button"
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all shadow-md z-10 
                      ${isDefaultOrProtected 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-white text-red-500 hover:bg-red-500 hover:text-white'
                      }`}
                    title={isDefaultOrProtected ? "Default image cannot be deleted" : "Revert to Default Image"}
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
