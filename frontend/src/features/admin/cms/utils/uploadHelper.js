import api from '../../../../api/axios';

/**
 * Uploads a deferred image to the backend and optionally deletes the old image if replacing.
 * 
 * @param {string|Object} imageObj - The current image state. Might be a string (URL) or an object `{ file, previewUrl, oldUrl }`.
 * @param {string} uploadEndpoint - The endpoint to POST the new image file to (e.g., '/upload/management').
 * @returns {Promise<string>} - The final URL of the image.
 */
export const uploadDeferredImage = async (imageObj, uploadEndpoint) => {
  // If it's a new file selected by the user
  if (imageObj && typeof imageObj === 'object' && imageObj.file) {
    // 1. Delete the old image if it existed and was not a default image
    if (imageObj.oldUrl && !imageObj.oldUrl.startsWith('blob:') && !imageObj.oldUrl.startsWith('http')) {
      try {
        await api.delete('/upload', { data: { fileUrl: imageObj.oldUrl }, hideLoader: true });
      } catch (err) {
        console.warn('Failed to delete old image:', err);
      }
    }

    // 2. Upload the new file
    const formData = new FormData();
    formData.append('image', imageObj.file);
    const res = await api.post(uploadEndpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      hideLoader: true
    });
    
    return res.data.url;
  } else if (imageObj && typeof imageObj === 'object' && imageObj.isDeleted) {
    if (imageObj.oldUrl && !imageObj.oldUrl.startsWith('blob:') && !imageObj.oldUrl.startsWith('http')) {
      try {
        await api.delete('/upload', { data: { fileUrl: imageObj.oldUrl }, hideLoader: true });
      } catch (err) {
        console.warn('Failed to delete old image:', err);
      }
    }
    return imageObj.previewUrl || '';
  }
  
  // If no change was made, return the existing URL (or empty string)
  return typeof imageObj === 'string' ? imageObj : '';
};
