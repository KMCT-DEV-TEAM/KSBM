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
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          name: 'Dr. Adrian Starlin',
          role: 'CHAIRMAN DIRECTOR',
          verticalText: 'CHAIRMAN',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '3',
          name: 'Dr. Elena Rostova',
          role: 'EXECUTIVE DIRECTOR',
          verticalText: 'EXECUTIVE',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
