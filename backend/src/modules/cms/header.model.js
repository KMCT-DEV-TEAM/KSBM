import mongoose from 'mongoose';

const navItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const headerSchema = new mongoose.Schema(
  {
    navItems: [navItemSchema],
    actionButton: {
      text: {
        type: String,
        default: 'Apply Now',
      },
      isVisible: {
        type: Boolean,
        default: true,
      },
    },
    logoUrl: {
      type: String,
      default: '', // Empty means fallback to static logo
    },
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'right', // By default, align to the right to leave space in center
    },
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
headerSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      navItems: [
        { label: 'Home', link: '#home' },
        { label: 'About Us', link: '#about-us' },
        { label: 'Campus', link: '#campus' },
        { label: 'People', link: '#people' },
        { label: 'Placement', link: '#placement' },
        { label: 'Programs', link: '#programs' },
        { label: 'Events', link: '#events' },
        { label: 'Admission', link: '#admission' },
        { label: 'Examinations', link: '#examinations' },
      ],
      actionButton: { text: 'Apply Now', isVisible: true },
      logoUrl: '',
      alignment: 'center',
    });
  }
  return settings;
};

const Header = mongoose.model('Header', headerSchema);

export default Header;
