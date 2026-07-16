import mongoose from 'mongoose';

const gridItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ''
  },
  description2: {
    type: String,
    default: ''
  },
  thumbnails: {
    type: [String],
    default: []
  }
});

const clubItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String },
  hero: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    backgroundImage: { type: String, default: '' }
  },
  about: {
    heading: { type: String, default: '' },
    paragraphs: { type: [String], default: [] },
    image: { type: String, default: '' }
  },
  activities: {
    heading: { type: String, default: '' },
    items: {
      type: [{ title: String, subtitle: String, image: String }],
      default: []
    }
  },
  faculty: {
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    description: { type: String, default: '' },
    members: {
      type: [{ name: String, role: String, image: String }],
      default: []
    }
  },
  gallery: {
    heading: { type: String, default: '' },
    images: {
      type: [{ title: String, image: String }],
      default: []
    }
  }
});

const facilitiesPageSchema = new mongoose.Schema(
  {
    hero: {
      heading: { type: String, default: 'Institutional Resources' },
      subtext: { type: String, default: 'Our campus offers state-of-the-art facilities, modern classrooms, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.' },
      backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }
    },
    institutionalResources: {
      heading: { type: String, default: 'Institutional Resources' },
      description: { type: String, default: 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.' },
    },
    library: {
      heading: { type: String, default: 'Library' },
      description: { type: String, default: 'The KSBM Library serves as a dynamic hub, supporting students, faculty, and researchers with a rich collection of academic resources, integrated to drive engagement, research, and innovation. Our spaces provide a quiet and comfortable environment where students can explore concepts, prepare for their courses, and stay informed about the latest developments in business and management.' },
      description2: { type: String, default: 'With an extensive collection of books, journals, and digital resources, the library provides a conducive environment for both individual study and collaborative research.' },
      mainImage: { type: String, default: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2030&auto=format&fit=crop' },
      thumbnails: {
        type: [String],
        default: [
          'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2028&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop'
        ]
      }
    },
    otherResources: {
      heading: { type: String, default: 'Other Resources' },
      items: {
        type: [gridItemSchema],
        default: [
          { title: 'Classroom', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop' },
          { title: 'Hostel', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop' },
          { title: 'Computer Lab', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' },
          { title: 'Cafeteria', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop' }
        ]
      }
    },
    clubs: {
      heading: { type: String, default: 'Clubs And Association' },
      description: { type: String, default: 'Extracurricular activities at KSBM encompass academic clubs, professional societies, and cultural organizations that play an instrumental role in shaping holistic development. Through active participation in events, students forge long-lasting networks and acquire critical skills that transcend the classroom boundaries.' },
      items: {
        type: [clubItemSchema],
        default: [
          { title: 'Cultural Club', image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1974&auto=format&fit=crop' },
          { title: 'Sports Club', image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop' },
          { title: 'Health Club', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' }
        ]
      }
    }
  },
  {
    timestamps: true,
  }
);

facilitiesPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  } else {
    let isModified = false;
    if (!settings.institutionalResources || !settings.institutionalResources.heading) {
      settings.institutionalResources = {
        heading: 'Institutional Resources',
        description: 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.'
      };
      isModified = true;
    }
    if (isModified) {
      await settings.save();
    }
  }
  return settings;
};

const FacilitiesPage = mongoose.model('FacilitiesPage', facilitiesPageSchema);

export default FacilitiesPage;

