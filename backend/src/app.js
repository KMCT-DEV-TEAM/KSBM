// Initialized app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/users/user.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
