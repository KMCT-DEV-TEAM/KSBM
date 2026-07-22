"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Award, FileText, Briefcase, Users, Activity, Monitor, Tablet, Smartphone, X, RefreshCw, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import Loader from '../../../components/Loader';
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

const ManagePlacementPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = React.useRef(null);
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Hero State
  const [hero, setHero] = useState({ title: '', subtitle: '', badge: '', backgroundImage: '' });

  // Overview State
  const [overview, setOverview] = useState({ title: '', deskBadge: '', description1: '', description2: '', stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', collageImage1: '', collageImage2: '', floatingQuote: '' });

  // Proud Achievers State
  const [proudAchievers, setProudAchievers] = useState({ title: '', items: [] });

  // Top Recruiters State
  const [topRecruiters, setTopRecruiters] = useState({ title: '', description: '', items: [] });

  // Excellence Support State
  const [excellenceSupport, setExcellenceSupport] = useState({ title: '', description: '', backgroundImage: '', listOne: [], listTwo: [] });

  // Faculty In-Charge State
  const [facultyInCharge, setFacultyInCharge] = useState({ badge: '', title: '', description: '', items: [] });

  // Placement Committee State
  const [placementCommittee, setPlacementCommittee] = useState({ title: '', description: '', buttonText: '', image: '', items: [] });

  // Activities State
  const [activities, setActivities] = useState({ title: '', items: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/placement-page');
      const data = response.data;
      if (data.hero) setHero(data.hero);
      if (data.overview) setOverview(data.overview);
      if (data.proudAchievers) setProudAchievers(data.proudAchievers);
      if (data.topRecruiters) setTopRecruiters(data.topRecruiters);
      if (data.excellenceSupport) setExcellenceSupport(data.excellenceSupport);
      if (data.facultyInCharge) setFacultyInCharge(data.facultyInCharge);
      if (data.placementCommittee) setPlacementCommittee(data.placementCommittee);
      if (data.activities) setActivities(data.activities);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Toast.fire({ icon: 'error', title: 'Failed to load page settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        hero,
        overview,
        proudAchievers,
        topRecruiters,
        excellenceSupport,
        facultyInCharge,
        placementCommittee,
        activities
      };
      await api.put('/cms/placement-page', payload);
      Toast.fire({ icon: 'success', title: 'Placement Page updated successfully' });
    } catch (error) {
      console.error('Failed to save', error);
      Toast.fire({ icon: 'error', title: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all text, images, and cards for the Placement Page to their original standard state. You still need to click "Save Changes" to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'danger',
      action: async () => {
        setHero({
          badge: 'CAREER & PLACEMENTS',
          title: 'Where Ambition Meets Opportunity',
          subtitle: 'KSBM connects our dynamic management graduates with global industry leaders, fostering careers that shape the future of business.',
          backgroundImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop'
        });

        setOverview({
          title: 'Placement Excellence',
          deskBadge: 'Management Desk',
          description1: 'At KSBM, placement is not just an event, it is a process which starts from the first semester. We understand that every student has a unique set of skills and career aspirations. Our aim is to connect the right talent with the right opportunity.',
          description2: 'We have a dedicated placement cell that works tirelessly to bridge the gap between academia and industry. By organizing various training programs, seminars, and mock interviews, we ensure our students are well-prepared to face the competitive corporate world.',
          stat1Value: '100+',
          stat1Label: 'Students Placed',
          stat2Value: '100+',
          stat2Label: 'Companies Visited',
          collageImage1: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
          collageImage2: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
          floatingQuote: '"KSBM graduates are consistently rated as \'Highly Adaptable\' by global recruiters."'
        });

        setProudAchievers({
          title: 'Proud Achievers',
          items: [
            { name: 'Pratik Patil', program: 'MBA 2022-24', company: 'Google', role: 'Business Analyst', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop' },
            { name: 'Megha Sharma', program: 'MBA 2022-24', company: 'Microsoft', role: 'Product Manager', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
            { name: 'Rohit Verma', program: 'MBA 2022-24', company: 'Infosys', role: 'Software Engineer', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
            { name: 'Neha Gupta', program: 'MBA 2022-24', company: 'Cognizant', role: 'Consultant', companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop' }
          ]
        });

        setTopRecruiters({
          title: 'Top Recruiters',
          description: 'Our strong industry connections ensure that our students get the best career opportunities. We have a consistent track record of high-quality placements across diverse sectors.',
          items: [
            { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
            { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
            { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg' },
            { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' }
          ]
        });

        setExcellenceSupport({
          title: 'Excellence in Placement Support',
          description: 'Comprehensive training and guidance to ensure you step into the corporate world with confidence and the right skill set.',
          listOne: [
            { title: 'Dedicated Placement Cell' },
            { title: 'Industry Mentorship Programs' },
            { title: 'Group Discussion Training' },
            { title: 'Internship Assistance' }
          ],
          listTwo: [
            { title: 'Mock Interviews' },
            { title: 'Aptitude Test Preparation' },
            { title: 'Corporate Guest Lectures' },
            { title: 'Personality Development' }
          ],
          backgroundImage: '/assets/Images/Rectangle 67.png'
        });

        setFacultyInCharge({
          badge: 'Faculty In-Charge',
          title: 'Empowering Careers. Inspiring Success.',
          description: 'Our experienced faculty members work tirelessly to bridge the gap between academia and industry, ensuring every student has access to the best career opportunities through dedicated mentorship and corporate engagement.',
          items: [
            { name: 'Dr. Sarah Johnson', designation: 'Head of Placements', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
            { name: 'Prof. David Chen', designation: 'Corporate Relations', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' }
          ]
        });

        setPlacementCommittee({
          title: 'Placement Committee',
          description: 'The Placement Committee consists of student representatives who actively coordinate with recruiters, schedule interviews, and ensure a smooth placement process.',
          buttonText: 'Connect with Committee',
          image: '/assets/Images/placement.png',
          items: [
            { name: 'Rahul Sharma', role: 'President', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800&auto=format&fit=crop' },
            { name: 'Anita Patel', role: 'Corporate Outreach', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
            { name: 'Vikram Singh', role: 'Student Coordinator', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' }
          ]
        });

        setActivities({
          title: 'Placement Activities & Events',
          items: [
            { title: 'Mock Interview Session', description: 'Industry experts conduct one-on-one mock interviews to prepare students for real-world scenarios.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop' },
            { title: 'Resume Building Workshop', description: 'Interactive workshop helping students craft compelling resumes that stand out to top recruiters.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop' },
            { title: 'Pre-Placement Talk', description: 'An engaging session by top recruiters on expectations from fresh graduates and how to build a strong career trajectory.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800&auto=format&fit=crop' }
          ]
        });

        Toast.fire({ icon: 'info', title: 'Reset to default template values. Click "Save Changes" to apply.' });
      }
    });
  };

  const confirmSave = () => {
    confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to update the Placement Landing Page content on the live website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: handleSave
    });
  };

  // Helper for arrays
  const handleArrayAdd = (setter, state, defaultItem) => {
    setter({ ...state, items: [...state.items, defaultItem] });
  };

  const handleArrayRemove = (setter, state, index) => {
    const newItems = [...state.items];
    newItems.splice(index, 1);
    setter({ ...state, items: newItems });
  };

  const handleArrayChange = (setter, state, index, field, value) => {
    const newItems = [...state.items];
    newItems[index][field] = value;
    setter({ ...state, items: newItems });
  };

  const moveItem = (setter, state, index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === state.items.length - 1)
    ) return;
    const newItems = [...state.items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    setter({ ...state, items: newItems });
  };

  // Dedicated helper for listOne and listTwo in Excellence Support
  const handleFeatureListAdd = (listName) => {
    setExcellenceSupport({ ...excellenceSupport, [listName]: [...excellenceSupport[listName], { title: '' }] });
  };
  const handleFeatureListRemove = (listName, index) => {
    const newList = [...excellenceSupport[listName]];
    newList.splice(index, 1);
    setExcellenceSupport({ ...excellenceSupport, [listName]: newList });
  };
  const handleFeatureListChange = (listName, index, value) => {
    const newList = [...excellenceSupport[listName]];
    newList[index].title = value;
    setExcellenceSupport({ ...excellenceSupport, [listName]: newList });
  };

  if (isLoading) return <Loader />;

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <Award className="w-4 h-4" /> },
    { id: 'overview', name: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'proudAchievers', name: 'Achievers', icon: <Award className="w-4 h-4" /> },
    { id: 'topRecruiters', name: 'Recruiters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'excellenceSupport', name: 'Excellence', icon: <Award className="w-4 h-4" /> },
    { id: 'facultyInCharge', name: 'Faculty', icon: <Users className="w-4 h-4" /> },
    { id: 'placementCommittee', name: 'Committee', icon: <Users className="w-4 h-4" /> },
    { id: 'activities', name: 'Activities', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Manage Placement Page"
        description="Edit content and sections of the Placement Landing Page"
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={confirmSave}
        isSaving={isSaving}
      />


      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
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
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div>
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Hero Section Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Badge Text</label>
                <input type="text" value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                <textarea value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Subtitle</label>
                <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Background Image</label>
                <LogoUploader value={hero.backgroundImage} onChange={(url) => setHero({ ...hero, backgroundImage: url })} />
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Overview Section Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Badge Text</label>
                  <input type="text" value={overview.deskBadge} onChange={(e) => setOverview({ ...overview, deskBadge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                  <input type="text" value={overview.title} onChange={(e) => setOverview({ ...overview, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description Paragraph 1</label>
                <textarea value={overview.description1} onChange={(e) => setOverview({ ...overview, description1: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description Paragraph 2</label>
                <textarea value={overview.description2} onChange={(e) => setOverview({ ...overview, description2: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Floating Quote</label>
                <input type="text" value={overview.floatingQuote} onChange={(e) => setOverview({ ...overview, floatingQuote: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm">
                  <h4 className="text-sm font-semibold mb-3">Statistic 1</h4>
                  <input type="text" placeholder="Value (e.g. 100+)" value={overview.stat1Value} onChange={(e) => setOverview({ ...overview, stat1Value: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium mb-2" />
                  <input type="text" placeholder="Label (e.g. Students Placed)" value={overview.stat1Label} onChange={(e) => setOverview({ ...overview, stat1Label: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                </div>
                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm">
                  <h4 className="text-sm font-semibold mb-3">Statistic 2</h4>
                  <input type="text" placeholder="Value (e.g. 99%)" value={overview.stat2Value} onChange={(e) => setOverview({ ...overview, stat2Value: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium mb-2" />
                  <input type="text" placeholder="Label (e.g. Placement Rate)" value={overview.stat2Label} onChange={(e) => setOverview({ ...overview, stat2Label: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Collage Image 1</label>
                  <LogoUploader value={overview.collageImage1} onChange={(url) => setOverview({ ...overview, collageImage1: url })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Collage Image 2</label>
                  <LogoUploader value={overview.collageImage2} onChange={(url) => setOverview({ ...overview, collageImage2: url })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACHIEVERS TAB */}
        {activeTab === 'proudAchievers' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Proud Achievers Settings</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
              <input type="text" value={proudAchievers.title} onChange={(e) => setProudAchievers({ ...proudAchievers, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#111836]">Achievers List ({proudAchievers.items.length})</h3>
                <button onClick={() => handleArrayAdd(setProudAchievers, proudAchievers, { name: '', program: '', company: '', role: '', companyLogo: '', image: '' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  <Plus className="w-4 h-4" /> Add Achiever
                </button>
              </div>
              {proudAchievers.items.map((item, index) => (
                <div key={index} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm">
                  <div className="flex justify-between items-center mb-5 border-b pb-3">
                    <span className="font-semibold text-gray-800">Achiever #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => moveItem(setProudAchievers, proudAchievers, index, -1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveItem(setProudAchievers, proudAchievers, index, 1)} disabled={index === proudAchievers.items.length - 1} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => handleArrayRemove(setProudAchievers, proudAchievers, index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={item.name} onChange={(e) => handleArrayChange(setProudAchievers, proudAchievers, index, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                    <input type="text" placeholder="Program (e.g. MBA 2022-24)" value={item.program} onChange={(e) => handleArrayChange(setProudAchievers, proudAchievers, index, 'program', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                    <input type="text" placeholder="Company Name" value={item.company} onChange={(e) => handleArrayChange(setProudAchievers, proudAchievers, index, 'company', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                    <input type="text" placeholder="Role/Designation" value={item.role} onChange={(e) => handleArrayChange(setProudAchievers, proudAchievers, index, 'role', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Student Photo</label>
                      <LogoUploader value={item.image} onChange={(url) => handleArrayChange(setProudAchievers, proudAchievers, index, 'image', url)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Company Logo</label>
                      <LogoUploader value={item.companyLogo} onChange={(url) => handleArrayChange(setProudAchievers, proudAchievers, index, 'companyLogo', url)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECRUITERS TAB */}
        {activeTab === 'topRecruiters' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Top Recruiters Settings</h2>
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
                <input type="text" value={topRecruiters.title} onChange={(e) => setTopRecruiters({ ...topRecruiters, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                <textarea value={topRecruiters.description} onChange={(e) => setTopRecruiters({ ...topRecruiters, description: e.target.value })} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"></textarea>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#111836]">Recruiters Logos ({topRecruiters.items.length})</h3>
                <button onClick={() => handleArrayAdd(setTopRecruiters, topRecruiters, { name: '', logo: '' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  <Plus className="w-4 h-4" /> Add Recruiter
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRecruiters.items.map((item, index) => (
                  <div key={index} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-800">Logo #{index + 1}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveItem(setTopRecruiters, topRecruiters, index, -1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveItem(setTopRecruiters, topRecruiters, index, 1)} disabled={index === topRecruiters.items.length - 1} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
                        <button onClick={() => handleArrayRemove(setTopRecruiters, topRecruiters, index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <input type="text" placeholder="Company Name" value={item.name} onChange={(e) => handleArrayChange(setTopRecruiters, topRecruiters, index, 'name', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                    <LogoUploader value={item.logo} onChange={(url) => handleArrayChange(setTopRecruiters, topRecruiters, index, 'logo', url)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXCELLENCE TAB */}
        {activeTab === 'excellenceSupport' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Excellence Support Settings</h2>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
                <input type="text" value={excellenceSupport.title} onChange={(e) => setExcellenceSupport({ ...excellenceSupport, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                <textarea value={excellenceSupport.description} onChange={(e) => setExcellenceSupport({ ...excellenceSupport, description: e.target.value })} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Background Image</label>
                <LogoUploader value={excellenceSupport.backgroundImage} onChange={(url) => setExcellenceSupport({ ...excellenceSupport, backgroundImage: url })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* List One */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-5 border-b pb-3">
                  <h3 className="font-semibold text-gray-800">Feature List 1</h3>
                  <button onClick={() => handleFeatureListAdd('listOne')} className="text-primary hover:text-primary/80"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  {excellenceSupport.listOne.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={item.title} onChange={(e) => handleFeatureListChange('listOne', index, e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded" placeholder="Feature..." />
                      <button onClick={() => handleFeatureListRemove('listOne', index)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
              {/* List Two */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-5 border-b pb-3">
                  <h3 className="font-semibold text-gray-800">Feature List 2</h3>
                  <button onClick={() => handleFeatureListAdd('listTwo')} className="text-primary hover:text-primary/80"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  {excellenceSupport.listTwo.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={item.title} onChange={(e) => handleFeatureListChange('listTwo', index, e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded" placeholder="Feature..." />
                      <button onClick={() => handleFeatureListRemove('listTwo', index)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FACULTY TAB */}
        {activeTab === 'facultyInCharge' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Faculty In-Charge Settings</h2>
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Badge Text</label>
                <input type="text" value={facultyInCharge.badge} onChange={(e) => setFacultyInCharge({ ...facultyInCharge, badge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
                <input type="text" value={facultyInCharge.title} onChange={(e) => setFacultyInCharge({ ...facultyInCharge, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                <textarea value={facultyInCharge.description} onChange={(e) => setFacultyInCharge({ ...facultyInCharge, description: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"></textarea>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#111836]">Faculty List ({facultyInCharge.items.length})</h3>
                <button onClick={() => handleArrayAdd(setFacultyInCharge, facultyInCharge, { name: '', designation: '', image: '' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  <Plus className="w-4 h-4" /> Add Faculty
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facultyInCharge.items.map((item, index) => (
                  <div key={index} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm">
                    <div className="flex justify-between items-center mb-5 border-b pb-3">
                      <span className="font-semibold text-gray-800">Faculty #{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleArrayRemove(setFacultyInCharge, facultyInCharge, index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input type="text" placeholder="Name" value={item.name} onChange={(e) => handleArrayChange(setFacultyInCharge, facultyInCharge, index, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                      <input type="text" placeholder="Designation" value={item.designation} onChange={(e) => handleArrayChange(setFacultyInCharge, facultyInCharge, index, 'designation', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Photo</label>
                        <LogoUploader value={item.image} onChange={(url) => handleArrayChange(setFacultyInCharge, facultyInCharge, index, 'image', url)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMITTEE TAB */}
        {activeTab === 'placementCommittee' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Placement Committee Settings</h2>
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
                <input type="text" value={placementCommittee.title} onChange={(e) => setPlacementCommittee({ ...placementCommittee, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                <textarea value={placementCommittee.description} onChange={(e) => setPlacementCommittee({ ...placementCommittee, description: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Button Text</label>
                  <input type="text" value={placementCommittee.buttonText} onChange={(e) => setPlacementCommittee({ ...placementCommittee, buttonText: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Side Vector Image</label>
                  <LogoUploader value={placementCommittee.image} onChange={(url) => setPlacementCommittee({ ...placementCommittee, image: url })} />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Activities & Events Settings</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
              <input type="text" value={activities.title} onChange={(e) => setActivities({ ...activities, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#111836]">Activities List ({activities.items.length})</h3>
                <button onClick={() => handleArrayAdd(setActivities, activities, { title: '', description: '', image: '' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  <Plus className="w-4 h-4" /> Add Activity
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.items.map((item, index) => (
                  <div key={index} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm">
                    <div className="flex justify-between items-center mb-5 border-b pb-3">
                      <span className="font-semibold text-gray-800">Activity #{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveItem(setActivities, activities, index, -1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveItem(setActivities, activities, index, 1)} disabled={index === activities.items.length - 1} className="p-1 text-gray-500 hover:text-primary disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
                        <button onClick={() => handleArrayRemove(setActivities, activities, index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input type="text" placeholder="Title" value={item.title} onChange={(e) => handleArrayChange(setActivities, activities, index, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium" />
                      <textarea placeholder="Description" value={item.description} onChange={(e) => handleArrayChange(setActivities, activities, index, 'description', e.target.value)} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"></textarea>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                        <LogoUploader value={item.image} onChange={(url) => handleArrayChange(setActivities, activities, index, 'image', url)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-t-2xl shadow-lg border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-base">Placement Page Live Preview</span>
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
                href="/placement"
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
                src="/placement"
                title="Live Placement Page Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagePlacementPage;
