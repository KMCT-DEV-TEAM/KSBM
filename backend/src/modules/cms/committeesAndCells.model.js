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
    default: '/assets/Images/committees/default-committees-hero.png',
  },
  committees: [committeeSchema],
}, {
  timestamps: true,
});

const CommitteesAndCellsCms = mongoose.model('CommitteesAndCellsCms', committeesAndCellsSchema);

export default CommitteesAndCellsCms;
