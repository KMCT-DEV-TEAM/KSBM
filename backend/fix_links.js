import mongoose from 'mongoose';
import GlobalButton from './src/modules/cms/globalButton.model.js';
import dotenv from 'dotenv';
dotenv.config();

const fixLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    
    // Update all buttons that have "Apply" in their label to point to the correct link
    const result = await GlobalButton.updateMany(
      { label: { $regex: /Apply/i } },
      { $set: { link: 'https://kmct.edu.in/apply' } }
    );
    
    console.log(`Updated ${result.modifiedCount} buttons to use https://kmct.edu.in/apply`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating links:', error);
    process.exit(1);
  }
};

fixLinks();
