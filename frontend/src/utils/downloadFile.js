export const downloadFile = async (e, url, defaultFilename = 'Brochure.pdf') => {
  if (!url || url === '#') return;
  if (e) e.preventDefault();
  
  try {
    let finalUrl = url;

    // Force Cloudinary to return as attachment if it's a Cloudinary URL
    if (finalUrl.includes('res.cloudinary.com') && finalUrl.includes('/upload/')) {
      if (!finalUrl.includes('fl_attachment')) {
        // e.g. /upload/v1234 -> /upload/fl_attachment/v1234
        finalUrl = finalUrl.replace('/upload/', '/upload/fl_attachment/');
      }
    }

    // Attempt to download as a blob to guarantee the file saves instead of opening
    try {
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const filename = finalUrl.split('/').pop() || defaultFilename;
      link.download = filename.includes('.') ? filename : `${filename}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      return;
    } catch (fetchError) {
      console.warn('Blob fetch failed, falling back to direct anchor download.', fetchError);
    }

    // Fallback if CORS prevents blob fetch
    const link = document.createElement('a');
    link.href = finalUrl;
    link.download = defaultFilename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Download completely failed:', error);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
