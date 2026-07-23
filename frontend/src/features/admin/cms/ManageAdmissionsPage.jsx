"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2, ArrowUp, ArrowDown, Award, Sparkles, Route, GraduationCap, MessageSquareText, HelpCircle, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import LogoUploader from './components/LogoUploader';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageAdmissionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Hero Section
  const [heroBadgeText, setHeroBadgeText] = useState('Admissions 2026');
  const [heroTitle, setHeroTitle] = useState('Empowering Future Leaders');
  const [heroSubtitle, setHeroSubtitle] = useState('Join a world-class institution dedicated to excellence in management education. Shape your future with industry-relevant curriculum and global perspectives.');
  const [heroApplyBtnText, setHeroApplyBtnText] = useState('Apply Now');
  const [heroApplyBtnUrl, setHeroApplyBtnUrl] = useState('/#contact');
  const [heroBrochureBtnText, setHeroBrochureBtnText] = useState('Download Brochure');
  const [heroBrochureBtnUrl, setHeroBrochureBtnUrl] = useState('#');
  const [heroBgImage, setHeroBgImage] = useState('/assets/Images/image 73.png');
  const [heroStats, setHeroStats] = useState([
    { value: '98%', label: 'Placement Rate' },
    { value: '500+', label: 'Recruiting Partners' },
    { value: '15:1', label: 'Student-Faculty Ratio' }
  ]);

  // 2. Elite Advantage Section
  const [eliteHeading, setEliteHeading] = useState('The KSBM Elite Advantage');
  const [eliteSubtitle, setEliteSubtitle] = useState('Why Choose Our Program');
  const [eliteDesc, setEliteDesc] = useState('Supported by experienced faculty and corporate mentors, we focus on analytical depth, strategic vision, and holistic individual development, preparing students to excel in top multinational corporations and dynamic entrepreneurial ventures across India and globally.');
  const [eliteImage, setEliteImage] = useState('/assets/Images/image 2.png');
  const [eliteAdvantages, setEliteAdvantages] = useState([
    { icon: 'TrendingUp', title: 'Career Transformation', desc: 'Personalized career guidance and leadership development designed to elevate graduates into high-impact management roles.' },
    { icon: 'Globe2', title: 'Global Curriculum', desc: 'Modern case-study approach integrated with real-world industry simulations, guest lectures, and corporate mentorship.' },
    { icon: 'ShieldCheck', title: 'Academic Excellence', desc: 'Rigorous academic standards taught by renowned faculty members with extensive doctoral and corporate consulting backgrounds.' },
    { icon: 'Users', title: 'Vibrant Network', desc: 'Access to a distinguished alumni network and active executive connections spanning leading multinational corporations worldwide.' }
  ]);

  // 3. Journey Section
  const [journeyHeading, setJourneyHeading] = useState('Your Journey to KSBM');
  const [journeySubtitle, setJourneySubtitle] = useState('Application Process');
  const [journeySteps, setJourneySteps] = useState([
    { step: '01', title: 'Online Application', duration: 'Approx. 20 Mins', desc: 'Complete the comprehensive online application form via our portal and upload academic transcripts, graduation certificates, and entrance exam scorecards.', icon: 'ClipboardList' },
    { step: '02', title: 'Document & Score Verification', duration: '3 - 5 Business Days', desc: 'Our admissions committee rigorously reviews your academic credentials, entrance test scores (KMAT/CMAT/CAT/MAT), and eligibility compliance.', icon: 'CheckCircle2' },
    { step: '03', title: 'Personal Interview & Assessment', duration: 'Scheduled Panel Assessment', desc: 'Shortlisted candidates participate in an interactive personal evaluation with faculty experts to evaluate communication, analytical clarity, and managerial aptitude.', icon: 'Users' },
    { step: '04', title: 'Offer of Admission', duration: 'Within 7 Business Days', desc: 'Successful applicants receive an official provisional admission offer letter detailing scholarship eligibility, fee structure, and enrollment deadlines.', icon: 'Award' },
    { step: '05', title: 'Enrollment & Onboarding', duration: 'Before Semester Commencement', desc: 'Confirm your seat by completing fee formalities, submitting original verification documents, and attending orientation.', icon: 'CheckCircle2' }
  ]);

  // 4. Eligibility Standards Section
  const [eligibilityHeading, setEligibilityHeading] = useState('Program Requirements');
  const [eligibilitySubtitle, setEligibilitySubtitle] = useState('Eligibility Criteria');
  const [feeStructure, setFeeStructure] = useState({ amount: '₹1,50,000', period: 'per semester' });
  const [mba, setMba] = useState({
    eligibilityText: 'Any recognized Bachelor’s degree with a valid CMAT/CAT/KMAT score.',
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
  const [activeProgTab, setActiveProgTab] = useState('MBA');

  // 5. CTA Section
  const [ctaHeading, setCtaHeading] = useState('Begin Your Leadership Journey at KSBM');
  const [ctaDesc, setCtaDesc] = useState('Applications for the upcoming academic year are now open. Take the first step towards a transformative management education under a community of vibrant peers, experienced faculty, and industry leaders.');
  const [ctaApplyBtnText, setCtaApplyBtnText] = useState('Apply Now');
  const [ctaApplyBtnUrl, setCtaApplyBtnUrl] = useState('/#contact');
  const [ctaEnquiryBtnText, setCtaEnquiryBtnText] = useState('Enquiry Now');
  const [ctaEnquiryBtnUrl, setCtaEnquiryBtnUrl] = useState('/#contact');
  const [ctaImage, setCtaImage] = useState('/assets/Images/image 78.png');

  // 6. FAQ Section
  const [faqHeading, setFaqHeading] = useState('FAQ');
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cms/admissions-page');
      const data = res?.data || {};

      if (data.heroBadgeText !== undefined) setHeroBadgeText(data.heroBadgeText);
      if (data.heroTitle !== undefined) setHeroTitle(data.heroTitle);
      if (data.heroSubtitle !== undefined) setHeroSubtitle(data.heroSubtitle);
      if (data.heroApplyBtnText !== undefined) setHeroApplyBtnText(data.heroApplyBtnText);
      if (data.heroApplyBtnUrl !== undefined) setHeroApplyBtnUrl(data.heroApplyBtnUrl);
      if (data.heroBrochureBtnText !== undefined) setHeroBrochureBtnText(data.heroBrochureBtnText);
      if (data.heroBrochureBtnUrl !== undefined) setHeroBrochureBtnUrl(data.heroBrochureBtnUrl);
      if (data.heroBgImage !== undefined) setHeroBgImage(data.heroBgImage);
      if (data.heroStats && Array.isArray(data.heroStats)) setHeroStats(data.heroStats);

      if (data.eliteHeading !== undefined) setEliteHeading(data.eliteHeading);
      if (data.eliteSubtitle !== undefined) setEliteSubtitle(data.eliteSubtitle);
      if (data.eliteDesc !== undefined) setEliteDesc(data.eliteDesc);
      if (data.eliteImage !== undefined) setEliteImage(data.eliteImage);
      if (data.eliteAdvantages && Array.isArray(data.eliteAdvantages)) setEliteAdvantages(data.eliteAdvantages);

      if (data.journeyHeading !== undefined) setJourneyHeading(data.journeyHeading);
      if (data.journeySubtitle !== undefined) setJourneySubtitle(data.journeySubtitle);
      if (data.journeySteps && Array.isArray(data.journeySteps)) setJourneySteps(data.journeySteps);

      if (data.eligibilityHeading !== undefined) setEligibilityHeading(data.eligibilityHeading);
      if (data.eligibilitySubtitle !== undefined) setEligibilitySubtitle(data.eligibilitySubtitle);
      if (data.feeStructure) setFeeStructure({ ...feeStructure, ...data.feeStructure });
      if (data.mba) setMba({ ...mba, ...data.mba });
      if (data.bba) setBba({ ...bba, ...data.bba });

      if (data.ctaHeading !== undefined) setCtaHeading(data.ctaHeading);
      if (data.ctaDesc !== undefined) setCtaDesc(data.ctaDesc);
      if (data.ctaApplyBtnText !== undefined) setCtaApplyBtnText(data.ctaApplyBtnText);
      if (data.ctaApplyBtnUrl !== undefined) setCtaApplyBtnUrl(data.ctaApplyBtnUrl);
      if (data.ctaEnquiryBtnText !== undefined) setCtaEnquiryBtnText(data.ctaEnquiryBtnText);
      if (data.ctaEnquiryBtnUrl !== undefined) setCtaEnquiryBtnUrl(data.ctaEnquiryBtnUrl);
      if (data.ctaImage !== undefined) setCtaImage(data.ctaImage);

      if (data.faqHeading !== undefined) setFaqHeading(data.faqHeading);
      if (data.faqs && Array.isArray(data.faqs)) setFaqs(data.faqs);
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
          const payload = {
            heroBadgeText, heroTitle, heroSubtitle, heroApplyBtnText, heroApplyBtnUrl, heroBrochureBtnText, heroBrochureBtnUrl, heroBgImage, heroStats,
            eliteHeading, eliteSubtitle, eliteDesc, eliteImage, eliteAdvantages,
            journeyHeading, journeySubtitle, journeySteps,
            eligibilityHeading, eligibilitySubtitle, feeStructure, mba, bba,
            ctaHeading, ctaDesc, ctaApplyBtnText, ctaApplyBtnUrl, ctaEnquiryBtnText, ctaEnquiryBtnUrl, ctaImage,
            faqHeading, faqs
          };
          await api.put('/cms/admissions-page', payload);
          Toast.fire({ icon: 'success', title: 'Admissions page settings saved successfully!' });
        } catch (err) {
          console.error('Error saving admission settings:', err);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  // CRUD helpers for Hero Stats
  const updateHeroStat = (index, field, value) => {
    const updated = [...heroStats];
    updated[index][field] = value;
    setHeroStats(updated);
  };
  const addHeroStat = () => setHeroStats([...heroStats, { value: '100%', label: 'New Metric' }]);
  const deleteHeroStat = (index) => setHeroStats(heroStats.filter((_, idx) => idx !== index));

  // CRUD helpers for Elite Advantages
  const updateAdvantage = (index, field, value) => {
    const updated = [...eliteAdvantages];
    updated[index][field] = value;
    setEliteAdvantages(updated);
  };
  const addAdvantage = () => setEliteAdvantages([...eliteAdvantages, { icon: 'Award', title: 'New Advantage Title', desc: 'Description of advantage point.' }]);
  const deleteAdvantage = (index) => setEliteAdvantages(eliteAdvantages.filter((_, idx) => idx !== index));

  // CRUD helpers for Journey Steps
  const updateJourneyStep = (index, field, value) => {
    const updated = [...journeySteps];
    updated[index][field] = value;
    setJourneySteps(updated);
  };
  const addJourneyStep = () => setJourneySteps([...journeySteps, { step: String(journeySteps.length + 1).padStart(2, '0'), title: 'New Step Title', duration: 'Duration info', desc: 'Detailed description of this application phase.', icon: 'CheckCircle2' }]);
  const deleteJourneyStep = (index) => setJourneySteps(journeySteps.filter((_, idx) => idx !== index));
  const moveJourneyStep = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === journeySteps.length - 1) return;
    const updated = [...journeySteps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    setJourneySteps(updated);
  };

  // CRUD helpers for Program Criteria/Highlights strings
  const addProgStringItem = (progKey, arrayKey) => {
    const targetObj = progKey === 'MBA' ? { ...mba } : { ...bba };
    const setFunc = progKey === 'MBA' ? setMba : setBba;
    targetObj[arrayKey] = [...(targetObj[arrayKey] || []), 'Label : New detail text value'];
    setFunc(targetObj);
  };
  const updateProgStringItem = (progKey, arrayKey, index, value) => {
    const targetObj = progKey === 'MBA' ? { ...mba } : { ...bba };
    const setFunc = progKey === 'MBA' ? setMba : setBba;
    const list = [...targetObj[arrayKey]];
    list[index] = value;
    targetObj[arrayKey] = list;
    setFunc(targetObj);
  };
  const deleteProgStringItem = (progKey, arrayKey, index) => {
    const targetObj = progKey === 'MBA' ? { ...mba } : { ...bba };
    const setFunc = progKey === 'MBA' ? setMba : setBba;
    targetObj[arrayKey] = targetObj[arrayKey].filter((_, idx) => idx !== index);
    setFunc(targetObj);
  };

  // CRUD helpers for FAQs
  const addFaq = () => setFaqs([...faqs, { question: 'New Question About Admissions?', answer: 'Detailed explanation and official guidance answer.' }]);
  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };
  const deleteFaq = (index) => setFaqs(faqs.filter((_, idx) => idx !== index));
  const moveFaq = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;
    const updated = [...faqs];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    setFaqs(updated);
  };

  

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Admissions Page Management"
        description="Manage hero banner, advantage highlights, application steps, MBA/BBA eligibility standards, fees, call-to-action, and frequently asked questions."
        onPreview={() => window.open('/admissions', '_blank')}
        onSave={handleSave}
        isSaving={isSaving}
      />

      
        <SectionForm title="Hero Banner Settings">
<div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apply Button Text</label>
                <input
                  type="text"
                  value={heroApplyBtnText}
                  onChange={(e) => setHeroApplyBtnText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apply Button URL</label>
                <input
                  type="text"
                  value={heroApplyBtnUrl}
                  onChange={(e) => setHeroApplyBtnUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brochure Button Text</label>
                <input
                  type="text"
                  value={heroBrochureBtnText}
                  onChange={(e) => setHeroBrochureBtnText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brochure Button URL</label>
                <input
                  type="text"
                  value={heroBrochureBtnUrl}
                  onChange={(e) => setHeroBrochureBtnUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <LogoUploader
                label="Hero Background Image"
                currentImage={heroBgImage}
                onImageChange={setHeroBgImage}
              />
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-700">Hero Stat Counters</h3>
                <button
                  type="button"
                  onClick={addHeroStat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stat</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heroStats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => deleteHeroStat(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Value (e.g. 98%)</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateHeroStat(idx, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateHeroStat(idx, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
</SectionForm>

<SectionForm title="Elite Advantage Section Settings">
  <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section Heading</label>
                <input
                  type="text"
                  value={eliteHeading}
                  onChange={(e) => setEliteHeading(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={eliteSubtitle}
                  onChange={(e) => setEliteSubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description Paragraph</label>
              <textarea
                rows={4}
                value={eliteDesc}
                onChange={(e) => setEliteDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
              />
            </div>

            <div className="pt-4 border-t">
              <LogoUploader
                label="Right Side Section Image"
                currentImage={eliteImage}
                onImageChange={setEliteImage}
              />
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-700">Advantage Highlight Cards</h3>
                <button
                  type="button"
                  onClick={addAdvantage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Advantage Card</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eliteAdvantages.map((adv, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => deleteAdvantage(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={adv.title}
                        onChange={(e) => updateAdvantage(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={adv.desc}
                        onChange={(e) => updateAdvantage(idx, 'desc', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
</SectionForm>

<SectionForm title="Application Journey Settings">
  <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
                <input
                  type="text"
                  value={journeyHeading}
                  onChange={(e) => setJourneyHeading(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={journeySubtitle}
                  onChange={(e) => setJourneySubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-700">Application Steps ({journeySteps.length})</h3>
                <button
                  type="button"
                  onClick={addJourneyStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Journey Step</span>
                </button>
              </div>

              <div className="space-y-4">
                {journeySteps.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center gap-4 relative">
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveJourneyStep(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1.5 rounded border ${idx === 0 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:bg-white'}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveJourneyStep(idx, 'down')}
                        disabled={idx === journeySteps.length - 1}
                        className={`p-1.5 rounded border ${idx === journeySteps.length - 1 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:bg-white'}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 w-full">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Step #</label>
                        <input
                          type="text"
                          value={step.step}
                          onChange={(e) => updateJourneyStep(idx, 'step', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateJourneyStep(idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Duration Tag</label>
                        <input
                          type="text"
                          value={step.duration}
                          onChange={(e) => updateJourneyStep(idx, 'duration', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={step.desc}
                          onChange={(e) => updateJourneyStep(idx, 'desc', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteJourneyStep(idx)}
                      className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
</SectionForm>

<SectionForm title="Eligibility Standards & Fee Structure">
  <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section Heading</label>
                <input
                  type="text"
                  value={eligibilityHeading}
                  onChange={(e) => setEligibilityHeading(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={eligibilitySubtitle}
                  onChange={(e) => setEligibilitySubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-primary mb-2">Fee Amount Display (e.g. ₹1,50,000)</label>
                <input
                  type="text"
                  value={feeStructure.amount}
                  onChange={(e) => setFeeStructure({ ...feeStructure, amount: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary mb-2">Fee Period Label (e.g. per semester)</label>
                <input
                  type="text"
                  value={feeStructure.period}
                  onChange={(e) => setFeeStructure({ ...feeStructure, period: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white"
                />
              </div>
            </div>

            {/* Sub-tabs for MBA vs BBA */}
            <div className="pt-6 border-t space-y-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProgTab('MBA')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeProgTab === 'MBA' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  MBA Program Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProgTab('BBA')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeProgTab === 'BBA' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  BBA Program Details
                </button>
              </div>

              {['MBA', 'BBA'].map((prog) => {
                if (activeProgTab !== prog) return null;
                const currentObj = prog === 'MBA' ? mba : bba;
                const setObj = prog === 'MBA' ? setMba : setBba;

                return (
                  <div key={prog} className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">General Eligibility Summary Text</label>
                        <textarea
                          rows={2}
                          value={currentObj.eligibilityText}
                          onChange={(e) => setObj({ ...currentObj, eligibilityText: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Approved Intake Badge Text (e.g. 60 Seats)</label>
                        <input
                          type="text"
                          value={currentObj.approvedIntake}
                          onChange={(e) => setObj({ ...currentObj, approvedIntake: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white"
                        />
                      </div>
                    </div>

                    {/* Eligibility Criteria Strings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-gray-700">Eligibility Criteria List Items (Use Colon ':' to separate Label from Value)</label>
                        <button
                          type="button"
                          onClick={() => addProgStringItem(prog, 'eligibilityCriteria')}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Criteria Item</span>
                        </button>
                      </div>
                      {currentObj.eligibilityCriteria.map((str, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={str}
                            onChange={(e) => updateProgStringItem(prog, 'eligibilityCriteria', i, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => deleteProgStringItem(prog, 'eligibilityCriteria', i)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Program Highlights Strings */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-gray-700">Program Highlights List Items (Use Colon ':' to separate Label from Value)</label>
                        <button
                          type="button"
                          onClick={() => addProgStringItem(prog, 'programHighlights')}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Highlight Item</span>
                        </button>
                      </div>
                      {currentObj.programHighlights.map((str, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={str}
                            onChange={(e) => updateProgStringItem(prog, 'programHighlights', i, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => deleteProgStringItem(prog, 'programHighlights', i)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
</SectionForm>

<SectionForm title="Admission CTA Banner Settings">
  <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={ctaDesc}
                onChange={(e) => setCtaDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apply Button Text</label>
                <input
                  type="text"
                  value={ctaApplyBtnText}
                  onChange={(e) => setCtaApplyBtnText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apply Button URL</label>
                <input
                  type="text"
                  value={ctaApplyBtnUrl}
                  onChange={(e) => setCtaApplyBtnUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enquiry Button Text</label>
                <input
                  type="text"
                  value={ctaEnquiryBtnText}
                  onChange={(e) => setCtaEnquiryBtnText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enquiry Button URL</label>
                <input
                  type="text"
                  value={ctaEnquiryBtnUrl}
                  onChange={(e) => setCtaEnquiryBtnUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <LogoUploader
                label="CTA Right Visual Image"
                currentImage={ctaImage}
                onImageChange={setCtaImage}
              />
            </div>
          </div>
</SectionForm>

<SectionForm title="FAQ Section Settings">
  <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={faqHeading}
                onChange={(e) => setFaqHeading(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
              />
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-700">Frequently Asked Questions ({faqs.length})</h3>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-blue-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center gap-4 relative">
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveFaq(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1.5 rounded border ${idx === 0 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:bg-white'}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFaq(idx, 'down')}
                        disabled={idx === faqs.length - 1}
                        className={`p-1.5 rounded border ${idx === faqs.length - 1 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:bg-white'}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 w-full">
                      <div className="md:col-span-5">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold bg-white"
                        />
                      </div>
                      <div className="md:col-span-7">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Answer</label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteFaq(idx)}
                      className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
</SectionForm>
</div>
);
};
export default ManageAdmissionsPage;
