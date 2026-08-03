import mongoose from 'mongoose';
import GlobalButton from './src/modules/cms/globalButton.model.js';
import dotenv from 'dotenv';
dotenv.config();

const fixColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    
    await GlobalButton.findOneAndUpdate(
      { identifier: 'hero_apply' },
      { color: 'bg-primary text-white' }
    );
    
    await GlobalButton.findOneAndUpdate(
      { identifier: 'hero_brochure' },
      { color: 'bg-primary text-white' }
    );
    
    console.log('Colors fixed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing colors:', error);
    process.exit(1);
  }
};

fixColors();
