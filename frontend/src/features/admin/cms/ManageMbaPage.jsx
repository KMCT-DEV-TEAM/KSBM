"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Plus, Trash2, GraduationCap, FileText, BookOpen, Briefcase, Award, Eye, Monitor, Tablet, Smartphone, X, RotateCcw, ChevronLeft, ChevronRight, Calendar, ArrowUp, ArrowDown, GripVertical, Edit2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import LogoUploader from './components/LogoUploader';
import ManageRecruiters from './ManageRecruiters';
import PageHeader from './components/PageHeader';
import AddItemModal from './components/AddItemModal';

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



const TabSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 w-full animate-pulse">
    <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-md w-full"></div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-md w-full"></div>
      </div>
    </div>
  </div>
);

const CharCountLabel = ({ label, value, max }) => (
  <div className="flex justify-between items-center mb-1.5">
    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">{label}</label>
    <span className={`text-[9px] font-medium ${value?.length >= max ? 'text-red-500' : value?.length > max * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
      {value?.length || 0} / {max}
    </span>
  </div>
);

const extractImageUrls = (obj, urls = []) => {
  if (!obj) return urls;
  if (typeof obj === 'string') {
    if (obj.startsWith('/assets/Images/') || obj.startsWith('/uploads/')) {
      if (!urls.includes(obj)) urls.push(obj);
    }
    return urls;
  }
  if (Array.isArray(obj)) {
    obj.forEach(item => extractImageUrls(item, urls));
    return urls;
  }
  if (typeof obj === 'object') {
    Object.values(obj).forEach(val => extractImageUrls(val, urls));
    return urls;
  }
  return urls;
};

const processDeferredUploads = async (obj, apiInstance) => {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('blob:')) {
      try {
        const res = await fetch(obj);
        const blob = await res.blob();
        const file = new File([blob], 'upload.png', { type: blob.type });
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await apiInstance.post('/upload/mba', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          hideLoader: true
        });
        return uploadRes.data.url;
      } catch (err) {
        console.error("Failed to upload deferred image", obj, err);
        return obj;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await processDeferredUploads(item, apiInstance));
    }
    return newArr;
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await processDeferredUploads(obj[key], apiInstance);
    }
    return newObj;
  }
  return obj;
};

const ManageMbaPage = ({ isBba = false }) => {
  const endpoint = isBba ? '/cms/bba-page' : '/cms/mba-page';
  const pageName = isBba ? 'BBA Program Page' : 'Page';
  const liveUrl = isBba ? '/programs/bba' : '/programs/mba';

  const [activeTab, setActiveTab] = useState('hero');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', fields: [], onSave: () => {} });
  const [isLoading, setIsLoading] = useState(true);
  const tabsContainerRef = useRef(null);
  const originalImagesRef = useRef([]);
  const [isSaving, setIsSaving] = useState(false);

  // Preview Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const iframeRef = useRef(null);

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
    '/assets/Images/mba/internship_2.png',
    '/assets/Images/mba/internship_27.png',
    '/assets/Images/mba/internship_28.png'
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
    images: ['/assets/Images/mba/dynamic_49.png', '/assets/Images/mba/dynamic_60.png'],
    features: []
  });

  const [momentsGallery, setMomentsGallery] = useState({
    badgeText: 'GALLERY',
    title: 'Moments Captured in Trip',
    bgImage: '',
    items: []
  });
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState(null);
  const [draggedPillIndex, setDraggedPillIndex] = useState(null);
  const [draggedDynamicIndex, setDraggedDynamicIndex] = useState(null);

  const [academicCalendarBanner, setAcademicCalendarBanner] = useState({
    badgeText: 'ACADEMIC SCHEDULE 2026-27',
    title: 'Download the Official Academic Calendar',
    description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
    viewBtnText: 'View Calendar',
    viewBtnUrl: '/assets/Images/mba/calendar_64.png',
    downloadBtnText: 'Download Calendar',
    downloadBtnUrl: '/assets/Images/mba/calendar_64.png',
    image: '/assets/Images/mba/calendar_64.png',
    events: defaultCalendarEvents
  });

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const currentDraftData = {
    shortTitle, title, description, heroImage,
    heroTitleLine1, heroTitleLine2, heroPrimaryBtnText, heroSecondaryBtnText,
    heroCardTitle, heroCardStat1Title, heroCardStat1Sub, heroCardStat2Title, heroCardStat2Sub,
    overviewTitle, overviewText, overviewSubtext, overviewImage,
    overviewBadgeText, overviewFloatingBadgeText, overviewPrimaryBtnText, overviewSecondaryBtnText,
    highlights,
    dimensions,
    whyChoosePills: {
      badgeText: whyChoosePills.badgeText,
      title: whyChoosePills.title,
      items: whyChoosePills.items
    },
    internshipBanner: {
      internshipBgImage,
      internshipTitle,
      internshipDesc,
      internshipBadge,
      internshipBtnText,
      internshipBtnLink,
      internshipImages
    },
    dynamicLearning: {
      badgeText: dynamicLearning.badgeText,
      title: dynamicLearning.title,
      desc1: dynamicLearning.desc1,
      desc2: dynamicLearning.desc2,
      images: dynamicLearning.images,
      features: dynamicLearning.features
    },
    gallery: {
      badgeText: momentsGallery.badgeText,
      title: momentsGallery.title,
      bgImage: momentsGallery.bgImage,
      items: momentsGallery.items
    },
    academicCalendarBanner: {
      badgeText: academicCalendarBanner.badgeText,
      title: academicCalendarBanner.title,
      description: academicCalendarBanner.description,
      viewBtnText: academicCalendarBanner.viewBtnText,
      viewBtnUrl: academicCalendarBanner.viewBtnUrl,
      downloadBtnText: academicCalendarBanner.downloadBtnText,
      downloadBtnUrl: academicCalendarBanner.downloadBtnUrl,
      image: academicCalendarBanner.image,
      events: academicCalendarBanner.events
    },
    eligibility
  };

  // Live Preview Data Poster
  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: currentDraftData }, '*');
    }
  }, [isPreviewModalOpen, currentDraftData]);

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
        '/assets/Images/mba/internship_2.png',
        '/assets/Images/mba/internship_27.png',
        '/assets/Images/mba/internship_28.png'
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
        images: ['/assets/Images/mba/dynamic_49.png', '/assets/Images/mba/dynamic_60.png'],
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
          { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/mba/gallery_67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
          { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/mba/internship_27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/mba/internship_28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
          { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/mba/internship_2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
          { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/mba/gallery_58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
        ]
      });

      setAcademicCalendarBanner({
        ...(data.academicCalendarBanner || {}),
        badgeText: data.academicCalendarBanner?.badgeText || 'ACADEMIC SCHEDULE 2026-27',
        title: data.academicCalendarBanner?.title || 'Download the Official Academic Calendar',
        description: data.academicCalendarBanner?.description || 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
        viewBtnText: data.academicCalendarBanner?.viewBtnText || 'View Calendar',
        viewBtnUrl: data.academicCalendarBanner?.viewBtnUrl || '/assets/Images/mba/calendar_64.png',
        downloadBtnText: data.academicCalendarBanner?.downloadBtnText || 'Download Calendar',
        downloadBtnUrl: data.academicCalendarBanner?.downloadBtnUrl || '/assets/Images/mba/calendar_64.png',
        image: data.academicCalendarBanner?.image || '/assets/Images/mba/calendar_64.png',
        events: (data.academicCalendarBanner?.events && data.academicCalendarBanner.events.length > 0)
          ? data.academicCalendarBanner.events
          : defaultCalendarEvents
      });
        
      // Track original images for deletion later
      originalImagesRef.current = extractImageUrls(data);
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
          const rawPayload = {
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
          };
          
          const processedPayload = await processDeferredUploads(rawPayload, api);
          
          await api.put(endpoint, processedPayload);
          
          const newImages = extractImageUrls(processedPayload);
          const deletedUrls = originalImagesRef.current.filter(url => !newImages.includes(url));
          
          for (const url of deletedUrls) {
            try {
              await api.delete('/upload', { data: { fileUrl: url }, hideLoader: true });
            } catch (err) {
              console.error('Failed to delete orphaned image:', url, err);
            }
          }
          
          originalImagesRef.current = newImages; // Update tracked images
          
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
          setHeroImage('/assets/Images/mba/mba_hero_bg.png');
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
          setOverviewImage('/assets/Images/mba/mba_main.png');
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
          setHeroImage('/assets/Images/mba/mba_hero_bg.png');
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
          setOverviewImage('/assets/Images/mba/mba_main.png');
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
          '/assets/Images/mba/internship_2.png',
          '/assets/Images/mba/internship_27.png',
          '/assets/Images/mba/internship_28.png'
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
          images: ['/assets/Images/mba/dynamic_49.png', '/assets/Images/mba/dynamic_60.png'],
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
            { title: 'Industrial Visit 2025', subtitle: 'Corporate Tour & Leadership Insights', image: '/assets/Images/mba/gallery_67.png', span: 'col-span-1 md:col-span-2 lg:col-span-4 h-[340px]' },
            { title: 'Leadership Camp', subtitle: 'Outbound Team Building', image: '/assets/Images/mba/internship_27.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
            { title: 'Outbound Learning', subtitle: 'Nature & Strategic Reflection', image: '/assets/Images/mba/internship_28.png', span: 'col-span-1 md:col-span-1 lg:col-span-4 h-[340px]' },
            { title: 'Global Immersion', subtitle: 'Cross-Cultural Case Discussions', image: '/assets/Images/mba/internship_2.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' },
            { title: 'Corporate Night Tour', subtitle: 'Metropolitan Industry Networking', image: '/assets/Images/mba/gallery_58.png', span: 'col-span-1 md:col-span-2 lg:col-span-6 h-[340px]' }
          ]
        });
        setAcademicCalendarBanner({
          badgeText: 'ACADEMIC SCHEDULE 2026-27',
          title: 'Download the Official Academic Calendar',
          description: 'Stay fully updated with semester schedules, examination dates, key leadership events, industrial tours, and term breaks for the upcoming academic year.',
          viewBtnText: 'View Calendar',
          viewBtnUrl: '/assets/Images/mba/calendar_64.png',
          downloadBtnText: 'Download Calendar',
          downloadBtnUrl: '/assets/Images/mba/calendar_64.png',
          image: '/assets/Images/mba/calendar_64.png'
        });
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save Changes to confirm.' });
      }
    });
  };

  // Highlights helpers
  const addHighlight = () => {
    openAddModal(
      'Add Highlight Item',
      [{ name: 'text', label: 'Highlight Text', type: 'text', maxLength: 100, required: true, placeholder: 'New highlight item' }],
      (data) => setHighlights([...highlights, data.text])
    );
  };
  const updateHighlight = (index, val) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };
  const removeHighlight = (index) => confirmAction({ title: 'Remove Highlight', message: 'Are you sure you want to remove this highlight?', confirmText: 'Yes, remove', variant: 'danger', action: () => setHighlights(highlights.filter((_, i) => i !== index)) });

  // Dimensions helpers
  const addDimension = () => {
    openAddModal(
      'Add New Dimension',
      [
        { name: 'title', label: 'Dimension Title', type: 'text', maxLength: 100, required: true },
        { name: 'description', label: 'Dimension Description', type: 'textarea', maxLength: 200, required: true }
      ],
      (data) => {
        setDimensions([
          ...dimensions,
          {
            number: `0${dimensions.length + 1}`,
            title: data.title,
            description: data.description,
            topics: []
          }
        ]);
      }
    );
  };
  const updateDimension = (index, field, val) => {
    const updated = [...dimensions];
    updated[index][field] = val;
    setDimensions(updated);
  };
  const removeDimension = (index) => confirmAction({ title: 'Remove Dimension', message: 'Are you sure you want to remove this dimension card?', confirmText: 'Yes, remove', variant: 'danger', action: () => setDimensions(dimensions.filter((_, i) => i !== index)) });

  const addDimensionTopic = (dimIdx) => {
    openAddModal(
      'Add Dimension Topic',
      [{ name: 'text', label: 'Topic Name', type: 'text', maxLength: 100, required: true }],
      (data) => {
        const updated = [...dimensions];
        updated[dimIdx].topics.push(data.text);
        setDimensions(updated);
      }
    );
  };
  const updateDimensionTopic = (dimIdx, topIdx, val) => {
    const updated = [...dimensions];
    updated[dimIdx].topics[topIdx] = val;
    setDimensions(updated);
  };
  const removeDimensionTopic = (dimIdx, topIdx) => confirmAction({ title: 'Remove Topic', message: 'Are you sure you want to remove this topic bullet?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updated = [...dimensions]; updated[dimIdx].topics = updated[dimIdx].topics.filter((_, i) => i !== topIdx); setDimensions(updated); }});

  // Eligibility helpers
  const addEligibilityStep = () => {
    openAddModal(
      'Add Admission Step',
      [
        { name: 'title', label: 'Step Title', type: 'text', maxLength: 100, required: true },
        { name: 'description', label: 'Step Description', type: 'textarea', maxLength: 200, required: true }
      ],
      (data) => {
        setEligibility([
          ...eligibility,
          {
            step: `0${eligibility.length + 1}`,
            title: data.title,
            description: data.description,
            bullets: []
          }
        ]);
      }
    );
  };
  const updateEligibilityStep = (index, field, val) => {
    const updated = [...eligibility];
    updated[index][field] = val;
    setEligibility(updated);
  };
  const removeEligibilityStep = (index) => confirmAction({ title: 'Remove Eligibility Step', message: 'Are you sure you want to remove this eligibility card?', confirmText: 'Yes, remove', variant: 'danger', action: () => setEligibility(eligibility.filter((_, i) => i !== index)) });

  const addEligibilityBullet = (stepIdx) => {
    openAddModal(
      'Add Requirement Bullet',
      [{ name: 'text', label: 'Requirement Details', type: 'textarea', maxLength: 200, required: true }],
      (data) => {
        const updated = [...eligibility];
        updated[stepIdx].bullets.push(data.text);
        setEligibility(updated);
      }
    );
  };
  const updateEligibilityBullet = (stepIdx, bulIdx, val) => {
    const updated = [...eligibility];
    updated[stepIdx].bullets[bulIdx] = val;
    setEligibility(updated);
  };
  const removeEligibilityBullet = (stepIdx, bulIdx) => confirmAction({ title: 'Remove Requirement', message: 'Are you sure you want to remove this requirement bullet?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updated = [...eligibility]; updated[stepIdx].bullets = updated[stepIdx].bullets.filter((_, i) => i !== bulIdx); setEligibility(updated); }});

  // WhyChoosePills helpers
  const addPillItem = () => {
    openAddModal(
      'Add Dimension Pill',
      [
        { name: 'title', label: 'Title', type: 'text', maxLength: 100, required: true },
        { name: 'description', label: 'Description', type: 'textarea', maxLength: 200, required: true }
      ],
      (data) => {
        const updatedItems = [...(whyChoosePills.items || []), { title: data.title, description: data.description, icon: 'BookOpen' }];
        setWhyChoosePills({ ...whyChoosePills, items: updatedItems });
      }
    );
  };
  const updatePillItem = (idx, field, val) => {
    const updatedItems = [...(whyChoosePills.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], [field]: val };
    setWhyChoosePills({ ...whyChoosePills, items: updatedItems });
  };
  const removePillItem = (idx) => confirmAction({ title: 'Remove Pill', message: 'Are you sure you want to remove this dimension pill?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updatedItems = (whyChoosePills.items || []).filter((_, i) => i !== idx); setWhyChoosePills({ ...whyChoosePills, items: updatedItems }); }});

  // WhyChoosePills drag-and-drop handlers
  const handlePillDragStart = (e, index) => {
    setDraggedPillIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };
  const handlePillDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handlePillDrop = (e, targetIndex) => {
    e.preventDefault();
    if (e.target) e.target.style.opacity = '1';
    if (draggedPillIndex === null || draggedPillIndex === targetIndex) return;
    const items = [...(whyChoosePills.items || [])];
    const draggedItem = items[draggedPillIndex];
    items.splice(draggedPillIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    setWhyChoosePills({ ...whyChoosePills, items });
    setDraggedPillIndex(null);
  };
  const handlePillDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedPillIndex(null);
  };

  // Academic Calendar Events helpers
  const addCalendarEvent = () => {
    openAddModal(
      'Add Calendar Event',
      [
        { name: 'title', label: 'Event Title', type: 'text', maxLength: 100, required: true },
        { name: 'date', label: 'Date', type: 'text', maxLength: 100, required: true, placeholder: 'e.g. November 15, 2026' },
        { name: 'semester', label: 'Semester / Term', type: 'text', maxLength: 50, required: true, placeholder: 'e.g. Trimester 1' },
        { name: 'category', label: 'Category', type: 'text', maxLength: 50, required: true, placeholder: 'e.g. Exams & Assessments' },
        { name: 'description', label: 'Description', type: 'textarea', maxLength: 200, required: true }
      ],
      (data) => {
        setAcademicCalendarBanner({
          ...academicCalendarBanner,
          events: [
            ...(academicCalendarBanner.events || []),
            {
              id: Date.now().toString(),
              title: data.title,
              date: data.date,
              semester: data.semester,
              category: data.category,
              description: data.description
            }
          ]
        });
      }
    );
  };
  const updateCalendarEvent = (idx, field, val) => {
    const updated = [...(academicCalendarBanner.events || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setAcademicCalendarBanner({ ...academicCalendarBanner, events: updated });
  };
  const removeCalendarEvent = (idx) => confirmAction({ title: 'Remove Event', message: 'Are you sure you want to remove this calendar event?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updated = (academicCalendarBanner.events || []).filter((_, i) => i !== idx); setAcademicCalendarBanner({ ...academicCalendarBanner, events: updated }); }});
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
    openAddModal(
      'Add Feature Card',
      [
        { name: 'title', label: 'Feature Title', type: 'text', maxLength: 100, required: true },
        { name: 'desc', label: 'Feature Description', type: 'textarea', maxLength: 250, required: true },
        { name: 'icon', label: 'Icon Name (lucide-react)', type: 'text', maxLength: 50, defaultValue: 'Award' }
      ],
      (data) => {
        const updatedFeatures = [...(dynamicLearning.features || []), { title: data.title, desc: data.desc, icon: data.icon || 'Award' }];
        setDynamicLearning({ ...dynamicLearning, features: updatedFeatures });
      }
    );
  };
  const updateDynamicFeature = (idx, field, val) => {
    const updatedFeatures = [...(dynamicLearning.features || [])];
    updatedFeatures[idx] = { ...updatedFeatures[idx], [field]: val };
    setDynamicLearning({ ...dynamicLearning, features: updatedFeatures });
  };
  const removeDynamicFeature = (idx) => confirmAction({ title: 'Remove Feature', message: 'Are you sure you want to remove this feature card?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updatedFeatures = (dynamicLearning.features || []).filter((_, i) => i !== idx); setDynamicLearning({ ...dynamicLearning, features: updatedFeatures }); }});

  // DynamicLearning drag-and-drop handlers
  const handleDynamicDragStart = (e, index) => {
    setDraggedDynamicIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };
  const handleDynamicDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDynamicDrop = (e, targetIndex) => {
    e.preventDefault();
    if (e.target) e.target.style.opacity = '1';
    if (draggedDynamicIndex === null || draggedDynamicIndex === targetIndex) return;
    const features = [...(dynamicLearning.features || [])];
    const draggedItem = features[draggedDynamicIndex];
    features.splice(draggedDynamicIndex, 1);
    features.splice(targetIndex, 0, draggedItem);
    setDynamicLearning({ ...dynamicLearning, features });
    setDraggedDynamicIndex(null);
  };
  const handleDynamicDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedDynamicIndex(null);
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
    openAddModal(
      'Add Gallery Photo',
      [
        { name: 'title', label: 'Photo Title', type: 'text', maxLength: 60, required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 60, required: true },
        { name: 'image', label: 'Upload Photo', type: 'image', required: true }
      ],
      (data) => {
        const span = defaultSpans[(momentsGallery.items || []).length % defaultSpans.length];
        setMomentsGallery({
          ...momentsGallery,
          items: [
            ...(momentsGallery.items || []),
            { title: data.title, subtitle: data.subtitle, image: data.image, span }
          ]
        });
      }
    );
  };
  const updateGalleryItem = (idx, field, val) => {
    const updatedItems = [...(momentsGallery.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], [field]: val };
    setMomentsGallery({ ...momentsGallery, items: updatedItems });
  };
  const removeGalleryItem = (idx) => confirmAction({ title: 'Remove Gallery Item', message: 'Are you sure you want to remove this gallery photo?', confirmText: 'Yes, remove', variant: 'danger', action: () => { const updatedItems = (momentsGallery.items || []).filter((_, i) => i !== idx); setMomentsGallery({ ...momentsGallery, items: updatedItems }); }});

  const handleGalleryDragStart = (e, index) => {
    setDraggedGalleryIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };
  const handleGalleryDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleGalleryDrop = (e, targetIndex) => {
    e.preventDefault();
    if (e.target) e.target.style.opacity = '1';
    if (draggedGalleryIndex === null || draggedGalleryIndex === targetIndex) return;

    const items = [...(momentsGallery.items || [])];
    const draggedItem = items[draggedGalleryIndex];
    items.splice(draggedGalleryIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    
    setMomentsGallery({ ...momentsGallery, items });
    setDraggedGalleryIndex(null);
  };
  const handleGalleryDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedGalleryIndex(null);
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

  
  
  const openAddModal = (title, fields, onSaveCallback) => {
    setModalConfig({
      isOpen: true,
      title,
      fields,
      onSave: (data) => {
        onSaveCallback(data);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      initialData: null
    });
  };
  
  const openEditModal = (title, fields, initialData, onSaveCallback) => {
    setModalConfig({
      isOpen: true,
      title,
      fields,
      onSave: (data) => {
        onSaveCallback(data);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      initialData
    });
  };
  
  const handleTabClick = (tabId) => {
    if (activeTab === tabId) return;
    setIsTabLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
  };
  
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-[#566A7F] hover:bg-gray-100 hover:text-primary transition-all shadow-sm focus:outline-none"
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
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
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
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-[#566A7F] hover:bg-gray-100 hover:text-primary transition-all shadow-sm focus:outline-none"
          title="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <PageHeader
        title={`${pageName} CMS`}
        description="Manage titles, banner images, curriculum highlights, overview details, and eligibility criteria."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />



      {isTabLoading ? <TabSkeleton /> : (
        <>
        {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-primary border-b pb-2">Hero Banner Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Short Badge Title" value={shortTitle} max={60} />
                <input maxLength={60} 
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="MBA"
              />
              <p className="text-xs text-gray-400 mt-1">Appears inside the top pill badge (`ACADEMIC PROGRAM • MBA`)</p>
            </div>
            <div>
              <CharCountLabel label="Full Program Title" value={title} max={60} />
                <input maxLength={60} 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Master of Business Administration"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
            <div>
              <CharCountLabel label="Hero Heading Line 1 (White Text)" value={heroTitleLine1} max={50} />
                <input maxLength={50} 
                type="text"
                value={heroTitleLine1}
                onChange={(e) => setHeroTitleLine1(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder=" Master of Business"
              />
            </div>
            <div>
              <CharCountLabel label="Hero Heading Line 2 (Blue Text)" value={heroTitleLine2} max={50} />
                <input maxLength={50} 
                type="text"
                value={heroTitleLine2}
                onChange={(e) => setHeroTitleLine2(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Administration (MBA)"
              />
            </div>
          </div>

          <div>
            <CharCountLabel label="Hero Description Paragraph" value={description} max={400} />
                <textarea maxLength={400} 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter comprehensive hero description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <CharCountLabel label="Primary Action Button Text" value={heroPrimaryBtnText} max={30} />
                <input maxLength={30} 
                type="text"
                value={heroPrimaryBtnText}
                onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="EXPLORE PROGRAM"
              />
            </div>
            <div>
              <CharCountLabel label="Secondary Action Button Text" value={heroSecondaryBtnText} max={30} />
                <input maxLength={30} 
                type="text"
                value={heroSecondaryBtnText}
                onChange={(e) => setHeroSecondaryBtnText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="DOWNLOAD BROCHURE"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Hero Background Image</label>
            <div className="space-y-4">
              <LogoUploader deferredMode={true}
                uploadEndpoint="/upload/mba"
                currentLogoUrl={heroImage}
                defaultImage="/assets/Images/mba/mba_hero_bg.png"
                onUploadSuccess={(url) => setHeroImage(url)}
              />
              <div>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Program Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-primary border-b pb-2">Program Overview Settings</h2>

          <div>
            <CharCountLabel label="Overview Section Heading" value={overviewTitle} max={100} />
                <input maxLength={100} 
              type="text"
              value={overviewTitle}
              onChange={(e) => setOverviewTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <CharCountLabel label="Primary Overview Paragraph" value={overviewText} max={400} />
                <textarea maxLength={400} 
              rows={4}
              value={overviewText}
              onChange={(e) => setOverviewText(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <CharCountLabel label="Secondary Overview Paragraph" value={overviewSubtext} max={400} />
                <textarea maxLength={400} 
              rows={3}
              value={overviewSubtext}
              onChange={(e) => setOverviewSubtext(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <CharCountLabel label="Top Pill Badge Text" value={overviewBadgeText} max={50} />
                <input maxLength={50} 
                type="text"
                value={overviewBadgeText}
                onChange={(e) => setOverviewBadgeText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="POSTGRADUATE EXCELLENCE"
              />
            </div>
            <div>
              <CharCountLabel label="Floating Image Badge Text" value={overviewFloatingBadgeText} max={50} />
                <input maxLength={50} 
                type="text"
                value={overviewFloatingBadgeText}
                onChange={(e) => setOverviewFloatingBadgeText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="100% Case-Study Driven"
              />
            </div>
            <div>
              <CharCountLabel label="Primary Action Button Text" value={overviewPrimaryBtnText} max={30} />
                <input maxLength={30} 
                type="text"
                value={overviewPrimaryBtnText}
                onChange={(e) => setOverviewPrimaryBtnText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Apply Now"
              />
            </div>
            <div>
              <CharCountLabel label="Secondary Action Button Text" value={overviewSecondaryBtnText} max={30} />
                <input maxLength={30} 
                type="text"
                value={overviewSecondaryBtnText}
                onChange={(e) => setOverviewSecondaryBtnText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Download Brochure"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Showcase Image (Right side)</label>
            <div className="space-y-4">
              <LogoUploader deferredMode={true}
                uploadEndpoint="/upload/mba"
                currentLogoUrl={overviewImage}
                defaultImage="/assets/Images/mba/mba_main.png"
                onUploadSuccess={(url) => setOverviewImage(url)}
              />
              <div>
                
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Checklist Highlights (Left Column)</label>
              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
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
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            <h2 className="text-lg font-bold text-primary">4 Core Curriculum Dimensions Cards</h2>
            <button
              type="button"
              onClick={addDimension}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Dimension Card
            </button>
          </div>

          <div className="space-y-6">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm flex flex-col">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(
                        'Edit Dimension Card',
                        [
                          { name: 'number', label: 'Card Number / Step', type: 'text', maxLength: 10, required: true },
                          { name: 'title', label: 'Dimension Card Title', type: 'text', maxLength: 60, required: true },
                          { name: 'description', label: 'Dimension Description', type: 'textarea', maxLength: 300, required: true },
                          { name: 'topicsText', label: 'Topics (Comma Separated)', type: 'textarea', maxLength: 500, placeholder: 'e.g. Finance, Marketing, Leadership' }
                        ],
                        { ...dim, topicsText: dim.topics?.join(', ') || '' },
                        (data) => {
                          const updated = [...dimensions];
                          const topicsArray = (data.topicsText || '').split(',').map(t => t.trim()).filter(Boolean);
                          updated[idx] = { number: data.number, title: data.title, description: data.description, topics: topicsArray };
                          setDimensions(updated);
                        }
                      );
                    }}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDimension(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-4 pr-20">
                  <div className="text-3xl font-black text-gray-200">{dim.number || '00'}</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-800">{dim.title || 'Untitled'}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{dim.description || 'No description provided.'}</p>
                    
                    {dim.topics && dim.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {dim.topics.map((t, i) => (
                          <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
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
            <h2 className="text-lg font-bold text-primary">Key Learning Dimensions Settings</h2>
            <button
              type="button"
              onClick={addPillItem}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Dimension Pill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Top Badge Text" value={whyChoosePills.badgeText || ''} max={50} />
                <input maxLength={50} 
                type="text"
                value={whyChoosePills.badgeText || ''}
                onChange={(e) => setWhyChoosePills({ ...whyChoosePills, badgeText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. LEARNING GOALS"
              />
            </div>
            <div>
              <CharCountLabel label="Section Title" value={whyChoosePills.title || ''} max={60} />
                <input maxLength={60} 
                type="text"
                value={whyChoosePills.title || ''}
                onChange={(e) => setWhyChoosePills({ ...whyChoosePills, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Key Learning Dimensions"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#566A7F]">Dimension Cards Grid (Max 5 recommended)</h3>
            {(whyChoosePills.items || []).map((item, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handlePillDragStart(e, idx)}
                onDragOver={handlePillDragOver}
                onDrop={(e) => handlePillDrop(e, idx)}
                onDragEnd={handlePillDragEnd}
                className={`p-5 rounded-2xl bg-gray-50/80 border ${draggedPillIndex === idx ? 'border-primary shadow-lg scale-[1.02]' : 'border-gray-200'} relative space-y-4 shadow-sm transition-all duration-200`}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(
                        'Edit Dimension Pill',
                        [
                          { name: 'title', label: 'Dimension Title', type: 'text', maxLength: 100, required: true },
                          { name: 'description', label: 'Description', type: 'textarea', maxLength: 300, required: true },
                          { 
                            name: 'icon', 
                            label: 'Icon Name', 
                            type: 'select', 
                            required: true, 
                            options: [
                              { value: 'BookOpen', label: 'BookOpen (Management)' },
                              { value: 'Users', label: 'Users (Leadership/Team)' },
                              { value: 'Briefcase', label: 'Briefcase (Analytics/Business)' },
                              { value: 'Globe', label: 'Globe (Collaboration/Global)' },
                              { value: 'Award', label: 'Award (Innovation/Excellence)' },
                              { value: 'Sparkles', label: 'Sparkles' },
                              { value: 'Trophy', label: 'Trophy' },
                              { value: 'Target', label: 'Target' },
                              { value: 'TrendingUp', label: 'TrendingUp' },
                              { value: 'Zap', label: 'Zap' },
                              { value: 'Shield', label: 'Shield' },
                              { value: 'Heart', label: 'Heart' }
                            ]
                          }
                        ],
                        item,
                        (data) => {
                          const updatedItems = [...(whyChoosePills.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], ...data };
                          setWhyChoosePills({ ...whyChoosePills, items: updatedItems });
                        }
                      );
                    }}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePillItem(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-3 pr-20">
                  <div className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 cursor-move" title="Drag to reorder">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1 pl-6">
                  <h4 className="text-sm font-bold text-gray-800">{item.title || 'Untitled Dimension'}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description || 'No description provided.'}</p>
                  <div className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block mt-2 text-gray-400 self-start">
                    Icon: {item.icon || 'Sparkles'}
                  </div>
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
          <h2 className="text-lg font-bold text-primary border-b pb-2">Summer Internship Banner Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Top Badge Text" value={internshipBadge} max={50} />
                <input maxLength={50} 
                type="text"
                value={internshipBadge}
                onChange={(e) => setInternshipBadge(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. EXPERIENTIAL LEARNING"
              />
            </div>
            <div>
              <CharCountLabel label="Banner Title" value={internshipTitle} max={60} />
                <input maxLength={60} 
                type="text"
                value={internshipTitle}
                onChange={(e) => setInternshipTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <CharCountLabel label="Banner Description" value={internshipDesc} max={300} />
                <textarea maxLength={300} 
              rows={4}
              value={internshipDesc}
              onChange={(e) => setInternshipDesc(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <CharCountLabel label="Button Text" value={internshipBtnText} max={30} />
                <input maxLength={30} 
                type="text"
                value={internshipBtnText}
                onChange={(e) => setInternshipBtnText(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Button Link URL" value={internshipBtnLink} max={30} />
                <input maxLength={30} 
                type="text"
                value={internshipBtnLink}
                onChange={(e) => setInternshipBtnLink(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Banner Background Image</label>
            <div className="space-y-4">
              <LogoUploader deferredMode={true}
                uploadEndpoint="/upload/mba"
                currentLogoUrl={internshipBgImage}
                defaultImage="/assets/Images/mba/internship_bg.png"
                onUploadSuccess={(url) => setInternshipBgImage(url)}
              />
              <div>
                
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-[#566A7F]">3 Floating Highlight Cards (Right side)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-600">Card Image #{i + 1}</label>
                  <LogoUploader deferredMode={true}
                      uploadEndpoint="/upload/mba"
                      currentLogoUrl={(internshipImages || [])[i] || ''}
                      defaultImage={i === 0 ? '/assets/Images/mba/internship_2.png' : i === 1 ? '/assets/Images/mba/internship_27.png' : '/assets/Images/mba/internship_28.png'}
                      onUploadSuccess={(url) => updateInternshipImage(i, url)}
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
            <h2 className="text-lg font-bold text-primary">Dynamic Learning Section Settings</h2>
            <button
              type="button"
              onClick={addDynamicFeature}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Feature Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Top Badge Text" value={dynamicLearning.badgeText || ''} max={50} />
                <input maxLength={50} 
                type="text"
                value={dynamicLearning.badgeText || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, badgeText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Section Title" value={dynamicLearning.title || ''} max={60} />
                <input maxLength={60} 
                type="text"
                value={dynamicLearning.title || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Paragraph 1" value={dynamicLearning.desc1 || ''} max={400} />
                <textarea maxLength={400} 
                rows={3}
                value={dynamicLearning.desc1 || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, desc1: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Paragraph 2" value={dynamicLearning.desc2 || ''} max={400} />
                <textarea maxLength={400} 
                rows={3}
                value={dynamicLearning.desc2 || ''}
                onChange={(e) => setDynamicLearning({ ...dynamicLearning, desc2: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-[#566A7F]">Right Collage Images (2 images)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-600">Collage Image #{i + 1}</label>
                  <LogoUploader deferredMode={true}
                    uploadEndpoint="/upload/mba"
                    currentLogoUrl={(dynamicLearning.images || [])[i] || ''}
                    onUploadSuccess={(url) => updateDynamicImage(i, url)}
                  />
                  
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#566A7F]">Bottom Feature Cards Grid</h3>
            {(dynamicLearning.features || []).map((feat, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDynamicDragStart(e, idx)}
                onDragOver={handleDynamicDragOver}
                onDrop={(e) => handleDynamicDrop(e, idx)}
                onDragEnd={handleDynamicDragEnd}
                className={`p-5 rounded-2xl bg-gray-50/80 border ${draggedDynamicIndex === idx ? 'border-primary shadow-lg scale-[1.02]' : 'border-gray-200'} relative space-y-4 shadow-sm transition-all duration-200`}
              >
                <div className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 cursor-move" title="Drag to reorder">
                  <GripVertical className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => removeDynamicFeature(idx)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <CharCountLabel label="Feature Title" value={feat.title || ''} max={60} />
                <input maxLength={60} 
                      type="text"
                      value={feat.title || ''}
                      onChange={(e) => updateDynamicFeature(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Name</label>
                    <select
                      value={feat.icon || 'Award'}
                      onChange={(e) => updateDynamicFeature(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    <CharCountLabel label="Description" value={feat.desc || ''} max={300} />
                <input maxLength={300} 
                      type="text"
                      value={feat.desc || ''}
                      onChange={(e) => updateDynamicFeature(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            <h2 className="text-lg font-bold text-primary">Moments Gallery Settings</h2>
            <button
              type="button"
              onClick={addGalleryItem}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Gallery Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Top Badge Text" value={momentsGallery.badgeText || ''} max={50} />
                <input maxLength={50} 
                type="text"
                value={momentsGallery.badgeText || ''}
                onChange={(e) => setMomentsGallery({ ...momentsGallery, badgeText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Section Title" value={momentsGallery.title || ''} max={60} />
                <input maxLength={60} 
                type="text"
                value={momentsGallery.title || ''}
                onChange={(e) => setMomentsGallery({ ...momentsGallery, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Section Background Image (Optional)</label>
            <div className="space-y-3 max-w-md">
              <LogoUploader deferredMode={true}
                uploadEndpoint="/upload/mba"
                currentLogoUrl={momentsGallery.bgImage || ''}
                defaultImage="/assets/Images/mba/gallery_bg.png"
                onUploadSuccess={(url) => setMomentsGallery({ ...momentsGallery, bgImage: url })}
              />
              <div>
                
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#566A7F]">Gallery Items Grid</h3>
            {(momentsGallery.items || []).map((item, idx) => (
              <div 
                key={idx} 
                draggable
                onDragStart={(e) => handleGalleryDragStart(e, idx)}
                onDragOver={(e) => handleGalleryDragOver(e, idx)}
                onDrop={(e) => handleGalleryDrop(e, idx)}
                onDragEnd={handleGalleryDragEnd}
                className={`p-6 rounded-2xl bg-gray-50/80 border ${draggedGalleryIndex === idx ? 'border-primary shadow-lg scale-[1.02]' : 'border-gray-200'} relative space-y-4 shadow-sm transition-all duration-200`}
              >
                <div className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(
                        'Edit Gallery Photo',
                        [
                          { name: 'title', label: 'Photo Title', type: 'text', maxLength: 60, required: true },
                          { name: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 60, required: true },
                          { 
                            name: 'span', 
                            label: 'Grid Layout Size (Span)', 
                            type: 'select', 
                            required: true, 
                            options: [
                              { value: 'col-span-1 md:col-span-2 lg:col-span-4 h-[260px] sm:h-[280px]', label: 'Small Card (col-span-4)' },
                              { value: 'col-span-1 md:col-span-2 lg:col-span-6 h-[260px] sm:h-[280px]', label: 'Wide Card (col-span-6)' },
                              { value: 'col-span-1 md:col-span-2 lg:col-span-12 h-[320px]', label: 'Full Width (col-span-12)' }
                            ]
                          },
                          { name: 'image', label: 'Upload Photo', type: 'image', required: true }
                        ],
                        item,
                        (data) => {
                          const updatedItems = [...(momentsGallery.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], ...data };
                          setMomentsGallery({ ...momentsGallery, items: updatedItems });
                        }
                      );
                    }}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-4 items-center pt-2 ml-6">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.title || 'Untitled Photo'}</h4>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                    <div className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block mt-2 text-gray-400">
                      Layout: {item.span?.includes('col-span-4') ? 'Small Card' : item.span?.includes('col-span-6') ? 'Wide Card' : 'Full Width'}
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
            <h2 className="text-lg font-bold text-primary">Academic Calendar Banner Settings</h2>
            <p className="text-xs text-gray-500 mt-1">Configure texts, buttons, and illustration for the Academic Calendar section.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Top Badge Text" value={academicCalendarBanner.badgeText || ''} max={50} />
                <input maxLength={50} 
                type="text"
                value={academicCalendarBanner.badgeText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, badgeText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Main Title" value={academicCalendarBanner.title || ''} max={60} />
                <input maxLength={60} 
                type="text"
                value={academicCalendarBanner.title || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <CharCountLabel label="Description" value={academicCalendarBanner.description || ''} max={300} />
                <textarea maxLength={300} 
              rows={3}
              value={academicCalendarBanner.description || ''}
              onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <CharCountLabel label="View Button Text" value={academicCalendarBanner.viewBtnText || ''} max={30} />
                <input maxLength={30} 
                type="text"
                value={academicCalendarBanner.viewBtnText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, viewBtnText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="View Button URL / File Path" value={academicCalendarBanner.viewBtnUrl || ''} max={30} />
                <input maxLength={30} 
                type="text"
                value={academicCalendarBanner.viewBtnUrl || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, viewBtnUrl: e.target.value })}
                placeholder="/assets/Images/image 64.png or https://..."
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CharCountLabel label="Download Button Text" value={academicCalendarBanner.downloadBtnText || ''} max={30} />
                <input maxLength={30} 
                type="text"
                value={academicCalendarBanner.downloadBtnText || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, downloadBtnText: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <CharCountLabel label="Download Button URL / File Path" value={academicCalendarBanner.downloadBtnUrl || ''} max={30} />
                <input maxLength={30} 
                type="text"
                value={academicCalendarBanner.downloadBtnUrl || ''}
                onChange={(e) => setAcademicCalendarBanner({ ...academicCalendarBanner, downloadBtnUrl: e.target.value })}
                placeholder="/assets/Images/image 64.png or https://..."
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Right Side Illustration Image</label>
            <div className="space-y-3 max-w-md">
              <LogoUploader deferredMode={true}
                uploadEndpoint="/upload/mba"
                currentLogoUrl={academicCalendarBanner.image || ''}
                defaultImage="/assets/Images/mba/calendar_64.png"
                onUploadSuccess={(url) => setAcademicCalendarBanner({ ...academicCalendarBanner, image: url })}
              />
              <div>
                
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Interactive Schedule & Key Milestones
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage timeline events displayed when visitors click "View Calendar" on the program page.</p>
              </div>
              <button
                type="button"
                onClick={addCalendarEvent}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
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

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        openEditModal(
                          'Edit Schedule Event',
                          [
                            { name: 'title', label: 'Event Title', type: 'text', maxLength: 60, required: true },
                            { name: 'date', label: 'Date Range', type: 'text', maxLength: 100, required: true },
                            { 
                              name: 'semester', 
                              label: 'Semester / Term', 
                              type: 'select', 
                              required: true,
                              options: [
                                { value: 'Trimester 1', label: 'Trimester 1' },
                                { value: 'Trimester 2', label: 'Trimester 2' },
                                { value: 'Trimester 3', label: 'Trimester 3' },
                                { value: 'Key Events', label: 'Key Events' }
                              ]
                            },
                            { 
                              name: 'category', 
                              label: 'Category', 
                              type: 'select', 
                              required: true,
                              options: [
                                { value: 'Leadership & Events', label: 'Leadership & Events' },
                                { value: 'Exams & Assessments', label: 'Exams & Assessments' },
                                { value: 'Industrial Visits', label: 'Industrial Visits' },
                                { value: 'Term Breaks & Holidays', label: 'Term Breaks & Holidays' }
                              ]
                            },
                            { name: 'description', label: 'Brief Description', type: 'textarea', maxLength: 300, required: true }
                          ],
                          ev,
                          (data) => {
                            const updatedEvents = [...(academicCalendarBanner.events || [])];
                            updatedEvents[idx] = { ...updatedEvents[idx], ...data };
                            setAcademicCalendarBanner({ ...academicCalendarBanner, events: updatedEvents });
                          }
                        );
                      }}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCalendarEvent(idx)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                      title="Remove Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 pr-20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{ev.semester || 'Trimester 1'}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{ev.category || 'Event'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800">{ev.title || 'Untitled Event'}</h4>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {ev.date || 'No date set'}</p>
                    <p className="text-xs text-gray-600 mt-2">{ev.description || 'No description provided.'}</p>
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
            <h2 className="text-lg font-bold text-primary">Admission Steps & Eligibility Cards</h2>
            <button
              type="button"
              onClick={addEligibilityStep}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Eligibility Card
            </button>
          </div>

          <div className="space-y-6">
            {eligibility.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 relative space-y-4 shadow-sm flex flex-col">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(
                        'Edit Eligibility Step',
                        [
                          { name: 'step', label: 'Step Number', type: 'text', maxLength: 10, required: true },
                          { name: 'title', label: 'Step Title', type: 'text', maxLength: 60, required: true },
                          { name: 'description', label: 'Step Summary Description', type: 'textarea', maxLength: 300, required: true },
                          { name: 'bulletsText', label: 'Requirements (Comma Separated)', type: 'textarea', maxLength: 500, placeholder: 'e.g. 50% Marks, Entrance Exam, Interview' }
                        ],
                        { ...item, bulletsText: item.bullets?.join(', ') || '' },
                        (data) => {
                          const updated = [...eligibility];
                          const bulletsArray = (data.bulletsText || '').split(',').map(t => t.trim()).filter(Boolean);
                          updated[idx] = { step: data.step, title: data.title, description: data.description, bullets: bulletsArray };
                          setEligibility(updated);
                        }
                      );
                    }}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEligibilityStep(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 transition-all duration-200"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-4 pr-20">
                  <div className="text-3xl font-black text-gray-200">{item.step || '00'}</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-800">{item.title || 'Untitled Step'}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description || 'No description provided.'}</p>
                    
                    {item.bullets && item.bullets.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1">
                        {item.bullets.map((b, i) => (
                          <div key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span>
                            {b}
                          </div>
                        ))}
                      </div>
                    )}
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
            <h2 className="text-lg font-bold text-primary">Top Recruiters & Corporate Partners</h2>
            <p className="text-xs text-gray-500 mt-1">Manage corporate logos, placement categories, CTC highlights, and partner links displayed at the bottom of the {shortTitle} Program Page.</p>
          </div>
          <div className="pt-2">
            <ManageRecruiters />
          </div>
        </div>
      )}

        </>
      )}

      <AddItemModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        fields={modalConfig.fields}
        onSave={modalConfig.onSave}
        initialData={modalConfig.initialData}
      />

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-800">Live Preview</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'desktop' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'tablet' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'mobile' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4 sm:p-8">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewDevice === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src={liveUrl}
                className="w-full h-full border-0"
                title="Live Preview"
                onLoad={() => {
                  if (iframeRef.current) {
                    iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: currentDraftData }, '*');
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMbaPage;
