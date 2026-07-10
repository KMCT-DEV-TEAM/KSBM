import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
});

const programsSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'Our Courses',
    },
    heading: {
      type: String,
      default: 'Academic Programs',
    },
    description: {
      type: String,
      default:
        'Discover our MBA and BBA programmes, crafted to develop future-ready professionals through innovative learning, industry engagement, and leadership-focused education.',
    },
    programs: {
      type: [programSchema],
      default: [
        {
          id: 'mba',
          title: 'MBA',
          subtitle: 'Master of Business Administration. 2 - Year Full-time immersive leadership journey.',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
          tag: 'GRADUATE',
        },
        {
          id: 'bba',
          title: 'BBA',
          subtitle: 'Bachelor of Business Administration. Building the foundation for corporate excellence.',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
          tag: 'UNDERGRADUATE',
        },
      ],
    },
    showSubheading: { type: Boolean, default: true },
    showHeading: { type: Boolean, default: true },
    showDescription: { type: Boolean, default: true },
    showPrograms: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

programsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      subheading: 'Our Courses',
      heading: 'Academic Programs',
      description: 'Discover our MBA and BBA programmes, crafted to develop future-ready professionals through innovative learning, industry engagement, and leadership-focused education.',
      programs: [
        {
          id: 'mba',
          title: 'MBA',
          subtitle: 'Master of Business Administration. 2 - Year Full-time immersive leadership journey.',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
          tag: 'GRADUATE',
        },
        {
          id: 'bba',
          title: 'BBA',
          subtitle: 'Bachelor of Business Administration. Building the foundation for corporate excellence.',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
          tag: 'UNDERGRADUATE',
        },
      ],
      showSubheading: true,
      showHeading: true,
      showDescription: true,
      showPrograms: true,
    });
  }
  return settings;
};

const Programs = mongoose.model('Programs', programsSchema);

export default Programs;
