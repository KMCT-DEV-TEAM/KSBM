import mongoose from 'mongoose';

const bbaPageSchema = new mongoose.Schema(
  {
    shortTitle: { type: String, default: 'BBA' },
    title: { type: String, default: 'Bachelor of Business Administration' },
    heroTitleLine1: { type: String, default: 'Bachelor of Business' },
    heroTitleLine2: { type: String, default: 'Administration (BBA)' },
    description: {
      type: String,
      default: 'A dynamic three-year undergraduate program designed to build strong business foundations, leadership capabilities, and practical skills for aspiring professionals and future entrepreneurs.'
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop'
    },
    heroPrimaryBtnText: { type: String, default: 'EXPLORE PROGRAM' },
    heroSecondaryBtnText: { type: String, default: 'DOWNLOAD BROCHURE' },
    heroCardTitle: { type: String, default: 'Batch 2025–27' },
    heroCardStat1Title: { type: String, default: 'Limited Seats' },
    heroCardStat1Sub: { type: String, default: 'Last few slots remaining' },
    heroCardStat2Title: { type: String, default: 'Industry Aligned' },
    heroCardStat2Sub: { type: String, default: '3-Year Degree & Projects' },
    overviewTitle: { type: String, default: 'Bachelor of Business Administration' },
    overviewText: {
      type: String,
      default: 'The BBA program at KSBM lays the essential groundwork for young minds aspiring to make an impact in the corporate world or launch their own ventures.'
    },
    overviewSubtext: {
      type: String,
      default: 'Combining fundamental business theory with practical workshops, presentation modules, and industry exposure, the curriculum ensures smooth transition to corporate careers or premier MBA programs.'
    },
    overviewImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop'
    },
    overviewBadgeText: { type: String, default: 'UNDERGRADUATE EXCELLENCE' },
    overviewFloatingBadgeText: { type: String, default: '3-Year Foundation' },
    overviewPrimaryBtnText: { type: String, default: 'Apply Now' },
    overviewSecondaryBtnText: { type: String, default: 'Download Brochure' },
    highlights: {
      type: [String],
      default: [
        '3-Year Full-Time Undergraduate Degree Program',
        'Affiliated with Calicut University & AICTE Approved',
        'Integrated Skill Development & Leadership Training',
        'Direct Corporate Internships & Career Counseling'
      ]
    },
    dimensions: {
      type: [
        {
          number: { type: String },
          title: { type: String },
          description: { type: String },
          topics: { type: [String] }
        }
      ],
      default: [
        {
          number: '01',
          title: 'Business Fundamentals & Ethics',
          description: 'Building a robust foundation in core management principles, economics, accounting, and business law.',
          topics: [
            'Principles of Management & Economics',
            'Corporate Law & Business Ethics',
            'Organizational Behavior & Communication'
          ]
        },
        {
          number: '02',
          title: 'Marketing & Communication',
          description: 'Developing persuasive professional communication, consumer psychology understanding, and digital branding.',
          topics: [
            'Marketing Management Essentials',
            'Professional Corporate Communication',
            'Digital & Social Media Fundamentals'
          ]
        },
        {
          number: '03',
          title: 'Financial Accounting & Management',
          description: 'Understanding corporate accounting practices, financial reporting, budgeting, and banking basics.',
          topics: [
            'Financial Accounting & Reporting',
            'Cost Accounting & Budgetary Control',
            'Banking & Financial Services'
          ]
        },
        {
          number: '04',
          title: 'Entrepreneurship & Innovation',
          description: 'Fostering venture creation skills, startup incubation, and practical business plan development.',
          topics: [
            'Venture Creation & Business Planning',
            'Startup Incubation & Ecosystems',
            'Innovation & New Product Development'
          ]
        }
      ]
    },
    internshipTitle: { type: String, default: 'Summer Internship & Industry Projects' },
    internshipDesc: {
      type: String,
      default: 'Students undergo structured industrial visits and a dedicated corporate project phase, gaining valuable workplace skills, professional mentorship, and early career clarity.'
    },
    internshipBgImage: {
      type: String,
      default: '/assets/Images/image 67.png'
    },
    internshipBadge: { type: String, default: 'EXPERIENTIAL LEARNING' },
    internshipBtnText: { type: String, default: 'Apply Now' },
    internshipBtnLink: { type: String, default: '/#contact' },
    internshipImages: {
      type: [String],
      default: [
        '/assets/Images/image 2.png',
        '/assets/Images/image 27.png',
        '/assets/Images/image 28.png'
      ]
    },
    eligibility: {
      type: [
        {
          step: { type: String },
          title: { type: String },
          description: { type: String },
          bullets: { type: [String] }
        }
      ],
      default: [
        {
          step: '01',
          title: 'Academic Eligibility',
          description: 'Successful completion of Higher Secondary (10+2) examination or equivalent from a recognized board.',
          bullets: [
            'Minimum 50% aggregate marks in 10+2 (any stream)',
            'Students awaiting 12th results can apply provisionally',
            'Recognized by State / CBSE / ICSE boards'
          ]
        },
        {
          step: '02',
          title: 'Aptitude Assessment',
          description: 'Evaluation of general aptitude, communication ability, and interest in business studies.',
          bullets: [
            'KSBM General Business Aptitude Assessment',
            'Evaluation of basic analytical & verbal skills',
            'Merit-based screening as per university guidelines'
          ]
        },
        {
          step: '03',
          title: 'Personal Counseling & Interview',
          description: 'Interactive session to understand student career aspirations and guide specialization pathways.',
          bullets: [
            'One-on-one interaction with faculty panel',
            'Assessment of student motivation and career clarity',
            'Final admission offer & registration counseling'
          ]
        }
      ]
    },
    whyChoosePills: {
      badgeText: { type: String, default: 'LEARNING GOALS' },
      title: { type: String, default: 'Key Learning Dimensions' },
      items: {
        type: [
          {
            title: { type: String },
            description: { type: String },
            icon: { type: String }
          }
        ],
        default: [
          { title: 'Management', description: 'Strategic Execution.', icon: 'BookOpen' },
          { title: 'Leadership', description: 'Visionary Guidance.', icon: 'Users' },
          { title: 'Analytics', description: 'Data-Driven Insights.', icon: 'Briefcase' },
          { title: 'Collaboration', description: 'Cross-Functional Teams.', icon: 'Globe' },
          { title: 'Innovation', description: 'Futuristic Innovation.', icon: 'Award' }
        ]
      }
    },
    dynamicLearning: {
      badgeText: { type: String, default: 'ABOUT THE IV' },
      title: { type: String, default: 'Experience Dynamic Learning' },
      desc1: {
        type: String,
        default: 'Beyond the classroom, KSBM offers an electrifying campus ecosystem packed with management clubs, national-level conclaves, cultural extravaganzas, and executive workshops.'
      },
      desc2: {
        type: String,
        default: 'We believe true leadership is forged through holistic development, peer collaboration, and continuous exposure to diverse real-world scenarios.'
      },
      images: {
        type: [String],
        default: ['/assets/Images/image 49.png', '/assets/Images/image 60.png']
      },
      features: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            icon: { type: String }
          }
        ],
        default: [
          { title: 'Management Clubs', desc: 'Specialized student-led clubs in Finance, Marketing, HR, and Entrepreneurship.', icon: 'Users' },
          { title: 'Leadership Conclaves', desc: 'Annual summits bringing top business leaders and innovators to campus.', icon: 'Award' },
          { title: 'Cultural & Sports', desc: 'National-level fests, athletic tournaments, and vibrant community celebrations.', icon: 'Trophy' },
          { title: 'Corporate Workshops', desc: 'Intensive bootcamps on AI in business, advanced Excel, and executive presence.', icon: 'Briefcase' }
        ]
      }
    },
    momentsGallery: {
      badgeText: { type: String, default: 'GALLERY' },
      title: { type: String, default: 'Moments Captured in Trip' },
      bgImage: { type: String, default: '' },
      items: {
        type: [
          {
            title: { type: String },
            subtitle: { type: String },
            image: { type: String },
            span: { type: String }
          }
        ],
        default: [
          { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/image 67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
          { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/image 27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/image 28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/image 2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
          { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/image 58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
        ]
      }
    },
    academicCalendarBanner: {
      badgeText: { type: String, default: 'ACADEMIC SCHEDULE 2026-27' },
      title: { type: String, default: 'Download the Official Academic Calendar' },
      description: {
        type: String,
        default: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.'
      },
      viewBtnText: { type: String, default: 'View Calendar' },
      viewBtnUrl: { type: String, default: '/assets/Images/image 64.png' },
      downloadBtnText: { type: String, default: 'Download Calendar' },
      downloadBtnUrl: { type: String, default: '/assets/Images/image 64.png' },
      image: { type: String, default: '/assets/Images/image 64.png' },
      events: { type: [mongoose.Schema.Types.Mixed], default: [] }
    }
  },
  { timestamps: true }
);

bbaPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const BbaPageSetting = mongoose.model('BbaPageSetting', bbaPageSchema);
export default BbaPageSetting;
