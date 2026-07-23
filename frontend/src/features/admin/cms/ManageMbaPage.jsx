"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Plus, Trash2, GraduationCap, FileText, BookOpen, Briefcase, Award, Eye, Monitor, Tablet, Smartphone, X, RotateCcw, ChevronLeft, ChevronRight, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import LogoUploader from './components/LogoUploader';
import ManageRecruiters from './ManageRecruiters';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const defaultCalendarEvents = [
  { id: '1', title: 'Orientation & Leadership Summit', date: 'July 15 - July 18, 2026', semester: 'Trimester 1', category: 'Leadership & Events', description: 'Inaugural session, corporate guest keynotes, and campus orientation for the incoming cohort.' },
  { id: '2', title: 'Trimester 1 Mid-Term Assessments', date: 'September 10 - September 18, 2026', semester: 'Trimester 1', category: 'Exams & Assessments', description: 'Mid-term written and case-based evaluation across core foundational subjects.' },
  { id: '3', title: 'Global Corporate Immersion & Industrial Tour', date: 'October 05 - October 10, 2026', semester: 'Trimester 1', category: 'Industrial Visits', description: 'On-site industrial visits to top tech hubs and financial conglomerates.' },
  { id: '4', title: 'End-Semester Examinations & Project Defense', date: 'October 24 - October 30, 2026', semester: 'Trimester 1', category: 'Exams & Assessments', description: 'Final comprehensive examinations and viva-voce for Trimester 1 completion.' },
  { id: '5', title: 'Inter-Term Break & Winter Internship Prep', date: 'November 01 - November 08, 2026', semester: 'Trimester 1', category: 'Term Breaks & Holidays', description: 'Semester break and career counseling workshops for summer internship placement readiness.' },
  { id: '6', title: 'Trimester 2 Commencement & Core Electives', date: 'November 10, 2026', semester: 'Trimester 2', category: 'Leadership & Events', description: 'Start of Trimester 2 coursework focusing on advanced managerial electives.' },
  { id: '7', title: 'Annual Management Fest & CXO Colloquium', date: 'January 14 - January 16, 2027', semester: 'Trimester 2', category: 'Leadership & Events', description: 'National level B-school symposium featuring industry leaders and management competitions.' },
  { id: '8', title: 'Summer Internship Placement Drive', date: 'February 15 - February 28, 2027', semester: 'Trimester 2', category: 'Industrial Visits', description: 'On-campus recruitment process for 8-10 week corporate summer internships.' }
];

const ManageMbaPage = ({ isBba = false }) => {
  const endpoint = isBba ? '/cms/bba-page' : '/cms/mba-page';
  const pageName = isBba ? 'BBA Program Page' : 'Page';
  const liveUrl = isBba ? '/programs/bba' : '/programs/mba';

  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const tabsContainerRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Preview Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Form states
  const [shortTitle, setShortTitle] = useState(isBba ? 'BBA' : 'MBA');
  const [title, setTitle] = useState(isBba ? 'Bachelor of Business Administration' : 'Master of Business Administration');
  const [heroTitleLine1, setHeroTitleLine1] = useState(isBba ? 'Bachelor of Business' : 'Master of Business');
  const [heroTitleLine2, setHeroTitleLine2] = useState(isBba ? 'Administration (BBA)' : 'Administration (MBA)');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroPrimaryBtnText, setHeroPrimaryBtnText] = useState('EXPLORE PROGRAM');
  const [heroSecondaryBtnText, setHeroSecondaryBtnText] = useState('DOWNLOAD BROCHURE');
  const [heroCardTitle, setHeroCardTitle] = useState('Batch 2025–27');
  const [heroCardStat1Title, setHeroCardStat1Title] = useState('Limited Seats');
  const [heroCardStat1Sub, setHeroCardStat1Sub] = useState('Last few slots remaining');
  const [heroCardStat2Title, setHeroCardStat2Title] = useState('100% Placement');
  const [heroCardStat2Sub, setHeroCardStat2Sub] = useState('Consistent record over years');

  const [overviewTitle, setOverviewTitle] = useState('');
  const [overviewText, setOverviewText] = useState('');
  const [overviewSubtext, setOverviewSubtext] = useState('');
  const [overviewImage, setOverviewImage] = useState('');
  const [overviewBadgeText, setOverviewBadgeText] = useState(isBba ? 'UNDERGRADUATE EXCELLENCE' : 'POSTGRADUATE EXCELLENCE');
  const [overviewFloatingBadgeText, setOverviewFloatingBadgeText] = useState(isBba ? '3-Year Foundation' : '100% Case-Study Driven');
  const [overviewPrimaryBtnText, setOverviewPrimaryBtnText] = useState('Apply Now');
  const [overviewSecondaryBtnText, setOverviewSecondaryBtnText] = useState('Download Brochure');
  const [highlights, setHighlights] = useState([]);

  const [dimensions, setDimensions] = useState([]);

  const [internshipTitle, setInternshipTitle] = useState('');
  const [internshipDesc, setInternshipDesc] = useState('');
  const [internshipBgImage, setInternshipBgImage] = useState('');

  const [eligibility, setEligibility] = useState([]);

  const [internshipBadge, setInternshipBadge] = useState('EXPERIENTIAL LEARNING');
  const [internshipBtnText, setInternshipBtnText] = useState('Apply Now');
  const [internshipBtnLink, setInternshipBtnLink] = useState('/#contact');
  const [internshipImages, setInternshipImages] = useState([
    '/assets/Images/image 2.png',
    '/assets/Images/image 27.png',
    '/assets/Images/image 28.png'
  ]);

  const [whyChoosePills, setWhyChoosePills] = useState({
    badgeText: 'LEARNING GOALS',
    title: 'Key Learning Dimensions',
    items: []
  });

  const [dynamicLearning, setDynamicLearning] = useState({
    badgeText: 'ABOUT THE IV',
    title: 'Experience Dynamic Learning',
    desc1: '',
    desc2: '',
    images: ['/assets/Images/image 49.png', '/assets/Images/image 60.png'],
    features: []
  });

  const [momentsGallery, setMomentsGallery] = useState({
    badgeText: 'GALLERY',
    title: 'Moments Captured in Trip',
    bgImage: '',
    items: []
  });

  const [academicCalendarBanner, setAcademicCalendarBanner] = useState({
    badgeText: 'ACADEMIC SCHEDULE 2026-27',
    title: 'Download the Official Academic Calendar',
    description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
    viewBtnText: 'View Calendar',
    viewBtnUrl: '/assets/Images/image 64.png',
    downloadBtnText: 'Download Calendar',
    downloadBtnUrl: '/assets/Images/image 64.png',
    image: '/assets/Images/image 64.png',
    events: defaultCalendarEvents
  });

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setShortTitle(data.shortTitle || (isBba ? 'BBA' : 'MBA'));
      setTitle(data.title || (isBba ? 'Bachelor of Business Administration' : 'Master of Business Administration'));
      setHeroTitleLine1(data.heroTitleLine1 || (isBba ? 'Bachelor of Business' : 'Master of Business'));
      setHeroTitleLine2(data.heroTitleLine2 || (isBba ? 'Administration (BBA)' : 'Administration (MBA)'));
      setDescription(data.description || '');
      setHeroImage(data.heroImage || '');
      setHeroPrimaryBtnText(data.heroPrimaryBtnText || 'EXPLORE PROGRAM');
      setHeroSecondaryBtnText(data.heroSecondaryBtnText || 'DOWNLOAD BROCHURE');
      setHeroCardTitle(data.heroCardTitle || 'Batch 2025–27');
      setHeroCardStat1Title(data.heroCardStat1Title || 'Limited Seats');
      setHeroCardStat1Sub(data.heroCardStat1Sub || 'Last few slots remaining');
      setHeroCardStat2Title(data.heroCardStat2Title || (isBba ? 'Industry Aligned' : '100% Placement'));
      setHeroCardStat2Sub(data.heroCardStat2Sub || (isBba ? '3-Year Degree & Projects' : 'Consistent record over years'));

      setOverviewTitle(data.overviewTitle || '');
      setOverviewText(data.overviewText || '');
      setOverviewSubtext(data.overviewSubtext || '');
      setOverviewImage(data.overviewImage || '');
      setOverviewBadgeText(data.overviewBadgeText || (isBba ? 'UNDERGRADUATE EXCELLENCE' : 'POSTGRADUATE EXCELLENCE'));
      setOverviewFloatingBadgeText(data.overviewFloatingBadgeText || (isBba ? '3-Year Foundation' : '100% Case-Study Driven'));
      setOverviewPrimaryBtnText(data.overviewPrimaryBtnText || 'Apply Now');
      setOverviewSecondaryBtnText(data.overviewSecondaryBtnText || 'Download Brochure');
      setHighlights(data.highlights || []);

      setDimensions(data.dimensions || []);

      setInternshipTitle(data.internshipTitle || '');
      setInternshipDesc(data.internshipDesc || '');
      setInternshipBgImage(data.internshipBgImage || '');

      setEligibility(data.eligibility || []);

      setInternshipBadge(data.internshipBadge || 'EXPERIENTIAL LEARNING');
      setInternshipBtnText(data.internshipBtnText || 'Apply Now');
      setInternshipBtnLink(data.internshipBtnLink || '/#contact');
      setInternshipImages(data.internshipImages && data.internshipImages.length > 0 ? data.internshipImages : [
        '/assets/Images/image 2.png',
        '/assets/Images/image 27.png',
        '/assets/Images/image 28.png'
      ]);

      setWhyChoosePills(data.whyChoosePills || {
        badgeText: 'LEARNING GOALS',
        title: 'Key Learning Dimensions',
        items: [
          { title: 'Management', description: 'Strategic Execution.', icon: 'BookOpen' },
          { title: 'Leadership', description: 'Visionary Guidance.', icon: 'Users' },
          { title: 'Analytics', description: 'Data-Driven Insights.', icon: 'Briefcase' },
          { title: 'Collaboration', description: 'Cross-Functional Teams.', icon: 'Globe' },
          { title: 'Innovation', description: 'Futuristic Innovation.', icon: 'Award' }
        ]
      });

      setDynamicLearning(data.dynamicLearning || {
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
      });

      setMomentsGallery(data.momentsGallery || {
        badgeText: 'GALLERY',
        title: 'Moments Captured in Trip',
        bgImage: '',
        items: [
          { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/image 67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
          { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/image 27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/image 28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/image 2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
          { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/image 58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
        ]
      });

      setAcademicCalendarBanner({
        ...(data.academicCalendarBanner || {}),
        badgeText: data.academicCalendarBanner?.badgeText || 'ACADEMIC SCHEDULE 2026-27',
        title: data.academicCalendarBanner?.title || 'Download the Official Academic Calendar',
        description: data.academicCalendarBanner?.description || 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
        viewBtnText: data.academicCalendarBanner?.viewBtnText || 'View Calendar',
        viewBtnUrl: data.academicCalendarBanner?.viewBtnUrl || '/assets/Images/image 64.png',
        downloadBtnText: data.academicCalendarBanner?.downloadBtnText || 'Download Calendar',
        downloadBtnUrl: data.academicCalendarBanner?.downloadBtnUrl || '/assets/Images/image 64.png',
        image: data.academicCalendarBanner?.image || '/assets/Images/image 64.png',
        events: (data.academicCalendarBanner?.events && data.academicCalendarBanner.events.length > 0)
          ? data.academicCalendarBanner.events
          : defaultCalendarEvents
      });
    } catch (error) {
      console.error(`Error fetching ${pageName} settings:`, error);
      Toast.fire({ icon: 'error', title: `Failed to load ${pageName} settings.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: `Are you sure you want to update the ${pageName} content on the live website?`,
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put(endpoint, {
            shortTitle,
            title,
            heroTitleLine1,
            heroTitleLine2,
            description,
            heroImage,
            heroPrimaryBtnText,
            heroSecondaryBtnText,
            heroCardTitle,
            heroCardStat1Title,
            heroCardStat1Sub,
            heroCardStat2Title,
            heroCardStat2Sub,
            overviewTitle,
            overviewText,
            overviewSubtext,
            overviewImage,
            overviewBadgeText,
            overviewFloatingBadgeText,
            overviewPrimaryBtnText,
            overviewSecondaryBtnText,
            highlights,
            dimensions,
            internshipTitle,
            internshipDesc,
            internshipBgImage,
            internshipBadge,
            internshipBtnText,
            internshipBtnLink,
            internshipImages,
            eligibility,
            whyChoosePills,
            dynamicLearning,
            momentsGallery,
            academicCalendarBanner
          });
          Toast.fire({ icon: 'success', title: `${pageName} updated successfully!` });
        } catch (error) {
          console.error(`Error saving ${pageName} settings:`, error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: `This will reset all text, images, and cards for the ${pageName} to their original standard state. You still need to click "Save Changes" to apply.`,
      confirmText: 'Yes, reset it!',
      variant: 'danger',
      action: async () => {
        if (isBba) {
          setShortTitle('BBA');
          setTitle('Bachelor of Business Administration');
          setHeroTitleLine1('Bachelor of Business');
          setHeroTitleLine2('Administration (BBA)');
          setDescription('A dynamic three-year undergraduate program designed to build strong business foundations, leadership capabilities, and practical skills for aspiring professionals and future entrepreneurs.');
          setHeroImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop');
          setHeroPrimaryBtnText('EXPLORE PROGRAM');
          setHeroSecondaryBtnText('DOWNLOAD BROCHURE');
          setHeroCardTitle('Batch 2025–27');
          setHeroCardStat1Title('Limited Seats');
          setHeroCardStat1Sub('Last few slots remaining');
          setHeroCardStat2Title('Industry Aligned');
          setHeroCardStat2Sub('3-Year Degree & Projects');
          setOverviewTitle('Bachelor of Business Administration');
          setOverviewText('The BBA program at KSBM lays the essential groundwork for young minds aspiring to make an impact in the corporate world or launch their own ventures.');
          setOverviewSubtext('Combining fundamental business theory with practical workshops, presentation modules, and industry exposure, the curriculum ensures smooth transition to corporate careers or premier MBA programs.');
          setOverviewImage('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop');
          setOverviewBadgeText('UNDERGRADUATE EXCELLENCE');
          setOverviewFloatingBadgeText('3-Year Foundation');
          setOverviewPrimaryBtnText('Apply Now');
          setOverviewSecondaryBtnText('Download Brochure');
          setHighlights([
            '3-Year Full-Time Undergraduate Degree Program',
            'Affiliated with Calicut University & AICTE Approved',
            'Integrated Skill Development & Leadership Training',
            'Direct Corporate Internships & Career Counseling'
          ]);
        } else {
          setShortTitle('MBA');
          setTitle('Master of Business Administration');
          setHeroTitleLine1('Master of Business');
          setHeroTitleLine2('Administration (MBA)');
          setDescription('A rigorous two-year program designed to mold visionary business leaders, strategic thinkers, and dynamic entrepreneurs ready to navigate the global corporate landscape.');
          setHeroImage('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop');
          setHeroPrimaryBtnText('EXPLORE PROGRAM');
          setHeroSecondaryBtnText('DOWNLOAD BROCHURE');
          setHeroCardTitle('Batch 2025–27');
          setHeroCardStat1Title('Limited Seats');
          setHeroCardStat1Sub('Last few slots remaining');
          setHeroCardStat2Title('100% Placement');
          setHeroCardStat2Sub('Consistent record over years');
          setOverviewTitle('Master of Business Administration');
          setOverviewText('Our MBA program combines rigorous academic foundations with experiential learning, empowering students to master complex global business challenges and lead with confidence.');
          setOverviewSubtext('Through case-study pedagogy, industry mentorship, and live corporate projects, students develop executive presence, analytical rigor, and entrepreneurial innovation.');
          setOverviewImage('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop');
          setOverviewBadgeText('POSTGRADUATE EXCELLENCE');
          setOverviewFloatingBadgeText('100% Case-Study Driven');
          setOverviewPrimaryBtnText('Apply Now');
          setOverviewSecondaryBtnText('Download Brochure');
          setHighlights([
            '2-Year Full-Time AICTE Approved Curriculum',
            'Dual Specializations (Finance, Marketing, HR, Ops)',
            'Harvard & IIM Case-Study Pedagogy',
            'Guaranteed Corporate Mentorship & Live Projects'
          ]);
        }
        setInternshipBadge('EXPERIENTIAL LEARNING');
        setInternshipBtnText('Apply Now');
        setInternshipBtnLink('/#contact');
        setInternshipImages([
          '/assets/Images/image 2.png',
          '/assets/Images/image 27.png',
          '/assets/Images/image 28.png'
        ]);
        setWhyChoosePills({
          badgeText: 'LEARNING GOALS',
          title: 'Key Learning Dimensions',
          items: [
            { title: 'Management', description: 'Strategic Execution.', icon: 'BookOpen' },
            { title: 'Leadership', description: 'Visionary Guidance.', icon: 'Users' },
            { title: 'Analytics', description: 'Data-Driven Insights.', icon: 'Briefcase' },
            { title: 'Collaboration', description: 'Cross-Functional Teams.', icon: 'Globe' },
            { title: 'Innovation', description: 'Futuristic Innovation.', icon: 'Award' }
          ]
        });
        setDynamicLearning({
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
        });
        setMomentsGallery({
          badgeText: 'GALLERY',
          title: 'Moments Captured in Trip',
          bgImage: '',
          items: [
            { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/image 67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
            { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/image 27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
            { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/image 28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
            { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/image 2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
            { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/image 58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
          ]
        });
        setAcademicCalendarBanner({
          badgeText: 'ACADEMIC SCHEDULE 2026-27',
          title: 'Download the Official Academic Calendar',
          description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
          viewBtnText: 'View Calendar',
          viewBtnUrl: '/assets/Images/image 64.png',
          downloadBtnText: 'Download Calendar',
          downloadBtnUrl: '/assets/Images/image 64.png',
          image: '/assets/Images/image 64.png'
        });
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save Changes to confirm.' });
      }
    });
  };

  // Highlights helpers
  const addHighlight = () => setHighlights([...highlights, '']);
  const updateHighlight = (index, val) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };
  const removeHighlight = (index) => setHighlights(highlights.filter((_, i) => i !== index));

  // Dimensions helpers
  const addDimension = () => {
    setDimensions([
      ...dimensions,
      {
        number: `0${dimensions.length + 1}`,
        title: 'New Dimension Title',
        description: 'Dimension description goes here.',
        topics: ['Topic 1', 'Topic 2']
      }
    ]);
  };
  const updateDimension = (index, field, val) => {
    const updated = [...dimensions];
    updated[index][field] = val;
    setDimensions(updated);
  };
  const removeDimension = (index) => setDimensions(dimensions.filter((_, i) => i !== index));

  const addDimensionTopic = (dimIdx) => {
    const updated = [...dimensions];
    updated[dimIdx].topics.push('New Topic');
    setDimensions(updated);
  };
  const updateDimensionTopic = (dimIdx, topIdx, val) => {
    const updated = [...dimensions];
    updated[dimIdx].topics[topIdx] = val;
    setDimensions(updated);
  };
  const removeDimensionTopic = (dimIdx, topIdx) => {
    const updated = [...dimensions];
    updated[dimIdx].topics = updated[dimIdx].topics.filter((_, i) => i !== topIdx);
    setDimensions(updated);
  };

  // Eligibility helpers
  const addEligibilityStep = () => {
    setEligibility([
      ...eligibility,
      {
        step: `0${eligibility.length + 1}`,
        title: 'New Step Title',
        description: 'Step description goes here.',
        bullets: ['Requirement 1', 'Requirement 2']
      }
    ]);
  };
  const updateEligibilityStep = (index, field, val) => {
    const updated = [...eligibility];
    updated[index][field] = val;
    setEligibility(updated);
  };
  const removeEligibilityStep = (index) => setEligibility(eligibility.filter((_, i) => i !== index));

  const addEligibilityBullet = (stepIdx) => {
    const updated = [...eligibility];
    updated[stepIdx].bullets.push('New bullet requirement');
    setEligibility(updated);
  };
  const updateEligibilityBullet = (stepIdx, bulIdx, val) => {
    const updated = [...eligibility];
    updated[stepIdx].bullets[bulIdx] = val;
    setEligibility(updated);
  };
  const removeEligibilityBullet = (stepIdx, bulIdx) => {
    const updated = [...eligibility];
    updated[stepIdx].bullets = updated[stepIdx].bullets.filter((_, i) => i !== bulIdx);
    setEligibility(updated);
  };

  // WhyChoosePills helpers
  const addPillItem = () => {
    setWhyChoosePills({
      ...whyChoosePills,
      items: [
        ...(whyChoosePills.items || []),
        { title: 'New Dimension', description: 'Brief description.', icon: 'BookOpen' }
      ]
    });
  };
  const updatePillItem = (idx, field, val) => {
    const updatedItems = [...(whyChoosePills.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], [field]: val };
    setWhyChoosePills({ ...whyChoosePills, items: updatedItems });
  };
  const removePillItem = (idx) => {
    const updatedItems = (whyChoosePills.items || []).filter((_, i) => i !== idx);
    setWhyChoosePills({ ...whyChoosePills, items: updatedItems });
  };

  // Academic Calendar Events helpers
  const addCalendarEvent = () => {
    setAcademicCalendarBanner({
      ...academicCalendarBanner,
      events: [
        ...(academicCalendarBanner.events || []),
        {
          id: Date.now().toString(),
          title: 'New Schedule Milestone',
          date: 'November 15, 2026',
          semester: 'Trimester 1',
          category: 'Exams & Assessments',
          description: 'Brief details about this academic event or schedule.'
        }
      ]
    });
  };
  const updateCalendarEvent = (idx, field, val) => {
    const updated = [...(academicCalendarBanner.events || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setAcademicCalendarBanner({ ...academicCalendarBanner, events: updated });
  };
  const removeCalendarEvent = (idx) => {
    const updated = (academicCalendarBanner.events || []).filter((_, i) => i !== idx);
    setAcademicCalendarBanner({ ...academicCalendarBanner, events: updated });
  };
  const moveCalendarEvent = (idx, direction) => {
    const current = [...(academicCalendarBanner.events || [])];
    const target = idx + direction;
    if (target < 0 || target >= current.length) return;
    const [item] = current.splice(idx, 1);
    current.splice(target, 0, item);
    setAcademicCalendarBanner({ ...academicCalendarBanner, events: current });
  };

  // DynamicLearning helpers
  const addDynamicFeature = () => {
    setDynamicLearning({
      ...dynamicLearning,
      features: [
        ...(dynamicLearning.features || []),
        { title: 'New Feature', desc: 'Brief feature description.', icon: 'Award' }
      ]
    });
  };
  const updateDynamicFeature = (idx, field, val) => {
    const updatedFeatures = [...(dynamicLearning.features || [])];
    updatedFeatures[idx] = { ...updatedFeatures[idx], [field]: val };
    setDynamicLearning({ ...dynamicLearning, features: updatedFeatures });
  };
  const removeDynamicFeature = (idx) => {
    const updatedFeatures = (dynamicLearning.features || []).filter((_, i) => i !== idx);
    setDynamicLearning({ ...dynamicLearning, features: updatedFeatures });
  };
  const updateDynamicImage = (idx, url) => {
    const updatedImages = [...(dynamicLearning.images || ['', ''])];
    updatedImages[idx] = url;
    setDynamicLearning({ ...dynamicLearning, images: updatedImages });
  };

  // MomentsGallery helpers
  const addGalleryItem = () => {
    const defaultSpans = [
      'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]',
      'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]',
      'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]',
      'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]',
      'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]'
    ];
    const span = defaultSpans[(momentsGallery.items || []).length % defaultSpans.length];
    setMomentsGallery({
      ...momentsGallery,
      items: [
        ...(momentsGallery.items || []),
        { title: 'New Moment', subtitle: 'Moment Subtitle', image: '/assets/Images/image 67.png', span }
      ]
    });
  };
  const updateGalleryItem = (idx, field, val) => {
    const updatedItems = [...(momentsGallery.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], [field]: val };
    setMomentsGallery({ ...momentsGallery, items: updatedItems });
  };
  const removeGalleryItem = (idx) => {
    const updatedItems = (momentsGallery.items || []).filter((_, i) => i !== idx);
    setMomentsGallery({ ...momentsGallery, items: updatedItems });
  };

  // Internship Images helpers
  const updateInternshipImage = (idx, url) => {
    const updated = [...(internshipImages || ['', '', ''])];
    updated[idx] = url;
    setInternshipImages(updated);
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  const tabs = [
    { id: 'hero', name: 'Hero Banner', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'overview', name: 'Program Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'dimensions', name: '4 Core Dimensions', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'whyChoose', name: 'Key Learning Dimensions', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'internship', name: 'Internship Banner', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'dynamicLearning', name: 'Dynamic Learning', icon: <Award className="w-4 h-4" /> },
    { id: 'momentsGallery', name: 'Moments Gallery', icon: <FileText className="w-4 h-4" /> },
    { id: 'academicCalendarBanner', name: 'Academic Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'eligibility', name: 'Admission & Eligibility', icon: <Award className="w-4 h-4" /> },
    { id: 'topRecruiters', name: 'Top Recruiters & Partners', icon: <Briefcase className="w-4 h-4" /> }
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title={`${pageName} CMS`}
        description="Manage titles, banner images, curriculum highlights, overview details, and eligibility criteria."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
          title="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
          title="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Hero Banner Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Badge Title</label>
              <input
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="MBA"
              />
              <p className="text-xs text-gray-400 mt-1">Appears inside the top pill badge (`ACADEMIC PROGRAM • MBA`)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Program Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="Master of Business Administration"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Heading Line 1 (White Text)</label>
              <input
                type="text"
                value={heroTitleLine1}
                onChange={(e) => setHeroTitleLine1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                placeholder=" Master of Business"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Heading Line 2 (Blue Text)</label>
              <input
                type="text"
                value={heroTitleLine2}
                onChange={(e) => setHeroTitleLine2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                placeholder="Administration (MBA)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Description Paragraph</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              placeholder="Enter comprehensive hero description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Action Button Text</label>
              <input
                type="text"
                value={heroPrimaryBtnText}
                onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="EXPLORE PROGRAM"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Action Button Text</label>
              <input
                type="text"
                value={heroSecondaryBtnText}
                onChange={(e) => setHeroSecondaryBtnText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="DOWNLOAD BROCHURE"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Hero Background Image</label>
            <div className="space-y-4">
              <LogoUploader
                currentLogoUrl={heroImage}
                onUploadSuccess={(url) => setHeroImage(url)}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL directly:</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Program Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Program Overview Settings</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Overview Section Heading</label>
            <input
              type="text"
              value={overviewTitle}
              onChange={(e) => setOverviewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Overview Paragraph</label>
            <textarea
              rows={4}
              value={overviewText}
              onChange={(e) => setOverviewText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Overview Paragraph</label>
            <textarea
              rows={3}
              value={overviewSubtext}
              onChange={(e) => setOverviewSubtext(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Pill Badge Text</label>
              <input
                type="text"
                value={overviewBadgeText}
                onChange={(e) => setOverviewBadgeText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="POSTGRADUATE EXCELLENCE"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floating Image Badge Text</label>
              <input
                type="text"
                value={overviewFloatingBadgeText}
                onChange={(e) => setOverviewFloatingBadgeText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="100% Case-Study Driven"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Action Button Text</label>
              <input
                type="text"
                value={overviewPrimaryBtnText}
                onChange={(e) => setOverviewPrimaryBtnText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="Apply Now"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Action Button Text</label>
              <input
                type="text"
                value={overviewSecondaryBtnText}
                onChange={(e) => setOverviewSecondaryBtnText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                placeholder="Download Brochure"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Showcase Image (Right side)</label>
            <div className="space-y-4">
              <LogoUploader
                currentLogoUrl={overviewImage}
                onUploadSuccess={(url) => setOverviewImage(url)}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL directly:</label>
                <input
                  type="text"
                  value={overviewImage}
                  onChange={(e) => setOverviewImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700">Checklist Highlights (Left Column)</label>
              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Highlight Item
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none font-medium"
                    placeholder="Enter checkmark highlight..."
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dimensions */}
      {activeTab === 'dimensions' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">4 Core Curriculum Dimensions Cards</h2>
            <button
              type="button"
              onClick={addDimension}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow"
            >
              <Plus className="w-4 h-4" /> Add Dimension Card
            </button>
          </div>

          <div className="space-y-6">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => removeDimension(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove Dimension Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number / Step</label>
                    <input
                      type="text"
                      value={dim.number}
                      onChange={(e) => updateDimension(idx, 'number', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                      placeholder="01"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Dimension Card Title</label>
                    <input
                      type="text"
                      value={dim.title}
                      onChange={(e) => updateDimension(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Dimension Description</label>
                  <textarea
                    rows={2}
                    value={dim.description}
                    onChange={(e) => updateDimension(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-600">Curriculum Topics (Bullets)</label>
                    <button
                      type="button"
                      onClick={() => addDimensionTopic(idx)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + Add Topic Bullet
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {dim.topics && dim.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => updateDimensionTopic(idx, tIdx, e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border-none focus:ring-0 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeDimensionTopic(idx, tIdx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Key Learning Dimensions (Why Choose Pills) */}
      {activeTab === 'whyChoose' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Key Learning Dimensions Settings</h2>
            <button
              type="button"
              onClick={addPillItem}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow"
            >
              <Plus className="w-4 h-4" /> Add Dimension Pill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Badge Text</label>
              <input
                type="text"
                value={whyChoosePills.badgeText || ''}
                onChange={(e) => setWhyChoosePills({ ...whyChoosePills, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
                placeholder="e.g. LEARNING GOALS"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={whyChoosePills.title || ''}
                onChange={(e) => setWhyChoosePills({ ...whyChoosePills, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
                placeholder="e.g. Key Learning Dimensions"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Dimension Cards Grid (Max 5 recommended)</h3>
            {(whyChoosePills.items || []).map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => removePillItem(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updatePillItem(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Name</label>
                    <select
                      value={item.icon || 'Sparkles'}
                      onChange={(e) => updatePillItem(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium bg-white"
                    >
                      <option value="BookOpen">BookOpen (Management)</option>
                      <option value="Users">Users (Leadership/Team)</option>
                      <option value="Briefcase">Briefcase (Analytics/Business)</option>
                      <option value="Globe">Globe (Collaboration/Global)</option>
                      <option value="Award">Award (Innovation/Excellence)</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Trophy">Trophy</option>
                      <option value="Target">Target</option>
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Zap">Zap</option>
                      <option value="Shield">Shield</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updatePillItem(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Internship Banner */}
      {activeTab === 'internship' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Summer Internship Banner Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Badge Text</label>
              <input
                type="text"
                value={internshipBadge}
                onChange={(e) => setInternshipBadge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
                placeholder="e.g. EXPERIENTIAL LEARNING"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Title</label>
              <input
                type="text"
                value={internshipTitle}
                onChange={(e) => setInternshipTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Description</label>
            <textarea
              rows={4}
              value={internshipDesc}
              onChange={(e) => setInternshipDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={internshipBtnText}
                onChange={(e) => setInternshipBtnText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link URL</label>
              <input
                type="text"
                value={internshipBtnLink}
                onChange={(e) => setInternshipBtnLink(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Banner Background Image</label>
            <div className="space-y-4">
              <LogoUploader
                currentLogoUrl={internshipBgImage}
                onUploadSuccess={(url) => setInternshipBgImage(url)}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL directly:</label>
                <input
                  type="text"
                  value={internshipBgImage}
                  onChange={(e) => setInternshipBgImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">3 Floating Highlight Cards (Right side)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-600">Card Image #{i + 1}</label>
                  <LogoUploader
                    currentLogoUrl={(internshipImages || [])[i] || ''}
                    onUploadSuccess={(url) => updateInternshipImage(i, url)}
                  />
                  <input
                    type="text"
                    value={(internshipImages || [])[i] || ''}
                    onChange={(e) => updateInternshipImage(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                    placeholder="Image URL"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Dynamic Learning Section */}
      {activeTab === 'dynamicLearning' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Dynamic Learning Section Settings</h2>
            <button
              type="button"
              onClick={addDynamicFeature}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow"
            >
              <Plus className="w-4 h-4" /> Add Feature Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Badge Text</label>
              <input
                type="text"
                value={dynamicLearning.badgeText || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={dynamicLearning.title || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 1</label>
              <textarea
                rows={3}
                value={dynamicLearning.desc1 || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, desc1: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 2</label>
              <textarea
                rows={3}
                value={dynamicLearning.desc2 || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, desc2: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">Right Collage Images (2 images)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-600">Collage Image #{i + 1}</label>
                  <LogoUploader
                    currentLogoUrl={(dynamicLearning.images || [])[i] || ''}
                    onUploadSuccess={(url) => updateDynamicImage(i, url)}
                  />
                  <input
                    type="text"
                    value={(dynamicLearning.images || [])[i] || ''}
                    onChange={(e) => updateDynamicImage(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                    placeholder="Image URL"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Bottom Feature Cards Grid</h3>
            {(dynamicLearning.features || []).map((feat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => removeDynamicFeature(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Feature Title</label>
                    <input
                      type="text"
                      value={feat.title || ''}
                      onChange={(e) => updateDynamicFeature(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Name</label>
                    <select
                      value={feat.icon || 'Award'}
                      onChange={(e) => updateDynamicFeature(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium bg-white"
                    >
                      <option value="Users">Users</option>
                      <option value="Award">Award</option>
                      <option value="Trophy">Trophy</option>
                      <option value="Briefcase">Briefcase</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="Globe">Globe</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Target">Target</option>
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Zap">Zap</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={feat.desc || ''}
                      onChange={(e) => updateDynamicFeature(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Moments Gallery */}
      {activeTab === 'momentsGallery' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Moments Gallery Settings</h2>
            <button
              type="button"
              onClick={addGalleryItem}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow"
            >
              <Plus className="w-4 h-4" /> Add Gallery Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Badge Text</label>
              <input
                type="text"
                value={momentsGallery.badgeText || ''}
                onChange={(e) => setMomentsGallery({ ...momentsGallery, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={momentsGallery.title || ''}
                onChange={(e) => setMomentsGallery({ ...momentsGallery, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Background Image (Optional)</label>
            <div className="space-y-3 max-w-md">
              <LogoUploader
                currentLogoUrl={momentsGallery.bgImage || ''}
                onUploadSuccess={(url) => setMomentsGallery({ ...momentsGallery, bgImage: url })}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or paste background image URL directly:</label>
                <input
                  type="text"
                  value={momentsGallery.bgImage || ''}
                  onChange={(e) => setMomentsGallery({ ...momentsGallery, bgImage: e.target.value })}
                  placeholder="https://... or /assets/Images/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Gallery Items Grid</h3>
            {(momentsGallery.items || []).map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => removeGalleryItem(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Photo Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateGalleryItem(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={item.subtitle || ''}
                      onChange={(e) => updateGalleryItem(idx, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Grid Layout Size (Span)</label>
                    <select
                      value={item.span || 'col-span-1 md:col-span-2 lg:col-span-4 h-[260px] sm:h-[280px]'}
                      onChange={(e) => updateGalleryItem(idx, 'span', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                    >
                      <option value="col-span-1 md:col-span-2 lg:col-span-4 h-[260px] sm:h-[280px]">Small Card (col-span-4)</option>
                      <option value="col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]">Wide Card (col-span-6)</option>
                      <option value="col-span-1 md:col-span-2 lg:col-span-12 h-[320px]">Full Width (col-span-12)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Photo Image</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <LogoUploader
                      currentLogoUrl={item.image || ''}
                      onUploadSuccess={(url) => updateGalleryItem(idx, 'image', url)}
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL directly:</label>
                      <input
                        type="text"
                        value={item.image || ''}
                        onChange={(e) => updateGalleryItem(idx, 'image', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Academic Calendar Banner */}
      {activeTab === 'academicCalendarBanner' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Academic Calendar Banner Settings</h2>
            <p className="text-xs text-gray-500 mt-1">Configure texts, buttons, and illustration for the Academic Calendar section.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Badge Text</label>
              <input
                type="text"
                value={academicCalendarBanner.badgeText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title</label>
              <input
                type="text"
                value={academicCalendarBanner.title || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={academicCalendarBanner.description || ''}
              onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">View Button Text</label>
              <input
                type="text"
                value={academicCalendarBanner.viewBtnText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, viewBtnText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">View Button URL / File Path</label>
              <input
                type="text"
                value={academicCalendarBanner.viewBtnUrl || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, viewBtnUrl: e.target.value })}
                placeholder="/assets/Images/image 64.png or https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Download Button Text</label>
              <input
                type="text"
                value={academicCalendarBanner.downloadBtnText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, downloadBtnText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Download Button URL / File Path</label>
              <input
                type="text"
                value={academicCalendarBanner.downloadBtnUrl || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, downloadBtnUrl: e.target.value })}
                placeholder="/assets/Images/image 64.png or https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Right Side Illustration Image</label>
            <div className="space-y-3 max-w-md">
              <LogoUploader
                currentLogoUrl={academicCalendarBanner.image || ''}
                onUploadSuccess={(url) => setAcademicCalendarBanner({ ...academicCalendarBanner, image: url })}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL directly:</label>
                <input
                  type="text"
                  value={academicCalendarBanner.image || ''}
                  onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, image: e.target.value })}
                  placeholder="/assets/Images/image 64.png or https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111836] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Interactive Schedule & Key Milestones
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage timeline events displayed when visitors click "View Calendar" on the program page.</p>
              </div>
              <button
                type="button"
                onClick={addCalendarEvent}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Schedule Event
              </button>
            </div>

            <div className="space-y-4">
              {(academicCalendarBanner.events || []).map((ev, idx) => (
                <div key={ev.id || idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-4 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveCalendarEvent(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 bg-white border rounded text-gray-400 hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCalendarEvent(idx, 1)}
                      disabled={idx === (academicCalendarBanner.events || []).length - 1}
                      className="p-1.5 bg-white border rounded text-gray-400 hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCalendarEvent(idx)}
                      className="p-1.5 bg-white border rounded text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                      title="Remove Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-24">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={ev.title || ''}
                        onChange={(e) => updateCalendarEvent(idx, 'title', e.target.value)}
                        placeholder="e.g. Orientation & Leadership Summit"
                        className="w-full px-3 py-2 rounded-lg border bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Date Range</label>
                      <input
                        type="text"
                        value={ev.date || ''}
                        onChange={(e) => updateCalendarEvent(idx, 'date', e.target.value)}
                        placeholder="e.g. July 15 - July 18, 2026"
                        className="w-full px-3 py-2 rounded-lg border bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Semester / Term</label>
                      <select
                        value={ev.semester || 'Trimester 1'}
                        onChange={(e) => updateCalendarEvent(idx, 'semester', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-white text-xs font-semibold"
                      >
                        <option value="Trimester 1">Trimester 1</option>
                        <option value="Trimester 2">Trimester 2</option>
                        <option value="Trimester 3">Trimester 3</option>
                        <option value="Key Events">Key Events</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                      <select
                        value={ev.category || 'Leadership & Events'}
                        onChange={(e) => updateCalendarEvent(idx, 'category', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-white text-xs font-semibold"
                      >
                        <option value="Leadership & Events">Leadership & Events</option>
                        <option value="Exams & Assessments">Exams & Assessments</option>
                        <option value="Industrial Visits">Industrial Visits</option>
                        <option value="Term Breaks & Holidays">Term Breaks & Holidays</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Brief Description</label>
                      <input
                        type="text"
                        value={ev.description || ''}
                        onChange={(e) => updateCalendarEvent(idx, 'description', e.target.value)}
                        placeholder="e.g. Inaugural session and guest keynotes."
                        className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(academicCalendarBanner.events || []).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-xl">
                  No schedule events added. Click "Add Schedule Event" to create one, or default timeline will be shown.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Admission & Eligibility */}
      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Admission Steps & Eligibility Cards</h2>
            <button
              type="button"
              onClick={addEligibilityStep}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow"
            >
              <Plus className="w-4 h-4" /> Add Eligibility Card
            </button>
          </div>

          <div className="space-y-6">
            {eligibility.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => removeEligibilityStep(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Step Number</label>
                    <input
                      type="text"
                      value={item.step}
                      onChange={(e) => updateEligibilityStep(idx, 'step', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Step Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateEligibilityStep(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Step Summary Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateEligibilityStep(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-600">Specific Requirements (Checkmarks)</label>
                    <button
                      type="button"
                      onClick={() => addEligibilityBullet(idx)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + Add Requirement
                    </button>
                  </div>
                  <div className="space-y-2">
                    {item.bullets && item.bullets.map((bul, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200">
                        <input
                          type="text"
                          value={bul}
                          onChange={(e) => updateEligibilityBullet(idx, bIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border-none focus:ring-0 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeEligibilityBullet(idx, bIdx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Top Recruiters & Corporate Partners */}
      {activeTab === 'topRecruiters' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-[#111836]">Top Recruiters & Corporate Partners</h2>
            <p className="text-xs text-gray-500 mt-1">Manage corporate logos, placement categories, CTC highlights, and partner links displayed at the bottom of the {shortTitle} Program Page.</p>
          </div>
          <div className="pt-2">
            <ManageRecruiters />
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-t-2xl shadow-lg border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-base">{pageName} Live Preview</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Real-time</span>
            </div>

            {/* Viewport switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'tablet' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 font-semibold hover:underline px-3 py-1.5 rounded-lg bg-blue-50"
              >
                Open in New Tab ↗
              </a>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
            <div
              className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${previewDevice === 'desktop'
                ? 'w-full h-full rounded-none'
                : previewDevice === 'tablet'
                  ? 'w-[768px] h-[90%] rounded-3xl border-[12px] border-gray-800'
                  : 'w-[375px] h-[90%] rounded-[3rem] border-[14px] border-gray-800 shadow-2xl'
                }`}
            >
              <iframe
                src={liveUrl}
                title="Live Program Page Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMbaPage;
