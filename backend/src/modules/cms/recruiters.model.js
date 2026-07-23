import mongoose from 'mongoose';

const recruiterItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: '',
  }
}, { strict: false });

const recruitersSchema = new mongoose.Schema(
  {
    recruiters: {
      type: [recruiterItemSchema],
      default: [
        {
          name: 'Infosys',
          logo: '/assets/Images/Home/infosys_logo.svg'
        },
        {
          name: 'Wipro',
          logo: '/assets/Images/Home/wipro_logo.svg'
        },
        {
          name: 'Cognizant',
          logo: '/assets/Images/Home/cognizant_logo.svg'
        },
        {
          name: 'Google',
          logo: '/assets/Images/Home/google_logo.svg'
        },
        {
          name: 'Microsoft',
          logo: '/assets/Images/Home/microsoft_logo.svg'
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
          logo: '/assets/Images/Home/infosys_logo.svg'
        },
        {
          name: 'Wipro',
          logo: '/assets/Images/Home/wipro_logo.svg'
        },
        {
          name: 'Cognizant',
          logo: '/assets/Images/Home/cognizant_logo.svg'
        },
        {
          name: 'Google',
          logo: '/assets/Images/Home/google_logo.svg'
        },
        {
          name: 'Microsoft',
          logo: '/assets/Images/Home/microsoft_logo.svg'
        }
      ],
      showRecruiters: true
    });
  }
  return settings;
};

const Recruiters = mongoose.model('Recruiters', recruitersSchema);

export default Recruiters;
