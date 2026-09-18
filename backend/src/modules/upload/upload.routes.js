import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../../middleware/authMiddleware.js';
import { uploadAssets, getUploadedFileUrl } from '../../config/assetsUpload.js';
import { deleteS3Object, isS3Configured, getBucketName } from '../../config/s3.config.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for standard upload response with explicit terminal logging
const handleUploadResponse = (req, res, fallbackPrefix, successMessage = 'File uploaded successfully') => {
  if (!req.file) {
    console.warn(`[UPLOAD REJECTED] Endpoint: ${req.originalUrl} - No file was provided in request.`);
    return res.status(400).json({ message: 'No file provided' });
  }

  const fallbackUrl = `${fallbackPrefix}/${req.file.filename}`;
  const fileUrl = getUploadedFileUrl(req.file, fallbackUrl);
  const isS3 = Boolean(req.file.location || req.file.key);
  const storageEngine = isS3 ? `AWS S3 (Bucket: ${getBucketName()})` : 'Local Disk Storage';

  console.log('\n================== [FILE UPLOAD] ==================');
  console.log(`📍 Route:        ${req.originalUrl}`);
  console.log(`💾 Storage:      ${storageEngine}`);
  console.log(`📄 Original:     ${req.file.originalname}`);
  console.log(`🏷️  MIME Type:    ${req.file.mimetype}`);
  if (req.file.size) console.log(`⚖️  File Size:    ${(req.file.size / 1024).toFixed(2)} KB`);
  if (req.file.key)  console.log(`🔑 S3 Key:       ${req.file.key}`);
  console.log(`🔗 Stored URL:   ${fileUrl}`);
  console.log('===================================================\n');

  res.status(200).json({
    message: successMessage,
    url: fileUrl,
    storage: isS3 ? 's3' : 'local',
    key: req.file.key || undefined
  });
};

router.post('/home', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/Home', 'Image uploaded successfully');
});

router.post('/programs', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/Home', 'Image uploaded successfully');
});

router.post('/aboutus', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/aboutus', 'Image uploaded successfully');
});

router.post('/management', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/management', 'Image uploaded successfully');
});

router.post('/mba', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/mba', 'Image uploaded successfully');
});

router.post('/faculty', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/faculty', 'Image uploaded successfully');
});

router.post('/alumni', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/alumni', 'Image uploaded successfully');
});

router.post('/placements', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/placements', 'Image uploaded successfully');
});

router.post('/committees', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/committees', 'Image uploaded successfully');
});

router.post('/examinations', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/examinations', 'File uploaded successfully');
});

router.post('/blogs', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/blogs', 'Image uploaded successfully');
});

router.post('/grievance', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/grievance', 'File uploaded successfully');
});

router.post('/contact', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/contact', 'Image uploaded successfully');
});

router.post('/facilities', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/fecilities', 'Image uploaded successfully');
});

router.post('/admissions', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/admissions', 'File uploaded successfully');
});

router.post('/', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/uploads', 'File uploaded successfully');
});

router.post('/faq', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/faq', 'Image uploaded successfully');
});

router.post('/gallery', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/gallery', 'Image uploaded successfully');
});

router.post('/downloads', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/downloads', 'Document uploaded successfully');
});

router.post('/terms', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/terms', 'Image uploaded successfully');
});

router.post('/privacy', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/privacy', 'Image uploaded successfully');
});

router.post('/events', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/Images/events', 'Image uploaded successfully');
});

router.post('/brochure', protect, uploadAssets.single('image'), (req, res) => {
  handleUploadResponse(req, res, '/assets/brochures', 'Brochure uploaded successfully');
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
    'facilities_hero.png', 'life_1.jpg', 'facility_details_hero.jpg', 'image_55.png',
    'infosys_logo.svg', 'wipro_logo.svg', 'cognizant_logo.svg',
    'google_logo.svg', 'microsoft_logo.svg',
    'testimonial_1.jpg', 'testimonial_2.jpg', 'testimonial_3.jpg',
    'about-hero-bg.jpg',
    'default-management-hero.jpg', 'default-management-leader.jpg', 'default-management-badge.png',
    'mba_hero_bg.png', 'mba_main.png', 'mba_feature_1.png', 'mba_feature_2.png',
    'internship_2.png', 'internship_27.png', 'internship_28.png',
    'dynamic_49.png', 'dynamic_60.png', 'calendar_64.png',
    'gallery_67.png', 'gallery_58.png', 'gallery_69.png', 'gallery_70.png',
    'gallery_71.png', 'gallery_72.png', 'gallery_73.png', 'gallery_74.png',
    'gallery_75.png', 'gallery_76.png', 'gallery_77.png', 'gallery_78.png',
    'image 53.png', 'image%2053.png', 'default-faculty-leader.jpg',
    'image 2.png', 'image 31.png',
    'default-hero-bg.jpg', 'default-collage-1.jpg', 'default-collage-2.jpg',
    'default-excellence-bg.png', 'default-committee-vector.png', 'default-avatar.png',
    'default-partner-1.jpg', 'default-partner-2.jpg', 'default-partner-3.jpg',
    'default-faculty-hero.jpg', 'default-faculty-leader.jpg', 'default-committees-hero.png',
    'exam_hero_bg.png', 'exam_main.png', 'exam_schedule.png', 'image 64.png',
    'admissions-hero-bg.png', 'admissions-elite.png', 'admissions-cta.png',
    'hero-bg.jpg', 'default-card.jpg',
    'grievance_hero.jpg', 'grievance_info.jpg', 'grievance_form.jpg',
    'contact_hero.png'
  ];

  const filename = fileUrl.split('/').pop();

  if (defaultImages.includes(filename)) {
    console.log(`[DELETE SKIPPED] Default asset preserved: ${filename}`);
    return res.status(200).json({ message: 'Default asset, skipped deletion' });
  }

  // Check if file is stored in AWS S3 or CloudFront
  const isS3Url = fileUrl.startsWith('http://') || fileUrl.startsWith('https://');
  if (isS3Url) {
    console.log(`\n[DELETE REQUEST] Target S3 URL: ${fileUrl}`);
    try {
      if (isS3Configured()) {
        await deleteS3Object(fileUrl);
        console.log(`[DELETE SUCCESS] Removed from AWS S3: ${fileUrl}\n`);
        return res.status(200).json({ message: 'File deleted from S3 successfully' });
      } else {
        console.log(`[DELETE SKIPPED] S3 credentials not configured, skipping external delete for: ${fileUrl}\n`);
        return res.status(200).json({ message: 'S3 not configured, skipped external delete' });
      }
    } catch (err) {
      console.error('[DELETE ERROR] Failed to delete file from S3:', err);
      return res.status(500).json({ message: 'Failed to delete file from S3', error: err.message });
    }
  }

  // Handle local file deletion fallback
  let filePath = '';
  if (fileUrl.includes('/assets/Images/Home/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/Images/aboutus/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/Images/management/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/Images/mba/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/Images/faculty/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/faculty', filename);
  } else if (fileUrl.includes('/assets/Images/alumni/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/alumni', filename);
  } else if (fileUrl.includes('/assets/Images/placements/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/placements', filename);
  } else if (fileUrl.includes('/assets/Images/committees/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/committees', filename);
  } else if (fileUrl.includes('/assets/Images/admissions/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/admissions', filename);
  } else if (fileUrl.includes('/assets/Images/examinations/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/Images/blogs/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/blogs', filename);
  } else if (fileUrl.includes('/assets/Images/grievance/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/grievance', filename);
  } else if (fileUrl.includes('/assets/Images/contact/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/contact', filename);
  } else if (fileUrl.includes('/assets/Images/fecilities/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/fecilities', filename);
  } else if (fileUrl.includes('/assets/Images/faq/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/faq', filename);
  } else if (fileUrl.includes('/assets/Images/downloads/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/downloads', filename);
  } else if (fileUrl.includes('/assets/Images/terms/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/terms', filename);
  } else if (fileUrl.includes('/assets/Images/privacy/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/privacy', filename);
  } else if (fileUrl.includes('/assets/Images/events/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/events', filename);
  } else if (fileUrl.includes('/assets/Images/gallery/')) {
    filePath = path.join(__dirname, '../../../../frontend/public/assets/Images/gallery', filename);
  } else if (fileUrl.includes('/assets/brochures/')) {
    filePath = path.join(__dirname, '../../../../frontend/public', fileUrl);
  } else if (fileUrl.includes('/assets/home/')) {
    filePath = path.join(__dirname, '../../../../assets/home', filename);
  } else if (fileUrl.includes('/uploads/')) {
    filePath = path.join(__dirname, '../../../uploads', filename);
  }

  console.log(`[DELETE REQUEST] Target Local File: ${fileUrl} -> Path: ${filePath}`);

  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("[DELETE ERROR] Failed to delete local file:", err);
        return res.status(500).json({ message: 'Failed to delete file' });
      }
      console.log('[DELETE SUCCESS] Deleted local file:', filePath);
      return res.status(200).json({ message: 'File deleted successfully' });
    });
  } else {
    return res.status(200).json({ message: 'File not found on server or already deleted' });
  }
});

export default router;
