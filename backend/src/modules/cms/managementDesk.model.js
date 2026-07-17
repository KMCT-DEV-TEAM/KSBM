import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  badgeRole: { type: String, required: true },
  tag: { type: String, required: true },
  title: { type: String, default: 'Leadership Vision' },
  image: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  description: { type: [String], default: [] }
});

const managementDeskSchema = new mongoose.Schema(
  {
    showHero: {
      type: Boolean,
      default: true,
    },
    heroHeading: {
      type: String,
      default: 'Management Desk',
    },
    heroSubtext: {
      type: String,
      default: "Our leaders stand at the forefront of delivering dynamic management education through innovative teaching, practical learning and personalized mentorship to shape today's students into tomorrow's successful business leaders.",
    },
    heroBgImage: {
      type: String,
      default: '/assets/Images/image 2.png',
    },
    showIntro: {
      type: Boolean,
      default: true,
    },
    introSubheading: {
      type: String,
      default: 'MANAGEMENT DESK',
    },
    introHeading: {
      type: String,
      default: 'A Vision That Inspires Excellence',
    },
    introDescription: {
      type: [String],
      default: [
        "The Management Desk at KSBM sets the vision, strategy, and direction for the institution, guiding future leaders and administrators with a firm commitment to high academic and professional standards. Our dedicated management board brings invaluable experience across top industries, governing and mentoring students with confidence. Through strategic guidance and a student-centric approach, they ensure that every learner receives the opportunities, support, and mentorship needed to excel in both academic and professional life."
      ],
    },
    showMembers: {
      type: Boolean,
      default: true,
    },
    members: {
      type: [memberSchema],
      default: [
        {
          id: '1',
          name: 'Dr. Navas K. M',
          badgeRole: 'Chairman',
          tag: 'MESSAGE FROM OUR CHAIRMAN',
          title: 'Leadership Vision',
          image: '/assets/Images/Group 164.png',
          thumbnail: '/assets/Images/image 32.png',
          description: [
            "The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge — they reveal the defining nature of KSBM.",
            "We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and at KSBM, this is our overarching commitment to shaping a transformative future.",
            "As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."
          ]
        },
        {
          id: '2',
          name: 'Dr. Ayisha Nazreen',
          badgeRole: 'Vice Chairman',
          tag: 'MESSAGE FROM OUR VICE CHAIRMAN',
          title: 'Leadership Vision',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          description: [
            "The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds.",
            "We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.",
            "KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."
          ]
        },
        {
          id: '3',
          name: 'Dr. James Starlin',
          badgeRole: 'Executive Director',
          tag: 'MESSAGE FROM OUR DIRECTOR',
          title: 'Leadership Vision',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          description: [
            "In an era defined by rapid technological shifts and global transformation, management education must remain adaptive and innovative. At KSBM, we prepare our graduates to not only respond to industry evolution but to actively drive change and foster sustainable enterprises.",
            "Our commitment to academic excellence and industrial synergy empowers students with deep analytical rigor, strategic foresight, and hands-on leadership capabilities. We invite ambitious minds to embark on this transformative journey with us."
          ]
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

managementDeskSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const ManagementDesk = mongoose.model('ManagementDesk', managementDeskSchema);

export default ManagementDesk;
