"use client";
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProgramHero from './components/ProgramHero';
import ProgramOverview from './components/ProgramOverview';
import LearningDimensionsGrid from './components/LearningDimensionsGrid';
import WhyChoosePills from './components/WhyChoosePills';
import SummerInternshipBanner from './components/SummerInternshipBanner';
import DynamicLearningSection from './components/DynamicLearningSection';
import MomentsGallery from './components/MomentsGallery';
import AcademicCalendarBanner from './components/AcademicCalendarBanner';
import AdmissionEligibility from './components/AdmissionEligibility';
import TopRecruitersGrid from './components/TopRecruitersGrid';

const programConfigs = {
  mba: {
    id: 'mba',
    shortTitle: 'MBA',
    title: 'Master of Business Administration',
    description: 'A rigorous two-year program designed to mold visionary business leaders, strategic thinkers, and dynamic entrepreneurs ready to navigate the global corporate landscape.',
    heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
    overviewTitle: 'Master of Business Administration',
    overviewText: 'Our MBA program combines rigorous academic foundations with experiential learning, empowering students to master complex global business challenges and lead with confidence.',
    overviewSubtext: 'Through case-study pedagogy, industry mentorship, and live corporate projects, students develop executive presence, analytical rigor, and entrepreneurial innovation.',
    overviewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    highlights: [
      '2-Year Full-Time AICTE Approved Curriculum',
      'Dual Specializations (Finance, Marketing, HR, Ops)',
      'Harvard & IIM Case-Study Pedagogy',
      'Guaranteed Corporate Mentorship & Live Projects'
    ],
    dimensions: [
      {
        number: '01',
        title: 'Core Foundations',
        description: 'Building strong fundamental knowledge across essential business functions and management principles.',
        topics: [
          'Financial Accounting',
          'Marketing Management',
          'Organizational Behavior'
        ],
        credits: 'Credits: 18'
      },
      {
        number: '02',
        title: 'Analytical Depth',
        description: 'Mastering quantitative techniques, financial modeling, and data-driven corporate decision making.',
        topics: [
          'Corporate Finance',
          'Operations Research',
          'Business Analytics'
        ],
        credits: 'Credits: 20'
      },
      {
        number: '03',
        title: 'Strategic Integration',
        description: 'Synthesizing cross-functional insights to formulate global strategies and drive organizational innovation.',
        topics: [
          'Global Strategy',
          'Innovation Management',
          'Specialization Track I'
        ],
        credits: 'Credits: 22'
      },
      {
        number: '04',
        title: 'Capstone Mastery',
        description: 'Applying integrated management competencies to solve real-world corporate consulting problems.',
        topics: [
          'Industry Consulting Project',
          'Entrepreneurial Lab',
          'Final Thesis'
        ],
        credits: 'Credits: 16'
      }
    ],
    internshipBgImage: '/assets/Images/image%2067.png',
    internshipTitle: 'Summer Internship Program',
    internshipDesc: 'Our mandatory 8-week summer internship bridges the gap between academic theory and real-world corporate challenges, working with industry leaders across India and abroad.',
    internshipBadge: 'EXPERIENTIAL LEARNING',
    internshipBtnText: 'Apply Now',
    internshipBtnLink: '/#contact',
    internshipImages: [
      '/assets/Images/image 2.png',
      '/assets/Images/image 27.png',
      '/assets/Images/image 28.png'
    ],
    whyChoosePills: {
      badgeText: 'LEARNING GOALS',
      title: 'Key Learning Dimensions',
      items: [
        { title: 'Management', description: 'Strategic Execution.', icon: 'BookOpen' },
        { title: 'Leadership', description: 'Visionary Guidance.', icon: 'Users' },
        { title: 'Analytics', description: 'Data-Driven Insights.', icon: 'Briefcase' },
        { title: 'Collaboration', description: 'Cross-Functional Teams.', icon: 'Globe' },
        { title: 'Innovation', description: 'Futuristic Innovation.', icon: 'Award' }
      ]
    },
    dynamicLearning: {
      badgeText: 'ABOUT THE IV',
      title: 'Experience Dynamic Learning',
      desc1: 'Beyond the classroom, KSBM offers an electrifying campus ecosystem packed with management clubs, national-level conclaves, cultural extravaganzas, and executive workshops.',
      desc2: 'We believe true leadership is forged through holistic development, peer collaboration, and continuous exposure to diverse real-world scenarios.',
      images: ['/assets/Images/image 49.png', '/assets/Images/image 60.png'],
      features: [
        { title: 'Management Clubs', desc: 'Specialized student-led clubs in Finance, Marketing, HR, and Entrepreneurship.', icon: 'Users' },
        { title: 'Leadership Conclaves', desc: 'Annual summits bringing top business leaders and innovators to campus.', icon: 'Award' },
        { title: 'Cultural & Sports', desc: 'National-level fests, athletic tournaments, and vibrant community celebrations.', icon: 'Trophy' },
        { title: 'Corporate Workshops', desc: 'Intensive bootcamps on AI in business, advanced Excel, and executive presence.', icon: 'Briefcase' }
      ]
    },
    momentsGallery: {
      badgeText: 'GALLERY',
      title: 'Moments Captured in Trip',
      items: [
        { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/image 67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
        { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/image 27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
        { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/image 28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
        { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/image 2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
        { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/image 58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
      ]
    },
    eligibility: [
      {
        step: '01',
        title: 'Academic Requirement',
        description: 'Candidates must hold a recognized Bachelor\'s Degree in any discipline with minimum qualifying marks.',
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
    ],
    academicCalendarBanner: {
      badgeText: 'ACADEMIC SCHEDULE 2026-27',
      title: 'Download the Official Academic Calendar',
      description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
      viewBtnText: 'View Calendar',
      viewBtnUrl: '/assets/Images/image 64.png',
      downloadBtnText: 'Download Calendar',
      downloadBtnUrl: '/assets/Images/image 64.png',
      image: '/assets/Images/image 64.png',
      events: []
    }
  },
  bba: {
    id: 'bba',
    shortTitle: 'BBA',
    title: 'Bachelor of Business Administration',
    description: 'A dynamic three-year undergraduate program designed to build strong business foundations, leadership capabilities, and practical skills for aspiring professionals and future entrepreneurs.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    overviewTitle: 'Bachelor of Business Administration',
    overviewText: 'The BBA program at KSBM lays the essential groundwork for young minds aspiring to make an impact in the corporate world or launch their own ventures.',
    overviewSubtext: 'Combining fundamental business theory with practical workshops, presentation modules, and industry exposure, the curriculum ensures smooth transition to corporate careers or premier MBA programs.',
    overviewImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    highlights: [
      '3-Year Full-Time Undergraduate Degree Program',
      'Affiliated with Calicut University & AICTE Approved',
      'Integrated Skill Development & Leadership Training',
      'Direct Corporate Internships & Career Counseling'
    ],
    dimensions: [
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
    ],
    internshipBgImage: '/assets/Images/image%2067.png',
    internshipTitle: 'Summer Internship & Industry Projects',
    internshipDesc: 'Students undergo structured industrial visits and a dedicated corporate project phase, gaining valuable workplace skills, professional mentorship, and early career clarity.',
    internshipBadge: 'EXPERIENTIAL LEARNING',
    internshipBtnText: 'Apply Now',
    internshipBtnLink: '/#contact',
    internshipImages: [
      '/assets/Images/image 2.png',
      '/assets/Images/image 27.png',
      '/assets/Images/image 28.png'
    ],
    whyChoosePills: {
      badgeText: 'LEARNING GOALS',
      title: 'Key Learning Dimensions',
      items: [
        { title: 'Management', description: 'Strategic Execution.', icon: 'BookOpen' },
        { title: 'Leadership', description: 'Visionary Guidance.', icon: 'Users' },
        { title: 'Analytics', description: 'Data-Driven Insights.', icon: 'Briefcase' },
        { title: 'Collaboration', description: 'Cross-Functional Teams.', icon: 'Globe' },
        { title: 'Innovation', description: 'Futuristic Innovation.', icon: 'Award' }
      ]
    },
    dynamicLearning: {
      badgeText: 'ABOUT THE IV',
      title: 'Experience Dynamic Learning',
      desc1: 'Beyond the classroom, KSBM offers an electrifying campus ecosystem packed with management clubs, national-level conclaves, cultural extravaganzas, and executive workshops.',
      desc2: 'We believe true leadership is forged through holistic development, peer collaboration, and continuous exposure to diverse real-world scenarios.',
      images: ['/assets/Images/image 49.png', '/assets/Images/image 60.png'],
      features: [
        { title: 'Management Clubs', desc: 'Specialized student-led clubs in Finance, Marketing, HR, and Entrepreneurship.', icon: 'Users' },
        { title: 'Leadership Conclaves', desc: 'Annual summits bringing top business leaders and innovators to campus.', icon: 'Award' },
        { title: 'Cultural & Sports', desc: 'National-level fests, athletic tournaments, and vibrant community celebrations.', icon: 'Trophy' },
        { title: 'Corporate Workshops', desc: 'Intensive bootcamps on AI in business, advanced Excel, and executive presence.', icon: 'Briefcase' }
      ]
    },
    momentsGallery: {
      badgeText: 'GALLERY',
      title: 'Moments Captured in Trip',
      items: [
        { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/image 67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
        { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/image 27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
        { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/image 28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
        { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/image 2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
        { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/image 58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
      ]
    },
    eligibility: [
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
    ],
    academicCalendarBanner: {
      badgeText: 'ACADEMIC SCHEDULE 2026-27',
      title: 'Download the Official Academic Calendar',
      description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
      viewBtnText: 'View Calendar',
      viewBtnUrl: '/assets/Images/image 64.png',
      downloadBtnText: 'Download Calendar',
      downloadBtnUrl: '/assets/Images/image 64.png',
      image: '/assets/Images/image 64.png',
      events: []
    }
  }
};

const ProgramPage = ({ programType = 'mba' }) => {
  const defaultConfig = programConfigs[programType?.toLowerCase()] || programConfigs.mba;
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    window.scrollTo(0, 0);
    const endpoint = programType?.toLowerCase() === 'bba' ? '/cms/bba-page' : '/cms/mba-page';
    setConfig(programConfigs[programType?.toLowerCase()] || programConfigs.mba);
    const fetchCmsData = async () => {
      try {
        const { data } = await api.get(endpoint);
        if (data && (data.title || data.description || data.overviewText)) {
          setConfig((prev) => ({
            ...prev,
            ...data,
            id: programType?.toLowerCase() || 'mba'
          }));
        }
      } catch (err) {
        console.error('Error fetching program CMS settings:', err);
      }
    };
    fetchCmsData();
  }, [programType]);

  return (
    <div className="min-h-screen bg-white">
      <ProgramHero program={config} />
      <ProgramOverview program={config} />
      <LearningDimensionsGrid dimensions={config.dimensions} />
      <WhyChoosePills program={config} />
      <SummerInternshipBanner program={config} />
      <DynamicLearningSection program={config} />
      <MomentsGallery program={config} />
      <AcademicCalendarBanner program={config} />
      <AdmissionEligibility eligibility={config.eligibility} />
      <TopRecruitersGrid />
    </div>
  );
};

export default ProgramPage;
