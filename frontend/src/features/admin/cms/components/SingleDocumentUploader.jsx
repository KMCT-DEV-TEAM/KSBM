"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X, FileText } from 'lucide-react';
import api from '../../../../api/axios';
import Swal from 'sweetalert2';
import confirmAction from '../../../../utils/confirmAction';

const SingleDocumentUploader = ({ 
  fileUrl, 
  onUploadComplete, 
  onUploadStateChange, 
  label = "Drag & drop PDF, or click to select",
  uploadEndpoint = "/upload",
  allowDelete = true,
  deferredUpload = false,
  defaultFile = "",
  recommendedSize = "PDF up to 10MB"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const currentDisplayUrl = typeof fileUrl === 'object' && fileUrl?.previewUrl 
    ? fileUrl.previewUrl 
    : (fileUrl || defaultFile);

  const getFileName = (url) => {
    if (!url) return 'No file';
    if (url.startsWith('blob:')) return 'Newly selected file';
    return url.split('/').pop();
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (deferredUpload) {
      const previewUrl = URL.createObjectURL(file);
      onUploadComplete({ 
        file, 
        previewUrl, 
        oldUrl: (currentDisplayUrl && currentDisplayUrl !== defaultFile && !currentDisplayUrl.startsWith('blob:')) ? currentDisplayUrl : null 
      });
      return;
    }

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);

    if (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultFile) {
      try {
        await api.delete('/upload', { data: { fileUrl: currentDisplayUrl }, hideLoader: true });
      } catch (err) {
        console.warn('Skipped deleting previous file:', err);
      }
    }

    const formData = new FormData();
    formData.append('image', file); // keeping field name 'image' as per backend uploadAssets
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
        title: 'Document uploaded successfully!',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to upload document:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: `Failed to upload document`,
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  }, [onUploadComplete, onUploadStateChange, currentDisplayUrl, defaultFile, uploadEndpoint, deferredUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isUploading,
    multiple: false
  });

  const removeFile = async (e) => {
    if (e) e.stopPropagation();
    await confirmAction({
      title: 'Revert to Default?',
      message: 'Are you sure you want to remove this document and revert to the default?',
      confirmText: 'Yes, revert',
      variant: 'danger',
      action: async () => {
        if (currentDisplayUrl && !currentDisplayUrl.startsWith('blob:') && !currentDisplayUrl.startsWith('http') && currentDisplayUrl !== defaultFile) {
          try {
            await api.delete('/upload', { data: { fileUrl: currentDisplayUrl }, hideLoader: true });
          } catch (err) {
            console.warn('Skipped deleting physical file:', err);
          }
        }
        onUploadComplete(defaultFile);
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
              <p className="text-sm font-medium text-gray-500">Uploading Document...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? "Drop the document here..." : label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{recommendedSize}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {currentDisplayUrl && currentDisplayUrl !== '#' && (
        <div className="mt-4">
          <h4 className="text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-2">
            Active Document
          </h4>
          
          <div className="max-w-md">
            <div className="relative group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{getFileName(currentDisplayUrl)}</p>
                <p className="text-xs text-gray-500">
                  {currentDisplayUrl === defaultFile ? "Default PDF" : "Uploaded PDF"}
                </p>
              </div>

              {allowDelete && currentDisplayUrl !== defaultFile && (
                <button 
                  onClick={removeFile}
                  type="button"
                  className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm shrink-0"
                  title="Revert to Default"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleDocumentUploader;
