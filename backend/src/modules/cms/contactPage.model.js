import mongoose from 'mongoose';

const contactPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Stay Connected. \nStart Your Journey With KSBM.' },
      subtitle: { type: String, default: 'Reach out to our admissions office, placement cell, or general inquiry desk. We are here to answer your questions and guide you toward a transformative management education experience.' },
      badge: { type: String, default: 'CONTACT INFORMATION' },
      backgroundImage: { type: String, default: '/assets/Images/image 73.png' }
    },
    contactBox: {
      badge: { type: String, default: 'CONTACT US' },
      title: { type: String, default: 'Start Your Journey' },
      subtitle: { type: String, default: 'Whether you are seeking admission to our flagship management programs or exploring corporate collaboration, our doors are always open to support your ambitions.' },
      phoneLabel: { type: String, default: 'Call us for inquiry' },
      phoneNumber: { type: String, default: '+91 495 2211 444' },
      phoneSecondary: { type: String, default: '/ +1 (212) 555-0198' },
      emailLabel: { type: String, default: 'Email anytime' },
      emailPrimary: { type: String, default: 'admissions@ksbm.ac.in' },
      emailSecondary: { type: String, default: 'solutions@lumina.com' },
      addressLabel: { type: String, default: 'Visit Our Office' },
      addressText: { type: String, default: 'KMCT Hills, Mampara, Pazhur P.O., Kuttippuram, Kerala - 679571' },
      bottomBadgeText: { type: String, default: 'Admissions Open 2025–27' },
      bottomBadgeDesk: { type: String, default: 'KSBM Desk' }
    }
  },
  { timestamps: true }
);

contactPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const ContactPage = mongoose.model('ContactPage', contactPageSchema);

export default ContactPage;
