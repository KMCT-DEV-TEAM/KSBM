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
        { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', alt: 'Students in cafe' },
        { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1973&auto=format&fit=crop', alt: 'Students jumping' },
        { src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop', alt: 'Campus festival' },
        { src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop', alt: 'Meeting room' },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', alt: 'Selfie' },
        { src: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop', alt: 'Dining hall' },
        { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop', alt: 'Outdoor gathering' },
        { src: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=2070&auto=format&fit=crop', alt: 'Campus gate' }
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
