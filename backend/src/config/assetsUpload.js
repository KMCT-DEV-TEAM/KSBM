import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { s3Client, getBucketName, isS3Configured, getCustomDomain } from './s3.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to resolve S3 key prefix based on request URL
export const getS3KeyPrefix = (reqUrl = '') => {
  if (reqUrl.includes('/upload/programs')) return 'ksbm/images/programs';
  if (reqUrl.includes('/upload/home')) return 'ksbm/images/home';
  if (reqUrl.includes('/upload/aboutus')) return 'ksbm/images/aboutus';
  if (reqUrl.includes('/upload/management')) return 'ksbm/images/management';
  if (reqUrl.includes('/upload/mba')) return 'ksbm/images/mba';
  if (reqUrl.includes('/upload/faculty')) return 'ksbm/images/faculty';
  if (reqUrl.includes('/upload/alumni')) return 'ksbm/images/alumni';
  if (reqUrl.includes('/upload/placements')) return 'ksbm/images/placements';
  if (reqUrl.includes('/upload/committees')) return 'ksbm/images/committees';
  if (reqUrl.includes('/upload/examinations')) return 'ksbm/images/examinations';
  if (reqUrl.includes('/upload/facilities')) return 'ksbm/images/facilities';
  if (reqUrl.includes('/upload/admissions')) return 'ksbm/images/admissions';
  if (reqUrl.includes('/upload/blogs')) return 'ksbm/images/blogs';
  if (reqUrl.includes('/upload/grievance')) return 'ksbm/images/grievance';
  if (reqUrl.includes('/upload/contact')) return 'ksbm/images/contact';
  if (reqUrl.includes('/upload/faq')) return 'ksbm/images/faq';
  if (reqUrl.includes('/upload/gallery')) return 'ksbm/images/gallery';
  if (reqUrl.includes('/upload/downloads')) return 'ksbm/documents/downloads';
  if (reqUrl.includes('/upload/terms')) return 'ksbm/images/terms';
  if (reqUrl.includes('/upload/privacy')) return 'ksbm/images/privacy';
  if (reqUrl.includes('/upload/events')) return 'ksbm/images/events';
  if (reqUrl.includes('/upload/brochure')) return 'ksbm/documents/brochures';
  if (reqUrl.includes('/seo')) return 'ksbm/images/seo';
  return 'ksbm/uploads';
};

// Helper function to format the final public URL of an uploaded file
export const getUploadedFileUrl = (file, fallbackRelativeUrl = '') => {
  if (!file) return fallbackRelativeUrl;
  const customDomain = getCustomDomain();
  if (customDomain && file.key) {
    const cleanDomain = customDomain.endsWith('/') ? customDomain.slice(0, -1) : customDomain;
    return `${cleanDomain}/${file.key}`;
  }
  return file.location || fallbackRelativeUrl;
};

// ==========================================
// Local Disk Storage Setup (Fallback)
// ==========================================
const assetsDir = path.join(__dirname, '../../../assets');
const homeAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/Home');
const programsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/Home');
const aboutusAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/aboutus');
const managementAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/management');
const mbaAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/mba');
const facultyAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/faculty');
const alumniAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/alumni');
const placementsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/placements');
const committeesAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/committees');
const examinationAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/examinations');
const facilitiesAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/fecilities');
const admissionsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/admissions');
const blogsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/blogs');
const grievanceAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/grievance');
const contactAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/contact');
const faqAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/faq');
const downloadsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/downloads');
const brochuresDir = path.join(__dirname, '../../../frontend/public/assets/brochures');
const termsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/terms');
const galleryAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/gallery');
const privacyAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/privacy');
const eventsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/events');
const uploadsDir = path.join(__dirname, '../../uploads');

const localDiskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let targetDir = assetsDir;
    if (req.originalUrl.includes('/upload/programs')) {
      targetDir = programsAssetsDir;
    } else if (req.originalUrl.includes('/upload/home')) {
      targetDir = homeAssetsDir;
    } else if (req.originalUrl.includes('/upload/aboutus')) {
      targetDir = aboutusAssetsDir;
    } else if (req.originalUrl.includes('/upload/management')) {
      targetDir = managementAssetsDir;
    } else if (req.originalUrl.includes('/upload/mba')) {
      targetDir = mbaAssetsDir;
    } else if (req.originalUrl.includes('/upload/faculty')) {
      targetDir = facultyAssetsDir;
    } else if (req.originalUrl.includes('/upload/alumni')) {
      targetDir = alumniAssetsDir;
    } else if (req.originalUrl.includes('/upload/placements')) {
      targetDir = placementsAssetsDir;
    } else if (req.originalUrl.includes('/upload/committees')) {
      targetDir = committeesAssetsDir;
    } else if (req.originalUrl.includes('/upload/examinations')) {
      targetDir = examinationAssetsDir;
    } else if (req.originalUrl.includes('/upload/facilities')) {
      targetDir = facilitiesAssetsDir;
    } else if (req.originalUrl.includes('/upload/admissions')) {
      targetDir = admissionsAssetsDir;
    } else if (req.originalUrl.includes('/upload/blogs')) {
      targetDir = blogsAssetsDir;
    } else if (req.originalUrl.includes('/upload/grievance')) {
      targetDir = grievanceAssetsDir;
    } else if (req.originalUrl.includes('/upload/contact')) {
      targetDir = contactAssetsDir;
    } else if (req.originalUrl.includes('/upload/faq')) {
      targetDir = faqAssetsDir;
    } else if (req.originalUrl.includes('/upload/downloads')) {
      targetDir = downloadsAssetsDir;
    } else if (req.originalUrl.includes('/upload/terms')) {
      targetDir = termsAssetsDir;
    } else if (req.originalUrl.includes('/upload/privacy')) {
      targetDir = privacyAssetsDir;
    } else if (req.originalUrl.includes('/upload/events')) {
      targetDir = eventsAssetsDir;
    } else if (req.originalUrl.includes('/upload/gallery')) {
      targetDir = galleryAssetsDir;
    } else if (req.originalUrl.includes('/upload/brochure')) {
      targetDir = brochuresDir;
    } else if (req.originalUrl.includes('/seo') || req.originalUrl === '/api/upload' || req.originalUrl === '/api/upload/') {
      targetDir = uploadsDir;
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ==========================================
// AWS S3 Storage Setup
// ==========================================
const createS3Storage = () => {
  return multerS3({
    s3: s3Client,
    bucket: getBucketName(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: (req, file, cb) => {
      // For PDFs or images, allow browser inline rendering
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, 'inline');
      } else {
        cb(null, `attachment; filename="${file.originalname}"`);
      }
    },
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        uploadedAt: new Date().toISOString()
      });
    },
    key: function (req, file, cb) {
      const prefix = getS3KeyPrefix(req.originalUrl || '');
      const cleanOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(cleanOriginalName) || (file.mimetype === 'application/pdf' ? '.pdf' : '');
      const key = `${prefix}/${uniqueSuffix}${ext}`;
      cb(null, key);
    }
  });
};

// Determine storage engine based on whether S3 is configured
const getStorage = () => {
  if (isS3Configured()) {
    console.log(`[Storage] Initializing AWS S3 Storage (Bucket: ${getBucketName()})`);
    return createS3Storage();
  } else {
    console.warn('[Storage] AWS S3 credentials not fully configured in .env. Falling back to local disk storage.');
    return localDiskStorage;
  }
};

export const uploadAssets = multer({
  storage: getStorage(),
  limits: { fileSize: 104857600 } // 100MB limit
});
