const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const heroColl = collections.find(c => c.name.toLowerCase().includes('hero'));
  console.log('Hero collection name:', heroColl ? heroColl.name : 'not found');
  if (heroColl) {
    const doc = await mongoose.connection.db.collection(heroColl.name).findOne({});
    console.log('Hero doc bannerImages:', doc && doc.bannerImages ? doc.bannerImages : 'None');
    if (doc && doc.bannerImages) {
        let changed = false;
        const newBanners = doc.bannerImages.map(img => {
            if (img.url.includes('localhost:5000')) {
                changed = true;
                return { url: img.url.replace(/^http:\/\/localhost:5000/, '') };
            }
            if (img.url.includes('ksbm-bs43.onrender.com')) {
                changed = true;
                return { url: img.url.replace(/^https?:\/\/ksbm-bs43\.onrender\.com/, '') };
            }
            return img;
        });
        if (changed) {
            await mongoose.connection.db.collection(heroColl.name).updateOne({ _id: doc._id }, { $set: { bannerImages: newBanners } });
            console.log('Updated to:', newBanners);
        }
    }
  }
  process.exit(0);
});
