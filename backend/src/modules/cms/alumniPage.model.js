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
        default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
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
      mainImage: { type: String, default: '/assets/Images/image 60.png' },
      secondaryImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1000&auto=format&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
            date: 'December 2024'
          },
          {
            title: 'Med Tech Innovation Summit',
            description: 'An exclusive panel discussing the intersection of healthcare management and AI technology.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
            date: 'October 2024'
          },
          {
            title: 'Annual Alumni Sports Meet',
            description: 'Relive campus memories with friendly cricket and football tournaments at KMCT grounds.',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
            date: 'August 2024'
          },
          {
            title: 'Global Alumni Reunion 2023',
            description: 'A look back at our memorable digital and physical gathering celebrating 20 years of excellence.',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
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
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
          },
          {
            name: 'Priya Nair',
            role: 'Managing Director, FinServe India',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
          },
          {
            name: 'Arun Varma',
            role: 'Founder & CEO, NextGen Retail',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
          },
          {
            name: 'Sneha Menon',
            role: 'Head of HR, APAC Operations',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop'
          },
          {
            name: 'Mohammed Tariq',
            role: 'Supply Chain Director, Logistics International',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
          }
        ]
      }
    },
    gallery: {
      heading: { type: String, default: 'Captured in Events' },
      items: {
        type: [galleryItemSchema],
        default: [
          { title: 'Graduation', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
          { title: 'Convocation', image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop' },
          { title: 'Celebration', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop' },
          { title: 'Campus Reunion', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
          { title: 'Ceremony', image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=800&auto=format&fit=crop' }
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
  { timestamps: true }
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
