import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const aboutSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'BUILDING EXCELLENCE SINCE 1995',
    },
    heading: {
      type: String,
      default: 'Shaping Tomorrow\'s Business Leaders',
    },
    paragraphs: {
      type: [String],
      default: [
        'At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today\'s evolving business landscape.',
        'Our MBA program equips students with advanced managerial knowledge, strategic thinking, and leadership skills for successful corporate careers, while the BBA program builds a strong foundation in business, communication, and management for higher studies and professional growth. Supported by experienced faculty, modern infrastructure, and strong industry collaborations, KSBM provides an inspiring environment that nurtures critical thinking, entrepreneurship, innovation, and lifelong learning.'
      ]
    },
    imageUrl: {
      type: String,
      default: '', // Fallback to local image in frontend if empty
    },
    stats: {
      type: [statSchema],
      default: [
        { value: '16+', label: 'YEARS OF EXCELLENCE' },
        { value: '991+', label: 'ACTIVE STUDENTS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' }
      ]
    },
    showSubheading: { type: Boolean, default: true },
    showHeading: { type: Boolean, default: true },
    showParagraphs: { type: Boolean, default: true },
    showImage: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
aboutSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      subheading: 'BUILDING EXCELLENCE SINCE 1995',
      heading: 'Shaping Tomorrow\'s Business Leaders',
      paragraphs: [
        'At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today\'s evolving business landscape.',
        'Our MBA program equips students with advanced managerial knowledge, strategic thinking, and leadership skills for successful corporate careers, while the BBA program builds a strong foundation in business, communication, and management for higher studies and professional growth. Supported by experienced faculty, modern infrastructure, and strong industry collaborations, KSBM provides an inspiring environment that nurtures critical thinking, entrepreneurship, innovation, and lifelong learning.'
      ],
      imageUrl: '',
      stats: [
        { value: '16+', label: 'YEARS OF EXCELLENCE' },
        { value: '991+', label: 'ACTIVE STUDENTS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' }
      ],
      showSubheading: true,
      showHeading: true,
      showParagraphs: true,
      showImage: true,
      showStats: true
    });
  }
  return settings;
};

const About = mongoose.model('About', aboutSchema);

export default About;
