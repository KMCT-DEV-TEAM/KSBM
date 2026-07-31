import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import FacilitiesPage from './src/modules/cms/facilitiesPage.model.js';

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    const settings = await FacilitiesPage.getSettings();
    settings.library = {
      _id: '6a6c2c0e9845b00992e0e09e',
      heading: 'Library',
      description: 'Test',
      description2: 'Test 2',
      mainImage: '/assets/Images/fecilities/library_main.jpg',
      thumbnails: [ '', '', '' ]
    };
    settings.markModified('library');
    await settings.save();
    console.log('Success');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}
test();
