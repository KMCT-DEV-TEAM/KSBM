// Initialized app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/users/user.routes.js';
import cmsRoutes from './modules/cms/cms.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import grievanceRoutes from './modules/grievances/grievance.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



dotenv.config();

// Middlewares   
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://ksbm-2.onrender.com", "https://ksbm-l2reat5g7-kmct2.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve static uploads and assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
// Trigger nodemon restart
