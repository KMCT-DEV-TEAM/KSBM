import mongoose from 'mongoose';

const mbaPageSchema = new mongoose.Schema(
  {
    shortTitle: { type: String, default: 'MBA' },
    title: { type: String, default: 'Master of Business Administration' },
    heroTitleLine1: { type: String, default: 'Master of Business' },
    heroTitleLine2: { type: String, default: 'Administration (MBA)' },
    description: {
      type: String,
      default: 'A rigorous two-year program designed to mold visionary business leaders, strategic thinkers, and dynamic entrepreneurs ready to navigate the global corporate landscape.'
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'
    },
    heroPrimaryBtnText: { type: String, default: 'EXPLORE PROGRAM' },
    heroSecondaryBtnText: { type: String, default: 'DOWNLOAD BROCHURE' },
    heroCardTitle: { type: String, default: 'Batch 2025–27' },
    heroCardStat1Title: { type: String, default: 'Limited Seats' },
    heroCardStat1Sub: { type: String, default: 'Last few slots remaining' },
    heroCardStat2Title: { type: String, default: '100% Placement' },
    heroCardStat2Sub: { type: String, default: 'Consistent record over years' },
    overviewTitle: { type: String, default: 'Master of Business Administration' },
    overviewText: {
      type: String,
      default: 'Our MBA program combines rigorous academic foundations with experiential learning, empowering students to master complex global business challenges and lead with confidence.'
    },
    overviewSubtext: {
      type: String,
      default: 'Through case-study pedagogy, industry mentorship, and live corporate projects, students develop executive presence, analytical rigor, and entrepreneurial innovation.'
    },
    overviewImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
    },
    overviewBadgeText: { type: String, default: 'POSTGRADUATE EXCELLENCE' },
    overviewFloatingBadgeText: { type: String, default: '100% Case-Study Driven' },
    overviewPrimaryBtnText: { type: String, default: 'Apply Now' },
    overviewSecondaryBtnText: { type: String, default: 'Download Brochure' },
    highlights: {
      type: [String],
      default: [
        '2-Year Full-Time AICTE Approved Curriculum',
        'Dual Specializations (Finance, Marketing, HR, Ops)',
        'Harvard & IIM Case-Study Pedagogy',
        'Guaranteed Corporate Mentorship & Live Projects'
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
          title: 'Business Strategy & Leadership',
          description: 'Cultivating executive presence, strategic decision-making, and organizational leadership capabilities.',
          topics: [
            'Strategic Management & Innovation',
            'Corporate Governance & Ethics',
            'Executive Decision Making'
          ]
        },
        {
          number: '02',
          title: 'Financial Management & Analytics',
          description: 'Mastering corporate finance, investment valuation, risk management, and data-driven insights.',
          topics: [
            'Corporate Finance & Modeling',
            'Investment & Risk Management',
            'Business Analytics & AI Tools'
          ]
        },
        {
          number: '03',
          title: 'Marketing & Consumer Insights',
          description: 'Building brand leadership, digital marketing dominance, and advanced market analysis skills.',
          topics: [
            'Global Strategic Marketing',
            'Digital Brand Management',
            'Consumer Behavior & Psychology'
          ]
        },
        {
          number: '04',
          title: 'Operations & Supply Chain',
          description: 'Optimizing global supply chains, lean management practices, and quality assurance.',
          topics: [
            'Global Supply Chain Optimization',
            'Lean Management & Six Sigma',
            'Project Management Methodology'
          ]
        }
      ]
    },
    internshipTitle: { type: String, default: 'Summer Internship Program' },
    internshipDesc: {
      type: String,
      default: 'Our mandatory 8-week summer internship bridges the gap between academic theory and real-world corporate challenges, working with industry leaders across India and abroad.'
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
          title: 'Academic Requirement',
          description: "Candidates must hold a recognized Bachelor's Degree in any discipline with minimum qualifying marks.",
          bullets: [
            'Minimum 50% aggregate marks in graduation',
            'Final year degree students may also apply',
            'Degree from any university recognized by UGC/AIU'
          ]
        },
        {
          step: '02',
          title: 'Entrance Examination',
          description: 'Valid score in national or state-level management aptitude tests.',
          bullets: [
            'Valid CAT / CMAT / KMAT / MAT score',
            'Competitive percentile score preferred',
            'Exemption criteria as per state university regulations'
          ]
        },
        {
          step: '03',
          title: 'Selection Process',
          description: 'Multi-stage evaluation testing leadership aptitude, communication skills, and academic merit.',
          bullets: [
            'Shortlisting based on entrance examination scores',
            'Group Discussion (GD) on contemporary business topics',
            'Personal Interview (PI) with expert panel'
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

mbaPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const MbaPageSetting = mongoose.model('MbaPageSetting', mbaPageSchema);
export default MbaPageSetting;
