export const downloadFile = async (e, url, defaultFilename = 'Brochure.pdf') => {
  if (!url || url === '#') return;
  e.preventDefault();
  
  try {
    // Check if it's an external URL (e.g. Cloudinary, AWS S3)
    const isExternal = url.startsWith('http') && !url.includes(window.location.hostname);

    if (isExternal) {
      // For external URLs, we use a hidden link with the download attribute.
      // If the server doesn't support CORS or doesn't set Content-Disposition, 
      // the browser will just open it in a new tab safely.
      const link = document.createElement('a');
      link.href = url;
      link.download = defaultFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For relative/internal URLs, fetch as blob to guarantee download behavior
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    
    const filename = url.split('/').pop() || defaultFilename;
    link.download = filename.includes('.') ? filename : `${filename}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // Fallback if fetch fails
    console.warn('Blob download failed, falling back to direct link:', error);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
