import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
});

const governingBodySchema = new mongoose.Schema(
  {
    heroHeading: { type: String, default: "KSBM Governing Body" },
    heroSubtext: { type: String, default: "Strategizing for excellence: The leadership framework dedicated to advancing pharmaceutical management education through visionary governance, industrial synergy, and academic rigor." },
    heroBgImage: { type: String, default: "/assets/Images/image 2.png" },
    contentSubheading: { type: String, default: "COMMITTEE" },
    contentHeading: { type: String, default: "Governing Body" },
    contentDescription: { 
      type: [String], 
      default: [
        "The Governing Body of KMCT School of Business Management plays a pivotal role in shaping the institution's academic and administrative framework. The body is chaired by Dr. Navas KM, with Dr. Ayisha Nazreen serving as the Special Invitee, and Dr. Sujith Varma as the Member Secretary. It also includes selected faculty members who serve as academic nominees, industry representatives, and ex-officio members, ensuring a diverse and well-rounded leadership.",
        "The Governing Body is committed to maintaining academic excellence, fostering research and innovation, and strengthening industry-academic collaborations. Through strategic decision-making and policy implementation, it ensures the holistic development of students and the institution, keeping pace with the evolving landscape of management education."
      ]
    },
    members: {
      type: [memberSchema],
      default: [
        { name: "Dr. Navas K M", title: "CHAIRMAN", image: "/assets/Images/image 31.png" },
        { name: "Dr. Ayisha Nazreen", title: "SPECIAL INVITEE", image: "/assets/Images/image 31.png" },
        { name: "Dr. Sujith Varma", title: "MEMBER SECRETARY", image: "/assets/Images/image 31.png" },
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

governingBodySchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const GoverningBody = mongoose.model('GoverningBody', governingBodySchema);
export default GoverningBody;
