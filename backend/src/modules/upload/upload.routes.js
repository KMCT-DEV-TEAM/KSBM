import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { upload, cloudinary } from '../../config/cloudinary.js';
import { protect } from '../../middleware/authMiddleware.js';

import { uploadAssets } from '../../config/assetsUpload.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/home', protect, uploadAssets.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image provided' });
  }

  const fileUrl = `/assets/Images/Home/${req.file.filename}`;
  
  res.status(200).json({
    message: 'Image uploaded successfully to /assets/Images/Home',
    url: fileUrl,
  });
});

router.post('/programs', protect, uploadAssets.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image provided' });
  }

  const fileUrl = `/assets/Images/Home/${req.file.filename}`;
  
  res.status(200).json({
    message: 'Image uploaded successfully to /assets/Images/Home',
    url: fileUrl,
  });
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image provided' });
  }
  
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
    try {
      const result = await cloudinary.uploader.unsigned_upload(req.file.path, 'ksbmimage', {
        folder: 'ksbm_assets'
      });
      
      // Optionally remove the file from local storage after successful upload
      import('fs').then(fs => {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete local file:", err);
        });
      });

      return res.status(200).json({
        message: 'Image uploaded successfully to Cloudinary',
        url: result.secure_url,
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ message: 'Failed to upload to Cloudinary', error: error.message || error });
    }
  }

  // Local URL fallback
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.status(200).json({
    message: 'Image uploaded successfully locally',
    url: fileUrl,
  });
});

router.delete('/', protect, async (req, res) => {
  const { fileUrl } = req.body;
  if (!fileUrl) return res.status(400).json({ message: 'No fileUrl provided' });

  // Safety checks for defaults
  const defaultImages = [
    'hero_banner_1.png', 'hero_banner_2.png', 'hero_banner_3.png',
    'academic_mba.jpg', 'academic_bba.jpg', 'graduate.png',
    'Component 86.png', 'Component 87.png', 'Component 88.png',
    'watermark_logo.png', 'watermark_logo1.png',
    'management_1.jpg', 'management_2.jpg', 'management_3.jpg',
    'facility_1.jpg', 'facility_2.jpg', 'facility_3.jpg',
    'facility_4.jpg', 'facility_5.jpg', 'facility_6.jpg',
    'infosys_logo.svg', 'wipro_logo.svg', 'cognizant_logo.svg',
    'google_logo.svg', 'microsoft_logo.svg'
  ];

  const filename = fileUrl.split('/').pop();

  if (defaultImages.includes(filename)) {
    return res.status(200).json({ message: 'Default image, skipped deletion' });
  }

  let filePath = '';
  if (fileUrl.includes('/assets/Images/Home/')) {
     filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/Home', filename);
  } else if (fileUrl.includes('/assets/home/')) {
     filePath = path.join(__dirname, '../../../assets/home', filename);
  } else if (fileUrl.includes('/uploads/')) {
     filePath = path.join(__dirname, '../../../uploads', filename);
  }

  console.log('DELETE request for:', fileUrl);
  console.log('Resolved filePath:', filePath);

  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
        return res.status(500).json({ message: 'Failed to delete file' });
      }
      console.log('File deleted successfully:', filePath);
      return res.status(200).json({ message: 'File deleted successfully' });
    });
  } else {
    console.log('File not found or already deleted:', filePath);
    // If not found locally, might be cloudinary or already deleted, which is fine
    return res.status(200).json({ message: 'File not found on server or already deleted' });
  }
});

export default router;
