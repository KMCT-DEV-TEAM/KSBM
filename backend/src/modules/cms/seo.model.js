import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema(
  {
    pageIdentifier: {
      type: String,
      required: true,
      unique: true, // e.g., 'home', 'about', 'contact', 'global'
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: String,
      default: '',
    },
    ogTitle: {
      type: String,
      default: '',
    },
    ogDescription: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image',
    },
    twitterTitle: {
      type: String,
      default: '',
    },
    twitterDescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Seo = mongoose.model('Seo', seoSchema);
export default Seo;
