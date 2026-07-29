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

const storage = multer.diskStorage({
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
