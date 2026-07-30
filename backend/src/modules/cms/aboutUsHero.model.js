import mongoose from 'mongoose';

const aboutUsHeroSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'About KSBM' },
    subtitle: { type: String, default: 'Building Excellence Since 1995' },
    backgroundImage: { type: String, default: '/assets/Images/aboutus/about-hero-bg.jpg' },
    showTextContent: { type: Boolean, default: true },
    showSection: { type: Boolean, default: true },
  },
  { timestamps: true }
);

aboutUsHeroSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      title: 'About KSBM',
      subtitle: 'Building Excellence Since 1995',
      backgroundImage: '/assets/Images/aboutus/about-hero-bg.jpg',
      showTextContent: true,
    });
  } else if (settings.backgroundImage === '/assets/Images/about-hero-bg.jpg' || settings.backgroundImage === 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80') {
    settings.backgroundImage = '/assets/Images/aboutus/about-hero-bg.jpg';
    await settings.save();
  }
  return settings;
};

const AboutUsHero = mongoose.model('AboutUsHero', aboutUsHeroSchema);
export default AboutUsHero;
