import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
});

const advisoryBoardSchema = new mongoose.Schema(
  {
    heroHeading: { type: String, default: "Institutional Advisory Board" },
    heroSubtext: { type: String, default: "The Institutional Advisory Board of KMCT School of Business Management plays a crucial role in guiding the institution's strategic vision and academic progress." },
    heroBgImage: { type: String, default: "/assets/Images/image 2.png" },
    contentSubheading: { type: String, default: "COMMITTEE" },
    contentHeading: { type: String, default: "Advisory Board" },
    contentDescription: { 
      type: [String], 
      default: [
        "The Advisory Board of KMCT School of Business Management is instrumental in shaping the institution's strategic direction and academic excellence.",
        "It is composed of distinguished leaders and experts from various industries who provide valuable insights and guidance. Their collective expertise ensures that our curriculum remains relevant, innovative, and aligned with industry standards, empowering our students to become the future leaders of the business world."
      ]
    },
    members: {
      type: [memberSchema],
      default: [
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", image: "/assets/Images/image 31.png" },
        { name: "Dr. Shmmon M", title: "MEMBER SECRETARY", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" }
      ]
    },
  },
  { timestamps: true }
);

advisoryBoardSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AdvisoryBoard = mongoose.model('AdvisoryBoard', advisoryBoardSchema);
export default AdvisoryBoard;
