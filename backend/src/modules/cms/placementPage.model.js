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
      backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop' }
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
      collageImage1: { type: String, default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop' },
      collageImage2: { type: String, default: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop' },
      floatingQuote: { type: String, default: '"KSBM graduates are consistently rated as \'Highly Adaptable\' by global recruiters."' }
    },
    proudAchievers: {
      title: { type: String, default: 'Proud Achievers' },
      items: {
        type: [achieverSchema],
        default: [
          { name: 'Pratik Patil', program: 'MBA 2022-24', company: 'Google', role: 'Business Analyst', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop' },
          { name: 'Megha Sharma', program: 'MBA 2022-24', company: 'Microsoft', role: 'Product Manager', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
          { name: 'Rohit Verma', program: 'MBA 2022-24', company: 'Infosys', role: 'Software Engineer', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
          { name: 'Neha Gupta', program: 'MBA 2022-24', company: 'Cognizant', role: 'Consultant', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop' },
        ]
      }
    },
    topRecruiters: {
      title: { type: String, default: 'Top Recruiters' },
      description: { type: String, default: 'Our strong industry connections ensure that our students get the best career opportunities. We have a consistent track record of high-quality placements across diverse sectors.' },
      items: {
        type: [recruiterSchema],
        default: [
          { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
          { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
          { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg' },
          { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
          { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
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
      backgroundImage: { type: String, default: '/assets/Images/Rectangle 67.png' }
    },
    facultyInCharge: {
      badge: { type: String, default: 'Faculty In-Charge' },
      title: { type: String, default: 'Empowering Careers. Inspiring Success.' },
      description: { type: String, default: 'Our experienced faculty members work tirelessly to bridge the gap between academia and industry, ensuring every student has access to the best career opportunities through dedicated mentorship and corporate engagement.' },
      items: {
        type: [facultySchema],
        default: [
          { name: 'Dr. Sarah Johnson', designation: 'Head of Placements', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
          { name: 'Prof. David Chen', designation: 'Corporate Relations', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    },
    placementCommittee: {
      title: { type: String, default: 'Placement Committee' },
      description: { type: String, default: 'The Placement Committee consists of student representatives who actively coordinate with recruiters, schedule interviews, and ensure a smooth placement process.' },
      buttonText: { type: String, default: 'Connect with Committee' },
      image: { type: String, default: '/assets/Images/placement.png' },
      items: {
        type: [committeeSchema],
        default: [
          { name: 'Rahul Sharma', role: 'President', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800&auto=format&fit=crop' },
          { name: 'Anita Patel', role: 'Corporate Outreach', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
          { name: 'Vikram Singh', role: 'Student Coordinator', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    },
    activities: {
      title: { type: String, default: 'Placement Activities & Events' },
      items: {
        type: [activitySchema],
        default: [
          { title: 'Mock Interview Session', description: 'Industry experts conduct one-on-one mock interviews to prepare students for real-world scenarios.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop' },
          { title: 'Resume Building Workshop', description: 'Interactive workshop helping students craft compelling resumes that stand out to top recruiters.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop' },
          { title: 'Pre-Placement Talk', description: 'An engaging session by top recruiters on expectations from fresh graduates and how to build a strong career trajectory.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    }
  },
  { timestamps: true }
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
