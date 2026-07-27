import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Compliance', 'Administration'],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  }
});

const downloadPageSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      default: 'Download',
    },
    subtitle: {
      type: String,
      default: 'Access all essential academic documents in one convenient location. Download application forms, brochures, academic regulations, examination guidelines, fee structures, and other important resources. Stay informed with the latest documents to support your academic journey and campus experience.',
    },
    backgroundImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1571260899304-42507d4b0086?q=80&w=1600&auto=format&fit=crop' // placeholder
    }
  },
  documents: [documentSchema]
}, { timestamps: true });

const DownloadPage = mongoose.model('DownloadPage', downloadPageSchema);

export default DownloadPage;
