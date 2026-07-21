import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema(
  {
    subheading: { type: String, default: 'MEET OUR LEADER' },
    heading: { type: String, default: 'Visionary Leadership for a Better Tomorrow' },
    name: { type: String, default: 'Dr. Navas K M' },
    title: { type: String, default: 'MANAGING TRUSTEE - KMCT' },
    description: { 
      type: [String], 
      default: [
        'At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today\'s evolving business landscape.'
      ]
    },
    image: { type: String, default: '/assets/Images/image 33.png' },
    signatureImage: { type: String, default: '/assets/Images/image 32.png' },
    
    // Leader 2
    leader2Name: { type: String, default: 'Dr. James Starlin' },
    leader2Title: { type: String, default: 'PRINCIPAL' },
    leader2Description: { 
      type: [String], 
      default: [
        '"The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."',
        'We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM\'s dedication to robust, responsible, and forward-looking education.',
        'KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."'
      ]
    },
    leader2Image: { type: String, default: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80' },

    leaders: [
      {
        id: { type: String },
        subheading: { type: String, default: 'MEET OUR LEADER' },
        name: { type: String, default: '' },
        title: { type: String, default: '' },
        description: { type: [String], default: [] },
        image: { type: String, default: '' },
        signatureImage: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

leadershipSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  if (!settings.leaders || settings.leaders.length === 0) {
    settings.leaders = [
      {
        id: '1',
        subheading: settings.subheading || 'OUR VISIONARY LEADER DR. NAVAS K.M',
        name: settings.name || 'Dr. Navas K.M',
        title: settings.title || 'MANAGING TRUSTEE - KMCT',
        description: settings.description && settings.description.length > 0 ? settings.description : [
          `"The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."`,
          `We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.`,
          `As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."`
        ],
        image: settings.image || '/assets/Images/Group 164.png',
        signatureImage: settings.signatureImage || '/assets/Images/image 32.png'
      },
      {
        id: '2',
        subheading: 'MEET OUR LEADER',
        name: settings.leader2Name || 'Dr. James Starlin',
        title: settings.leader2Title || 'PRINCIPAL',
        description: settings.leader2Description && settings.leader2Description.length > 0 ? settings.leader2Description : [
          `"The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."`,
          `We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.`,
          `KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."`
        ],
        image: settings.leader2Image || 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80',
        signatureImage: ''
      }
    ];
    await settings.save();
  }
  return settings;
};

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
