import mongoose from 'mongoose';

const legacyCardSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const legacySchema = new mongoose.Schema(
  {
    subheading: { type: String, default: 'OUR IDENTITY' },
    heading: { type: String, default: 'A Legacy of Strategic Excellence.' },
    description: { 
      type: String, 
      default: 'Founded with a vision to revolutionize business leadership in the region, KSBM has consistently pushed the boundaries of traditional management education. We are not merely an institution; it is a transformative space where students are not just participants in commerce, but leaders of it.\n\nOur curriculum is meticulously crafted to reflect the complexities of the global economy, emphasizing critical thinking, strategic foresight, and an entrepreneurial mindset. We empower our students to see beyond immediate numbers and shape the architects of commerce.' 
    },
    image: { type: String, default: '/assets/Images/image 2.png' },
    cards: {
      type: [legacyCardSchema],
      default: [
        {
          year: '1994',
          title: 'The Beginning',
          description: 'KMCT was established by Dr. Navas K.M. with a vision to provide quality education and healthcare to the society.',
          image: '/assets/Images/legacy/legacy_timeline_1.png'
        },
        {
          year: '2008',
          title: 'Medical College',
          description: 'Establishment of KMCT Medical College, a milestone in providing world-class healthcare education.',
          image: '/assets/Images/legacy/legacy_timeline_2.png'
        },
        {
          year: '2024',
          title: 'University Status',
          description: 'KMCT Group achieved a historic milestone by becoming a full-fledged University.',
          image: '/assets/Images/legacy/legacy_timeline_3.png'
        }
      ]
    },
    showSection: { type: Boolean, default: true },
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
