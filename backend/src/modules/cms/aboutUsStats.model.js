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
        { value: '25+', label: 'Years of Excellence' },
        { value: '25k+', label: 'Students Graduated' },
        { value: '30+', label: 'Institutions' },
        { value: '5+', label: 'Campuses' }
      ]
    },
  },
  { timestamps: true }
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
