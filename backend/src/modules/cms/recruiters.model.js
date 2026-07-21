import mongoose from 'mongoose';

const recruiterItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'IT & Tech',
  },
  package: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
}, { strict: false });

const recruitersSchema = new mongoose.Schema(
  {
    recruiters: {
      type: [recruiterItemSchema],
      default: [
        {
          name: 'Infosys',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
        },
        {
          name: 'Wipro',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
        },
        {
          name: 'Cognizant',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg'
        },
        {
          name: 'Google',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
        },
        {
          name: 'Microsoft',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
        }
      ]
    },
    showRecruiters: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
recruitersSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      recruiters: [
        {
          name: 'Infosys',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
        },
        {
          name: 'Wipro',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
        },
        {
          name: 'Cognizant',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg'
        },
        {
          name: 'Google',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
        },
        {
          name: 'Microsoft',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
        }
      ],
      showRecruiters: true
    });
  }
  return settings;
};

const Recruiters = mongoose.model('Recruiters', recruitersSchema);

export default Recruiters;
