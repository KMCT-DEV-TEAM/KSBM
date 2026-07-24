import mongoose from 'mongoose';

const lifeAtKsbmSchema = new mongoose.Schema(
  {
    subheading: { type: String, default: 'Life at KSBM' },
    heading: { type: String, default: 'Beyond the Classroom' },
    description: { 
      type: String, 
      default: 'Experience a vibrant campus life that nurtures leadership, creativity, and lifelong connections through diverse clubs, cultural festivals, and community initiatives.' 
    },
    images: {
      type: [{
        src: { type: String, required: true },
        alt: { type: String, required: true }
      }],
      default: [
        { src: '/assets/Images/Home/life_at_ksbm_1.jpg', alt: 'Students in cafe' },
        { src: '/assets/Images/Home/life_at_ksbm_2.jpg', alt: 'Students jumping' },
        { src: '/assets/Images/Home/life_at_ksbm_3.jpg', alt: 'Campus festival' },
        { src: '/assets/Images/Home/life_at_ksbm_4.jpg', alt: 'Meeting room' },
        { src: '/assets/Images/Home/life_at_ksbm_5.jpg', alt: 'Selfie' },
        { src: '/assets/Images/Home/life_at_ksbm_6.jpg', alt: 'Dining hall' },
        { src: '/assets/Images/Home/life_at_ksbm_7.jpg', alt: 'Outdoor gathering' },
        { src: '/assets/Images/Home/life_at_ksbm_8.jpg', alt: 'Campus gate' }
      ]
    },
    showSubheading: { type: Boolean, default: true },
    showHeading: { type: Boolean, default: true },
    showDescription: { type: Boolean, default: true },
    showImages: { type: Boolean, default: true },
    showSection: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

lifeAtKsbmSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const LifeAtKsbm = mongoose.model('LifeAtKsbm', lifeAtKsbmSchema);

export default LifeAtKsbm;
