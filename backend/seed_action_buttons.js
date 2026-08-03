import mongoose from 'mongoose';
import GlobalButton from './src/modules/cms/globalButton.model.js';
import dotenv from 'dotenv';
dotenv.config();

const seedGlobalButtons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    
    const applyBtn = await GlobalButton.findOne({ identifier: 'hero_apply' });
    if (!applyBtn) {
      await GlobalButton.create({
        identifier: 'hero_apply',
        label: 'Apply Now',
        link: '/admissions',
        icon: 'ArrowUpRight',
        color: 'bg-secondary text-primary',
        isActive: true,
        order: 1
      });
      console.log('Created hero_apply button');
    } else {
      console.log('hero_apply button already exists');
    }

    const brochureBtn = await GlobalButton.findOne({ identifier: 'hero_brochure' });
    if (!brochureBtn) {
      await GlobalButton.create({
        identifier: 'hero_brochure',
        label: 'Download Brochure',
        link: '/brochure.pdf',
        icon: 'Download',
        color: 'bg-background/20 text-white',
        isActive: true,
        order: 2
      });
      console.log('Created hero_brochure button');
    } else {
      console.log('hero_brochure button already exists');
    }
    
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding global buttons:', error);
    process.exit(1);
  }
};

seedGlobalButtons();
