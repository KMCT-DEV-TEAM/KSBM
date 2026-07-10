import mongoose from 'mongoose';

const accreditationSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'Institutional Credentials',
    },
    heading: {
      type: String,
      default: 'Accreditation &\nAffiliations',
    },
    imageUrl: {
      type: String,
      default: '', // Empty means fallback to static image on frontend if needed
    },
    showSubheading: {
      type: Boolean,
      default: true,
    },
    showHeading: {
      type: Boolean,
      default: true,
    },
    showImage: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
accreditationSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      subheading: 'Institutional Credentials',
      heading: 'Accreditation & Affiliations',
      imageUrl: '',
      showSubheading: true,
      showHeading: true,
      showImage: true,
    });
  }
  return settings;
};

const Accreditation = mongoose.model('Accreditation', accreditationSchema);

export default Accreditation;
