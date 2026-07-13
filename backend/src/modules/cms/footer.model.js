import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
});

const footerSchema = new mongoose.Schema(
  {
    description: { 
      type: String, 
      default: 'Empowering global leaders through intellectual rigor and strategic excellence since 1998.' 
    },
    socialLinks: {
      instagram: { type: String, default: '#' },
      facebook: { type: String, default: '#' },
      whatsapp: { type: String, default: '#' }
    },
    programs: {
      type: [linkSchema],
      default: [
        { label: 'MBA Full-time', url: '#' },
        { label: 'Executive MBA', url: '#' },
        { label: 'BBA Program', url: '#' },
        { label: 'PhD in Management', url: '#' }
      ]
    },
    quickLinks: {
      type: [linkSchema],
      default: [
        { label: 'Programs', url: '#' },
        { label: 'Accreditations', url: '#' },
        { label: 'Gallery', url: '#' },
        { label: 'News & Events', url: '#' }
      ]
    },
    contactInfo: {
      address: { type: String, default: 'KMCT Hills, Kerala, India' },
      email: { type: String, default: 'admissions@ksbm.ac.in' },
      phone: { type: String, default: '+91 495 2211 444' }
    },
    copyrightText: { 
      type: String, 
      default: '© 2024 KMCT School of Business. All rights reserved. Accredited by AACSB & AMBA.' 
    }
  },
  {
    timestamps: true,
  }
);

footerSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const FooterModel = mongoose.model('Footer', footerSchema);

export default FooterModel;
