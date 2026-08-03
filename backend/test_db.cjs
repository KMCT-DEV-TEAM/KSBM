const mongoose = require('mongoose');
const heroSchema = new mongoose.Schema({}, { strict: false });
const Hero = mongoose.model('Hero', heroSchema, 'heroes');
require('dotenv').config();

async function test() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ksbm';
    await mongoose.connect(mongoUri);
    const hero = await Hero.findOne();
    console.log('Hero doc before:', hero);
    
    // update
    if (hero) {
      await Hero.updateOne({ _id: hero._id }, { $set: { showSection: false } });
      const heroAfter = await Hero.findOne();
      console.log('Hero doc after:', heroAfter);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();
