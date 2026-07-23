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
          image: '/assets/Images/Home/facility_1.jpg'
        },
        {
          title: 'Digital Library',
          image: '/assets/Images/Home/facility_2.jpg'
        },
        {
          title: 'Seminar Hall',
          image: '/assets/Images/Home/facility_3.jpg'
        },
        {
          title: 'Innovation Lab',
          image: '/assets/Images/Home/facility_4.jpg'
        },
        {
          title: 'Auditorium',
          image: '/assets/Images/Home/facility_5.jpg'
        },
        {
          title: 'Sports & Fitness',
          image: '/assets/Images/Home/facility_6.jpg'
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
