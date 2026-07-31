import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import FacilitiesPage from './src/modules/cms/facilitiesPage.model.js';

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    const settings = await FacilitiesPage.getSettings();
    console.log(JSON.stringify(settings.otherResources, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}
test();
