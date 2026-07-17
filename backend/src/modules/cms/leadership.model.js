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
  },
  { timestamps: true }
);

leadershipSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
