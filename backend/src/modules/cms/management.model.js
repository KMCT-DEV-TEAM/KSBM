import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  verticalText: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  }
});

const managementSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'OUR MANAGEMENT',
    },
    heading: {
      type: String,
      default: 'The Architects Of Excellence',
    },
    description: {
      type: String,
      default: 'Our leadership board combines decades of top-tier industry experience with a profound commitment to academic innovation.',
    },
    members: {
      type: [memberSchema],
      default: [
        {
          id: '1',
          name: 'Dr. Sarah Mitchell',
          role: 'MANAGING DIRECTOR',
          verticalText: 'DIRECTOR',
          image: '/assets/Images/Home/management_1.jpg'
        },
        {
          id: '2',
          name: 'Dr. Adrian Starlin',
          role: 'CHAIRMAN DIRECTOR',
          verticalText: 'CHAIRMAN',
          image: '/assets/Images/Home/management_2.jpg'
        },
        {
          id: '3',
          name: 'Dr. Elena Rostova',
          role: 'EXECUTIVE DIRECTOR',
          verticalText: 'EXECUTIVE',
          image: '/assets/Images/Home/management_3.jpg'
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

// Static method to always get the first (and only) settings document
managementSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Management = mongoose.model('Management', managementSchema);

export default Management;
