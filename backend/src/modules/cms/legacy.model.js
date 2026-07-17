import mongoose from 'mongoose';

const legacyCardSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const legacySchema = new mongoose.Schema(
  {
    subheading: { type: String, default: 'OUR LEGACY' },
    heading: { type: String, default: 'A Journey of Educational Excellence' },
    description: { 
      type: String, 
      default: 'Founded by the visionary leader Dr. Navas K.M., KMCT Group of Institutions has been a beacon of quality education and healthcare in Kerala. With over two decades of excellence, the group has established numerous institutions that shape the future of thousands of students.' 
    },
    cards: {
      type: [legacyCardSchema],
      default: [
        {
          year: '1994',
          title: 'The Beginning',
          description: 'KMCT was established by Dr. Navas K.M. with a vision to provide quality education and healthcare to the society.',
          image: '/assets/Images/image 34.png'
        },
        {
          year: '2008',
          title: 'Medical College',
          description: 'Establishment of KMCT Medical College, a milestone in providing world-class healthcare education.',
          image: '/assets/Images/image 34.png'
        },
        {
          year: '2024',
          title: 'University Status',
          description: 'KMCT Group achieved a historic milestone by becoming a full-fledged University.',
          image: '/assets/Images/image 34.png'
        }
      ]
    },
  },
  { timestamps: true }
);

legacySchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Legacy = mongoose.model('Legacy', legacySchema);
export default Legacy;
