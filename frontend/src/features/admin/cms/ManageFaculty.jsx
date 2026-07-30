"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Users, Briefcase, FileText, GripVertical, Pencil, X, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { uploadDeferredImage } from './utils/uploadHelper';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const FacultyMemberCard = ({ member, index, onEdit, onDelete }) => {
  const controls = useDragControls();
  
  // Try to safely get the display image
  let displayImg = '/assets/Images/image 31.png';
  if (member?.image) {
    if (typeof member.image === 'string') displayImg = member.image;
    else if (member.image.previewUrl) displayImg = member.image.previewUrl;
  }

  return (
    <Reorder.Item 
      value={member}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4 relative group hover:border-primary/30 transition-colors"
    >
      <div 
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-primary transition-colors"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
        <img src={displayImg} alt={member?.name || 'Faculty Member'} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate">{member?.name || 'Unnamed Member'}</h4>
        <p className="text-sm text-gray-500 truncate">{member?.title || 'No Title'}</p>
      </div>
      
      <div className="flex items-center gap-2 pr-2">
        <button 
          onClick={() => onEdit(index)}
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(index)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
};

const ManageFaculty = () => {
  const [showHeroTextContent, setShowHeroTextContent] = useState(true);
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  
  const [showIntro, setShowIntro] = useState(true);
  const [introSubheading, setIntroSubheading] = useState('');
  const [introHeading, setIntroHeading] = useState('');
  const [introText, setIntroText] = useState('');
  
  const [showKsbmFaculty, setShowKsbmFaculty] = useState(true);
  const [ksbmFaculty, setKsbmFaculty] = useState([]);
  const [showAdjunctFaculty, setShowAdjunctFaculty] = useState(true);
  const [adjunctFaculty, setAdjunctFaculty] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [modalType, setModalType] = useState('ksbm'); // 'ksbm' or 'adjunct'
  const [currentMemberIndex, setCurrentMemberIndex] = useState(null);
  const [currentMember, setCurrentMember] = useState({ name: '', title: '', image: '' });

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'intro', label: 'Intro Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'ksbm', label: 'KSBM Faculty', icon: <Users className="w-4 h-4" /> },
    { id: 'adjunct', label: 'Adjunct Faculty', icon: <Briefcase className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/faculty');
      if (data) {
        if (data.showHeroTextContent !== undefined) setShowHeroTextContent(data.showHeroTextContent);
        if (data.heroHeading) setHeroHeading(data.heroHeading);
        if (data.heroSubtext) setHeroSubtext(data.heroSubtext);
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        
        if (data.showIntro !== undefined) setShowIntro(data.showIntro);
        if (data.introSubheading) setIntroSubheading(data.introSubheading);
        if (data.introHeading) setIntroHeading(data.introHeading);
        if (data.introText) setIntroText(data.introText);
        
        if (data.showKsbmFaculty !== undefined) setShowKsbmFaculty(data.showKsbmFaculty);
        if (data.showAdjunctFaculty !== undefined) setShowAdjunctFaculty(data.showAdjunctFaculty);
        
        if (data.ksbmFaculty && data.ksbmFaculty.length > 0) setKsbmFaculty(data.ksbmFaculty);
        if (data.adjunctFaculty && data.adjunctFaculty.length > 0) setAdjunctFaculty(data.adjunctFaculty);
      }
    } catch (error) {
      console.error('Error fetching Faculty settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Faculty Settings?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const newHeroBgImage = await uploadDeferredImage(heroBgImage, '/upload/faculty');
          
          const newKsbmFaculty = await Promise.all(ksbmFaculty.map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/faculty')
          })));
          
          const newAdjunctFaculty = await Promise.all(adjunctFaculty.map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/faculty')
          })));

          await api.put('/cms/faculty', { 
            showHeroTextContent, heroHeading, heroSubtext, heroBgImage: newHeroBgImage,
            showIntro, introSubheading, introHeading, introText,
            showKsbmFaculty, showAdjunctFaculty,
            ksbmFaculty: newKsbmFaculty, adjunctFaculty: newAdjunctFaculty 
          }, { hideLoader: true });
          
          // Update local state so subsequent deletions use the real server URL instead of the stale blob URL
          setHeroBgImage(newHeroBgImage);
          setKsbmFaculty(newKsbmFaculty);
          setAdjunctFaculty(newAdjunctFaculty);
          
          Toast.fire({ icon: 'success', title: 'Faculty settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
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
      message: 'This will reset all input fields to default values. Click "Save Changes" to apply.',
      confirmText: 'Yes, reset!',
      variant: 'primary',
      action: async () => {
        setShowHeroTextContent(true);
        setHeroHeading('Faculty Members');
        setHeroSubtext('Our distinguished faculty are committed to delivering quality education through innovative teaching, practical learning, and personalized mentorship, helping students build the skills and confidence needed for successful careers.');
        setHeroBgImage('/assets/Images/image 2.png');
        
        setShowIntro(true);
        setIntroSubheading('FACULTY MEMBERS');
        setIntroHeading('Learn from the Best');
        setIntroText('At KSBM, our faculty members are the cornerstone of academic excellence. With a blend of strong academic credentials, industry expertise, and a passion for teaching, they create a dynamic learning environment that encourages critical thinking, innovation, and leadership. Beyond the classroom, our faculty mentor, inspire, and guide students through every stage of their academic journey, equipping them with the knowledge, confidence, and practical skills needed to succeed in an ever-evolving global business landscape.');
        setShowKsbmFaculty(true);
        setShowAdjunctFaculty(true);
        
        Toast.fire({ icon: 'info', title: 'Reset to defaults. Click Save Changes to apply.' });
      }
    });
  };

  // KSBM Faculty helpers
  const openModal = (mode, type, index = null) => {
    setModalMode(mode);
    setModalType(type);
    setCurrentMemberIndex(index);
    if (mode === 'edit' && index !== null) {
      const list = type === 'ksbm' ? ksbmFaculty : adjunctFaculty;
      setCurrentMember(list[index]);
    } else {
      setCurrentMember({ name: '', title: '', image: '/assets/Images/image 31.png' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember({ name: '', title: '', image: '' });
    setCurrentMemberIndex(null);
  };

  const handleSaveModal = () => {
    if (!currentMember.name || !currentMember.title) {
      Toast.fire({ icon: 'warning', title: 'Please fill out all fields.' });
      return;
    }
    
    if (modalType === 'ksbm') {
      if (modalMode === 'add') {
        setKsbmFaculty([...ksbmFaculty, { ...currentMember, order: ksbmFaculty.length + 1 }]);
      } else {
        const updated = [...ksbmFaculty];
        updated[currentMemberIndex] = currentMember;
        setKsbmFaculty(updated);
      }
    } else {
      if (modalMode === 'add') {
        setAdjunctFaculty([...adjunctFaculty, { ...currentMember, order: adjunctFaculty.length + 1 }]);
      } else {
        const updated = [...adjunctFaculty];
        updated[currentMemberIndex] = currentMember;
        setAdjunctFaculty(updated);
      }
    }
    
    closeModal();
  };

  const deleteImageFromServer = async (imageUrl) => {
    if (imageUrl && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('http')) {
      const isDefault = imageUrl.includes('image 2.png') || imageUrl.includes('image 31.png') || imageUrl.includes('default-');
      if (!isDefault) {
        try {
          await api.delete('/upload', { data: { fileUrl: imageUrl }, hideLoader: true });
        } catch (err) {
          console.warn('Skipped deleting image:', err);
        }
      }
    }
  };

  const handleDeleteKsbmMember = async (index) => {
    await confirmAction({
      title: 'Remove Member?',
      message: 'Are you sure you want to remove this faculty member?',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        const memberToDelete = ksbmFaculty[index];
        await deleteImageFromServer(memberToDelete?.image);
        const updated = ksbmFaculty.filter((_, i) => i !== index);
        setKsbmFaculty(updated);
        Toast.fire({ icon: 'success', title: 'Member removed from list.' });
      }
    });
  };

  // Adjunct Faculty helpers
  const handleDeleteAdjunctMember = async (index) => {
    await confirmAction({
      title: 'Remove Member?',
      message: 'Are you sure you want to remove this adjunct member?',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        const memberToDelete = adjunctFaculty[index];
        await deleteImageFromServer(memberToDelete?.image);
        const updated = adjunctFaculty.filter((_, i) => i !== index);
        setAdjunctFaculty(updated);
        Toast.fire({ icon: 'success', title: 'Adjunct member removed from list.' });
      }
    });
  };

  // Send preview data to the iframe whenever relevant state changes
  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        activeTab,
        showHeroTextContent, heroHeading, heroSubtext, heroBgImage,
        showIntro, introSubheading, introHeading, introText,
        showKsbmFaculty, showAdjunctFaculty,
        ksbmFaculty: ksbmFaculty.map(m => ({
          ...m,
          image: typeof m.image === 'string' ? m.image : m.image?.previewUrl || '/assets/Images/image 31.png'
        })),
        adjunctFaculty: adjunctFaculty.map(m => ({
          ...m,
          image: typeof m.image === 'string' ? m.image : m.image?.previewUrl || '/assets/Images/image 31.png'
        })),
      };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'faculty' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-faculty-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-faculty-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, heroHeading, heroSubtext, heroBgImage, introSubheading, introHeading, introText, ksbmFaculty, adjunctFaculty]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="w-full pb-12 space-y-8">
      {/* Tabs */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div
            ref={tabsContainerRef}
            className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <PageHeader
          title="Manage Faculty & People Page"
          description="Configure the hero banner, intro section, KSBM full-time faculty, and adjunct faculty lists."
          onPreview={() => setIsPreviewModalOpen(true)}
          onReset={handleResetToDefault}
          onSave={handleSave}
          isSaving={isSaving || isUploading}
        />

        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
            <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
                <Eye className="w-5 h-5" /> Live Preview
              </div>

              <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
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
            <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center p-4">
              <div className={`bg-white shadow-2xl transition-all duration-300 h-full ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
                <iframe
                  ref={iframeRef}
                  src="/preview/faculty"
                  className="w-full h-full border-0"
                  title="Faculty Preview"
                />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'hero' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-[#1e2869]">Hero Section</h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Text</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showHeroTextContent} onChange={(e) => setShowHeroTextContent(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${showHeroTextContent ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHeroTextContent ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Heading</label>
                  
</div>
<input
                  type="text"
                  value={heroHeading}
                  maxLength={50}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
<div className="text-right text-xs text-gray-400 mt-1">{heroHeading?.length || 0}/50 characters</div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Description</label>
                  
                </div>
                <textarea
                  rows="4"
                  value={heroSubtext}
                  maxLength={300}
                  onChange={(e) => setHeroSubtext(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
              <SingleImageUploader
                imageUrl={heroBgImage}
                uploadEndpoint="/upload/faculty"
                defaultImage="/assets/Images/image 2.png"
                onUploadComplete={(urlObj) => setHeroBgImage(urlObj)}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Background"
                deferredUpload={true}
              />
            </div>
          </div>
        </div>
        )}

        {activeTab === 'intro' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-[#1e2869]">Learn from the Best (Intro Section)</h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showIntro} onChange={(e) => setShowIntro(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${showIntro ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showIntro ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Intro Subheading Tag</label>
                  <span className="text-xs text-gray-400">{introSubheading?.length || 0}/50</span>
</div>
<input
                  type="text"
                  value={introSubheading}
                  maxLength={50}
                  onChange={(e) => setIntroSubheading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
<div className="text-right text-xs text-gray-400 mt-1">{heroSubtext?.length || 0}/300 characters</div>
              </div>
              <div>
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Intro Heading</label>
                  
</div>
<input
                  type="text"
                  value={introHeading}
                  maxLength={100}
                  onChange={(e) => setIntroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
<div className="text-right text-xs text-gray-400 mt-1">{introHeading?.length || 0}/100 characters</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Intro Paragraph Text</label>
                
              </div>
              <textarea
                rows="4"
                value={introText}
                maxLength={600}
                onChange={(e) => setIntroText(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
        )}

        {activeTab === 'ksbm' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-[#1e2869]">KSBM Full-Time Faculty ({ksbmFaculty.length})</h2>
              </div>
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={showKsbmFaculty} onChange={(e) => setShowKsbmFaculty(e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showKsbmFaculty ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showKsbmFaculty ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            <button
              onClick={() => openModal('add', 'ksbm')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
            {ksbmFaculty.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p>No KSBM Faculty members added yet.</p>
              </div>
            ) : (
              <Reorder.Group axis="y" values={ksbmFaculty} onReorder={setKsbmFaculty} className="space-y-3">
                {ksbmFaculty.map((member, idx) => (
                  <FacultyMemberCard 
                    key={member.order || idx} 
                    member={member} 
                    index={idx} 
                    onEdit={(i) => openModal('edit', 'ksbm', i)} 
                    onDelete={handleDeleteKsbmMember} 
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>
        )}

        {activeTab === 'adjunct' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-[#1e2869]">Adjunct Faculty ({adjunctFaculty.length})</h2>
              </div>
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={showAdjunctFaculty} onChange={(e) => setShowAdjunctFaculty(e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showAdjunctFaculty ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAdjunctFaculty ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            <button
              onClick={() => openModal('add', 'adjunct')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Adjunct
            </button>
          </div>

          <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
            {adjunctFaculty.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Briefcase className="w-12 h-12 mb-3 opacity-20" />
                <p>No Adjunct Faculty members added yet.</p>
              </div>
            ) : (
              <Reorder.Group axis="y" values={adjunctFaculty} onReorder={setAdjunctFaculty} className="space-y-3">
                {adjunctFaculty.map((member, idx) => (
                  <FacultyMemberCard 
                    key={member.order || idx} 
                    member={member} 
                    index={idx} 
                    onEdit={(i) => openModal('edit', 'adjunct', i)} 
                    onDelete={handleDeleteAdjunctMember} 
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>
        )}
          </motion.div>
      </AnimatePresence>

      {/* Shared Modal for Adding/Editing Members */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-[#1e2869]">
                  {modalMode === 'add' ? 'Add' : 'Edit'} {modalType === 'ksbm' ? 'KSBM Faculty' : 'Adjunct Faculty'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                      <span className="text-xs text-gray-400">{currentMember?.name?.length || 0}/50</span>
</div>
<input
                      type="text"
                      value={currentMember.name}
                      maxLength={50}
                      onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Dr. Navas K. M"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{introText?.length || 0}/600 characters</div>
                  </div>
                  
                  <div>
                    <div className="mb-1.5">
<label className="block text-sm font-semibold text-gray-700">Title / Designation</label>
                      
</div>
<input
                      type="text"
                      value={currentMember.title}
                      maxLength={100}
                      onChange={(e) => setCurrentMember({ ...currentMember, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Managing Trustee"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{currentMember?.title?.length || 0}/100 characters</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Portrait Image</label>
                    <SingleImageUploader
                      imageUrl={currentMember.image}
                      uploadEndpoint="/upload/faculty"
                      defaultImage="/assets/Images/image 31.png"
                      onUploadComplete={(urlObj) => setCurrentMember({ ...currentMember, image: urlObj })}
                      onUploadStateChange={setIsUploading}
                      label="Upload Portrait"
                      deferredUpload={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save {modalMode === 'add' ? 'Member' : 'Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageFaculty;
