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
  isVisible: {
    type: Boolean,
    default: true,
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
  const defaultNavItems = [
    { label: 'Home', link: '/', isVisible: true },
    { label: 'About Us', link: '/about', isVisible: true },
    { label: 'Academics', link: '/faculty', isVisible: true },
    { label: 'Programs', link: '/programs', isVisible: true },
    { label: 'Facility', link: '/facilities', isVisible: true },
    { label: 'Admission', link: '/admissions', isVisible: true },
    { label: 'Events', link: '/events', isVisible: true },
    { label: 'Blogs', link: '/blogs', isVisible: true },
    { label: 'Grievance', link: '/grievance', isVisible: true },
    { label: 'Mandatory Disclosure', link: '/mandatory-disclosure', isVisible: true },
  ];

  if (!settings) {
    settings = await this.create({
      navItems: defaultNavItems,
      actionButton: { text: 'Apply Now', isVisible: true },
      logoUrl: '',
      alignment: 'center',
    });
  } else {
    const hasAcademics = settings.navItems && settings.navItems.some(i => i.label && i.label.toLowerCase() === 'academics');
    if (!hasAcademics) {
      settings.navItems = defaultNavItems;
      await settings.save();
    }
  }
  return settings;
};

const Header = mongoose.model('Header', headerSchema);

export default Header;
