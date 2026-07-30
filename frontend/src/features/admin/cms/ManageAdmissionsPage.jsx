"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Award, Sparkles, Route, GraduationCap, HelpCircle, FileText, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import SingleDocumentUploader from './components/SingleDocumentUploader';
import { uploadDeferredImage } from './utils/uploadHelper';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true, position: 'top-end',
  showConfirmButton: false, timer: 3000, timerProgressBar: true
});

const DEFAULT_IMAGES = {
  heroBgImage: '/assets/Images/admissions/admissions-hero-bg.png',
  eliteImage:  '/assets/Images/admissions/admissions-elite.png',
  ctaImage:    '/assets/Images/admissions/admissions-cta.png',
};

const isDefaultImage = (url) => {
  if (!url) return true;
  return url.includes('/assets/Images/admissions/') || url.includes('/assets/Images/image');
};

const ManageAdmissionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const tabs = [
    { id: 'hero',        label: 'Hero Banner',    icon: <FileText className="w-4 h-4" /> },
    { id: 'elite',       label: 'Elite Advantage', icon: <Award className="w-4 h-4" /> },
    { id: 'journey',     label: 'Journey',         icon: <Route className="w-4 h-4" /> },
    { id: 'eligibility', label: 'Eligibility',     icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'cta',         label: 'CTA Banner',      icon: <Sparkles className="w-4 h-4" /> },
    { id: 'faq',         label: 'FAQs',            icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Show/hide — matches model's showSections + heroShowText
  const [showSections, setShowSections] = useState({
    heroText: true, elite: true, journey: true, eligibility: true, cta: true, faq: true,
  });
  const setShow = (key, val) => setShowSections(prev => ({ ...prev, [key]: val }));

  // ── Hero ──────────────────────────────────────────────
  const [heroBadgeText, setHeroBadgeText] = useState('Admissions 2026');
  const [heroTitle, setHeroTitle] = useState('Empowering Future Leaders');
  const [heroSubtitle, setHeroSubtitle] = useState('Join a world-class institution dedicated to excellence in management education. Shape your future with industry-relevant curriculum and global perspectives.');
  const [heroBrochureBtnText, setHeroBrochureBtnText] = useState('Download Brochure');
  const [heroBrochureFile, setHeroBrochureFile] = useState('');
  const [heroBgImage, setHeroBgImage] = useState(DEFAULT_IMAGES.heroBgImage);

  // ── Elite ─────────────────────────────────────────────
  const [eliteHeading, setEliteHeading] = useState('The KSBM Elite Advantage');
  const [eliteSubtitle, setEliteSubtitle] = useState('Why Choose Our Program');
  const [eliteDesc, setEliteDesc] = useState("The MBA program at KSBM is uniquely crafted for young professionals and recent graduates aiming for high-impact leadership careers. Through our case-study pedagogy, industry immersions, and rigorous academic standards, students gain practical business intelligence and decision-making capabilities that stand out in today's corporate landscape.\n\nSupported by experienced faculty and corporate mentors, we focus on analytical depth, strategic vision, and holistic individual development, preparing students to excel in top multinational corporations and dynamic entrepreneurial ventures across India and globally.");
  const [eliteImage, setEliteImage] = useState(DEFAULT_IMAGES.eliteImage);

  // ── Journey ───────────────────────────────────────────
  const [journeyHeading, setJourneyHeading] = useState('Your Journey to KSBM');
  const [journeySubtitle, setJourneySubtitle] = useState('Application Process');
  const [journeySteps, setJourneySteps] = useState([
    { step: '01', title: 'Entrance Score', desc: 'CAT / MAT / CMAT / KMAT / ATMA eligibility', icon: 'FileCheck' },
    { step: '02', title: 'Group Discussion', desc: 'Demonstrate leadership and communication skills in interactive sessions', icon: 'Users' },
    { step: '03', title: 'Personal Interview', desc: 'One-on-one interview assessing passion, aptitude, and career alignment.', icon: 'UserCheck' }
  ]);

  // ── Eligibility ───────────────────────────────────────
  const [eligibilityHeading, setEligibilityHeading] = useState('Program Requirements');
  const [eligibilitySubtitle, setEligibilitySubtitle] = useState('Eligibility Criteria');
  const [feeStructure, setFeeStructure] = useState({ amount: '1,50,000', period: 'per semester' });
  const [mba, setMba] = useState({
    eligibilityText: "Any recognized Bachelor's degree with a valid CMAT/CAT/KMAT score.",
    approvedIntake: '60 Seats',
    eligibilityCriteria: [
      "General Category : Minimum 50% marks in aggregate in graduation.",
      "Reserved Categories : Minimum 45% marks in aggregate for SC/ST and OBC candidates as per university norms.",
      "Accepted Entrance Exams : Valid qualifying score in KMAT, CMAT, CAT, or MAT.",
      "Final Year Students : Candidates appearing for final year degree examinations may apply provisionally."
    ],
    programHighlights: [
      "Duration : 2 Years Full-Time (4 Semesters)",
      "Specializations : Finance, Marketing, HR, Systems, International Business",
      "Internship : 8-week compulsory corporate summer internship",
      "Affiliation : Calicut University & AICTE Approved"
    ]
  });
  const [bba, setBba] = useState({
    eligibilityText: 'Pass in Plus Two (10+2) or equivalent examination from a recognized board.',
    approvedIntake: '40 Seats',
    eligibilityCriteria: [
      "General Category : Pass in 10+2 or equivalent examination with minimum 45% marks.",
      "Reserved Categories : Minimum 40% marks for candidates belonging to SC/ST categories.",
      "Stream Flexibility : Students from Science, Commerce, and Humanities streams are eligible.",
      "Selection Criteria : Merit-based selection as per university guidelines."
    ],
    programHighlights: [
      "Duration : 3 Years Full-Time (6 Semesters)",
      "Focus Areas : Business Foundations, Entrepreneurship, Management Principles",
      "Industry Readiness : Live projects, industrial visits, and soft skills training",
      "Affiliation : Calicut University & AICTE Approved"
    ]
  });
  const [scholarshipNote, setScholarshipNote] = useState('Scholarships available for merit and economically disadvantaged students.');
  const [activeProgTab, setActiveProgTab] = useState('MBA');

  // ── CTA ───────────────────────────────────────────────
  const [ctaHeading, setCtaHeading] = useState('Begin Your Leadership Journey at KSBM');
  const [ctaDesc, setCtaDesc] = useState('Applications for the upcoming academic year are now open. Take the first step towards a transformative management education under a community of vibrant peers, experienced faculty, and industry leaders.');
  const [ctaImage, setCtaImage] = useState(DEFAULT_IMAGES.ctaImage);

  // ── FAQ ───────────────────────────────────────────────
  const [faqHeading, setFaqHeading] = useState('FAQ');
  const [faqs, setFaqs] = useState([]);

  // ─────────────────────────────────────────────────────
  useEffect(() => { fetchSettings(); }, []);

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        activeTab,
        showSections,
        heroBadgeText, heroTitle, heroSubtitle,
        heroBrochureBtnText, heroBrochureFile, heroBgImage,
        eliteHeading, eliteSubtitle, eliteDesc, eliteImage,
        journeyHeading, journeySubtitle, journeySteps,
        eligibilityHeading, eligibilitySubtitle, scholarshipNote, feeStructure, mba, bba,
        ctaHeading, ctaDesc, ctaImage,
        faqHeading, faqs
      };
      
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'admissions' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-admissions-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-admissions-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [
    isPreviewModalOpen, previewMode, activeTab,
    showSections, heroBadgeText, heroTitle, heroSubtitle, heroBrochureBtnText, heroBrochureFile, heroBgImage,
    eliteHeading, eliteSubtitle, eliteDesc, eliteImage,
    journeyHeading, journeySubtitle, journeySteps,
    eligibilityHeading, eligibilitySubtitle, scholarshipNote, feeStructure, mba, bba,
    ctaHeading, ctaDesc, ctaImage, faqHeading, faqs
  ]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cms/admissions-page');
      const d = res?.data || {};

      // showSections — model stores as showSections.{elite,journey,...} + heroShowText
      if (d.showSections) {
        setShowSections({
          heroText:    d.showSections.heroText    !== undefined ? d.showSections.heroText    : true,
          elite:       d.showSections.elite       !== undefined ? d.showSections.elite       : true,
          journey:     d.showSections.journey     !== undefined ? d.showSections.journey     : true,
          eligibility: d.showSections.eligibility !== undefined ? d.showSections.eligibility : true,
          cta:         d.showSections.cta         !== undefined ? d.showSections.cta         : true,
          faq:         d.showSections.faq         !== undefined ? d.showSections.faq         : true,
        });
      }

      if (d.heroBadgeText !== undefined) setHeroBadgeText(d.heroBadgeText);
      if (d.heroTitle !== undefined) setHeroTitle(d.heroTitle);
      if (d.heroSubtitle !== undefined) setHeroSubtitle(d.heroSubtitle);
      if (d.heroBrochureBtnText !== undefined) setHeroBrochureBtnText(d.heroBrochureBtnText);
      if (d.heroBrochureFile !== undefined) setHeroBrochureFile(d.heroBrochureFile);
      if (d.heroBgImage !== undefined) setHeroBgImage(d.heroBgImage);

      if (d.eliteHeading !== undefined) setEliteHeading(d.eliteHeading);
      if (d.eliteSubtitle !== undefined) setEliteSubtitle(d.eliteSubtitle);
      if (d.eliteDesc !== undefined) setEliteDesc(d.eliteDesc);
      if (d.eliteImage !== undefined) setEliteImage(d.eliteImage);

      if (d.journeyHeading !== undefined) setJourneyHeading(d.journeyHeading);
      if (d.journeySubtitle !== undefined) setJourneySubtitle(d.journeySubtitle);
      if (d.journeySteps && Array.isArray(d.journeySteps)) setJourneySteps(d.journeySteps);

      if (d.eligibilityHeading !== undefined) setEligibilityHeading(d.eligibilityHeading);
      if (d.eligibilitySubtitle !== undefined) setEligibilitySubtitle(d.eligibilitySubtitle);
      if (d.scholarshipNote !== undefined) setScholarshipNote(d.scholarshipNote);
      if (d.feeStructure) setFeeStructure(prev => ({ ...prev, ...d.feeStructure }));
      if (d.mba) setMba(prev => ({ ...prev, ...d.mba }));
      if (d.bba) setBba(prev => ({ ...prev, ...d.bba }));

      if (d.ctaHeading !== undefined) setCtaHeading(d.ctaHeading);
      if (d.ctaDesc !== undefined) setCtaDesc(d.ctaDesc);
      if (d.ctaImage !== undefined) setCtaImage(d.ctaImage);

      if (d.faqHeading !== undefined) setFaqHeading(d.faqHeading);
      if (d.faqs && Array.isArray(d.faqs)) setFaqs(d.faqs);
    } catch (err) {
      console.error('Error fetching admission page settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load admission page settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to update the Admissions page settings?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const finalHeroBgImage = await uploadDeferredImage(heroBgImage, '/upload/admissions');
          const finalEliteImage  = await uploadDeferredImage(eliteImage,  '/upload/admissions');
          const finalCtaImage    = await uploadDeferredImage(ctaImage,    '/upload/admissions');
          const finalBrochureFile = await uploadDeferredImage(heroBrochureFile, '/upload/admissions');

          const payload = {
            showSections,
            heroBadgeText, heroTitle, heroSubtitle,
            heroBrochureBtnText, heroBrochureFile: finalBrochureFile,
            heroBgImage: finalHeroBgImage,
            eliteHeading, eliteSubtitle, eliteDesc, eliteImage: finalEliteImage,
            journeyHeading, journeySubtitle, journeySteps,
            eligibilityHeading, eligibilitySubtitle, scholarshipNote, feeStructure, mba, bba,
            ctaHeading, ctaDesc, ctaImage: finalCtaImage,
            faqHeading, faqs,
          };

          await api.put('/cms/admissions-page', payload);

          for (const imgUrl of imagesToDelete) {
            try { await api.delete('/upload', { data: { fileUrl: imgUrl }, hideLoader: true }); }
            catch (err) { console.warn('Skipped deleting image:', err); }
          }
          setImagesToDelete([]);
          setHeroBrochureFile(finalBrochureFile);
          setHeroBgImage(finalHeroBgImage);
          setEliteImage(finalEliteImage);
          setCtaImage(finalCtaImage);

          Toast.fire({ icon: 'success', title: 'Admissions page settings saved successfully!' });
        } catch (err) {
          console.error('Error saving:', err);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = () => {
    confirmAction({
      title: 'Reset to Default?',
      message: 'Are you sure you want to revert all settings to their original default values? This will not be saved until you click "Save Changes".',
      confirmText: 'Yes, reset everything',
      variant: 'danger',
      action: () => {
        // Reset Show Sections
        setShowSections({ heroText: true, elite: true, journey: true, eligibility: true, cta: true, faq: true });
        
        // Reset Hero
        setHeroBadgeText('Admissions 2026');
        setHeroTitle('Empowering Future Leaders');
        setHeroSubtitle('Join a world-class institution dedicated to excellence in management education. Shape your future with industry-relevant curriculum and global perspectives.');
        setHeroBrochureBtnText('Download Brochure');
        setHeroBrochureFile('');
        setHeroBgImage(DEFAULT_IMAGES.heroBgImage);
        
        // Reset Elite
        setEliteHeading('The KSBM Elite Advantage');
        setEliteSubtitle('Why Choose Our Program');
        setEliteDesc("The MBA program at KSBM is uniquely crafted for young professionals and recent graduates aiming for high-impact leadership careers. Through our case-study pedagogy, industry immersions, and rigorous academic standards, students gain practical business intelligence and decision-making capabilities that stand out in today's corporate landscape.\n\nSupported by experienced faculty and corporate mentors, we focus on analytical depth, strategic vision, and holistic individual development, preparing students to excel in top multinational corporations and dynamic entrepreneurial ventures across India and globally.");
        setEliteImage(DEFAULT_IMAGES.eliteImage);
        
        // Reset Journey
        setJourneyHeading('Your Journey to KSBM');
        setJourneySubtitle('Application Process');
        setJourneySteps([
          { step: '01', title: 'Entrance Score', desc: 'CAT / MAT / CMAT / KMAT / ATMA eligibility', icon: 'FileCheck' },
          { step: '02', title: 'Group Discussion', desc: 'Demonstrate leadership and communication skills in interactive sessions', icon: 'Users' },
          { step: '03', title: 'Personal Interview', desc: 'One-on-one interview assessing passion, aptitude, and career alignment.', icon: 'UserCheck' }
        ]);
        
        // Reset Eligibility
        setEligibilityHeading('Program Requirements');
        setEligibilitySubtitle('Eligibility Criteria');
        setFeeStructure({ amount: '1,50,000', period: 'per semester' });
        setScholarshipNote('Scholarships available for merit and economically disadvantaged students.');
        setMba({
          eligibilityText: "Any recognized Bachelor's degree with a valid CMAT/CAT/KMAT score.",
          approvedIntake: '60 Seats',
          eligibilityCriteria: [
            "General Category : Minimum 50% marks in aggregate in graduation.",
            "Reserved Categories : Minimum 45% marks in aggregate for SC/ST and OBC candidates as per university norms.",
            "Accepted Entrance Exams : Valid qualifying score in KMAT, CMAT, CAT, or MAT.",
            "Final Year Students : Candidates appearing for final year degree examinations may apply provisionally."
          ],
          programHighlights: [
            "Duration : 2 Years Full-Time (4 Semesters)",
            "Specializations : Finance, Marketing, HR, Systems, International Business",
            "Internship : 8-week compulsory corporate summer internship",
            "Affiliation : Calicut University & AICTE Approved"
          ]
        });
        setBba({
          eligibilityText: 'Pass in Plus Two (10+2) or equivalent examination from a recognized board.',
          approvedIntake: '40 Seats',
          eligibilityCriteria: [
            "General Category : Pass in 10+2 or equivalent examination with minimum 45% marks.",
            "Reserved Categories : Minimum 40% marks for candidates belonging to SC/ST categories.",
            "Stream Flexibility : Students from Science, Commerce, and Humanities streams are eligible.",
            "Selection Criteria : Merit-based selection as per university guidelines."
          ],
          programHighlights: [
            "Duration : 3 Years Full-Time (6 Semesters)",
            "Focus Areas : Business Foundations, Entrepreneurship, Management Principles",
            "Industry Readiness : Live projects, industrial visits, and soft skills training",
            "Affiliation : Calicut University & AICTE Approved"
          ]
        });
        
        // Reset CTA
        setCtaHeading('Begin Your Leadership Journey at KSBM');
        setCtaDesc('Applications for the upcoming academic year are now open. Take the first step towards a transformative management education under a community of vibrant peers, experienced faculty, and industry leaders.');
        setCtaImage(DEFAULT_IMAGES.ctaImage);
        
        // Reset FAQ
        setFaqHeading('FAQ');
        setFaqs([
          {
            question: "Why is MBA/PGDM at KSBM preferred by top recruiters?",
            answer: "KSBM programs are designed with active corporate input, ensuring our curriculum remains at the cutting edge of industry demands. Through Harvard & IIM case-study pedagogy, live corporate projects, and intensive mentorship, our graduates are job-ready and equipped with practical strategic competencies from day one."
          },
          {
            question: "What is the eligibility criteria for the MBA program?",
            answer: "Candidates must hold a recognized Bachelor's Degree in any discipline with minimum 50% aggregate marks (45% for reserved categories). Additionally, applicants must possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance examinations."
          },
          {
            question: "How are scholarships or financial assistance awarded?",
            answer: "KSBM offers merit-based scholarships for high scorers in entrance exams and university graduations, alongside need-based financial aid for economically disadvantaged students. Educational loan assistance and tie-ups with leading banks are also provided during counseling."
          },
          {
            question: "What is the selection procedure after applying online?",
            answer: "Once your online application is submitted and reviewed, shortlisted candidates are invited for the Group Discussion (GD) and Personal Interview (PI) rounds. Final selection is based on academic record, entrance test score, and GD/PI performance."
          }
        ]);
        
        Toast.fire({ icon: 'info', title: 'Fields reset to default. Click "Save Changes" to apply.' });
      }
    });
  };

  const handleImageChange = (newImageObj, currentImageState, setFn) => {
    const oldUrl = typeof currentImageState === 'string' ? currentImageState : currentImageState?.oldUrl;
    if (oldUrl && !isDefaultImage(oldUrl) && !oldUrl.startsWith('blob:')) {
      setImagesToDelete(prev => [...prev, oldUrl]);
    }
    setFn(newImageObj);
  };

  const getDisplayUrl = (imgState, defaultImg) => {
    if (typeof imgState === 'object' && imgState?.previewUrl) return imgState.previewUrl;
    return typeof imgState === 'string' ? imgState : defaultImg;
  };

  // ── Toggle switch ─────────────────────────────────────
  const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
      <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`} />
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`} />
      </div>
    </label>
  );

  // ── Journey helpers ───────────────────────────────────
  const updateJourneyStep = (i, f, v) => { const u=[...journeySteps]; u[i][f]=v; setJourneySteps(u); };
  const addJourneyStep    = () => setJourneySteps([...journeySteps, { step: String(journeySteps.length+1).padStart(2,'0'), title:'New Step', desc:'Description.', icon:'CheckCircle2' }]);
  const deleteJourneyStep = (i) => setJourneySteps(journeySteps.filter((_,idx)=>idx!==i));
  const moveJourneyStep   = (i, dir) => {
    if (dir==='up' && i===0) return;
    if (dir==='down' && i===journeySteps.length-1) return;
    const u=[...journeySteps], t=dir==='up'?i-1:i+1;
    [u[i],u[t]]=[u[t],u[i]]; setJourneySteps(u);
  };

  // ── Prog string helpers ───────────────────────────────
  const addProgStringItem    = (prog, key) => { const o=prog==='MBA'?{...mba}:{...bba}; const s=prog==='MBA'?setMba:setBba; o[key]=[...(o[key]||[]),'Label : Value']; s(o); };
  const updateProgStringItem = (prog, key, i, val) => { const o=prog==='MBA'?{...mba}:{...bba}; const s=prog==='MBA'?setMba:setBba; const l=[...o[key]]; l[i]=val; o[key]=l; s(o); };
  const deleteProgStringItem = (prog, key, i) => { const o=prog==='MBA'?{...mba}:{...bba}; const s=prog==='MBA'?setMba:setBba; o[key]=o[key].filter((_,idx)=>idx!==i); s(o); };

  // ── FAQ helpers ───────────────────────────────────────
  const addFaq    = () => setFaqs([...faqs,{question:'New Question?',answer:'Answer.'}]);
  const updateFaq = (i,f,v) => { const u=[...faqs]; u[i][f]=v; setFaqs(u); };
  const deleteFaq = (i) => setFaqs(faqs.filter((_,idx)=>idx!==i));
  const moveFaq   = (i, dir) => {
    if (dir==='up' && i===0) return;
    if (dir==='down' && i===faqs.length-1) return;
    const u=[...faqs], t=dir==='up'?i-1:i+1;
    [u[i],u[t]]=[u[t],u[i]]; setFaqs(u);
  };

  const inputCls  = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none";
  const panelCls  = "bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100";
  const panelHdr  = "flex justify-between items-center mb-6 border-b pb-3";
  const panelTitle = "text-lg font-bold text-[#1e2869]";
  const fieldLabel = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const CharCounter = ({ text = '', limit }) => (
    <div className="text-right text-[10px] text-gray-400 mt-1 pr-1 font-medium">
      {text?.length || 0} / {limit}
    </div>
  );

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="w-full pb-12 space-y-8">

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div ref={tabsContainerRef} className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'}`}>
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Page header ─────────────────────────────────── */}
      <PageHeader
        title="Admissions Page Management"
        description="Manage hero banner, advantage highlights, application steps, MBA/BBA eligibility, CTA, and FAQs."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      {/* ── Preview modal ────────────────────────────────── */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              {[['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]].map(([mode, Icon]) => (
                <button key={mode} onClick={() => setPreviewMode(mode)}
                  className={`p-1.5 rounded-sm transition-colors ${previewMode === mode ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  title={`${mode.charAt(0).toUpperCase()+mode.slice(1)} View`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center p-4">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-full ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe ref={iframeRef} src="/preview/admissions" className="w-full h-full border-0" title="Admissions Preview" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab content ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">

          {/* HERO */}
          {activeTab === 'hero' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>Hero Banner</h2>
                <Toggle checked={showSections.heroText} onChange={v => setShow('heroText', v)} label="Show Text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div><label className={fieldLabel}>Badge Text</label><input type="text" maxLength={50} value={heroBadgeText} onChange={e=>setHeroBadgeText(e.target.value)} className={inputCls} /><CharCounter text={heroBadgeText} limit={50} /></div>
                  <div><label className={fieldLabel}>Hero Title</label><input type="text" maxLength={80} value={heroTitle} onChange={e=>setHeroTitle(e.target.value)} className={inputCls} /><CharCounter text={heroTitle} limit={80} /></div>
                  <div><label className={fieldLabel}>Hero Subtitle</label><textarea rows={4} maxLength={300} value={heroSubtitle} onChange={e=>setHeroSubtitle(e.target.value)} className={inputCls} /><CharCounter text={heroSubtitle} limit={300} /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={fieldLabel}>Brochure Btn Text</label><input type="text" maxLength={30} value={heroBrochureBtnText} onChange={e=>setHeroBrochureBtnText(e.target.value)} className={inputCls} /><CharCounter text={heroBrochureBtnText} limit={30} /></div>
                    <div>
                      <label className={fieldLabel}>Brochure PDF</label>
                      <SingleDocumentUploader
                        fileUrl={heroBrochureFile}
                        onUploadComplete={setHeroBrochureFile}
                        onUploadStateChange={setIsUploading}
                        deferredUpload={true}
                        defaultFile=""
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Background Image</label>
                  <SingleImageUploader
                    imageUrl={getDisplayUrl(heroBgImage, DEFAULT_IMAGES.heroBgImage)}
                    onUploadComplete={newImg => handleImageChange(newImg, heroBgImage, setHeroBgImage)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                    defaultImage={DEFAULT_IMAGES.heroBgImage}
                    label="Drag & drop hero background, or click to select"
                    allowDelete={getDisplayUrl(heroBgImage, DEFAULT_IMAGES.heroBgImage) !== DEFAULT_IMAGES.heroBgImage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ELITE */}
          {activeTab === 'elite' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>Elite Advantage Section</h2>
                <Toggle checked={showSections.elite} onChange={v => setShow('elite', v)} label="Show Section" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div><label className={fieldLabel}>Section Heading</label><input type="text" maxLength={80} value={eliteHeading} onChange={e=>setEliteHeading(e.target.value)} className={inputCls} /><CharCounter text={eliteHeading} limit={80} /></div>
                  <div><label className={fieldLabel}>Description</label><textarea rows={6} maxLength={1000} value={eliteDesc} onChange={e=>setEliteDesc(e.target.value)} className={inputCls} /><CharCounter text={eliteDesc} limit={1000} /></div>
                </div>
                <div>
                  <label className={fieldLabel}>Section Image</label>
                  <SingleImageUploader
                    imageUrl={getDisplayUrl(eliteImage, DEFAULT_IMAGES.eliteImage)}
                    onUploadComplete={newImg => handleImageChange(newImg, eliteImage, setEliteImage)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                    defaultImage={DEFAULT_IMAGES.eliteImage}
                    label="Drag & drop image, or click to select"
                    allowDelete={getDisplayUrl(eliteImage, DEFAULT_IMAGES.eliteImage) !== DEFAULT_IMAGES.eliteImage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* JOURNEY */}
          {activeTab === 'journey' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>Application Journey</h2>
                <Toggle checked={showSections.journey} onChange={v => setShow('journey', v)} label="Show Section" />
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={fieldLabel}>Heading</label><input type="text" maxLength={80} value={journeyHeading} onChange={e=>setJourneyHeading(e.target.value)} className={inputCls} /><CharCounter text={journeyHeading} limit={80} /></div>
                  <div><label className={fieldLabel}>Subtitle</label><input type="text" maxLength={80} value={journeySubtitle} onChange={e=>setJourneySubtitle(e.target.value)} className={inputCls} /><CharCounter text={journeySubtitle} limit={80} /></div>
                </div>
                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-gray-700">Steps ({journeySteps.length})</h3>
                    <button type="button" onClick={addJourneyStep} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900">
                      <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                  </div>
                  <div className="space-y-3">
                    {journeySteps.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={()=>moveJourneyStep(idx,'up')} disabled={idx===0} className={`p-1.5 rounded border ${idx===0?'text-gray-300 border-gray-100 cursor-not-allowed':'text-gray-600 border-gray-200 hover:bg-white'}`}><ArrowUp className="w-4 h-4" /></button>
                          <button type="button" onClick={()=>moveJourneyStep(idx,'down')} disabled={idx===journeySteps.length-1} className={`p-1.5 rounded border ${idx===journeySteps.length-1?'text-gray-300 border-gray-100 cursor-not-allowed':'text-gray-600 border-gray-200 hover:bg-white'}`}><ArrowDown className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 w-full">
                          <div className="md:col-span-2"><label className="block text-[11px] font-bold text-gray-500 mb-1">Step #</label><input type="text" maxLength={10} value={step.step} onChange={e=>updateJourneyStep(idx,'step',e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold" /><CharCounter text={step.step} limit={10} /></div>
                          <div className="md:col-span-4"><label className="block text-[11px] font-bold text-gray-500 mb-1">Title</label><input type="text" maxLength={80} value={step.title} onChange={e=>updateJourneyStep(idx,'title',e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold" /><CharCounter text={step.title} limit={80} /></div>
                          <div className="md:col-span-6"><label className="block text-[11px] font-bold text-gray-500 mb-1">Description</label><textarea rows={2} maxLength={250} value={step.desc} onChange={e=>updateJourneyStep(idx,'desc',e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium" /><CharCounter text={step.desc} limit={250} /></div>
                        </div>
                        <button type="button" onClick={()=>deleteJourneyStep(idx)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>Eligibility & Fee Structure</h2>
                <Toggle checked={showSections.eligibility} onChange={v => setShow('eligibility', v)} label="Show Section" />
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={fieldLabel}>Section Heading</label><input type="text" maxLength={80} value={eligibilityHeading} onChange={e=>setEligibilityHeading(e.target.value)} className={inputCls} /><CharCounter text={eligibilityHeading} limit={80} /></div>
                  <div><label className={fieldLabel}>Section Subtitle</label><input type="text" maxLength={150} value={eligibilitySubtitle} onChange={e=>setEligibilitySubtitle(e.target.value)} className={inputCls} /><CharCounter text={eligibilitySubtitle} limit={150} /></div>
                </div>
                <div className="p-5 rounded-2xl bg-primary/5 border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={fieldLabel}>Fee Amount (e.g. 1,50,000)</label><input type="text" maxLength={20} value={feeStructure.amount} onChange={e=>setFeeStructure({...feeStructure,amount:e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white" /><CharCounter text={feeStructure.amount} limit={20} /></div>
                  <div><label className={fieldLabel}>Fee Period (e.g. per semester)</label><input type="text" maxLength={30} value={feeStructure.period} onChange={e=>setFeeStructure({...feeStructure,period:e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white" /><CharCounter text={feeStructure.period} limit={30} /></div>
                  <div className="md:col-span-2"><label className={fieldLabel}>Scholarship Note</label><input type="text" maxLength={150} value={scholarshipNote} onChange={e=>setScholarshipNote(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white" /><CharCounter text={scholarshipNote} limit={150} /></div>
                </div>
                <div className="pt-4 border-t space-y-6">
                  <div className="flex gap-3">
                    {['MBA','BBA'].map(p => (
                      <button key={p} type="button" onClick={()=>setActiveProgTab(p)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeProgTab===p?'bg-primary text-white shadow-md':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p} Program</button>
                    ))}
                  </div>
                  {['MBA','BBA'].map(prog => {
                    if (activeProgTab!==prog) return null;
                    const obj = prog==='MBA'?mba:bba;
                    const setObj = prog==='MBA'?setMba:setBba;
                    return (
                      <div key={prog} className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className={fieldLabel}>Eligibility Summary</label><textarea rows={2} maxLength={200} value={obj.eligibilityText} onChange={e=>setObj({...obj,eligibilityText:e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white" /><CharCounter text={obj.eligibilityText} limit={200} /></div>
                          <div><label className={fieldLabel}>Approved Intake</label><input type="text" maxLength={30} value={obj.approvedIntake} onChange={e=>setObj({...obj,approvedIntake:e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white" /><CharCounter text={obj.approvedIntake} limit={30} /></div>
                        </div>
                        {[['eligibilityCriteria','Eligibility Criteria'],['programHighlights','Program Highlights']].map(([key,lbl])=>(
                          <div key={key} className="space-y-3 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold uppercase text-gray-700">{lbl}</label>
                              <button type="button" onClick={()=>addProgStringItem(prog,key)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Item</button>
                            </div>
                            {obj[key].map((str,i)=>(
                              <div key={i}>
                                <div className="flex items-center gap-2">
                                  <input type="text" maxLength={250} value={str} onChange={e=>updateProgStringItem(prog,key,i,e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white" />
                                  <button type="button" onClick={()=>deleteProgStringItem(prog,key,i)} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <CharCounter text={str} limit={250} />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {activeTab === 'cta' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>CTA Banner</h2>
                <Toggle checked={showSections.cta} onChange={v => setShow('cta', v)} label="Show Section" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div><label className={fieldLabel}>Heading</label><input type="text" maxLength={80} value={ctaHeading} onChange={e=>setCtaHeading(e.target.value)} className={inputCls} /><CharCounter text={ctaHeading} limit={80} /></div>
                  <div><label className={fieldLabel}>Description</label><textarea rows={4} maxLength={300} value={ctaDesc} onChange={e=>setCtaDesc(e.target.value)} className={inputCls} /><CharCounter text={ctaDesc} limit={300} /></div>
                </div>
                <div>
                  <label className={fieldLabel}>CTA Visual Image</label>
                  <SingleImageUploader
                    imageUrl={getDisplayUrl(ctaImage, DEFAULT_IMAGES.ctaImage)}
                    onUploadComplete={newImg => handleImageChange(newImg, ctaImage, setCtaImage)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                    defaultImage={DEFAULT_IMAGES.ctaImage}
                    label="Drag & drop CTA image, or click to select"
                    allowDelete={getDisplayUrl(ctaImage, DEFAULT_IMAGES.ctaImage) !== DEFAULT_IMAGES.ctaImage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className={panelCls}>
              <div className={panelHdr}>
                <h2 className={panelTitle}>FAQ Section</h2>
                <Toggle checked={showSections.faq} onChange={v => setShow('faq', v)} label="Show Section" />
              </div>
              <div className="space-y-6">
                <div><label className={fieldLabel}>Section Title</label><input type="text" maxLength={80} value={faqHeading} onChange={e=>setFaqHeading(e.target.value)} className={inputCls} /><CharCounter text={faqHeading} limit={80} /></div>
                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-gray-700">Frequently Asked Questions ({faqs.length})</h3>
                    <button type="button" onClick={addFaq} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900"><Plus className="w-3.5 h-3.5" /> Add FAQ</button>
                  </div>
                  <div className="space-y-3">
                    {faqs.map((faq,idx)=>(
                      <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={()=>moveFaq(idx,'up')} disabled={idx===0} className={`p-1.5 rounded border ${idx===0?'text-gray-300 border-gray-100 cursor-not-allowed':'text-gray-600 border-gray-200 hover:bg-white'}`}><ArrowUp className="w-4 h-4" /></button>
                          <button type="button" onClick={()=>moveFaq(idx,'down')} disabled={idx===faqs.length-1} className={`p-1.5 rounded border ${idx===faqs.length-1?'text-gray-300 border-gray-100 cursor-not-allowed':'text-gray-600 border-gray-200 hover:bg-white'}`}><ArrowDown className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 w-full">
                          <div className="md:col-span-5"><label className="block text-[11px] font-bold text-gray-500 mb-1">Question</label><input type="text" maxLength={150} value={faq.question} onChange={e=>updateFaq(idx,'question',e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold bg-white" /><CharCounter text={faq.question} limit={150} /></div>
                          <div className="md:col-span-7"><label className="block text-[11px] font-bold text-gray-500 mb-1">Answer</label><textarea rows={2} maxLength={500} value={faq.answer} onChange={e=>updateFaq(idx,'answer',e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium bg-white" /><CharCounter text={faq.answer} limit={500} /></div>
                        </div>
                        <button type="button" onClick={()=>deleteFaq(idx)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default ManageAdmissionsPage;
