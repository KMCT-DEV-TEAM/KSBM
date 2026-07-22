import mongoose from 'mongoose';

const privacyPolicySchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Privacy Policy' },
      subtitle: { type: String, default: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.' },
      backgroundImage: { type: String, default: '/assets/Images/image 73.png' }
    },
    mainContent: {
      heading: { type: String, default: 'Privacy Policy' },
      paragraph1: { type: String, default: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website.' },
      paragraph2: { type: String, default: 'KMCT Group of Colleges reserves the right to modify, update, or discontinue any aspect of the website, including academic programs, admission criteria, fee structures, policies, facilities, and services, at any time without prior notice. The content published should not be considered as a binding commitment, and users are encouraged to verify specific details directly with the institution\'s official representatives before making decisions.' },
      paragraph3: { type: String, default: 'The institution shall not be liable for any loss or damage, including but not limited to indirect or consequential loss, arising from the use of or reliance on information available on this website. This includes any interruptions, errors, or omissions in the content.' },
      paragraph4: { type: String, default: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.' },
      paragraph5: { type: String, default: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.' },
      paragraph6: { type: String, default: 'By accessing and using this website, users agree to the terms outlined in this disclaimer.' },
      bulletPoints: {
        type: [String],
        default: [
          'The information provided on the KMCT Group of Colleges website is for general informational purposes only.',
          'While efforts are made to ensure accuracy, the institution does not guarantee the completeness, reliability, or timeliness of the content.',
          'KMCT Group of Colleges reserves the right to modify or update courses, fees, policies, and other details without prior notice.',
          'Users are advised to verify all information directly with the institution before making any decisions.'
        ]
      },
      closingParagraph1: { type: String, default: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website. This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites. All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.' },
      closingParagraph2: { type: String, default: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.' },
      closingBoldText1: { type: String, default: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated.' },
      closingBoldText2: { type: String, default: 'Unauthorized use, reproduction, or distribution of any content is strictly prohibited.' }
    }
  },
  { timestamps: true }
);

privacyPolicySchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const PrivacyPolicyModel = mongoose.model('PrivacyPolicyPage', privacyPolicySchema);

export default PrivacyPolicyModel;
