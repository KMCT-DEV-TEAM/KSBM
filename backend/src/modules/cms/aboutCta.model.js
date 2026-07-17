import mongoose from 'mongoose';

const aboutCtaSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'Begin Your Leadership Journey at KSBM' },
    subtext: { type: String, default: 'Applications for the academic year 2024-25 are now open. Secure your seat in the cohort of the future.' },
    buttonText: { type: String, default: 'Apply Now Online' },
    buttonLink: { type: String, default: '/apply' },
    backgroundColor: { type: String, default: '#2A3256' },
  },
  { timestamps: true }
);

aboutCtaSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AboutCta = mongoose.model('AboutCta', aboutCtaSchema);
export default AboutCta;
