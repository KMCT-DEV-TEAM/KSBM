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

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    let uploadedUrls = [];

    // Upload files sequentially or concurrently
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await api.post('/upload', formData, {
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
      setBannerImages((prev) => [...prev, ...uploadedUrls]);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Images uploaded successfully!',
        showConfirmButton: false,
        timer: 3000
      });
    }

    setIsUploading(false);
    if (onUploadStateChange) onUploadStateChange(false);
  }, [setBannerImages, onUploadStateChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading
  });

  const removeImage = (index) => {
    const newImages = [...bannerImages];
    newImages.splice(index, 1);
    setBannerImages(newImages);
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;
    if (dragItem.current === dragOverItem.current) return;

    const copyListItems = [...bannerImages];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setBannerImages(copyListItems);
  };

  return (
    <div className="w-full space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#696CFF] bg-[#696CFF]/5' : 'border-gray-300 hover:border-[#696CFF]/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-[#696CFF] animate-spin" />
              <p className="text-sm font-medium text-gray-500">Uploading Images...</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-[#E7E7FF] text-[#696CFF] rounded-full">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">
                  {isDragActive ? "Drop the images here..." : "Drag & drop banner images, or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-2">You can select multiple files. Supports PNG, JPG, WEBP up to 5MB</p>
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
          
          <div className="space-y-3">
            {bannerImages.map((img, index) => (
              <div 
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-4 bg-[#F5F5F9] p-3 rounded-lg border border-gray-200 group transition-all"
              >
                <div className="cursor-move p-2 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-24 h-16 bg-black rounded-md overflow-hidden shrink-0 border border-gray-300 relative shadow-inner">
                  <img src={img.url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black/30">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <a href={img.url} target="_blank" rel="noreferrer" className="text-sm text-[#696CFF] hover:underline truncate block">
                    {img.url}
                  </a>
                </div>

                <button 
                  onClick={() => removeImage(index)}
                  className="p-2 text-gray-400 hover:text-[#FF3E1D] hover:bg-[#FF3E1D]/10 rounded-md transition-colors shrink-0"
                  title="Remove Slide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerUploader;
