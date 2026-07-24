import { useRef } from 'react';
import api from '../api/axios';

export const useDeferredUpload = () => {
  const filesToDelete = useRef([]);

  // Call this when an image is replaced or removed in the UI
  const markForDeletion = (url) => {
    if (
      url &&
      !url.includes('placeholder') &&
      !url.includes('unsplash') &&
      !url.startsWith('blob:') &&
      !filesToDelete.current.includes(url)
    ) {
      filesToDelete.current.push(url);
    }
  };

  // Call this during handleSave for any File objects pending upload
  const uploadFile = async (file, endpoint = '/upload/home') => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        hideLoader: true
      });
      return response.data.url;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  };

  // Call this during handleSave, AFTER successfully updating the DB
  // This physically deletes the old images from the server
  const executeDeletions = async () => {
    for (const url of filesToDelete.current) {
      try {
        await api.delete('/upload', { data: { fileUrl: url }, hideLoader: true });
      } catch (err) {
        console.error('Failed to delete deferred file:', url, err);
      }
    }
    filesToDelete.current = []; // clear after deletion
  };

  // Clear if user resets or cancels
  const clearDeletions = () => {
    filesToDelete.current = [];
  };

  return {
    markForDeletion,
    uploadFile,
    executeDeletions,
    clearDeletions
  };
};
