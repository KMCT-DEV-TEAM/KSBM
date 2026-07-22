"use client";
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';

const BannerUploader = ({ bannerImages, setBannerImages, onUploadStateChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    if (bannerImages.length + acceptedFiles.length > 5) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'You can only have up to 5 banner images.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    let uploadedUrls = [];

    // Upload files sequentially or concurrently
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await api.post('/upload/home', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          hideLoader: true
        });
        uploadedUrls.push({ url: response.data.url });
      } catch (error) {
        console.error('Failed to upload image:', error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: `Failed to upload ${file.name}`,
          showConfirmButton: false,
          timer: 3000
        });
      }
    }

    if (uploadedUrls.length > 0) {
      const newImages = [...bannerImages, ...uploadedUrls];
      setBannerImages(newImages);
      
      try {
        const { data } = await api.get('/cms/hero');
        await api.put('/cms/hero', {
          ...data,
          bannerImages: newImages
        });
      } catch (error) {
        console.error('Failed to sync upload with database:', error);
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Images uploaded and saved to database!',
        showConfirmButton: false,
        timer: 3000
      });
    }

    setIsUploading(false);
    if (onUploadStateChange) onUploadStateChange(false);
  }, [setBannerImages, onUploadStateChange, bannerImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading || bannerImages.length >= 5
  });

  const removeImage = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove this banner image?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: '#ff3e1d',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newImages = [...bannerImages];
        newImages.splice(index, 1);
        setBannerImages(newImages);
        
        try {
          const { data } = await api.get('/cms/hero');
          await api.put('/cms/hero', {
            ...data,
            bannerImages: newImages
          });
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Image deleted from database!',
            showConfirmButton: false,
            timer: 3000
          });
        } catch (error) {
          console.error('Failed to delete image from database:', error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Failed to delete from database',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }
    });
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;
    if (dragItem.current === dragOverItem.current) return;

    const copyListItems = [...bannerImages];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setBannerImages(copyListItems);
    
    try {
      const { data } = await api.get('/cms/hero');
      await api.put('/cms/hero', {
        ...data,
        bannerImages: copyListItems
      });
    } catch (error) {
      console.error('Failed to sync reorder with database:', error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${bannerImages.length >= 5 ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed' : 
            isDragActive ? 'border-primary bg-primary/5 cursor-pointer' : 'border-gray-300 hover:border-primary/50 cursor-pointer'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-500">Uploading Images...</p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full ${bannerImages.length >= 5 ? 'bg-gray-200 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">
                  {bannerImages.length >= 5 ? "Maximum of 5 images reached." : isDragActive ? "Drop the images here..." : "Drag & drop banner images, or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-2">Maximum 5 images allowed. You can select multiple files. Supports PNG, JPG, WEBP up to 5MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {bannerImages && bannerImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wide mb-3">
            Active Banners ({bannerImages.length})
          </h4>
          <p className="text-xs text-gray-500 mb-4">Drag and drop to reorder the slides.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bannerImages.map((img, index) => (
              <div 
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="relative group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-move"
              >
                <div className="aspect-[16/9] w-full bg-gray-100 relative">
                  <img src={img.url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <GripVertical className="w-8 h-8 text-white" />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                    {index + 1}
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                    title="Remove Slide"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerUploader;

