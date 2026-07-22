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

const homeAssetsDir = path.join(assetsDir, 'home');
if (!fs.existsSync(homeAssetsDir)) {
  fs.mkdirSync(homeAssetsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes('/upload/home')) {
      cb(null, homeAssetsDir);
    } else {
      cb(null, assetsDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadAssets = multer({ storage: storage });
