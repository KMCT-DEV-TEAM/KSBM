import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const facultySchema = new mongoose.Schema(
  {
    heroHeading: {
      type: String,
      default: "Faculty Members"
    },
    heroSubtext: {
      type: String,
      default: "Our distinguished faculty are committed to delivering quality education through innovative teaching, practical learning, and personalized mentorship, helping students build the skills and confidence needed for successful careers."
    },
    heroBgImage: {
      type: String,
      default: "/assets/Images/image 2.png"
    },
    introSubheading: {
      type: String,
      default: "FACULTY MEMBERS"
    },
    introHeading: {
      type: String,
      default: "Learn from the Best"
    },
    introText: {
      type: String,
      default: "At KSBM, our faculty members are the cornerstone of academic excellence. With a blend of strong academic credentials, industry expertise, and a passion for teaching, they create a dynamic learning environment that encourages critical thinking, innovation, and leadership. Beyond the classroom, our faculty mentor, inspire, and guide students through every stage of their academic journey, equipping them with the knowledge, confidence, and practical skills needed to succeed in an ever-evolving global business landscape."
    },
    ksbmFaculty: {
      type: [memberSchema],
      default: [
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 1 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 2 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 3 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 4 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 5 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 6 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 7 },
        { name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png", order: 8 }
      ]
    },
    adjunctFaculty: {
      type: [memberSchema],
      default: [
        { name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png", order: 1 },
        { name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png", order: 2 },
        { name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png", order: 3 },
        { name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png", order: 4 }
      ]
    }
  },
  { timestamps: true }
);

facultySchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
