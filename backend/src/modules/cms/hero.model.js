import mongoose from 'mongoose';

const buttonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  link: {
    type: String,
    default: '#',
  }
});

const textElementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  }
});

const heroSchema = new mongoose.Schema(
  {
    pillText: {
      type: textElementSchema,
      default: () => ({ text: 'ADMISSIONS OPEN 2025-26', isVisible: true })
    },
    headingLine1: {
      type: textElementSchema,
      default: () => ({ text: 'Empowering Future', isVisible: true })
    },
    headingLine2: {
      type: textElementSchema,
      default: () => ({ text: 'Business Leaders', isVisible: true })
    },
    description: {
      type: textElementSchema,
      default: () => ({ text: "Unlock your potential with India's leading B-School, where traditional academic rigor meets modern industry innovation. Join a network of global visionaries.", isVisible: true })
    },
    primaryButton: {
      type: buttonSchema,
      default: () => ({ text: 'Apply Now', isVisible: true, link: '#' })
    },
    secondaryButton: {
      type: buttonSchema,
      default: () => ({ text: 'Download Brochure', isVisible: true, link: '#' })
    },
    bannerImages: {
      type: [{ url: String }],
      default: () => [
        { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' }
      ]
    },
    statsCard: {
      type: {
        isVisible: { type: Boolean, default: true },
        batchText: { type: String, default: 'Batch 2025–27' },
        stat1Title: { type: String, default: 'Limited Seats' },
        stat1Subtitle: { type: String, default: 'Last few slots remaining' },
        stat2Title: { type: String, default: '100% Placement' },
        stat2Subtitle: { type: String, default: 'Consistent record over years' },
        linkText: { type: String, default: 'Read Admission Guidelines' },
        linkUrl: { type: String, default: '#' }
      },
      default: () => ({
        isVisible: true,
        batchText: 'Batch 2025–27',
        stat1Title: 'Limited Seats',
        stat1Subtitle: 'Last few slots remaining',
        stat2Title: '100% Placement',
        stat2Subtitle: 'Consistent record over years',
        linkText: 'Read Admission Guidelines',
        linkUrl: '#'
      })
    }
  },
  {
    timestamps: true,
  }
);

// We only need one settings document
heroSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
