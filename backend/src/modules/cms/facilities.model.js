import mongoose from 'mongoose';

const facilityItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const facilitiesSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'College Facilities',
    },
    heading: {
      type: String,
      default: 'Institutional Resources',
    },
    description: {
      type: String,
      default: 'Our state-of-the-art campus offers modern classrooms, advanced learning resources, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.',
    },
    facilitiesList: {
      type: [facilityItemSchema],
      default: [],
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
    showFacilities: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

facilitiesSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      subheading: 'College Facilities',
      heading: 'Institutional Resources',
      description: 'Our state-of-the-art campus offers modern classrooms, advanced learning resources, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.',
      facilitiesList: [
        {
          title: 'Smart Classrooms',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'
        },
        {
          title: 'Digital Library',
          image: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2030&auto=format&fit=crop'
        },
        {
          title: 'Seminar Hall',
          image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop'
        },
        {
          title: 'Innovation Lab',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
        },
        {
          title: 'Auditorium',
          image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'
        },
        {
          title: 'Sports & Fitness',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
        }
      ],
      showSubheading: true,
      showHeading: true,
      showDescription: true,
      showFacilities: true,
    });
  }
  return settings;
};

const Facilities = mongoose.model('Facilities', facilitiesSchema);

export default Facilities;
