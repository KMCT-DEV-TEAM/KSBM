"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Pencil, X, Eye, Monitor, Smartphone, Tablet, FileText, Image as ImageIcon, Award, Calendar, ExternalLink, Briefcase, Users, Activity } from 'lucide-react';
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

const defaultPlacementData = {
  hero: {
    badge: 'CAREER & PLACEMENTS',
    title: 'Where Ambition Meets Opportunity',
    subtitle: 'KSBM connects our dynamic management graduates with global industry leaders, fostering careers that shape the future of business.',
    backgroundImage: '/assets/Images/placements/default-hero-bg.jpg'
  },
  overview: {
    title: 'Placement Excellence',
    deskBadge: 'Management Desk',
    description1: 'At KSBM, placement is not just an event, it is a process which starts from the first semester.',
    description2: 'We have a dedicated placement cell that works tirelessly to bridge the gap between academia and industry.',
    stat1Value: '100+',
    stat1Label: 'Students Placed',
    stat2Value: '100+',
    stat2Label: 'Companies Visited',
    collageImage1: '/assets/Images/placements/default-collage-1.jpg',
    collageImage2: '/assets/Images/placements/default-collage-2.jpg',
    floatingQuote: '"KSBM graduates are consistently rated as \'Highly Adaptable\' by global recruiters."',
    overviewLogos: [
      '/assets/Images/placements/default-partner-1.jpg',
      '/assets/Images/placements/default-partner-2.jpg',
      '/assets/Images/placements/default-partner-3.jpg'
    ]
  },
  proudAchievers: {
    title: 'Proud Achievers',
    items: []
  },
  topRecruiters: {
    title: 'Top Recruiters',
    description: 'Our strong industry connections ensure that our students get the best career opportunities.',
    items: []
  },
  excellenceSupport: {
    title: 'Excellence in Placement Support',
    description: 'Comprehensive training and guidance to ensure you step into the corporate world with confidence.',
    backgroundImage: '/assets/Images/placements/default-excellence-bg.png',
    listOne: [],
    listTwo: []
  },
  facultyInCharge: {
    badge: 'Faculty In-Charge',
    title: 'Empowering Careers. Inspiring Success.',
    description: 'Our experienced faculty members work tirelessly to bridge the gap.',
    items: []
  },
  placementCommittee: {
    title: 'Placement Committee',
    description: 'The Placement Committee consists of student representatives.',
    buttonText: 'Connect with Committee',
    image: '/assets/Images/placements/default-committee-vector.png',
    items: []
  },
  activities: {
    title: 'Placement Activities & Events',
    items: []
  }
};

const DraggableItemCard = ({ item, index, onEdit, onDelete, type }) => {
  const controls = useDragControls();
  
  let displayImg = '/assets/Images/placements/default-avatar.png';
  if (item?.image) displayImg = typeof item.image === 'string' ? item.image : item.image.previewUrl;
  else if (item?.logo) displayImg = typeof item.logo === 'string' ? item.logo : item.logo.previewUrl;

  let primaryText = '';
  let secondaryText = '';
  
  if (type === 'proudAchievers') {
    primaryText = item.name;
    secondaryText = `${item.company} - ${item.role}`;
  } else if (type === 'topRecruiters') {
    primaryText = item.name;
    secondaryText = 'Recruiter Logo';
  } else if (type === 'facultyInCharge') {
    primaryText = item.name;
    secondaryText = item.designation;
  } else if (type === 'placementCommittee') {
    primaryText = item.name;
    secondaryText = item.role;
  } else if (type === 'activities') {
    primaryText = item.title;
    secondaryText = item.description;
  } else if (type === 'excellenceSupportListOne' || type === 'excellenceSupportListTwo') {
    primaryText = item.title;
    displayImg = null;
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
      
      {displayImg !== null && (
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50 flex items-center justify-center">
          <img src={displayImg} alt={primaryText || 'Item'} className="w-full h-full object-contain" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate">{primaryText || 'Unnamed Item'}</h4>
        <p className="text-sm text-gray-500 truncate">{secondaryText || ''}</p>
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

const ManagePlacementPage = () => {
  const [data, setData] = useState(defaultPlacementData);
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
  const [modalType, setModalType] = useState('proudAchievers'); 
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({});

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <Award className="w-4 h-4" /> },
    { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'proudAchievers', label: 'Achievers', icon: <Award className="w-4 h-4" /> },
    { id: 'topRecruiters', label: 'Recruiters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'excellenceSupport', label: 'Excellence', icon: <Award className="w-4 h-4" /> },
    { id: 'facultyInCharge', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
    { id: 'placementCommittee', label: 'Committee', icon: <Users className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities', icon: <Activity className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await api.get('/cms/placement-page');
      if (res && (res.hero || res.overview)) {
        ['proudAchievers', 'topRecruiters', 'facultyInCharge', 'placementCommittee', 'activities'].forEach(section => {
          if (res[section] && Array.isArray(res[section].items)) {
            res[section].items = res[section].items.map(item => ({ ...item, uuid: item._id || item.uuid || Math.random().toString(36).substr(2, 9) }));
          }
        });
        if (res.excellenceSupport) {
          if (Array.isArray(res.excellenceSupport.listOne)) {
            res.excellenceSupport.listOne = res.excellenceSupport.listOne.map(item => ({ ...item, uuid: item._id || item.uuid || Math.random().toString(36).substr(2, 9) }));
          }
          if (Array.isArray(res.excellenceSupport.listTwo)) {
            res.excellenceSupport.listTwo = res.excellenceSupport.listTwo.map(item => ({ ...item, uuid: item._id || item.uuid || Math.random().toString(36).substr(2, 9) }));
          }
        }
        // Ensure overviewLogos exists
        if (!res.overview) res.overview = defaultPlacementData.overview;
        if (!res.overview.overviewLogos || res.overview.overviewLogos.length !== 3) {
           res.overview.overviewLogos = defaultPlacementData.overview.overviewLogos;
        }
        setData(res);
      } else {
        setData(defaultPlacementData);
      }
    } catch (error) {
      console.warn('Placement CMS endpoint not found or error, using default layout:', error.message);
      setData(defaultPlacementData);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultPlacementImages = [
    '/assets/Images/placements/default-hero-bg.jpg',
    '/assets/Images/placements/default-collage-1.jpg',
    '/assets/Images/placements/default-collage-2.jpg',
    '/assets/Images/placements/default-excellence-bg.png',
    '/assets/Images/placements/default-committee-vector.png',
    '/assets/Images/placements/default-avatar.png',
    '/assets/Images/placements/default-partner-1.jpg',
    '/assets/Images/placements/default-partner-2.jpg',
    '/assets/Images/placements/default-partner-3.jpg'
  ];

  const isDefaultImage = (url) => {
    if (!url) return true;
    if (typeof url === 'object') return true; // Deferred blob objects are never saved on server yet, so don't delete them
    return defaultPlacementImages.includes(url) || url.includes('images.unsplash.com');
  };

  const trackDeletion = (url) => {
    if (url && typeof url === 'string' && !isDefaultImage(url) && !url.startsWith('blob:') && !url.startsWith('http')) {
      setImagesToDelete(prev => [...prev, url]);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Placement Page?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          // Process deferred uploads for single fields
          const newHeroBgImage = await uploadDeferredImage(data.hero?.backgroundImage, '/upload/placements');
          const newCollageImage1 = await uploadDeferredImage(data.overview?.collageImage1, '/upload/placements');
          const newCollageImage2 = await uploadDeferredImage(data.overview?.collageImage2, '/upload/placements');
          const newExcellenceBgImage = await uploadDeferredImage(data.excellenceSupport?.backgroundImage, '/upload/placements');
          const newCommitteeImage = await uploadDeferredImage(data.placementCommittee?.image, '/upload/placements');

          // Process overviewLogos
          const newOverviewLogos = await Promise.all((data.overview?.overviewLogos || []).map(img => uploadDeferredImage(img, '/upload/placements')));

          // Process Arrays
          const newProudAchievers = await Promise.all((data.proudAchievers?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/placements'),
            companyLogo: await uploadDeferredImage(m.companyLogo, '/upload/placements')
          })));

          const newTopRecruiters = await Promise.all((data.topRecruiters?.items || []).map(async (m) => ({
            ...m,
            logo: await uploadDeferredImage(m.logo, '/upload/placements')
          })));

          const newFacultyInCharge = await Promise.all((data.facultyInCharge?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/placements')
          })));

          const newPlacementCommittee = await Promise.all((data.placementCommittee?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/placements')
          })));

          const newActivities = await Promise.all((data.activities?.items || []).map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/placements')
          })));

          const payload = {
            ...data,
            hero: { ...data.hero, backgroundImage: newHeroBgImage },
            overview: { ...data.overview, collageImage1: newCollageImage1, collageImage2: newCollageImage2, overviewLogos: newOverviewLogos },
            proudAchievers: { ...data.proudAchievers, items: newProudAchievers },
            topRecruiters: { ...data.topRecruiters, items: newTopRecruiters },
            excellenceSupport: { ...data.excellenceSupport, backgroundImage: newExcellenceBgImage },
            facultyInCharge: { ...data.facultyInCharge, items: newFacultyInCharge },
            placementCommittee: { ...data.placementCommittee, image: newCommitteeImage, items: newPlacementCommittee },
            activities: { ...data.activities, items: newActivities }
          };

          await api.put('/cms/placement-page', payload, { hideLoader: true });
          
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
          Toast.fire({ icon: 'success', title: 'Placement page saved successfully!' });
        } catch (error) {
          console.error('Error saving placement page:', error);
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
        setData(defaultPlacementData);
        Toast.fire({ icon: 'info', title: 'Reset to defaults. Click Save Changes to apply.' });
      }
    });
  };

  const updateSection = (sectionName, key, value) => {
    if (key.toLowerCase().includes('image') || key === 'backgroundImage' || key === 'collageImage1' || key === 'collageImage2') {
      const oldImage = data[sectionName][key];
      trackDeletion(oldImage);
    }
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [key]: value
      }
    }));
  };

  const updateOverviewLogo = (index, value) => {
    const oldImage = data.overview.overviewLogos[index];
    trackDeletion(oldImage);
    const newLogos = [...data.overview.overviewLogos];
    newLogos[index] = value;
    setData(prev => ({ ...prev, overview: { ...prev.overview, overviewLogos: newLogos } }));
  };

  const updateArrayItems = (sectionName, newItems, subKey = 'items') => {
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [subKey]: newItems
      }
    }));
  };

  const openModal = (mode, type, index = null) => {
    setModalMode(mode);
    setModalType(type);
    setCurrentItemIndex(index);
    if (mode === 'edit' && index !== null) {
      let list = [];
      if (type === 'excellenceSupportListOne') list = data.excellenceSupport?.listOne || [];
      else if (type === 'excellenceSupportListTwo') list = data.excellenceSupport?.listTwo || [];
      else list = data[type]?.items || [];
      
      setCurrentItem(list[index]);
    } else {
      let defaultImg = '/assets/Images/placements/default-avatar.png';
      
      if (type === 'proudAchievers') setCurrentItem({ name: '', program: '', company: '', role: '', companyLogo: defaultImg, image: defaultImg });
      else if (type === 'topRecruiters') setCurrentItem({ name: '', logo: defaultImg });
      else if (type === 'facultyInCharge') setCurrentItem({ name: '', designation: '', image: defaultImg });
      else if (type === 'placementCommittee') setCurrentItem({ name: '', role: '', image: defaultImg });
      else if (type === 'activities') setCurrentItem({ title: '', description: '', image: defaultImg });
      else if (type === 'excellenceSupportListOne' || type === 'excellenceSupportListTwo') setCurrentItem({ title: '' });
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
    let sectionName = typeToSectionMap(modalType);
    let subKey = modalType === 'excellenceSupportListOne' ? 'listOne' : (modalType === 'excellenceSupportListTwo' ? 'listTwo' : 'items');
    
    list = [...(data[sectionName]?.[subKey] || [])];

    if (modalMode === 'add') {
      list.push({ ...currentItem, uuid: Math.random().toString(36).substr(2, 9) });
    } else {
      const oldItem = list[currentItemIndex];
      if (oldItem) {
        if (oldItem.image && oldItem.image !== currentItem.image) trackDeletion(oldItem.image);
        if (oldItem.logo && oldItem.logo !== currentItem.logo) trackDeletion(oldItem.logo);
        if (oldItem.companyLogo && oldItem.companyLogo !== currentItem.companyLogo) trackDeletion(oldItem.companyLogo);
      }
      list[currentItemIndex] = currentItem;
    }
    
    updateArrayItems(sectionName, list, subKey);
    closeModal();
  };

  const typeToSectionMap = (type) => {
    if (type === 'excellenceSupportListOne' || type === 'excellenceSupportListTwo') return 'excellenceSupport';
    return type;
  };

  const handleDeleteItem = async (type, index) => {
    await confirmAction({
      title: 'Remove Item?',
      message: 'Are you sure you want to remove this item? (Changes apply when you Save)',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        let sectionName = typeToSectionMap(type);
        let subKey = type === 'excellenceSupportListOne' ? 'listOne' : (type === 'excellenceSupportListTwo' ? 'listTwo' : 'items');
        let list = [...(data[sectionName]?.[subKey] || [])];
        
        const itemToDelete = list[index];
        if (itemToDelete?.image) trackDeletion(itemToDelete.image);
        if (itemToDelete?.logo) trackDeletion(itemToDelete.logo);
        if (itemToDelete?.companyLogo) trackDeletion(itemToDelete.companyLogo);
        
        list.splice(index, 1);
        updateArrayItems(sectionName, list, subKey);
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
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'placement' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-placement-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-placement-data', payload: pData }, '*');
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
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
        title="Placement Page Settings"
        description="Manage the Hero section."
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
                src="/preview/placement"
                className="w-full h-full border-0"
                title="Placement Preview"
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
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Hero Section</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.hero?.showSection !== false} onChange={(e) => updateSection('hero', 'showSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.hero?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.hero?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
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
                      value={data.hero?.badge || ''}
                      maxLength={50}
                      onChange={(e) => updateSection('hero', 'badge', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.hero?.badge?.length || 0}/50 characters</div>
                  </div>
                  <div>
                    <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading Title</label>
                      
</div>
<input
                      type="text"
                      value={data.hero?.title || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('hero', 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.hero?.title?.length || 0}/100 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Subtitle</label>
                      
                    </div>
                    <textarea
                      rows="4"
                      value={data.hero?.subtitle || ''}
                      maxLength={300}
                      onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
                  <SingleImageUploader
                    imageUrl={data.hero?.backgroundImage || ''}
                    uploadEndpoint="/upload/placements"
                    defaultImage="/assets/Images/placements/default-hero-bg.jpg"
                    onUploadComplete={(urlObj) => updateSection('hero', 'backgroundImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Background"
                    deferredUpload={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Overview Settings</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.overview?.showSection !== false} onChange={(e) => updateSection('overview', 'showSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.overview?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.overview?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge Text</label>
                    <span className="text-xs text-gray-400">{data.overview?.deskBadge?.length || 0}/50</span>
</div>
<input
                    type="text"
                    value={data.overview?.deskBadge || ''}
                    maxLength={50}
                    onChange={(e) => updateSection('overview', 'deskBadge', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
<div className="text-right text-xs text-gray-400 mt-1">{data.hero?.subtitle?.length || 0}/300 characters</div>
                </div>
                <div>
                  <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading Title</label>
                    
</div>
<input
                    type="text"
                    value={data.overview?.title || ''}
                    maxLength={100}
                    onChange={(e) => updateSection('overview', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
<div className="text-right text-xs text-gray-400 mt-1">{data.overview?.title?.length || 0}/100 characters</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description 1</label>
                    
                  </div>
                  <textarea
                    rows="4"
                    value={data.overview?.description1 || ''}
                    maxLength={400}
                    onChange={(e) => updateSection('overview', 'description1', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description 2</label>
                    <span className="text-xs text-gray-400">{data.overview?.description2?.length || 0}/400</span>
                  </div>
                  <textarea
                    rows="4"
                    value={data.overview?.description2 || ''}
                    maxLength={400}
                    onChange={(e) => updateSection('overview', 'description2', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Floating Quote</label>
                    <span className="text-xs text-gray-400">{data.overview?.floatingQuote?.length || 0}/200</span>
</div>
<input
                    type="text"
                    value={data.overview?.floatingQuote || ''}
                    maxLength={200}
                    onChange={(e) => updateSection('overview', 'floatingQuote', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
<div className="text-right text-xs text-gray-400 mt-1">{data.overview?.description1?.length || 0}/400 characters</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Statistic 1</label>
                  <div className="space-y-2">
                    <input type="text" placeholder="Value (e.g. 100+)" value={data.overview?.stat1Value || ''} maxLength={20} onChange={(e) => updateSection('overview', 'stat1Value', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    <input type="text" placeholder="Label (e.g. Placed)" value={data.overview?.stat1Label || ''} maxLength={50} onChange={(e) => updateSection('overview', 'stat1Label', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Statistic 2</label>
                  <div className="space-y-2">
                    <input type="text" placeholder="Value (e.g. 150+)" value={data.overview?.stat2Value || ''} maxLength={20} onChange={(e) => updateSection('overview', 'stat2Value', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                    <input type="text" placeholder="Label (e.g. Companies)" value={data.overview?.stat2Label || ''} maxLength={50} onChange={(e) => updateSection('overview', 'stat2Label', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Collage Image 1</label>
                  <SingleImageUploader
                    imageUrl={data.overview?.collageImage1 || ''}
                    uploadEndpoint="/upload/placements"
                    defaultImage="/assets/Images/placements/default-collage-1.jpg"
                    onUploadComplete={(url) => updateSection('overview', 'collageImage1', url)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Collage Image 2</label>
                  <SingleImageUploader
                    imageUrl={data.overview?.collageImage2 || ''}
                    uploadEndpoint="/upload/placements"
                    defaultImage="/assets/Images/placements/default-collage-2.jpg"
                    onUploadComplete={(url) => updateSection('overview', 'collageImage2', url)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Partner Logos (Bottom of Overview)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => (
                    <SingleImageUploader
                      key={idx}
                      imageUrl={data.overview?.overviewLogos?.[idx] || ''}
                      uploadEndpoint="/upload/placements"
                      defaultImage={`/assets/Images/placements/default-partner-${idx + 1}.jpg`}
                      onUploadComplete={(url) => updateOverviewLogo(idx, url)}
                      onUploadStateChange={setIsUploading}
                      deferredUpload={true}
                      label={`Logo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVERS TAB */}
          {activeTab === 'proudAchievers' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Proud Achievers ({(data.proudAchievers?.items || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.proudAchievers?.showSection !== false} onChange={(e) => updateSection('proudAchievers', 'showSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.proudAchievers?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.proudAchievers?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'proudAchievers')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Achiever
                </button>
              </div>
              <div className="mb-6">
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                  
</div>
<input
                  type="text"
                  value={data.proudAchievers?.title || ''}
                  maxLength={50}
                  onChange={(e) => updateSection('proudAchievers', 'title', e.target.value)}
                  className="max-w-md w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
<div className="text-right text-xs text-gray-400 mt-1">{data.proudAchievers?.title?.length || 0}/50 characters</div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.proudAchievers?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Award className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Achievers added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.proudAchievers.items} onReorder={(items) => updateArrayItems('proudAchievers', items)} className="space-y-3">
                    {data.proudAchievers.items.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || idx} 
                        item={item} 
                        index={idx} 
                        type="proudAchievers"
                        onEdit={(i) => openModal('edit', 'proudAchievers', i)} 
                        onDelete={() => handleDeleteItem('proudAchievers', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {/* RECRUITERS TAB */}
          {activeTab === 'topRecruiters' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Top Recruiters ({(data.topRecruiters?.items || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.topRecruiters?.showSection !== false} onChange={(e) => updateSection('topRecruiters', 'showSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.topRecruiters?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.topRecruiters?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'topRecruiters')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Recruiter
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                    
</div>
<input
                    type="text"
                    value={data.topRecruiters?.title || ''}
                    maxLength={50}
                    onChange={(e) => updateSection('topRecruiters', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
<div className="text-right text-xs text-gray-400 mt-1">{data.topRecruiters?.title?.length || 0}/50 characters</div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    
                  </div>
                  <textarea
                    rows="2"
                    value={data.topRecruiters?.description || ''}
                    maxLength={300}
                    onChange={(e) => updateSection('topRecruiters', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.topRecruiters?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Briefcase className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Recruiters added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.topRecruiters.items} onReorder={(items) => updateArrayItems('topRecruiters', items)} className="space-y-3">
                    {data.topRecruiters.items.map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || idx} 
                        item={item} 
                        index={idx} 
                        type="topRecruiters"
                        onEdit={(i) => openModal('edit', 'topRecruiters', i)} 
                        onDelete={() => handleDeleteItem('topRecruiters', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {/* EXCELLENCE TAB */}
          {activeTab === 'excellenceSupport' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-lg font-bold text-[#1e2869]">Excellence Support</h2>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={data.excellenceSupport?.showSection !== false} onChange={(e) => updateSection('excellenceSupport', 'showSection', e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.excellenceSupport?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.excellenceSupport?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading Title</label>
                      <span className="text-xs text-gray-400">{data.excellenceSupport?.title?.length || 0}/100</span>
</div>
<input
                      type="text"
                      value={data.excellenceSupport?.title || ''}
                      maxLength={100}
                      onChange={(e) => updateSection('excellenceSupport', 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
<div className="text-right text-xs text-gray-400 mt-1">{data.topRecruiters?.description?.length || 0}/300 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                      
                    </div>
                    <textarea
                      rows="4"
                      value={data.excellenceSupport?.description || ''}
                      maxLength={300}
                      onChange={(e) => updateSection('excellenceSupport', 'description', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Background Image</label>
                  <SingleImageUploader
                    imageUrl={data.excellenceSupport?.backgroundImage || ''}
                    uploadEndpoint="/upload/placements"
                    defaultImage="/assets/Images/placements/default-excellence-bg.png"
                    onUploadComplete={(urlObj) => updateSection('excellenceSupport', 'backgroundImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* List One */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Feature List 1</h3>
                    <button onClick={() => openModal('add', 'excellenceSupportListOne')} className="text-primary hover:text-primary/80"><Plus className="w-5 h-5" /></button>
                  </div>
                  <Reorder.Group axis="y" values={data.excellenceSupport.listOne || []} onReorder={(items) => updateArrayItems('excellenceSupport', items, 'listOne')} className="space-y-2">
                    {(data.excellenceSupport.listOne || []).map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || idx} item={item} index={idx} type="excellenceSupportListOne"
                        onEdit={(i) => openModal('edit', 'excellenceSupportListOne', i)} onDelete={() => handleDeleteItem('excellenceSupportListOne', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                </div>
                {/* List Two */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Feature List 2</h3>
                    <button onClick={() => openModal('add', 'excellenceSupportListTwo')} className="text-primary hover:text-primary/80"><Plus className="w-5 h-5" /></button>
                  </div>
                  <Reorder.Group axis="y" values={data.excellenceSupport.listTwo || []} onReorder={(items) => updateArrayItems('excellenceSupport', items, 'listTwo')} className="space-y-2">
                    {(data.excellenceSupport.listTwo || []).map((item, idx) => (
                      <DraggableItemCard 
                        key={item.uuid || idx} item={item} index={idx} type="excellenceSupportListTwo"
                        onEdit={(i) => openModal('edit', 'excellenceSupportListTwo', i)} onDelete={() => handleDeleteItem('excellenceSupportListTwo', idx)} 
                      />
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </div>
          )}

          {/* FACULTY TAB */}
          {activeTab === 'facultyInCharge' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Faculty In-Charge ({(data.facultyInCharge?.items || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.facultyInCharge?.showSection !== false} onChange={(e) => updateSection('facultyInCharge', 'showSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.facultyInCharge?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.facultyInCharge?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'facultyInCharge')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Faculty
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</label>
                    <span className="text-xs text-gray-400">{data.facultyInCharge?.badge?.length || 0}/50</span>
</div>
<input type="text" value={data.facultyInCharge?.badge || ''} maxLength={50} onChange={(e) => updateSection('facultyInCharge', 'badge', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
<div className="text-right text-xs text-gray-400 mt-1">{data.excellenceSupport?.description?.length || 0}/300 characters</div>
                </div>
                <div>
                  <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading</label>
                    
</div>
<input type="text" value={data.facultyInCharge?.title || ''} maxLength={100} onChange={(e) => updateSection('facultyInCharge', 'title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
<div className="text-right text-xs text-gray-400 mt-1">{data.facultyInCharge?.title?.length || 0}/100 characters</div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    
                  </div>
                  <textarea rows="2" value={data.facultyInCharge?.description || ''} maxLength={300} onChange={(e) => updateSection('facultyInCharge', 'description', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.facultyInCharge?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Users className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Faculty added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.facultyInCharge.items} onReorder={(items) => updateArrayItems('facultyInCharge', items)} className="space-y-3">
                    {data.facultyInCharge.items.map((item, idx) => (
                      <DraggableItemCard key={item.uuid || idx} item={item} index={idx} type="facultyInCharge" onEdit={(i) => openModal('edit', 'facultyInCharge', i)} onDelete={() => handleDeleteItem('facultyInCharge', idx)} />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {/* COMMITTEE TAB */}
          {activeTab === 'placementCommittee' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Placement Committee ({(data.placementCommittee?.items || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.placementCommittee?.showSection !== false} onChange={(e) => updateSection('placementCommittee', 'showSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.placementCommittee?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.placementCommittee?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'placementCommittee')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading</label>
                      <span className="text-xs text-gray-400">{data.placementCommittee?.title?.length || 0}/100</span>
</div>
<input type="text" value={data.placementCommittee?.title || ''} maxLength={100} onChange={(e) => updateSection('placementCommittee', 'title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
<div className="text-right text-xs text-gray-400 mt-1">{data.facultyInCharge?.description?.length || 0}/300 characters</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                      
                    </div>
                    <textarea rows="3" value={data.placementCommittee?.description || ''} maxLength={300} onChange={(e) => updateSection('placementCommittee', 'description', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Text</label>
                      <span className="text-xs text-gray-400">{data.placementCommittee?.buttonText?.length || 0}/50</span>
</div>
<input type="text" value={data.placementCommittee?.buttonText || ''} maxLength={50} onChange={(e) => updateSection('placementCommittee', 'buttonText', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
<div className="text-right text-xs text-gray-400 mt-1">{data.placementCommittee?.description?.length || 0}/300 characters</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vector Image</label>
                  <SingleImageUploader
                    imageUrl={data.placementCommittee?.image || ''}
                    uploadEndpoint="/upload/placements"
                    defaultImage="/assets/Images/placements/default-committee-vector.png"
                    onUploadComplete={(urlObj) => updateSection('placementCommittee', 'image', urlObj)}
                    onUploadStateChange={setIsUploading}
                    deferredUpload={true}
                  />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.placementCommittee?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Users className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Members added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.placementCommittee.items} onReorder={(items) => updateArrayItems('placementCommittee', items)} className="space-y-3">
                    {data.placementCommittee.items.map((item, idx) => (
                      <DraggableItemCard key={item.uuid || idx} item={item} index={idx} type="placementCommittee" onEdit={(i) => openModal('edit', 'placementCommittee', i)} onDelete={() => handleDeleteItem('placementCommittee', idx)} />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === 'activities' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-[#1e2869]">Activities & Events ({(data.activities?.items || []).length})</h2>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={data.activities?.showSection !== false} onChange={(e) => updateSection('activities', 'showSection', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${data.activities?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.activities?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => openModal('add', 'activities')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Activity
                </button>
              </div>
              <div className="mb-6">
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Heading</label>
                  
</div>
<input
                  type="text"
                  value={data.activities?.title || ''}
                  maxLength={100}
                  onChange={(e) => updateSection('activities', 'title', e.target.value)}
                  className="max-w-md w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
<div className="text-right text-xs text-gray-400 mt-1">{data.activities?.title?.length || 0}/100 characters</div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                {!(data.activities?.items || []).length ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity className="w-12 h-12 mb-3 opacity-20" />
                    <p>No Activities added yet.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={data.activities.items} onReorder={(items) => updateArrayItems('activities', items)} className="space-y-3">
                    {data.activities.items.map((item, idx) => (
                      <DraggableItemCard key={item.uuid || idx} item={item} index={idx} type="activities" onEdit={(i) => openModal('edit', 'activities', i)} onDelete={() => handleDeleteItem('activities', idx)} />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add New' : 'Edit'} Item
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-6">
                  {modalType === 'proudAchievers' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Name</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.name?.length || 0}/50 characters</div>
                        </div>
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Program</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.program || ''} onChange={e => setCurrentItem({...currentItem, program: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.program?.length || 0}/50 characters</div>
                        </div>
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Company</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.company || ''} onChange={e => setCurrentItem({...currentItem, company: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.company?.length || 0}/50 characters</div>
                        </div>
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Role</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.role || ''} onChange={e => setCurrentItem({...currentItem, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.role?.length || 0}/50 characters</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Student Image</label>
                          <SingleImageUploader imageUrl={currentItem.image || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, image: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                          <SingleImageUploader imageUrl={currentItem.companyLogo || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, companyLogo: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                        </div>
                      </div>
                    </>
                  )}

                  {modalType === 'topRecruiters' && (
                    <>
                      <div>
                        <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Company Name</label>
                          
</div>
<input type="text" maxLength={50} value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.name?.length || 0}/50 characters</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Logo</label>
                        <SingleImageUploader imageUrl={currentItem.logo || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, logo: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                      </div>
                    </>
                  )}

                  {(modalType === 'excellenceSupportListOne' || modalType === 'excellenceSupportListTwo') && (
                    <div>
                      <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Feature Text</label>
                        
</div>
<input type="text" maxLength={100} value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.title?.length || 0}/100 characters</div>
                    </div>
                  )}

                  {modalType === 'facultyInCharge' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Name</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.name?.length || 0}/50 characters</div>
                        </div>
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Designation</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.designation || ''} onChange={e => setCurrentItem({...currentItem, designation: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.designation?.length || 0}/50 characters</div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Photo</label>
                        <SingleImageUploader imageUrl={currentItem.image || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, image: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                      </div>
                    </>
                  )}

                  {modalType === 'placementCommittee' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Name</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.name?.length || 0}/50 characters</div>
                        </div>
                        <div>
                          <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Role</label>
                            
</div>
<input type="text" maxLength={50} value={currentItem.role || ''} onChange={e => setCurrentItem({...currentItem, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.role?.length || 0}/50 characters</div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Photo</label>
                        <SingleImageUploader imageUrl={currentItem.image || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, image: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                      </div>
                    </>
                  )}

                  {modalType === 'activities' && (
                    <>
                      <div>
                        <div className="mb-1.5">
<label className="block text-sm font-medium text-gray-700">Title</label>
                          
</div>
<input type="text" maxLength={100} value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
<div className="text-right text-xs text-gray-400 mt-1">{currentItem.title?.length || 0}/100 characters</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <span className="text-xs text-gray-400">{currentItem.description?.length || 0}/300</span>
                        </div>
                        <textarea rows="3" maxLength={300} value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Image</label>
                        <SingleImageUploader imageUrl={currentItem.image || ''} uploadEndpoint="/upload/placements" defaultImage="/assets/Images/placements/default-avatar.png" onUploadComplete={(url) => setCurrentItem({...currentItem, image: url})} onUploadStateChange={setIsUploading} deferredUpload={true} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  disabled={isUploading}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-[#151c48] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === 'add' ? 'Add Item' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePlacementPage;
