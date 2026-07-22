// Initialized app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/users/user.routes.js';
import cmsRoutes from './modules/cms/cms.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



dotenv.config();

// Middlewares   
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://ksbm-2.onrender.com"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve static uploads and assets
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
