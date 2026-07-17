import mongoose from 'mongoose';

const aboutUsHeroSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'About KSBM' },
    subtitle: { type: String, default: 'Building Excellence Since 1995' },
    backgroundImage: { type: String, default: '/assets/Images/about-hero-bg.jpg' },
  },
  { timestamps: true }
);

aboutUsHeroSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      title: 'About KSBM',
      subtitle: 'Building Excellence Since 1995',
      backgroundImage: '/assets/Images/about-hero-bg.jpg',
    });
  }
  return settings;
};

const AboutUsHero = mongoose.model('AboutUsHero', aboutUsHeroSchema);
export default AboutUsHero;
