import express from 'express';
import { upload, cloudinary } from '../../config/cloudinary.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

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
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(200).json({
    message: 'Image uploaded successfully locally',
    url: fileUrl,
  });
});

export default router;
