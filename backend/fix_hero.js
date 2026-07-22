import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const heroCollection = db.collection('heroes');
  const hero = await heroCollection.findOne({});
  console.log('Hero:', JSON.stringify(hero, null, 2));
  
  if (hero && hero.bannerImages) {
    let changed = false;
    const newBanners = hero.bannerImages.map(img => {
      if (img.url.startsWith('/assets/Images/hero_banner')) {
        changed = true;
        return { url: img.url.replace('/assets/Images/', '/assets/Images/Home/') };
      }
      return img;
    });
    
    if (changed) {
      await heroCollection.updateOne({ _id: hero._id }, { $set: { bannerImages: newBanners } });
      console.log('Updated to:', newBanners);
    } else {
      console.log('No update needed.');
    }
  }
  process.exit(0);
});
