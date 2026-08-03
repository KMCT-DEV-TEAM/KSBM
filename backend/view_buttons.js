import mongoose from 'mongoose';
import GlobalButton from './src/modules/cms/globalButton.model.js';
import dotenv from 'dotenv';
dotenv.config();

const viewButtons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    
    const buttons = await GlobalButton.find({});
    console.log(JSON.stringify(buttons, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

viewButtons();
