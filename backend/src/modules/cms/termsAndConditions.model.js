import mongoose from 'mongoose';

const termsAndConditionsSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Terms & Conditions' },
      subtitle: { type: String, default: 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.' },
      backgroundImage: { type: String, default: '/assets/Images/image 73.png' }
    },
    mainContent: {
      heading: { type: String, default: 'Terms of Use' },
      introParagraph: { type: String, default: 'By accessing and using the official website and online portals of KMCT Group of Colleges (KSBM), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our platforms immediately.' },
      sections: {
        type: [
          {
            title: { type: String },
            content: { type: String }
          }
        ],
        default: [
          {
            title: '1. Use of Website Content',
            content: 'All content provided on this website, including course schedules, fee details, academic curricula, faculty profiles, and news updates, is for educational and informational purposes. While we endeavor to maintain up-to-date and accurate information, KSBM reserves the right to modify academic offerings and policies without prior notice.'
          },
          {
            title: '2. User Conduct & Obligations',
            content: 'Users agree to access and use this website solely for lawful purposes. You must not transmit any malicious code, attempt unauthorized access to restricted portals or student information systems, or disrupt normal server operations.'
          },
          {
            title: '3. Intellectual Property Rights',
            content: 'All institutional logos, emblems, written documentation, imagery, and design layouts hosted on this site are registered trademarks or copyrighted assets of KMCT Group of Colleges. Any reproduction or distribution without explicit written consent is prohibited.'
          },
          {
            title: '4. Limitation of Liability',
            content: 'KSBM shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or reliance upon any content published herein.'
          },
          {
            title: '5. Governing Law',
            content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts in Kerala.'
          }
        ]
      },
      bulletPoints: {
        type: [String],
        default: [
          'All website content, course details, and fee structures are subject to periodic review and modification without prior notice.',
          'Unauthorized usage of institutional branding, emblems, or student data is strictly prohibited and subject to legal recourse.',
          'Accessing restricted student or faculty portals requires authorized credentials issued by the institution.',
          'All disputes regarding website usage and institutional policies fall strictly under the jurisdiction of the courts in Kerala.'
        ]
      },
      closingParagraph1: { type: String, default: 'KMCT Group of Colleges reserves the right to update or amend these Terms and Conditions at any time. Your continued use of the website following the posting of any modifications constitutes your formal acceptance of the updated guidelines.' },
      closingParagraph2: { type: String, default: 'If you have any questions or concerns regarding our terms of service, please contact our administrative desk or reach out via our general inquiry channels.' }
    }
  },
  { timestamps: true }
);

termsAndConditionsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const TermsAndConditionsModel = mongoose.model('TermsAndConditionsPage', termsAndConditionsSchema);

export default TermsAndConditionsModel;
