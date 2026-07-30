"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Pencil, X, Eye, Monitor, Smartphone, Tablet, FileText, Award, Calendar, Bell, BookOpen } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { uploadDeferredImage } from './utils/uploadHelper';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import SingleDocumentUploader from './components/SingleDocumentUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const defaultExamData = {
  heroBadgeText: 'Examinations 2026',
  heroTitle: 'Stay Informed. Stay Prepared. Excel in Every Examination.',
  heroSubtitle: 'Access examination schedules, important notifications, and semester results in one place. Stay updated with key dates and academic announcements to ensure a smooth and well-organized examination experience throughout your MBA journey.',
  heroImage: '/assets/Images/examinations/exam_hero_bg.png',
  
  overviewTitle: 'Examination Overview',
  overviewText1: 'Our examination system is designed to evaluate students through a comprehensive and transparent assessment process that reflects both academic knowledge and practical application. A balanced combination of internal assessments, assignments, presentations, case studies, projects, and end-semester examinations ensures continuous learning and holistic development throughout the program.',
  overviewText2: 'The examination process follows the academic calendar and is conducted with fairness, consistency, and integrity. Students are encouraged to demonstrate analytical thinking, problem-solving abilities, and managerial competencies through various evaluation methods. Timely notifications, published examination schedules, and prompt result declarations help students stay informed and well-prepared.',
  overviewImage: '/assets/Images/examinations/exam_main.png',

  calendarTitle: 'Download the Official Exam Calendar',
  calendarText: 'Stay informed with the official Exam Calendar. Access semester schedules, examination dates, academic milestones, holidays, project timelines, and important university events—all in one place.',
  calendarViewBtnText: 'View Calendar',
  calendarViewBtnUrl: '/assets/Images/examinations/exam_schedule.png',
  calendarDownloadBtnText: 'Download Calendar',
  calendarDownloadBtnUrl: '/assets/Images/examinations/exam_schedule.png',
  calendarImage: '/assets/Images/examinations/image 64.png',
  
  notifications: [
    {
      uuid: 'n-1',
      label: 'EXAMINATION ANNOUNCEMENT',
      title: 'REVISED TIME TABLE FOR FOURTH SEMESTER MBA (REGULAR / SUPPLEMENTARY EXAMINATIONS - JULY 2026)',
      date: '17 Jul 2026',
      pdfUrl: '#'
    }
  ],
  results: [
    {
      uuid: 'r-1',
      slNo: '01',
      dateDuration: 'NOV 10',
      courseName: 'CS502: Advanced Algorithms',
      semesterInfo: 'VIII Sem MBA 2026',
      pdfUrl: '#'
    }
  ]
};

const DraggableItemCard = ({ item, index, onEdit, onDelete, type }) => {
  const controls = useDragControls();
  
  let primaryText = '';
  let secondaryText = '';
  
  if (type === 'notifications') {
    primaryText = item.title;
    secondaryText = item.date;
  } else if (type === 'results') {
    primaryText = item.courseName;
    secondaryText = `${item.semesterInfo} | ${item.dateDuration}`;
  }

  return (
    <Reorder.Item 
      value={item}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4 relative group hover:border-primary/30 transition-colors select-none"
    >
      <div 
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-primary transition-colors touch-none"
        onPointerDown={(e) => {
          e.preventDefault();
          controls.start(e);
        }}
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate">{primaryText || 'Unnamed Item'}</h4>
        <p className="text-sm text-gray-500 truncate">{secondaryText || 'No description'}</p>
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

const ManageExaminationsPage = () => {
  const [data, setData] = useState(defaultExamData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalType, setModalType] = useState('notifications'); 
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({});

  const tabs = [
    { id: 'hero', name: 'Hero Banner', icon: <Award className="w-4 h-4" /> },
    { id: 'overview', name: 'Overview Section', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', name: 'Exam Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'results', name: 'Semester Results', icon: <FileText className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await api.get('/cms/examinations-page');
      if (res) {
        ['notifications', 'results'].forEach(section => {
          if (res[section] && Array.isArray(res[section])) {
            res[section] = res[section].map(item => ({ ...item, uuid: item._id || item.uuid || Math.random().toString(36).substr(2, 9) }));
          }
        });
        setData({ ...defaultExamData, ...res });
      } else {
        setData(defaultExamData);
      }
    } catch (error) {
      console.warn('Examinations CMS endpoint not found or error, using default layout:', error.message);
      setData(defaultExamData);
    } finally {
      setIsLoading(false);
    }
  };

  const isDefaultImage = (url) => {
    if (!url) return true;
    return url.includes('/assets/Images/examinations/') || url.includes('/assets/Images/image');
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Examinations Page?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          // Process deferred uploads
          const newHeroImage = await uploadDeferredImage(data.heroImage, '/upload/examinations');
          const newOverviewImage = await uploadDeferredImage(data.overviewImage, '/upload/examinations');
          const newCalendarImage = await uploadDeferredImage(data.calendarImage, '/upload/examinations');
          
          const newCalendarPdf = await uploadDeferredImage(data.calendarViewBtnUrl, '/upload/examinations');

          const payload = {
            ...data,
            heroImage: newHeroImage,
            overviewImage: newOverviewImage,
            calendarImage: newCalendarImage,
            calendarViewBtnUrl: newCalendarPdf,
            calendarDownloadBtnUrl: newCalendarPdf,
          };

          await api.put('/cms/examinations-page', payload, { hideLoader: true });
          
          // Execute deferred deletions
          for (const imgUrl of imagesToDelete) {
             try {
               await api.delete('/upload', { data: { fileUrl: imgUrl }, hideLoader: true });
             } catch (err) {
               console.warn('Skipped deleting image:', err);
             }
          }
          setImagesToDelete([]);

          setData(payload);
          Toast.fire({ icon: 'success', title: 'Examinations page saved successfully!' });
        } catch (error) {
          console.error('Error saving examinations page:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save changes.' });
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
        setData(defaultExamData);
        Toast.fire({ icon: 'info', title: 'Reset to defaults. Click Save Changes to apply.' });
      }
    });
  };

  const updateSection = (key, value) => {
    if (key.toLowerCase().includes('image')) {
      const oldImage = data[key];
      if (oldImage && oldImage !== value && !isDefaultImage(oldImage) && !oldImage.startsWith('blob:') && !oldImage.startsWith('http')) {
        setImagesToDelete(prev => [...prev, oldImage]);
      }
    }
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const openModal = (mode, type, index = null) => {
    setModalMode(mode);
    setModalType(type);
    setCurrentItemIndex(index);
    if (mode === 'edit' && index !== null) {
      let list = [];
      if (type === 'notifications') list = data.notifications || [];
      else if (type === 'results') list = data.results || [];
      
      setCurrentItem(list[index]);
    } else {
      if (type === 'notifications') setCurrentItem({ label: 'EXAMINATION ANNOUNCEMENT', title: '', date: '', pdfUrl: '#' });
      else if (type === 'results') setCurrentItem({ slNo: '01', dateDuration: '', courseName: '', semesterInfo: '', pdfUrl: '#' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem({});
    setCurrentItemIndex(null);
  };

  const handleSaveModal = () => {
    let list = [];
    let sectionName = '';
    
    if (modalType === 'notifications') { list = [...(data.notifications || [])]; sectionName = 'notifications'; }
    else if (modalType === 'results') { list = [...(data.results || [])]; sectionName = 'results'; }

    if (modalMode === 'add') {
      list.push({ ...currentItem, uuid: Math.random().toString(36).substr(2, 9), order: list.length + 1 });
    } else {
      list[currentItemIndex] = currentItem;
    }
    
    setData(prev => ({
      ...prev,
      [sectionName]: list
    }));
    closeModal();
  };

  const handleDeleteItem = async (type, index) => {
    await confirmAction({
      title: 'Remove Item?',
      message: 'Are you sure you want to remove this item? (Changes apply when you Save)',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        let list = [];
        let sectionName = '';
        if (type === 'notifications') { list = [...(data.notifications || [])]; sectionName = 'notifications'; }
        else if (type === 'results') { list = [...(data.results || [])]; sectionName = 'results'; }
        
        list.splice(index, 1);
        setData(prev => ({
          ...prev,
          [sectionName]: list
        }));
        Toast.fire({ icon: 'success', title: 'Item removed. Click Save to apply changes.' });
      }
    });
  };

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        activeTab,
        previewDevice: previewMode,
        ...data
      };
      
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'examinations' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-examinations-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-examinations-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, data]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="w-full pb-12 space-y-8">
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
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Examinations Page Settings"
        description="Manage the Hero section, Overview, Exam Calendar, Notifications, and Results."
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
                src="/preview/examinations"
                className="w-full h-full border-0"
                title="Examinations Preview"
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
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Hero Section</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.showHeroSection !== false} onChange={(e) => updateSection('showHeroSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.showHeroSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showHeroSection !== false ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge Text</label>
                      
</div>
<input
                      type="text"
                      value={data.heroBadgeText || ''}
                      maxLength={50}
                      onChange={(e) => updateSection('heroBadgeText', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.heroBadgeText?.length || 0}/50 characters</div>
                  </div>
                  <div>
                    <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading Title</label>
                      
</div>
<input
                      type="text"
                      value={data.heroTitle || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('heroTitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.heroTitle?.length || 0}/100 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Subtitle</label>
                      
                    </div>
                    <textarea
                      rows="4"
                      value={data.heroSubtitle || ''}
                      maxLength={300}
                      onChange={(e) => updateSection('heroSubtitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
                  <SingleImageUploader
                    imageUrl={data.heroImage || ''}
                    uploadEndpoint="/upload/examinations"
                    defaultImage="/assets/Images/examinations/exam_hero_bg.png"
                    onUploadComplete={(urlObj) => updateSection('heroImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Background"
                    deferredUpload={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Examination Overview Section</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.showOverviewSection !== false} onChange={(e) => updateSection('showOverviewSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.showOverviewSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showOverviewSection !== false ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Title</label>
                      <span className="text-xs text-gray-400">{data.overviewTitle?.length || 0}/100</span>
</div>
<input
                      type="text"
                      value={data.overviewTitle || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('overviewTitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.heroSubtitle?.length || 0}/300 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Paragraph 1 Text</label>
                      
                    </div>
                    <textarea
                      rows="4"
                      value={data.overviewText1 || ''}
                      maxLength={600}
                      onChange={(e) => updateSection('overviewText1', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Paragraph 2 Text</label>
                      <span className="text-xs text-gray-400">{data.overviewText2?.length || 0}/600</span>
                    </div>
                    <textarea
                      rows="4"
                      value={data.overviewText2 || ''}
                      maxLength={600}
                      onChange={(e) => updateSection('overviewText2', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Right Side Lecture Hall Image</label>
                  <SingleImageUploader
                    imageUrl={data.overviewImage || ''}
                    uploadEndpoint="/upload/examinations"
                    defaultImage="/assets/Images/examinations/exam_main.png"
                    onUploadComplete={(urlObj) => updateSection('overviewImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Image"
                    deferredUpload={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Official Exam Calendar Banner Settings</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.showCalendarSection !== false} onChange={(e) => updateSection('showCalendarSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.showCalendarSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showCalendarSection !== false ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Banner Title</label>
                      <span className="text-xs text-gray-400">{data.calendarTitle?.length || 0}/100</span>
</div>
<input
                      type="text"
                      value={data.calendarTitle || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('calendarTitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.overviewText1?.length || 0}/600 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Banner Description</label>
                      
                    </div>
                    <textarea
                      rows="4"
                      value={data.calendarText || ''}
                      maxLength={300}
                      onChange={(e) => updateSection('calendarText', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">View Button Label</label>
                        <span className="text-xs text-gray-400">{data.calendarViewBtnText?.length || 0}/50</span>
</div>
<input
                        type="text"
                        value={data.calendarViewBtnText || ''}
                        maxLength={50}
                        onChange={(e) => updateSection('calendarViewBtnText', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
<div className="text-right text-xs text-gray-400 mt-1">{data.calendarText?.length || 0}/300 characters</div>
                    </div>
                    <div>
                      <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Download Button Label</label>
                        
</div>
<input
                        type="text"
                        value={data.calendarDownloadBtnText || ''}
                        maxLength={50}
                        onChange={(e) => updateSection('calendarDownloadBtnText', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
<div className="text-right text-xs text-gray-400 mt-1">{data.calendarDownloadBtnText?.length || 0}/50 characters</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Calendar PDF Document</label>
                    <SingleDocumentUploader
                      fileUrl={data.calendarViewBtnUrl || ''}
                      uploadEndpoint="/upload/examinations"
                      defaultFile="/assets/Images/examinations/exam_schedule.png"
                      onUploadComplete={(urlObj) => {
                        updateSection('calendarViewBtnUrl', urlObj);
                        updateSection('calendarDownloadBtnUrl', urlObj);
                      }}
                      onUploadStateChange={setIsUploading}
                      label="Upload PDF (Used for View & Download)"
                      deferredUpload={true}
                      recommendedSize="PDF up to 10MB"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Right Side Calendar Illustration</label>
                  <SingleImageUploader
                    imageUrl={data.calendarImage || ''}
                    uploadEndpoint="/upload/examinations"
                    defaultImage="/assets/Images/examinations/image 64.png"
                    onUploadComplete={(urlObj) => updateSection('calendarImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Image"
                    deferredUpload={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Notifications & Announcements ({(data.notifications || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.showNotificationsSection !== false} onChange={(e) => updateSection('showNotificationsSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.showNotificationsSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showNotificationsSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'notifications')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Notification
                </button>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.notifications || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Bell className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Notifications added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.notifications} onReorder={(items) => updateSection('notifications', items)} className="space-y-3">
                    {data.notifications.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || item._id || item.order || idx} 
                        item={item} 
                        index={idx} 
                        type="notifications"
                        onEdit={(i) => openModal('edit', 'notifications', i)} 
                        onDelete={() => handleDeleteItem('notifications', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Semester Results List ({(data.results || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.showResultsSection !== false} onChange={(e) => updateSection('showResultsSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.showResultsSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showResultsSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'results')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Result
                </button>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.results || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Results added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.results} onReorder={(items) => updateSection('results', items)} className="space-y-3">
                    {data.results.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || item._id || item.order || idx} 
                        item={item} 
                        index={idx} 
                        type="results"
                        onEdit={(i) => openModal('edit', 'results', i)} 
                        onDelete={() => handleDeleteItem('results', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Add ' : 'Edit '}
                {modalType === 'notifications' ? 'Notification' : 'Result'}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalType === 'notifications' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label</label>
                    <input
                      type="text"
                      value={currentItem.label || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, label: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                    <input
                      type="text"
                      value={currentItem.title || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="text"
                      value={currentItem.date || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">PDF Document (Optional)</label>
                    <SingleDocumentUploader
                      fileUrl={currentItem.pdfUrl || ''}
                      uploadEndpoint="/upload/examinations"
                      defaultFile="#"
                      onUploadComplete={(urlObj) => setCurrentItem({ ...currentItem, pdfUrl: urlObj })}
                      onUploadStateChange={setIsUploading}
                      label="Upload PDF"
                      deferredUpload={false}
                      recommendedSize="PDF up to 10MB"
                    />
                  </div>
                </>
              )}
              {modalType === 'results' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SL No</label>
                      <input
                        type="text"
                        value={currentItem.slNo || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, slNo: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date & Duration</label>
                      <input
                        type="text"
                        value={currentItem.dateDuration || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, dateDuration: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Course Name</label>
                    <input
                      type="text"
                      value={currentItem.courseName || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, courseName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Semester Info</label>
                    <input
                      type="text"
                      value={currentItem.semesterInfo || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, semesterInfo: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">PDF Document (Optional)</label>
                    <SingleDocumentUploader
                      fileUrl={currentItem.pdfUrl || ''}
                      uploadEndpoint="/upload/examinations"
                      defaultFile="#"
                      onUploadComplete={(urlObj) => setCurrentItem({ ...currentItem, pdfUrl: urlObj })}
                      onUploadStateChange={setIsUploading}
                      label="Upload PDF"
                      deferredUpload={false}
                      recommendedSize="PDF up to 10MB"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl transition-colors shadow-sm"
              >
                {modalMode === 'add' ? 'Add Item' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ManageExaminationsPage;
