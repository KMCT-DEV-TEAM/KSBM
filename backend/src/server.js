// Initialized server.js
// trigger restart 2

import app from './app.js';
import connectDB from './config/db.js';
import { isS3Configured, getBucketName } from './config/s3.config.js';

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  if (isS3Configured()) {
    console.log(`☁️  Upload Storage: AWS S3 (Bucket: ${getBucketName()})`);
  } else {
    console.log(`📁 Upload Storage: Local Disk Storage (Fallback mode: AWS credentials not provided in .env)`);
  }
  console.log('--------------------------------------------------\n');
});

