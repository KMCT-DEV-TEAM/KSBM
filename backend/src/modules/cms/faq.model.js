import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Everything You Need to Know' },
      subtitle: { type: String, default: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.' },
      backgroundImage: { type: String, default: '/assets/Images/image 73.png' }
    },
    mainContent: {
      heading: { type: String, default: 'Need More Information?' },
      faqs: {
        type: [
          {
            question: { type: String },
            answer: { type: String }
          }
        ],
        default: [
          {
            question: 'What MBA programs are offered at KMCT College of MBA?',
            answer: 'MBA program offers industry-relevant specializations such as Finance, Marketing, Human Resource Management, Operations Management, Business Analytics, and International Business.'
          },
          {
            question: 'What the eligibility criteria of mba admission ?',
            answer: 'Candidates must hold a recognized Bachelor\'s Degree in any discipline with a minimum 50% aggregate marks (45% for reserved categories) and possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance exams.'
          },
          {
            question: 'Does the college provide placement assistance?',
            answer: 'Yes, KSBM has a dedicated Corporate Relations and Placement Cell that maintains active corporate tie-ups, conducts pre-placement training, resume building, and arranges campus recruitment drives with top multinational and national companies.'
          },
          {
            question: 'Are scholarships available for deserving students?',
            answer: 'Yes, KSBM offers merit-based scholarships for high scorers in qualifying entrance exams and degree examinations, along with financial assistance guidance and education loan support through partner banks.'
          },
          {
            question: 'What are the hostel and campus facilities like?',
            answer: 'KSBM provides secure, separate hostel accommodation for male and female students with modern amenities, Wi-Fi connectivity, state-of-the-art computer labs, rich digital library resources, and dedicated sports complexes.'
          }
        ]
      }
    }
  },
  { timestamps: true }
);

faqSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const FaqModel = mongoose.model('FaqPage', faqSchema);

export default FaqModel;
