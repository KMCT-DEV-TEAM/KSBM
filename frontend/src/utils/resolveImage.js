export const resolveImage = (img, defaultImg = '') => {
  if (!img) return defaultImg;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.previewUrl) return img.previewUrl;
  return defaultImg;
};
