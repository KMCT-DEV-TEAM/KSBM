import mongoose from 'mongoose';

const eventItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
});

const notableAlumniItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  image: { type: String, default: '' }
});

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  image: { type: String, default: '' }
});

const alumniPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Alumni' },
      subtitle: {
        type: String,
        default: 'Our alumni stand at the forefront of global business, driving innovation through principled leadership and strategic excellence across industries worldwide.'
      },
      backgroundImage: {
        type: String,
        default: '/assets/Images/alumni/alumni_hero.png'
      }
    },
    legacy: {
      subtitle: { type: String, default: 'KSBM ALUMNI NETWORK / OUR LEGACY' },
      title: { type: String, default: 'Legacy of Excellence' },
      description1: {
        type: String,
        default: 'Since our inception, the KMCT School of Business Management has been a beacon of academic brilliance and professional development. Our alumni embody our mission, leading top organizations and shaping global markets across diverse industries.'
      },
      description2: {
        type: String,
        default: 'With over three decades of history, we take immense pride in having trained thousands of remarkable business leaders. The KMCT Alumni Association is dedicated to fostering lifelong relationships between the institution and its graduates.'
      },
      mainImage: { type: String, default: '/assets/Images/alumni/alumni_member_1.png' },
      secondaryImage: {
        type: String,
        default: '/assets/Images/alumni/alumni_member_2.png'
      },
      floatingQuote: {
        type: String,
        default: '"Shaping the future through principled leadership and excellence."'
      },
      stat1Value: { type: String, default: '30k+' },
      stat1Label: { type: String, default: 'Global Alumni' },
      stat2Value: { type: String, default: '150+' },
      stat2Label: { type: String, default: 'Industry Leaders' }
    },
    events: {
      heading: { type: String, default: 'ALUMNI EVENTS' },
      items: {
        type: [eventItemSchema],
        default: [
          {
            title: 'Global Alumni Reunion 2024',
            description: 'Join fellow graduates for a weekend of celebration, networking, and keynotes from industry leaders.',
            image: '/assets/Images/alumni/alumni_event_1.png',
            date: 'December 2024'
          },
          {
            title: 'Med Tech Innovation Summit',
            description: 'An exclusive panel discussing the intersection of healthcare management and AI technology.',
            image: '/assets/Images/alumni/alumni_event_1.png',
            date: 'October 2024'
          },
          {
            title: 'Annual Alumni Sports Meet',
            description: 'Relive campus memories with friendly cricket and football tournaments at KMCT grounds.',
            image: '/assets/Images/alumni/alumni_event_1.png',
            date: 'August 2024'
          },
          {
            title: 'Global Alumni Reunion 2023',
            description: 'A look back at our memorable digital and physical gathering celebrating 20 years of excellence.',
            image: '/assets/Images/alumni/alumni_event_1.png',
            date: 'December 2023'
          }
        ]
      }
    },
    notableAlumni: {
      subtitle: { type: String, default: 'OUR PRIDE' },
      heading: { type: String, default: 'Notable Alumni' },
      items: {
        type: [notableAlumniItemSchema],
        default: [
          {
            name: 'Dr. Rajesh Kumar',
            role: 'VP Strategy, Global Tech Corp',
            image: '/assets/Images/alumni/alumni_member_1.png'
          },
          {
            name: 'Priya Nair',
            role: 'Managing Director, FinServe India',
            image: '/assets/Images/alumni/alumni_member_2.png'
          },
          {
            name: 'Arun Varma',
            role: 'Founder & CEO, NextGen Retail',
            image: '/assets/Images/alumni/alumni_member_1.png'
          },
          {
            name: 'Sneha Menon',
            role: 'Head of HR, APAC Operations',
            image: '/assets/Images/alumni/alumni_member_2.png'
          },
          {
            name: 'Mohammed Tariq',
            role: 'Supply Chain Director, Logistics International',
            image: '/assets/Images/alumni/alumni_member_1.png'
          }
        ]
      }
    },
    gallery: {
      heading: { type: String, default: 'Captured in Events' },
      items: {
        type: [galleryItemSchema],
        default: [
          { title: 'Graduation', image: '/assets/Images/alumni/alumni_event_1.png' },
          { title: 'Convocation', image: '/assets/Images/alumni/alumni_event_1.png' },
          { title: 'Celebration', image: '/assets/Images/alumni/alumni_event_1.png' },
          { title: 'Campus Reunion', image: '/assets/Images/alumni/alumni_event_1.png' },
          { title: 'Ceremony', image: '/assets/Images/alumni/alumni_event_1.png' }
        ]
      }
    },
    cta: {
      title: { type: String, default: 'Join the KMCT Alumni Network' },
      subtitle: {
        type: String,
        default: 'Stay connected with your alma mater, network with fellow peers, and participate in exclusive leadership and mentoring initiatives.'
      },
      buttonText: { type: String, default: 'View Details' },
      buttonLink: { type: String, default: '#register' }
    }
  },
  { timestamps: true, strict: false }
);

alumniPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AlumniPage = mongoose.model('AlumniPage', alumniPageSchema);

export default AlumniPage;
