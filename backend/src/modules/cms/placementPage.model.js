import mongoose from 'mongoose';

const achieverSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  program: { type: String, default: '' },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  image: { type: String, default: '' }
});

const recruiterSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  logo: { type: String, default: '' }
});

const facultySchema = new mongoose.Schema({
  name: { type: String, default: '' },
  designation: { type: String, default: '' },
  image: { type: String, default: '' }
});

const committeeSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  image: { type: String, default: '' }
});

const activitySchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
});

const featureSchema = new mongoose.Schema({
  title: { type: String, default: '' }
});

const placementPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Stay Informed. Stay Prepared. \nExcel in Every Examination.' },
      subtitle: { type: String, default: 'Equip yourself with the tools, knowledge, and confidence to ace every examination. Prepare smartly and secure your future with structured learning.' },
      badge: { type: String, default: 'Placement 2026' },
      backgroundImage: { type: String, default: '/assets/Images/placements/placement_hero_bg.png' }
    },
    overview: {
      title: { type: String, default: 'Placement Excellence' },
      deskBadge: { type: String, default: 'Management Desk' },
      description1: { type: String, default: 'At KSBM, placement is not just an event, it is a process which starts from the first semester. We understand that every student has a unique set of skills and career aspirations. Our aim is to connect the right talent with the right opportunity.' },
      description2: { type: String, default: 'We have a dedicated placement cell that works tirelessly to bridge the gap between academia and industry. By organizing various training programs, seminars, and mock interviews, we ensure our students are well-prepared to face the competitive corporate world.' },
      stat1Value: { type: String, default: '100+' },
      stat1Label: { type: String, default: 'Students Placed' },
      stat2Value: { type: String, default: '100+' },
      stat2Label: { type: String, default: 'Companies Visited' },
      collageImage1: { type: String, default: '/assets/Images/placements/collage_1.png' },
      collageImage2: { type: String, default: '/assets/Images/placements/collage_2.png' },
      floatingQuote: { type: String, default: '"KSBM graduates are consistently rated as \'Highly Adaptable\' by global recruiters."' },
      overviewLogos: {
        type: [String],
        default: [
          '/assets/Images/placements/icar_logo.jpg',
          '/assets/Images/placements/vit_logo.jpg',
          '/assets/Images/placements/rcc_logo.jpg'
        ]
      }
    },
    proudAchievers: {
      title: { type: String, default: 'Proud Achievers' },
      items: {
        type: [achieverSchema],
        default: [
          { name: 'Pratik Patil', program: 'MBA 2022-24', company: 'Google', role: 'Business Analyst', companyLogo: '/assets/Images/placements/google_logo.svg', image: '/assets/Images/placements/achiever_1.png' },
          { name: 'Megha Sharma', program: 'MBA 2022-24', company: 'Microsoft', role: 'Product Manager', companyLogo: '/assets/Images/placements/microsoft_logo.svg', image: '/assets/Images/placements/achiever_2.png' },
          { name: 'Rohit Verma', program: 'MBA 2022-24', company: 'Infosys', role: 'Software Engineer', companyLogo: '/assets/Images/placements/infosys_logo.svg', image: '/assets/Images/placements/achiever_1.png' },
          { name: 'Neha Gupta', program: 'MBA 2022-24', company: 'Cognizant', role: 'Consultant', companyLogo: '/assets/Images/placements/cognizant_logo.svg', image: '/assets/Images/placements/achiever_2.png' },
        ]
      }
    },
    topRecruiters: {
      title: { type: String, default: 'Top Recruiters' },
      description: { type: String, default: 'Our strong industry connections ensure that our students get the best career opportunities. We have a consistent track record of high-quality placements across diverse sectors.' },
      items: {
        type: [recruiterSchema],
        default: [
          { name: 'Infosys', logo: '/assets/Images/placements/infosys_logo.svg' },
          { name: 'Wipro', logo: '/assets/Images/placements/wipro_logo.svg' },
          { name: 'Cognizant', logo: '/assets/Images/placements/cognizant_logo.svg' },
          { name: 'Google', logo: '/assets/Images/placements/google_logo.svg' },
          { name: 'Microsoft', logo: '/assets/Images/placements/microsoft_logo.svg' },
        ]
      }
    },
    excellenceSupport: {
      title: { type: String, default: 'Excellence in Placement Support' },
      description: { type: String, default: 'Comprehensive training and guidance to ensure you step into the corporate world with confidence and the right skill set.' },
      listOne: {
        type: [featureSchema],
        default: [
          { title: 'Dedicated Placement Cell' },
          { title: 'Industry Mentorship Programs' },
          { title: 'Group Discussion Training' },
          { title: 'Internship Assistance' },
        ]
      },
      listTwo: {
        type: [featureSchema],
        default: [
          { title: 'Mock Interviews' },
          { title: 'Aptitude Test Preparation' },
          { title: 'Corporate Guest Lectures' },
          { title: 'Personality Development' },
        ]
      },
      backgroundImage: { type: String, default: '/assets/Images/placements/placement_main.png' }
    },
    facultyInCharge: {
      badge: { type: String, default: 'Faculty In-Charge' },
      title: { type: String, default: 'Empowering Careers. Inspiring Success.' },
      description: { type: String, default: 'Our experienced faculty members work tirelessly to bridge the gap between academia and industry, ensuring every student has access to the best career opportunities through dedicated mentorship and corporate engagement.' },
      items: {
        type: [facultySchema],
        default: [
          { name: 'Dr. Sarah Johnson', designation: 'Head of Placements', image: '/assets/Images/placements/committee_1.png' },
          { name: 'Prof. David Chen', designation: 'Corporate Relations', image: '/assets/Images/placements/committee_1.png' }
        ]
      }
    },
    placementCommittee: {
      title: { type: String, default: 'Placement Committee' },
      description: { type: String, default: 'The Placement Committee consists of student representatives who actively coordinate with recruiters, schedule interviews, and ensure a smooth placement process.' },
      buttonText: { type: String, default: 'Connect with Committee' },
      image: { type: String, default: '/assets/Images/placements/placement_main.png' },
      items: {
        type: [committeeSchema],
        default: [
          { name: 'Rahul Sharma', role: 'President', image: '/assets/Images/placements/committee_1.png' },
          { name: 'Anita Patel', role: 'Corporate Outreach', image: '/assets/Images/placements/committee_1.png' },
          { name: 'Vikram Singh', role: 'Student Coordinator', image: '/assets/Images/placements/committee_1.png' }
        ]
      }
    },
    activities: {
      title: { type: String, default: 'Placement Activities & Events' },
      items: {
        type: [activitySchema],
        default: [
          { title: 'Mock Interview Session', description: 'Industry experts conduct one-on-one mock interviews to prepare students for real-world scenarios.', image: '/assets/Images/placements/activity_1.png' },
          { title: 'Resume Building Workshop', description: 'Interactive workshop helping students craft compelling resumes that stand out to top recruiters.', image: '/assets/Images/placements/activity_2.png' },
          { title: 'Pre-Placement Talk', description: 'An engaging session by top recruiters on expectations from fresh graduates and how to build a strong career trajectory.', image: '/assets/Images/placements/activity_1.png' }
        ]
      }
    }
  },
  { timestamps: true, strict: false }
);

placementPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const PlacementPage = mongoose.model('PlacementPage', placementPageSchema);
export default PlacementPage;
