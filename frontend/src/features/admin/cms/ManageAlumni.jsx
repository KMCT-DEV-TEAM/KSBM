"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Pencil, X, Eye, Monitor, Smartphone, Tablet, FileText, Image as ImageIcon, Award, Calendar, ExternalLink } from 'lucide-react';
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

const defaultAlumniData = {
  hero: {
    title: 'Alumni',
    subtitle: 'Our alumni stand at the forefront of global business, driving innovation through principled leadership and strategic excellence across industries worldwide.',
    backgroundImage: '/assets/Images/alumni/hero-bg.png'
  },
  legacy: {
    subtitle: 'KSBM ALUMNI NETWORK / OUR LEGACY',
    title: 'Legacy of Excellence',
    description1: 'Since our inception, the KMCT School of Business Management has been a beacon of academic brilliance and professional development. Our alumni embody our mission, leading top organizations and shaping global markets across diverse industries.',
    description2: 'With over three decades of history, we take immense pride in having trained thousands of remarkable business leaders. The KMCT Alumni Association is dedicated to fostering lifelong relationships between the institution and its graduates.',
    mainImage: '/assets/Images/alumni/legacy-main.png',
    secondaryImage: '/assets/Images/alumni/legacy-secondary.png',
    floatingQuote: '"Shaping the future through principled leadership."',
    stat1Value: '30k+',
    stat1Label: 'Global Alumni',
    stat2Value: '150+',
    stat2Label: 'Industry Leaders'
  },
  events: {
    heading: 'ALUMNI EVENTS',
    items: [
      {
        uuid: 'ev-1',
        title: 'Global Alumni Reunion 2024',
        description: 'Join fellow graduates for a weekend of celebration, networking, and keynotes from industry leaders.',
        image: '/assets/Images/alumni/event-default.png',
        date: 'December 2024'
      }
    ]
  },
  notableAlumni: {
    subtitle: 'OUR PRIDE',
    heading: 'Notable Alumni',
    items: [
      { uuid: 'na-1', name: 'Dr. Arvind Nair', role: 'CEO, Global Corporate', image: '/assets/Images/alumni/notable-default.png' }
    ]
  },
  gallery: {
    heading: 'Captured in Events',
    items: [
      { uuid: 'ga-1', title: 'Graduation', image: '/assets/Images/alumni/gallery-default.png' }
    ]
  },
  cta: {
    title: 'Join the KMCT Alumni Network',
    subtitle: 'Stay connected with your alma mater, network with fellow peers, and participate in exclusive leadership and mentoring initiatives.',
    buttonText: 'View Details',
    buttonLink: '#register'
  }
};

const DraggableItemCard = ({ item, index, onEdit, onDelete, type }) => {
  const controls = useDragControls();
  
  let displayImg = '/assets/Images/image 31.png';
  if (item?.image) {
    if (typeof item.image === 'string') displayImg = item.image;
    else if (item.image.previewUrl) displayImg = item.image.previewUrl;
  }

  let primaryText = '';
  let secondaryText = '';
  
  if (type === 'events') {
    primaryText = item.title;
    secondaryText = item.date;
  } else if (type === 'notableAlumni') {
    primaryText = item.name;
    secondaryText = item.role;
  } else if (type === 'gallery') {
    primaryText = item.title;
    secondaryText = 'Gallery Image';
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
      
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
        <img src={displayImg} alt={primaryText || 'Item'} className="w-full h-full object-cover" />
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

const ManageAlumni = () => {
  const [data, setData] = useState(defaultAlumniData);
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
  const [modalType, setModalType] = useState('events'); 
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({});

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'legacy', label: 'Legacy', icon: <Award className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notable', label: 'Notable Alumni', icon: <FileText className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'cta', label: 'CTA', icon: <ExternalLink className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await api.get('/cms/alumni-page');
      if (res && res.hero) {
        ['events', 'notableAlumni', 'gallery'].forEach(section => {
          if (res[section] && Array.isArray(res[section].items)) {
            res[section].items = res[section].items.map(item => ({ ...item, uuid: item._id || item.uuid || Math.random().toString(36).substr(2, 9) }));
          }
        });
        setData(res);
      } else {
        setData(defaultAlumniData);
      }
    } catch (error) {
      console.warn('Alumni CMS endpoint not found or error, using default layout:', error.message);
      setData(defaultAlumniData);
    } finally {
      setIsLoading(false);
    }
  };

  const isDefaultImage = (url) => {
    if (!url) return true;
    return url.includes('/assets/Images/alumni/') || url.includes('/assets/Images/image');
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Alumni Page?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          // Process deferred uploads
          const newHeroBgImage = await uploadDeferredImage(data.hero?.backgroundImage, '/upload/alumni');
          const newMainImage = await uploadDeferredImage(data.legacy?.mainImage, '/upload/alumni');
          const newSecondaryImage = await uploadDeferredImage(data.legacy?.secondaryImage, '/upload/alumni');

          const newEvents = await Promise.all((data.events?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/alumni')
          })));

          const newNotable = await Promise.all((data.notableAlumni?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/alumni')
          })));

          const newGallery = await Promise.all((data.gallery?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/alumni')
          })));

          const payload = {
            ...data,
            hero: { ...data.hero, backgroundImage: newHeroBgImage },
            legacy: { ...data.legacy, mainImage: newMainImage, secondaryImage: newSecondaryImage },
            events: { ...data.events, items: newEvents },
            notableAlumni: { ...data.notableAlumni, items: newNotable },
            gallery: { ...data.gallery, items: newGallery }
          };

          await api.put('/cms/alumni-page', payload, { hideLoader: true });
          
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
          Toast.fire({ icon: 'success', title: 'Alumni page saved successfully!' });
        } catch (error) {
          console.error('Error saving alumni page:', error);
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
        setData(defaultAlumniData);
        Toast.fire({ icon: 'info', title: 'Reset to defaults. Click Save Changes to apply.' });
      }
    });
  };

  const updateSection = (sectionName, key, value) => {
    if (key.toLowerCase().includes('image') || key === 'backgroundImage' || key === 'mainImage' || key === 'secondaryImage') {
      const oldImage = data[sectionName][key];
      if (oldImage && oldImage !== value && !isDefaultImage(oldImage) && !oldImage.startsWith('blob:') && !oldImage.startsWith('http')) {
        setImagesToDelete(prev => [...prev, oldImage]);
      }
    }
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [key]: value
      }
    }));
  };

  const updateArrayItems = (sectionName, newItems) => {
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        items: newItems
      }
    }));
  };

  const openModal = (mode, type, index = null) => {
    setModalMode(mode);
    setModalType(type);
    setCurrentItemIndex(index);
    if (mode === 'edit' && index !== null) {
      let list = [];
      if (type === 'events') list = data.events?.items || [];
      else if (type === 'notableAlumni') list = data.notableAlumni?.items || [];
      else if (type === 'gallery') list = data.gallery?.items || [];
      
      setCurrentItem(list[index]);
    } else {
      let defaultImg = '/assets/Images/alumni/gallery-default.png';
      if (type === 'events') defaultImg = '/assets/Images/alumni/event-default.png';
      else if (type === 'notableAlumni') defaultImg = '/assets/Images/alumni/notable-default.png';
      
      if (type === 'events') setCurrentItem({ title: '', description: '', date: '', image: defaultImg });
      else if (type === 'notableAlumni') setCurrentItem({ name: '', role: '', image: defaultImg });
      else if (type === 'gallery') setCurrentItem({ title: '', image: defaultImg });
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
    
    if (modalType === 'events') { list = [...(data.events?.items || [])]; sectionName = 'events'; }
    else if (modalType === 'notableAlumni') { list = [...(data.notableAlumni?.items || [])]; sectionName = 'notableAlumni'; }
    else if (modalType === 'gallery') { list = [...(data.gallery?.items || [])]; sectionName = 'gallery'; }

    if (modalMode === 'add') {
      list.push({ ...currentItem, uuid: Math.random().toString(36).substr(2, 9), order: list.length + 1 });
    } else {
      const oldImage = list[currentItemIndex].image;
      if (oldImage && oldImage !== currentItem.image && !isDefaultImage(oldImage) && !oldImage.startsWith('blob:') && !oldImage.startsWith('http')) {
        setImagesToDelete(prev => [...prev, oldImage]);
      }
      list[currentItemIndex] = currentItem;
    }
    
    updateArrayItems(sectionName, list);
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
        if (type === 'events') { list = [...(data.events?.items || [])]; sectionName = 'events'; }
        else if (type === 'notableAlumni') { list = [...(data.notableAlumni?.items || [])]; sectionName = 'notableAlumni'; }
        else if (type === 'gallery') { list = [...(data.gallery?.items || [])]; sectionName = 'gallery'; }
        
        const itemToDelete = list[index];
        if (itemToDelete?.image && !isDefaultImage(itemToDelete.image) && !itemToDelete.image.startsWith('blob:') && !itemToDelete.image.startsWith('http')) {
           setImagesToDelete(prev => [...prev, itemToDelete.image]);
        }
        
        list.splice(index, 1);
        updateArrayItems(sectionName, list);
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
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'alumni' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-alumni-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-alumni-data', payload: pData }, '*');
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Alumni Page Settings"
        description="Manage the Hero section, Legacy of Excellence, Events, Notable Alumni, Gallery, and CTA."
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
                src="/preview/alumni"
                className="w-full h-full border-0"
                title="Alumni Preview"
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
              <h2 className="text-lg font-bold text-[#1e2869] mb-4 border-b pb-3">Hero Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading Title</label>
                      <span className="text-xs text-gray-400">{data.hero?.title?.length || 0}/50</span>
                    </div>
                    <input
                      type="text"
                      value={data.hero?.title || ''}
                      maxLength={50}
                      onChange={(e) => updateSection('hero', 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Alumni"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Subtitle</label>
                      <span className="text-xs text-gray-400">{data.hero?.subtitle?.length || 0}/300</span>
                    </div>
                    <textarea
                      rows="4"
                      value={data.hero?.subtitle || ''}
                      maxLength={300}
                      onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Brief intro..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
                  <SingleImageUploader
                    imageUrl={data.hero?.backgroundImage || ''}
                    uploadEndpoint="/upload/alumni"
                    defaultImage="/assets/Images/alumni/hero-bg.png"
                    onUploadComplete={(urlObj) => updateSection('hero', 'backgroundImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Background"
                    deferredUpload={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legacy' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#1e2869] mb-4 border-b pb-3">Legacy of Excellence</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Small Subtitle</label>
                      <span className="text-xs text-gray-400">{data.legacy?.subtitle?.length || 0}/50</span>
                    </div>
                    <input
                      type="text"
                      value={data.legacy?.subtitle || ''}
                      maxLength={50}
                      onChange={(e) => updateSection('legacy', 'subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Heading</label>
                      <span className="text-xs text-gray-400">{data.legacy?.title?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      value={data.legacy?.title || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('legacy', 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Paragraph 1</label>
                      <span className="text-xs text-gray-400">{data.legacy?.description1?.length || 0}/600</span>
                    </div>
                    <textarea
                      rows="4"
                      value={data.legacy?.description1 || ''}
                      maxLength={600}
                      onChange={(e) => updateSection('legacy', 'description1', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Paragraph 2</label>
                      <span className="text-xs text-gray-400">{data.legacy?.description2?.length || 0}/600</span>
                    </div>
                    <textarea
                      rows="4"
                      value={data.legacy?.description2 || ''}
                      maxLength={600}
                      onChange={(e) => updateSection('legacy', 'description2', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">First Image (Bottom/Left)</label>
                    <SingleImageUploader
                      imageUrl={data.legacy?.mainImage || ''}
                      uploadEndpoint="/upload/alumni"
                      defaultImage="/assets/Images/alumni/legacy-main.png"
                      onUploadComplete={(url) => updateSection('legacy', 'mainImage', url)}
                      onUploadStateChange={setIsUploading}
                      deferredUpload={true}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Second Image (Top/Right Overlapping)</label>
                    <SingleImageUploader
                      imageUrl={data.legacy?.secondaryImage || ''}
                      uploadEndpoint="/upload/alumni"
                      defaultImage="/assets/Images/alumni/legacy-secondary.png"
                      onUploadComplete={(url) => updateSection('legacy', 'secondaryImage', url)}
                      onUploadStateChange={setIsUploading}
                      deferredUpload={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Floating Quote</label>
                      <span className="text-xs text-gray-400">{data.legacy?.floatingQuote?.length || 0}/150</span>
                    </div>
                    <input
                      type="text"
                      value={data.legacy?.floatingQuote || ''}
                      maxLength={150}
                      onChange={(e) => updateSection('legacy', 'floatingQuote', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stat 1 (Value & Label)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={data.legacy?.stat1Value || ''}
                        maxLength={20}
                        onChange={(e) => updateSection('legacy', 'stat1Value', e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                        placeholder="30k+"
                      />
                      <input
                        type="text"
                        value={data.legacy?.stat1Label || ''}
                        maxLength={50}
                        onChange={(e) => updateSection('legacy', 'stat1Label', e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                        placeholder="Global Alumni"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stat 2 (Value & Label)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={data.legacy?.stat2Value || ''}
                        maxLength={20}
                        onChange={(e) => updateSection('legacy', 'stat2Value', e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                        placeholder="150+"
                      />
                      <input
                        type="text"
                        value={data.legacy?.stat2Label || ''}
                        maxLength={50}
                        onChange={(e) => updateSection('legacy', 'stat2Label', e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
                        placeholder="Industry Leaders"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-[#1e2869]">Alumni Events ({(data.events?.items || []).length})</h2>
                </div>
                <button
                  onClick={() => openModal('add', 'events')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                  <span className="text-xs text-gray-400">{data.events?.heading?.length || 0}/50</span>
                </div>
                <input
                  type="text"
                  value={data.events?.heading || ''}
                  maxLength={50}
                  onChange={(e) => updateSection('events', 'heading', e.target.value)}
                  className="max-w-md w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.events?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Calendar className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Alumni Events added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.events.items} onReorder={(items) => updateArrayItems('events', items)} className="space-y-3">
                    {data.events.items.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || item._id || item.order || idx} 
                        item={item} 
                        index={idx} 
                        type="events"
                        onEdit={(i) => openModal('edit', 'events', i)} 
                        onDelete={() => handleDeleteItem('events', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notable' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-[#1e2869]">Notable Alumni ({(data.notableAlumni?.items || []).length})</h2>
                </div>
                <button
                  onClick={() => openModal('add', 'notableAlumni')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Subtitle</label>
                    <span className="text-xs text-gray-400">{data.notableAlumni?.subtitle?.length || 0}/50</span>
                  </div>
                  <input
                    type="text"
                    value={data.notableAlumni?.subtitle || ''}
                    maxLength={50}
                    onChange={(e) => updateSection('notableAlumni', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                    <span className="text-xs text-gray-400">{data.notableAlumni?.heading?.length || 0}/50</span>
                  </div>
                  <input
                    type="text"
                    value={data.notableAlumni?.heading || ''}
                    maxLength={50}
                    onChange={(e) => updateSection('notableAlumni', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.notableAlumni?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Users className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Notable Alumni added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.notableAlumni.items} onReorder={(items) => updateArrayItems('notableAlumni', items)} className="space-y-3">
                    {data.notableAlumni.items.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || item._id || item.order || idx} 
                        item={item} 
                        index={idx} 
                        type="notableAlumni"
                        onEdit={(i) => openModal('edit', 'notableAlumni', i)} 
                        onDelete={() => handleDeleteItem('notableAlumni', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-[#1e2869]">Gallery ({(data.gallery?.items || []).length})</h2>
                </div>
                <button
                  onClick={() => openModal('add', 'gallery')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Photo
                </button>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                  <span className="text-xs text-gray-400">{data.gallery?.heading?.length || 0}/50</span>
                </div>
                <input
                  type="text"
                  value={data.gallery?.heading || ''}
                  maxLength={50}
                  onChange={(e) => updateSection('gallery', 'heading', e.target.value)}
                  className="max-w-md w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.gallery?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Gallery Photos added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.gallery.items} onReorder={(items) => updateArrayItems('gallery', items)} className="space-y-3">
                    {data.gallery.items.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || item._id || item.order || idx} 
                        item={item} 
                        index={idx} 
                        type="gallery"
                        onEdit={(i) => openModal('edit', 'gallery', i)} 
                        onDelete={() => handleDeleteItem('gallery', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#1e2869] mb-4 border-b pb-3">Join the KMCT Alumni Network (CTA)</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">CTA Heading</label>
                      <span className="text-xs text-gray-400">{data.cta?.title?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      value={data.cta?.title || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('cta', 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Text</label>
                        <span className="text-xs text-gray-400">{data.cta?.buttonText?.length || 0}/30</span>
                      </div>
                      <input
                        type="text"
                        value={data.cta?.buttonText || ''}
                        maxLength={30}
                        onChange={(e) => updateSection('cta', 'buttonText', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Link</label>
                        <span className="text-xs text-gray-400">{data.cta?.buttonLink?.length || 0}/100</span>
                      </div>
                      <input
                        type="text"
                        value={data.cta?.buttonLink || ''}
                        maxLength={100}
                        onChange={(e) => updateSection('cta', 'buttonLink', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">CTA Subtitle Description</label>
                    <span className="text-xs text-gray-400">{data.cta?.subtitle?.length || 0}/300</span>
                  </div>
                  <textarea
                    rows="3"
                    value={data.cta?.subtitle || ''}
                    maxLength={300}
                    onChange={(e) => updateSection('cta', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
                  {modalMode === 'add' ? 'Add' : 'Edit'} {modalType === 'events' ? 'Event' : modalType === 'notableAlumni' ? 'Alumni Profile' : 'Gallery Image'}
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
                  {modalType === 'events' && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Event Title</label>
                          <span className="text-xs text-gray-400">{currentItem?.title?.length || 0}/100</span>
                        </div>
                        <input
                          type="text"
                          value={currentItem.title || ''}
                          maxLength={100}
                          onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="e.g. Global Reunion 2024"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Date/Tag</label>
                          <span className="text-xs text-gray-400">{currentItem?.date?.length || 0}/50</span>
                        </div>
                        <input
                          type="text"
                          value={currentItem.date || ''}
                          maxLength={50}
                          onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="e.g. October 2024"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Description</label>
                          <span className="text-xs text-gray-400">{currentItem?.description?.length || 0}/200</span>
                        </div>
                        <textarea
                          rows="3"
                          value={currentItem.description || ''}
                          maxLength={200}
                          onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="Event details..."
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'notableAlumni' && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                          <span className="text-xs text-gray-400">{currentItem?.name?.length || 0}/100</span>
                        </div>
                        <input
                          type="text"
                          value={currentItem.name || ''}
                          maxLength={100}
                          onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="e.g. Dr. Arvind Nair"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Role / Batch</label>
                          <span className="text-xs text-gray-400">{currentItem?.role?.length || 0}/100</span>
                        </div>
                        <input
                          type="text"
                          value={currentItem.role || ''}
                          maxLength={100}
                          onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="e.g. CEO, Global Corporate"
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'gallery' && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Photo Title</label>
                          <span className="text-xs text-gray-400">{currentItem?.title?.length || 0}/100</span>
                        </div>
                        <input
                          type="text"
                          value={currentItem.title || ''}
                          maxLength={100}
                          onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="e.g. Graduation Ceremony"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image</label>
                    <SingleImageUploader
                      imageUrl={currentItem.image}
                      uploadEndpoint="/upload/alumni"
                      defaultImage={modalType === 'events' ? '/assets/Images/alumni/event-default.png' : modalType === 'notableAlumni' ? '/assets/Images/alumni/notable-default.png' : '/assets/Images/alumni/gallery-default.png'}
                      onUploadComplete={(urlObj) => setCurrentItem({ ...currentItem, image: urlObj })}
                      onUploadStateChange={setIsUploading}
                      label="Upload Image"
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
                  <Save className="w-4 h-4" /> Save {modalMode === 'add' ? 'Item' : 'Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAlumni;
