import mongoose from 'mongoose';
import GlobalButton from './src/modules/cms/globalButton.model.js';
import dotenv from 'dotenv';
dotenv.config();

const consolidateButtons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ksbm');
    
    // First, let's see if global_apply already exists
    let globalApply = await GlobalButton.findOne({ identifier: 'global_apply' });
    
    if (!globalApply) {
      // Create global_apply
      globalApply = await GlobalButton.create({
        identifier: 'global_apply',
        label: 'Apply Now',
        link: 'https://kmct.edu.in/apply',
        icon: 'ArrowRight',
        color: 'bg-primary text-white',
        isActive: true,
        order: 1
      });
      console.log('Created global_apply button');
    }
    
    // Remove the old ones
    const idsToRemove = ['header_apply', 'hero_apply', 'about_cta', 'footer_contact'];
    const result = await GlobalButton.deleteMany({ identifier: { $in: idsToRemove } });
    console.log(`Removed ${result.deletedCount} old apply buttons.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error consolidating buttons:', error);
    process.exit(1);
  }
};

consolidateButtons();
