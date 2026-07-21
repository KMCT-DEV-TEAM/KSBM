import mongoose from 'mongoose';

const statItemSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
});

const advantageItemSchema = new mongoose.Schema({
  icon: { type: String, default: 'Award' },
  title: { type: String, required: true },
  desc: { type: String, required: true }
});

const journeyStepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '' },
  desc: { type: String, required: true },
  icon: { type: String, default: 'ClipboardList' }
});

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const admissionsPageSchema = new mongoose.Schema(
  {
    // 1. Hero Section
    heroBadgeText: { type: String, default: 'Admissions 2026' },
    heroTitle: { type: String, default: 'Empowering Future Leaders' },
    heroSubtitle: {
      type: String,
      default: 'Join a world-class institution dedicated to excellence in management education. Shape your future with industry-relevant curriculum and global perspectives.'
    },
    heroApplyBtnText: { type: String, default: 'Apply Now' },
    heroApplyBtnUrl: { type: String, default: '/#contact' },
    heroBrochureBtnText: { type: String, default: 'Download Brochure' },
    heroBrochureBtnUrl: { type: String, default: '#' },
    heroBgImage: { type: String, default: '/assets/Images/image 73.png' },
    heroStats: {
      type: [statItemSchema],
      default: [
        { value: '98%', label: 'Placement Rate' },
        { value: '500+', label: 'Recruiting Partners' },
        { value: '15:1', label: 'Student-Faculty Ratio' }
      ]
    },

    // 2. Elite Advantage Section
    eliteHeading: { type: String, default: 'The KSBM Elite Advantage' },
    eliteSubtitle: { type: String, default: 'Why Choose Our Program' },
    eliteDesc: {
      type: String,
      default: 'Supported by experienced faculty and corporate mentors, we focus on analytical depth, strategic vision, and holistic individual development, preparing students to excel in top multinational corporations and dynamic entrepreneurial ventures across India and globally.'
    },
    eliteImage: { type: String, default: '/assets/Images/image 2.png' },
    eliteAdvantages: {
      type: [advantageItemSchema],
      default: [
        {
          icon: 'TrendingUp',
          title: 'Career Transformation',
          desc: 'Personalized career guidance and leadership development designed to elevate graduates into high-impact management roles.'
        },
        {
          icon: 'Globe2',
          title: 'Global Curriculum',
          desc: 'Modern case-study approach integrated with real-world industry simulations, guest lectures, and corporate mentorship.'
        },
        {
          icon: 'ShieldCheck',
          title: 'Academic Excellence',
          desc: 'Rigorous academic standards taught by renowned faculty members with extensive doctoral and corporate consulting backgrounds.'
        },
        {
          icon: 'Users',
          title: 'Vibrant Network',
          desc: 'Access to a distinguished alumni network and active executive connections spanning leading multinational corporations worldwide.'
        }
      ]
    },

    // 3. Admission Journey Section
    journeyHeading: { type: String, default: 'Your Journey to KSBM' },
    journeySubtitle: { type: String, default: 'Application Process' },
    journeySteps: {
      type: [journeyStepSchema],
      default: [
        {
          step: '01',
          title: 'Online Application',
          duration: 'Approx. 20 Mins',
          desc: 'Complete the comprehensive online application form via our portal and upload academic transcripts, graduation certificates, and entrance exam scorecards.',
          icon: 'ClipboardList'
        },
        {
          step: '02',
          title: 'Document & Score Verification',
          duration: '3 - 5 Business Days',
          desc: 'Our admissions committee rigorously reviews your academic credentials, entrance test scores (KMAT/CMAT/CAT/MAT), and eligibility compliance.',
          icon: 'CheckCircle2'
        },
        {
          step: '03',
          title: 'Personal Interview & Assessment',
          duration: 'Scheduled Panel Assessment',
          desc: 'Shortlisted candidates participate in an interactive personal evaluation with faculty experts to evaluate communication, analytical clarity, and managerial aptitude.',
          icon: 'Users'
        },
        {
          step: '04',
          title: 'Offer of Admission',
          duration: 'Within 7 Business Days',
          desc: 'Successful applicants receive an official provisional admission offer letter detailing scholarship eligibility, fee structure, and enrollment deadlines.',
          icon: 'Award'
        },
        {
          step: '05',
          title: 'Enrollment & Onboarding',
          duration: 'Before Semester Commencement',
          desc: 'Confirm your seat by completing fee formalities, submitting original verification documents, and attending orientation.',
          icon: 'CheckCircle2'
        }
      ]
    },

    // 4. Eligibility Standards Section
    eligibilityHeading: { type: String, default: 'Program Requirements' },
    eligibilitySubtitle: { type: String, default: 'Eligibility Criteria' },
    feeStructure: {
      amount: { type: String, default: '₹1,50,000' },
      period: { type: String, default: 'per semester' }
    },
    mba: {
      eligibilityText: { type: String, default: 'Any recognized Bachelor’s degree with a valid CMAT/CAT/KMAT score.' },
      approvedIntake: { type: String, default: '60 Seats' },
      eligibilityCriteria: {
        type: [String],
        default: [
          "General Category : Minimum 50% marks in aggregate in graduation.",
          "Reserved Categories : Minimum 45% marks in aggregate for SC/ST and OBC candidates as per university norms.",
          "Accepted Entrance Exams : Valid qualifying score in KMAT, CMAT, CAT, or MAT.",
          "Final Year Students : Candidates appearing for final year degree examinations may apply provisionally."
        ]
      },
      programHighlights: {
        type: [String],
        default: [
          "Duration : 2 Years Full-Time (4 Semesters)",
          "Specializations : Finance, Marketing, HR, Systems, International Business",
          "Internship : 8-week compulsory corporate summer internship",
          "Affiliation : Calicut University & AICTE Approved"
        ]
      }
    },
    bba: {
      eligibilityText: { type: String, default: 'Pass in Plus Two (10+2) or equivalent examination from a recognized board.' },
      approvedIntake: { type: String, default: '40 Seats' },
      eligibilityCriteria: {
        type: [String],
        default: [
          "General Category : Pass in 10+2 or equivalent examination with minimum 45% marks.",
          "Reserved Categories : Minimum 40% marks for candidates belonging to SC/ST categories.",
          "Stream Flexibility : Students from Science, Commerce, and Humanities streams are eligible.",
          "Selection Criteria : Merit-based selection as per university guidelines."
        ]
      },
      programHighlights: {
        type: [String],
        default: [
          "Duration : 3 Years Full-Time (6 Semesters)",
          "Focus Areas : Business Foundations, Entrepreneurship, Management Principles",
          "Industry Readiness : Live projects, industrial visits, and soft skills training",
          "Affiliation : Calicut University & AICTE Approved"
        ]
      }
    },

    // 5. CTA Section
    ctaHeading: { type: String, default: 'Begin Your Leadership Journey at KSBM' },
    ctaDesc: {
      type: String,
      default: 'Applications for the upcoming academic year are now open. Take the first step towards a transformative management education under a community of vibrant peers, experienced faculty, and industry leaders.'
    },
    ctaApplyBtnText: { type: String, default: 'Apply Now' },
    ctaApplyBtnUrl: { type: String, default: '/#contact' },
    ctaEnquiryBtnText: { type: String, default: 'Enquiry Now' },
    ctaEnquiryBtnUrl: { type: String, default: '/#contact' },
    ctaImage: { type: String, default: '/assets/Images/image 78.png' },

    // 6. FAQ Section
    faqHeading: { type: String, default: 'FAQ' },
    faqs: {
      type: [faqItemSchema],
      default: [
        {
          question: 'What are the basic eligibility criteria for the MBA program?',
          answer: 'Applicants must possess any recognized Bachelor’s degree under the 10+2+3 or 10+2+4 pattern with at least 50% aggregate marks (45% for reserved categories) along with a valid qualifying score in KMAT, CMAT, CAT, or MAT.'
        },
        {
          question: 'Can final year undergraduate students apply?',
          answer: 'Yes, students currently in their final semester or year of graduation can apply provisionally. However, confirmation of admission is subject to submitting the final degree mark sheets and certificates meeting the minimum percentage requirement before the stipulated cutoff date.'
        },
        {
          question: 'Which entrance exam scores are accepted by KSBM?',
          answer: 'We accept valid scores from KMAT Kerala, CMAT (conducted by NTA), CAT (conducted by IIMs), and MAT (conducted by AIMA). Candidates must ensure their scorecards are valid for the current academic admission cycle.'
        },
        {
          question: 'Is there any application fee or processing charge?',
          answer: 'Yes, nominal application and processing fees apply as per university norms. Payment instructions and exact fee structures are provided directly during the online application submission workflow on our portal.'
        },
        {
          question: 'Does KSBM offer scholarships or financial aid?',
          answer: 'Yes, merit-based scholarships and fee concessions are offered to outstanding students with high entrance exam percentiles or exceptional academic records. We also assist students with documentation for education loans from major nationalized and private banks.'
        }
      ]
    }
  },
  { timestamps: true }
);

admissionsPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AdmissionsPage = mongoose.model('AdmissionsPage', admissionsPageSchema);
export default AdmissionsPage;
