import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coordinator: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  pdfLink: {
    type: String,
    default: '',
  },
});

const committeesAndCellsSchema = new mongoose.Schema({
  heroHeading: {
    type: String,
    default: 'Committees & Cells',
  },
  heroSubtext: {
    type: String,
    default: 'Explore the various statutory committees and institutional cells established to ensure transparency, student welfare, academic excellence, and regulatory compliance. View committee documents and coordinator details in one place.',
  },
  heroBgImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  },
  committees: [committeeSchema],
}, {
  timestamps: true,
});

const CommitteesAndCellsCms = mongoose.model('CommitteesAndCellsCms', committeesAndCellsSchema);

export default CommitteesAndCellsCms;
