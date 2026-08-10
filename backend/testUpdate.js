import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import Grievance from './src/modules/grievances/grievance.model.js';

const testUpdate = async () => {
  await connectDB();
  const grievance = await Grievance.findOne();
  if (grievance) {
    console.log('Old Status:', grievance.status);
    grievance.status = 'In Progress';
    const updated = await grievance.save();
    console.log('New Status:', updated.status);
    
    // Fetch again to verify
    const refetched = await Grievance.findById(grievance._id);
    console.log('Refetched Status:', refetched.status);
  } else {
    console.log('No grievances found');
  }
  process.exit();
};

testUpdate();
