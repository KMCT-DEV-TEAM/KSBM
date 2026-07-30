import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../../../assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const homeAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/Home');
if (!fs.existsSync(homeAssetsDir)) {
  fs.mkdirSync(homeAssetsDir, { recursive: true });
}

const programsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/Home');
if (!fs.existsSync(programsAssetsDir)) {
  fs.mkdirSync(programsAssetsDir, { recursive: true });
}

const aboutusAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/aboutus');
if (!fs.existsSync(aboutusAssetsDir)) {
  fs.mkdirSync(aboutusAssetsDir, { recursive: true });
}

const managementAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/management');
if (!fs.existsSync(managementAssetsDir)) {
  fs.mkdirSync(managementAssetsDir, { recursive: true });
}

const mbaAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/mba');
if (!fs.existsSync(mbaAssetsDir)) {
  fs.mkdirSync(mbaAssetsDir, { recursive: true });
}
const facultyAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/faculty');
if (!fs.existsSync(facultyAssetsDir)) {
  fs.mkdirSync(facultyAssetsDir, { recursive: true });
}

const alumniAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/alumni');
if (!fs.existsSync(alumniAssetsDir)) {
  fs.mkdirSync(alumniAssetsDir, { recursive: true });
}

const placementsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/placements');
if (!fs.existsSync(placementsAssetsDir)) {
  fs.mkdirSync(placementsAssetsDir, { recursive: true });
  }
const committeesAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/committees');
if (!fs.existsSync(committeesAssetsDir)) {
  fs.mkdirSync(committeesAssetsDir, { recursive: true });
}

const examinationAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/examinations');
if (!fs.existsSync(examinationAssetsDir)) {
  fs.mkdirSync(examinationAssetsDir, { recursive: true });
}

const facilitiesAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/fecilities');
if (!fs.existsSync(facilitiesAssetsDir)) {
  fs.mkdirSync(facilitiesAssetsDir, { recursive: true });
}

const admissionsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/admissions');
if (!fs.existsSync(admissionsAssetsDir)) {
  fs.mkdirSync(admissionsAssetsDir, { recursive: true });
}

const blogsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/blogs');
if (!fs.existsSync(blogsAssetsDir)) {
  fs.mkdirSync(blogsAssetsDir, { recursive: true });
}

const grievanceAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/grievance');
if (!fs.existsSync(grievanceAssetsDir)) {
  fs.mkdirSync(grievanceAssetsDir, { recursive: true });
}

const contactAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/contact');
if (!fs.existsSync(contactAssetsDir)) {
  fs.mkdirSync(contactAssetsDir, { recursive: true });
}

const faqAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/faq');
if (!fs.existsSync(faqAssetsDir)) {
  fs.mkdirSync(faqAssetsDir, { recursive: true });
}

const downloadsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/downloads');
if (!fs.existsSync(downloadsAssetsDir)) {
  fs.mkdirSync(downloadsAssetsDir, { recursive: true });
}

const termsAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/terms');
if (!fs.existsSync(termsAssetsDir)) {
  fs.mkdirSync(termsAssetsDir, { recursive: true });
}

const privacyAssetsDir = path.join(__dirname, '../../../frontend/public/assets/Images/privacy');
if (!fs.existsSync(privacyAssetsDir)) {
  fs.mkdirSync(privacyAssetsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('UPLOAD URL:', req.originalUrl);
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

export const uploadAssets = multer({ storage: storage });

