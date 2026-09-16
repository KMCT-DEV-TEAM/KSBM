import mongoose from 'mongoose';

const statItemSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const aboutUsStatsSchema = new mongoose.Schema(
  {
    stats: {
      type: [statItemSchema],
      default: [
        { value: '16+', label: 'YEARS OF EXCELLENCE' },
        { value: '991+', label: 'ACTIVE STUDENTS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' }
      ]
    },
    showSection: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

aboutUsStatsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AboutUsStats = mongoose.model('AboutUsStats', aboutUsStatsSchema);
export default AboutUsStats;
