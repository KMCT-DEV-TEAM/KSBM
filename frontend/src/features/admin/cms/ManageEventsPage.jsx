"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, Monitor, Tablet, Smartphone, X, FileText, Info, Calendar, Sparkles, Music, Share2, Camera, Layout, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import { uploadDeferredImage } from './utils/uploadHelper';
import SingleDocumentUploader from './components/SingleDocumentUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageEventsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <FileText className="w-4 h-4" /> },
    { id: 'about', label: 'About Section', icon: <Info className="w-4 h-4" /> },
    { id: 'upcoming', label: 'Upcoming Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'highlighted', label: 'Highlighted Programs', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'essence', label: 'Essence of Culture', icon: <Music className="w-4 h-4" /> },
    { id: 'stayConnected', label: 'Stay Connected', icon: <Share2 className="w-4 h-4" /> },
    { id: 'moments', label: 'Moments Captured', icon: <Camera className="w-4 h-4" /> },
  ];

  const defaults = {
    hero: {
      title: 'THE SPIRIT OF CULTURE',
      subtitle: 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life, fostering creativity, leadership, and lifelong memories.',
      backgroundImage: '/assets/Images/Group 250.png'
    },
    about: {
      subheading: 'About',
      heading: 'THE SPIRIT OF CULTURE',
      paragraph1: 'Discover a celebration where creativity knows no limits and every performance tells a story worth remembering. Kaleido is more than a cultural festival—it\'s a vibrant platform where passion meets purpose, traditions blend with innovation, and talent shines without boundaries. Bringing together students, artists, performers, and creative minds from diverse backgrounds, the festival transforms the campus into a spectacular stage filled with energy, color, and inspiration.',
      paragraph2: 'Immerse yourself in a world of mesmerizing dance performances, soul-stirring music, captivating theatre, expressive fine arts, photography, fashion, literature, and countless cultural experiences that celebrate the richness of artistic expression. Whether you\'re stepping into the spotlight as a performer, competing to showcase your skills, cheering for your peers, or simply enjoying the electrifying atmosphere, every moment at Kaleido is designed to inspire, connect, and create lasting memories.',
      image: '/assets/Images/image 91.png',
      brochureUrl: '',
      calendarUrl: ''
    },
    upcomingEvents: {
      heading: 'THE UPCOMING EVENTS',
      events: [
        {
          title: 'CELEBRITY VISIT',
          description: 'Join us for an exclusive evening with renowned personalities. Experience an inspiring session filled with insights, interactions, and memorable moments.',
          date: '12',
          month: 'OCT',
          img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
        }
      ]
    },
    highlightedPrograms: {
      heading: 'THE HIGHLIGHTED PROGRAMS',
      images: [
        { img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop', alt: 'Program 1' },
        { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop', alt: 'Program 2' },
        { img: 'https://images.unsplash.com/photo-1533174000273-7d5d1c2ec7ce?q=80&w=600&auto=format&fit=crop', alt: 'Program 3' },
        { img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop', alt: 'Program 4' },
        { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', alt: 'Program 5' },
        { img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', alt: 'Program 6' },
        { img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop', alt: 'Program 7' },
        { img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop', alt: 'Program 8' }
      ]
    },
    essenceOfCulture: {
      heading: 'THE ESSENCE OF CULTURE',
      items: [
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop', category: 'Concert' }
      ]
    },
    stayConnected: {
      heading: 'STAY CONNECTED',
      posters: [
        { img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop' }
      ]
    },
    momentsCaptured: {
      heading: 'MOMENTS CAPTURED',
      images: [
        { img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop' }
      ]
    }
  };

  const [formData, setFormData] = useState(defaults);
  const [dragInfo, setDragInfo] = useState(null);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [modalFile, setModalFile] = useState(null);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isModalSaving, setIsModalSaving] = useState(false);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      let componentName = '';
      let payload = null;
      
      switch (activeTab) {
        case 'hero': componentName = 'EventsHero'; payload = { hero: formData.hero }; break;
        case 'about': componentName = 'EventsAbout'; payload = { about: formData.about }; break;
        case 'upcoming': componentName = 'EventsUpcoming'; payload = { upcomingEvents: formData.upcomingEvents }; break;
        case 'highlighted': componentName = 'EventsCarousel'; payload = { highlightedPrograms: formData.highlightedPrograms }; break;
        case 'essence': componentName = 'EventsEssence'; payload = { essenceOfCulture: formData.essenceOfCulture }; break;
        case 'stayConnected': componentName = 'EventsStayConnected'; payload = { stayConnected: formData.stayConnected }; break;
        case 'moments': componentName = 'EventsMoments'; payload = { momentsCaptured: formData.momentsCaptured }; break;
      }
      
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName, payload }, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      const interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [formData, activeTab, isPreviewModalOpen]);

  const openAddModal = (section, key, defaultTemplate) => {
    setAddModalType({ section, key });
    setModalData(defaultTemplate);
    setModalFile(null);
    setModalImageUrl('');
    setIsAddModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!addModalType || !isAddModalOpen || isModalSaving) return;
    setIsModalSaving(true);
    const { section, key } = addModalType;
    
    // Brief delay to show loading state and prevent rapid multiple clicks
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setAddModalType(null);
    setIsAddModalOpen(false);
    setIsModalSaving(false);

    setFormData(prev => {
      const arr = [...(prev[section][key] || [])];
      const newIndex = arr.length;
      
      if (modalFile) {
        setPendingUploads(p => {
          const filtered = p.filter(x => x.path !== `${section}.${key}.${newIndex}.img`);
          return [...filtered, { path: `${section}.${key}.${newIndex}.img`, file: modalFile }];
        });
      }
      
      arr.push({ ...modalData, img: modalImageUrl || modalData.img || '' });
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: arr
        }
      };
    });

    setModalData({});
    setModalFile(null);
    setModalImageUrl('');
  };

  const handleDragStart = (e, section, key, index) => {
    setDragInfo({ section, key, index });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDragInfo(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSection, targetKey, targetIndex) => {
    e.preventDefault();
    if (!dragInfo || dragInfo.section !== targetSection || dragInfo.key !== targetKey || dragInfo.index === targetIndex) return;
    setFormData(prev => {
      const arr = [...(prev[targetSection][targetKey] || [])];
      const draggedItem = arr[dragInfo.index];
      arr.splice(dragInfo.index, 1);
      arr.splice(targetIndex, 0, draggedItem);
      return { ...prev, [targetSection]: { ...prev[targetSection], [targetKey]: arr } };
    });
    setDragInfo(null);
  };

  const handleImageUploadChange = (path, url, file, currentUrl, defaultUrl) => {
    if (url !== currentUrl && currentUrl && !currentUrl.startsWith('blob:') && currentUrl !== defaultUrl) {
      setImagesToDelete(prev => [...prev, currentUrl]);
    }
    if (file) {
      setPendingUploads(prev => {
        const filtered = prev.filter(p => p.path !== path);
        return [...filtered, { path, file }];
      });
    }
    const keys = path.split('.');
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = url;
      return newData;
    });
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/events-page');
      if (res.data) {
        setFormData(prev => {
          const d = res.data;
          return {
            hero: { ...prev.hero, ...(d.hero || {}) },
            about: { ...prev.about, ...(d.about || {}) },
            upcomingEvents: { 
              ...prev.upcomingEvents, 
              ...(d.upcomingEvents || {}),
              events: d.upcomingEvents?.events?.length > 0 ? d.upcomingEvents.events : prev.upcomingEvents.events
            },
            highlightedPrograms: { 
              ...prev.highlightedPrograms, 
              ...(d.highlightedPrograms || {}),
              images: (() => {
                const fetchedImages = d.highlightedPrograms?.images?.length > 0 ? d.highlightedPrograms.images : prev.highlightedPrograms.images;
                const paddedImages = [...fetchedImages];
                while (paddedImages.length < 8) {
                  paddedImages.push({ img: '', alt: `Program ${paddedImages.length + 1}` });
                }
                return paddedImages.slice(0, 8);
              })()
            },
            essenceOfCulture: { 
              ...prev.essenceOfCulture, 
              ...(d.essenceOfCulture || {}),
              items: (() => {
                const raw = d.essenceOfCulture?.items?.length > 0 ? d.essenceOfCulture.items : prev.essenceOfCulture.items;
                const seen = new Set();
                return raw.filter(item => {
                  const key = (item.category || '').trim().toLowerCase();
                  if (!key) return true;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
              })()
            },
            stayConnected: { 
              ...prev.stayConnected, 
              ...(d.stayConnected || {}),
              posters: d.stayConnected?.posters?.length > 0 ? d.stayConnected.posters : prev.stayConnected.posters
            },
            momentsCaptured: { 
              ...prev.momentsCaptured, 
              ...(d.momentsCaptured || {}),
              images: d.momentsCaptured?.images?.length > 0 ? d.momentsCaptured.images : prev.momentsCaptured.images
            }
          };
        });
      }
    } catch (err) {
      console.error('Error loading Events Page settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the Events website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        if (saving) return;
        setSaving(true);
        try {
          let updatedData = JSON.parse(JSON.stringify(formData));
          if (updatedData.essenceOfCulture?.items?.length > 0) {
            const seen = new Set();
            updatedData.essenceOfCulture.items = updatedData.essenceOfCulture.items.filter(item => {
              const key = (item.category || '').trim().toLowerCase();
              if (!key) return true;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          }
          for (const upload of pendingUploads) {
            const uploadedUrl = await uploadDeferredImage({ file: upload.file }, '/upload/events');
            if (uploadedUrl) {
              const keys = upload.path.split('.');
              let current = updatedData;
              for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
              }
              current[keys[keys.length - 1]] = uploadedUrl;
            }
          }
          for (const url of imagesToDelete) {
            if (!url.startsWith('blob:') && url.includes('/assets/Images/events/')) {
              await api.delete('/upload', { data: { fileUrl: url }, hideLoader: true }).catch(() => {});
            }
          }
          setPendingUploads([]);
          setImagesToDelete([]);
          await api.put('/cms/events-page', updatedData, { hideLoader: true });
          setFormData(updatedData);
          Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    setFormData(defaults);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  // Helper arrays/functions for repetitive CRUD arrays
  const handleUpdateArray = (section, key, index, field, value) => {
    setFormData(prev => {
      const arr = [...(prev[section][key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [key]: arr } };
    });
  };

  const handleAddArrayItem = (section, key, emptyItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: [...(prev[section][key] || []), emptyItem]
      }
    }));
  };

  const handleRemoveArrayItem = (section, key, index) => {
    confirmAction({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item? This action cannot be undone after saving.',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: () => {
        setFormData(prev => {
          const itemToRemove = prev[section][key][index];
          if (itemToRemove && itemToRemove.img && !itemToRemove.img.startsWith('blob:') && !itemToRemove.img.startsWith('http')) {
            setImagesToDelete(old => [...old, itemToRemove.img]);
          }
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [key]: prev[section][key].filter((_, i) => i !== index)
            }
          };
        });
      }
    });
  };

  const handleMoveArrayItem = (section, key, index, direction) => {
    setFormData(prev => {
      const arr = [...(prev[section][key] || [])];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[target];
      arr[target] = temp;
      return { ...prev, [section]: { ...prev[section], [key]: arr } };
    });
  };

  if (loading) return <AdminSkeleton />;

  const VisibilityToggle = ({ section }) => (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={formData[section]?.showSection !== false}
          onChange={(e) => setFormData({ ...formData, [section]: { ...formData[section], showSection: e.target.checked } })}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${formData[section]?.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData[section]?.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
      </div>
      <span className="ml-3 text-sm font-medium text-gray-700">
        {formData[section]?.showSection !== false ? 'Visible' : 'Hidden'}
      </span>
    </label>
  );

  return (
    <div className="space-y-6 w-full">
      {/* Tabs Navigation */}
      <div className="relative flex items-center gap-1 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => { if(tabsContainerRef.current) tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' }) }} 
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors shrink-0"
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
        <button 
          onClick={() => { if(tabsContainerRef.current) tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' }) }} 
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <PageHeader 
        title="Manage Events Page" 
        description="Customize the cinematic events landing page including the hero, upcoming events, and photo collages."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={saving}
      />

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Smartphone className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewMode === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe ref={iframeRef} src="/preview/cms" className="w-full h-full border-0" title="Events Preview" />
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
          className="w-full space-y-6 pb-12"
        >
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <SectionForm title="Hero Banner">
              <div className="mb-8 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-[#1e2869]">Text Content Visibility</h3>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.hero?.showTextContent !== false}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, showTextContent: e.target.checked } })}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.hero?.showTextContent !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.hero?.showTextContent !== false ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.hero?.showTextContent !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Page Title <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                    <input type="text" maxLength={50} value={formData.hero.title} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.hero.title || '')).length}/50</span></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Subtitle <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 250 chars)</span></label>
                    <textarea rows={4} maxLength={250} value={formData.hero.subtitle} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 250</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.hero.subtitle || '')).length}/250</span></div>
                  </div>
                </div>
                
              </div>
            </SectionForm>
          )}

          {/* About Section */}
          {activeTab === 'about' && (
            <SectionForm title="About Section" actionButton={<VisibilityToggle section="about" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Subheading (Ribbon) <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 30 chars)</span></label>
                      <input type="text" maxLength={30} value={formData.about?.subheading || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, subheading: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.about?.subheading || '')).length}/30</span></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Main Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                      <input type="text" maxLength={50} value={formData.about?.heading || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, heading: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.about?.heading || '')).length}/50</span></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Paragraph 1 <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 1000 chars)</span></label>
                    <textarea rows={3} maxLength={1000} value={formData.about?.paragraph1 || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph1: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 1000</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.about?.paragraph1 || '')).length}/1000</span></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Paragraph 2 <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 1000 chars)</span></label>
                    <textarea rows={3} maxLength={1000} value={formData.about?.paragraph2 || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph2: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 1000</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.about?.paragraph2 || '')).length}/1000</span></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Event Brochure PDF (Optional)</label>
                      <SingleDocumentUploader
                        id="events-brochure"
                        fileUrl={formData.about?.brochureUrl}
                        deferredUpload={true}
                        onUploadComplete={(res) => {
                          if (res.isDeleted) {
                            handleImageUploadChange('about.brochureUrl', '', null, formData.about?.brochureUrl);
                          } else {
                            handleImageUploadChange('about.brochureUrl', res.previewUrl, res.file, formData.about?.brochureUrl);
                          }
                        }}
                        label="Upload Brochure PDF"
                        accept=".pdf"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">Download Calendar PDF (Optional)</label>
                      <SingleDocumentUploader
                        id="events-calendar"
                        fileUrl={formData.about?.calendarUrl}
                        deferredUpload={true}
                        onUploadComplete={(res) => {
                          if (res.isDeleted) {
                            handleImageUploadChange('about.calendarUrl', '', null, formData.about?.calendarUrl);
                          } else {
                            handleImageUploadChange('about.calendarUrl', res.previewUrl, res.file, formData.about?.calendarUrl);
                          }
                        }}
                        label="Upload Calendar PDF"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">About Featured Image</label>
                  <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                    label="About Section Image"
                    currentImage={formData.about?.image}
                    defaultImage={defaults.about.image} onChange={(url, file) => handleImageUploadChange('about.image', url, file, formData.about?.image, defaults.about.image)}
                  />
                </div>
              </div>
            </SectionForm>
          )}

          {/* Upcoming Events */}
          {activeTab === 'upcoming' && (
            <SectionForm title="Upcoming Events" actionButton={<VisibilityToggle section="upcomingEvents" />}>
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-gray-500">Section Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                  <input type="text" maxLength={50} value={formData.upcomingEvents.heading} onChange={e => setFormData({ ...formData, upcomingEvents: { ...formData.upcomingEvents, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.upcomingEvents.heading || '')).length}/50</span></div>
                </div>

                <div className="flex justify-end mb-4">
                  <button onClick={() => openAddModal('upcomingEvents', 'events', { title: '', description: '', date: '', month: '', img: '' })} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.upcomingEvents.events?.map((item, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, 'upcomingEvents', 'events', idx)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'upcomingEvents', 'events', idx)} className="p-4 rounded-md border border-gray-200 bg-gray-50/50 relative group hover:border-primary/30 transition-all cursor-move">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-500 uppercase">Event #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleMoveArrayItem('upcomingEvents', 'events', idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => handleMoveArrayItem('upcomingEvents', 'events', idx, 1)} disabled={idx === (formData.upcomingEvents.events?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                          <button onClick={() => handleRemoveArrayItem('upcomingEvents', 'events', idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-1/3 shrink-0">
                          <label className="text-xs font-semibold text-gray-500 mb-2 block">Event Poster/Image</label>
                          <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                            label="Upload Poster"
                            currentImage={item.img}
                            defaultImage={defaults.upcomingEvents.events[0]?.img} onChange={(url, file) => handleImageUploadChange(`upcomingEvents.events.${idx}.img`, url, file, item.img, defaults.upcomingEvents.events[0]?.img)}
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Event Title <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                            <input type="text" maxLength={50} value={item.title} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'title', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. CELEBRITY VISIT" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.title || '')).length}/50</span></div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Event Description <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 200 chars)</span></label>
                            <textarea rows={3} maxLength={200} value={item.description} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'description', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 200</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.description || '')).length}/200</span></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-500">Date <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 2 chars)</span></label>
                              <input type="text" maxLength={2} value={item.date} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'date', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. 12" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 2</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.date || '')).length}/2</span></div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-500">Month <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 3 chars)</span></label>
                              <input type="text" maxLength={3} value={item.month} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'month', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. OCT" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 3</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.month || '')).length}/3</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionForm>
          )}

          {/* Highlighted Programs Carousel */}
          {activeTab === 'highlighted' && (
            <SectionForm title="Highlighted Programs (3D Carousel)" actionButton={<VisibilityToggle section="highlightedPrograms" />}>
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-gray-500">Section Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                  <input type="text" maxLength={50} value={formData.highlightedPrograms.heading} onChange={e => setFormData({ ...formData, highlightedPrograms: { ...formData.highlightedPrograms, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.highlightedPrograms.heading || '')).length}/50</span></div>
                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.highlightedPrograms.images?.map((item, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, 'highlightedPrograms', 'images', idx)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'highlightedPrograms', 'images', idx)} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group cursor-move">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Image #{idx + 1}</span>
                      </div>
                      <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                        currentImage={item.img}
                        defaultImage={defaults.highlightedPrograms.images[0]?.img} onChange={(url, file) => handleImageUploadChange(`highlightedPrograms.images.${idx}.img`, url, file, item.img, defaults.highlightedPrograms.images[0]?.img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionForm>
          )}
          
          {/* Essence of Culture */}
          {activeTab === 'essence' && (
            <SectionForm title="Essence of Culture (Photo Collage)" actionButton={<VisibilityToggle section="essenceOfCulture" />}>
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-gray-500">Section Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                  <input type="text" maxLength={50} value={formData.essenceOfCulture.heading} onChange={e => setFormData({ ...formData, essenceOfCulture: { ...formData.essenceOfCulture, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.essenceOfCulture.heading || '')).length}/50</span></div>
                </div>

                <div className="flex justify-end mb-4">
                  <button onClick={() => openAddModal('essenceOfCulture', 'items', { img: '', category: '', description: '', programs: [] })} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.essenceOfCulture.items?.map((item, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, 'essenceOfCulture', 'items', idx)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'essenceOfCulture', 'items', idx)} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group flex flex-col space-y-3 cursor-move">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                        <button onClick={() => handleRemoveArrayItem('essenceOfCulture', 'items', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Category Name <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars, supports line breaks)</span></label>
                        <textarea rows={2} maxLength={50} value={item.category} onChange={e => handleUpdateArray('essenceOfCulture', 'items', idx, 'category', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none mt-1" placeholder="Category (e.g. Dance)" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.category || '')).length}/50</span></div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Category Description <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 100 chars)</span></label>
                        <textarea rows={2} maxLength={100} value={item.description || ''} onChange={e => handleUpdateArray('essenceOfCulture', 'items', idx, 'description', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none mt-1" placeholder="Short description of this cultural category..." />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 100</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.description || '')).length}/100</span></div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Programs List (Comma-separated) <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 200 chars)</span></label>
                        <input type="text" maxLength={200} value={Array.isArray(item.programs) ? item.programs.join(', ') : (item.programs || '')} onChange={e => handleUpdateArray('essenceOfCulture', 'items', idx, 'programs', e.target.value.split(',').map(s => s.trim()))} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none mt-1" placeholder="e.g. Solo Dance, Folk Dance, Group Classical" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 200</span><span className="text-[10px] text-gray-400 font-medium">{(String(item.programs || '')).length}/200</span></div>
                      </div>
                      <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                        currentImage={item.img}
                        defaultImage={defaults.essenceOfCulture.items[0]?.img} onChange={(url, file) => handleImageUploadChange(`essenceOfCulture.items.${idx}.img`, url, file, item.img, defaults.essenceOfCulture.items[0]?.img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionForm>
          )}
          
          {/* Stay Connected */}
          {activeTab === 'stayConnected' && (
            <SectionForm title="Stay Connected (Posters)" actionButton={<VisibilityToggle section="stayConnected" />}>
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-gray-500">Section Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                  <input type="text" maxLength={50} value={formData.stayConnected.heading} onChange={e => setFormData({ ...formData, stayConnected: { ...formData.stayConnected, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.stayConnected.heading || '')).length}/50</span></div>
                </div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => openAddModal('stayConnected', 'posters', { img: '' })} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Poster
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.stayConnected.posters?.map((item, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, 'stayConnected', 'posters', idx)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'stayConnected', 'posters', idx)} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group cursor-move">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Poster #{idx + 1}</span>
                        <button onClick={() => handleRemoveArrayItem('stayConnected', 'posters', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                        currentImage={item.img}
                        defaultImage={defaults.stayConnected.posters[0]?.img} onChange={(url, file) => handleImageUploadChange(`stayConnected.posters.${idx}.img`, url, file, item.img, defaults.stayConnected.posters[0]?.img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionForm>
          )}
          
          {/* Moments Captured */}
          {activeTab === 'moments' && (
            <SectionForm title="Moments Captured (Masonry Grid)" actionButton={<VisibilityToggle section="momentsCaptured" />}>
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-gray-500">Section Heading <span className="text-[10px] text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                  <input type="text" maxLength={50} value={formData.momentsCaptured.heading} onChange={e => setFormData({ ...formData, momentsCaptured: { ...formData.momentsCaptured, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(String(formData.momentsCaptured.heading || '')).length}/50</span></div>
                </div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => openAddModal('momentsCaptured', 'images', { img: '' })} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Moment
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.momentsCaptured.images?.map((item, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, 'momentsCaptured', 'images', idx)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'momentsCaptured', 'images', idx)} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group cursor-move">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Moment #{idx + 1}</span>
                        <button onClick={() => handleRemoveArrayItem('momentsCaptured', 'images', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <LogoUploader uploadEndpoint="/upload/events" deferredMode={true}
                        currentImage={item.img}
                        defaultImage={defaults.momentsCaptured.images[0]?.img} onChange={(url, file) => handleImageUploadChange(`momentsCaptured.images.${idx}.img`, url, file, item.img, defaults.momentsCaptured.images[0]?.img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionForm>
          )}

          
        </motion.div>
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg font-bold text-gray-800 tracking-wide uppercase">Add New Item</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50 flex-1">
                {addModalType?.section === 'upcomingEvents' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Event Title <span className="text-gray-400 font-normal ml-2">(Max 50 chars)</span></label>
                      <input type="text" maxLength={50} value={modalData.title} onChange={e => setModalData({...modalData, title: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="e.g. CELEBRITY VISIT" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Event Description <span className="text-gray-400 font-normal ml-2">(Max 200 chars)</span></label>
                      <textarea rows={3} maxLength={200} value={modalData.description} onChange={e => setModalData({...modalData, description: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Date <span className="text-gray-400 font-normal ml-2">(Max 2 chars)</span></label>
                        <input type="text" maxLength={2} value={modalData.date} onChange={e => setModalData({...modalData, date: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="e.g. 12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Month <span className="text-gray-400 font-normal ml-2">(Max 3 chars)</span></label>
                        <input type="text" maxLength={3} value={modalData.month} onChange={e => setModalData({...modalData, month: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="e.g. OCT" />
                      </div>
                    </div>
                  </div>
                )}
                
                {addModalType?.section === 'essenceOfCulture' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Category Name <span className="text-gray-400 font-normal ml-2">(Max 50 chars, supports line breaks)</span></label>
                      <textarea rows={2} maxLength={50} value={modalData.category} onChange={e => setModalData({...modalData, category: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="Category (e.g. Dance)" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Category Description <span className="text-gray-400 font-normal ml-2">(Max 100 chars)</span></label>
                      <textarea rows={2} maxLength={100} value={modalData.description} onChange={e => setModalData({...modalData, description: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="Short description of this cultural category..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Programs List (Comma-separated) <span className="text-gray-400 font-normal ml-2">(Max 200 chars)</span></label>
                      <input type="text" maxLength={200} value={Array.isArray(modalData.programs) ? modalData.programs.join(', ') : (modalData.programs || '')} onChange={e => setModalData({...modalData, programs: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50" placeholder="e.g. Solo Dance, Folk Dance, Group Classical" />
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-500">Image</label>
                  <LogoUploader 
                    uploadEndpoint="/upload/events" 
                    deferredMode={true}
                    currentImage={modalImageUrl}
                    defaultImage={''}
                    onChange={(url, file) => {
                      setModalImageUrl(url);
                      if (file) setModalFile(file);
                    }}
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
                <button onClick={() => setIsAddModalOpen(false)} disabled={isModalSaving} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={handleModalSave} disabled={isModalSaving} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-[#151c48] text-white rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                  {isModalSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isModalSaving ? 'Saving...' : 'Add Item'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEventsPage;
