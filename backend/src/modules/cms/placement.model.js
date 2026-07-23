import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'Placement Highlights',
    },
    heading: {
      type: String,
      default: 'Building Careers That Matter',
    },
    description: {
      type: String,
      default: 'Our dedicated Placement Cell equips students with the skills, confidence, and industry exposure needed to excel in the corporate world. Through strategic industry partnerships, career guidance, and recruitment opportunities, we help transform academic potential into professional success.',
    },
    stat1Value: {
      type: String,
      default: '99%',
    },
    stat1Label: {
      type: String,
      default: 'Placement Rate',
    },
    stat2Value: {
      type: String,
      default: '12 LPA',
    },
    stat2Label: {
      type: String,
      default: 'Highest Package',
    },
    statistics: {
      type: [{ value: String, label: String }],
      default: [
        { value: '99%', label: 'Placement Rate' },
        { value: '12 LPA', label: 'Highest Package' }
      ]
    },
    showSubheading: {
      type: Boolean,
      default: true,
    },
    showHeading: {
      type: Boolean,
      default: true,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
    showStats: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
placementSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Placement = mongoose.model('Placement', placementSchema);

export default Placement;
