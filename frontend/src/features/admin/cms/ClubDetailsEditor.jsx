"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, Plus, Trash2, FileText, Info, Activity, Users, Image as ImageIcon, GripHorizontal, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { useDeferredUpload } from '../../../hooks/useDeferredUpload';
import AdminModal from './components/AdminModal';
import { Pencil } from 'lucide-react';

const TabSkeleton = () => (
  <div className="space-y-6 w-full animate-pulse">
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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ClubDetailsEditor = ({ initialData, onSave, onCancel }) => {
  const [club, setClub] = useState(initialData || null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState(null);
  const [draggedActivityIdx, setDraggedActivityIdx] = useState(null);
  const [draggedFacultyIdx, setDraggedFacultyIdx] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, index: -1, data: null });
  
  const [activeTab, setActiveTab] = useState('hero');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const tabsContainerRef = useRef(null);

  // Preview Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      const payload = {
        type: 'LIVE_PREVIEW_UPDATE',
        data: club,
        activeTab: activeTab
      };
      
      const sendUpdate = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(payload, '*');
        }
      };

      let interval;
      let count = 0;
      interval = setInterval(() => {
        sendUpdate();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);

      const handleMessage = (e) => {
        if (e.data?.type === 'iframe-ready') {
          sendUpdate();
        }
      };
      window.addEventListener('message', handleMessage);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isPreviewModalOpen, club, activeTab]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab || isTabLoading) return;
    setIsTabLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTabLoading(false);
    }, 300);
  };

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  // Initialize on mount or when initialData changes
  useEffect(() => {
    if (initialData) {
      // Ensure we have defaults if some nested fields are missing
      const dataToSet = { ...initialData };
      if (!dataToSet.hero || (!dataToSet.hero.title && !dataToSet.hero.backgroundImage)) {
        dataToSet.hero = { 
          title: 'World Class Facilities', 
          subtitle: 'Experience learning with top-notch infrastructure designed for holistic development.', 
          backgroundImage: '/assets/Images/fecilities/facilities_hero.png', 
          showTextContent: true 
        };
      }
      if (!dataToSet.about || (!dataToSet.about.heading && !dataToSet.about.image)) {
        dataToSet.about = { 
          heading: 'About This Facility', 
          paragraphs: ['Our facilities are designed to provide the best environment for students.'], 
          image: '/assets/Images/fecilities/facility_1.jpg', 
          showSection: true 
        };
      }
      if (!dataToSet.activities || (!dataToSet.activities.heading && (!dataToSet.activities.items || dataToSet.activities.items.length === 0))) {
        dataToSet.activities = { 
          heading: 'Key Features', 
          items: [
            { title: 'Feature 1', subtitle: 'State of the art', image: '/assets/Images/fecilities/facility_2.jpg' },
            { title: 'Feature 2', subtitle: 'Modern equipment', image: '/assets/Images/fecilities/facility_3.jpg' }
          ], 
          showSection: true 
        };
      }
      if (!dataToSet.faculty || (!dataToSet.faculty.heading && (!dataToSet.faculty.members || dataToSet.faculty.members.length === 0))) {
        dataToSet.faculty = { 
          heading: 'Facility Management', 
          subheading: 'Guided by Experts', 
          description: 'Our facilities are managed by experienced professionals dedicated to student success.', 
          members: [
            { name: 'John Doe', role: 'Facility Manager', image: '/assets/Images/fecilities/life_1.jpg' }
          ], 
          showSection: true 
        };
      }
      if (!dataToSet.gallery || (!dataToSet.gallery.heading && (!dataToSet.gallery.images || dataToSet.gallery.images.length === 0))) {
        dataToSet.gallery = { 
          heading: 'Facility Gallery', 
          images: [
            { title: 'View 1', image: '/assets/Images/fecilities/facility_4.jpg' },
            { title: 'View 2', image: '/assets/Images/fecilities/facility_5.jpg' },
            { title: 'View 3', image: '/assets/Images/fecilities/facility_6.jpg' }
          ], 
          showSection: true 
        };
      }
      setClub(dataToSet);
      setIsLoading(false);
    }
  }, [initialData]);

  const openModal = (type, index = -1) => {
    let initialData = {};
    if (type === 'activity') {
      initialData = index >= 0 ? { ...club.activities.items[index] } : { title: '', subtitle: '', image: '' };
    } else if (type === 'faculty') {
      initialData = index >= 0 ? { ...club.faculty.members[index] } : { name: '', role: '', image: '' };
    } else if (type === 'gallery') {
      initialData = index >= 0 ? { ...club.gallery.images[index] } : { image: '', title: '' };
    } else if (type === 'paragraph') {
      initialData = index >= 0 ? { text: club.about.paragraphs[index] } : { text: '' };
    }
    setModalConfig({ isOpen: true, type, index, data: initialData });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null, index: -1, data: null });
  };

  const saveModal = () => {
    const { type, index, data } = modalConfig;
    const newClub = { ...club };
    
    if (type === 'activity') {
      if (!data?.image) {
        Toast.fire({ icon: 'warning', title: 'Please upload an activity image.' });
        return;
      }
      if (!data?.title?.trim()) {
        Toast.fire({ icon: 'warning', title: 'Please enter an activity title.' });
        return;
      }
      if (index >= 0) newClub.activities.items[index] = data;
      else newClub.activities.items.push(data);
    } else if (type === 'faculty') {
      if (!data?.image) {
        Toast.fire({ icon: 'warning', title: 'Please upload a profile image.' });
        return;
      }
      if (!data?.name?.trim()) {
        Toast.fire({ icon: 'warning', title: 'Please enter faculty name.' });
        return;
      }
      if (!data?.role?.trim()) {
        Toast.fire({ icon: 'warning', title: 'Please enter faculty role.' });
        return;
      }
      if (index >= 0) newClub.faculty.members[index] = data;
      else newClub.faculty.members.push(data);
    } else if (type === 'gallery') {
      if (!data?.image) {
        Toast.fire({ icon: 'warning', title: 'Please upload a gallery image.' });
        return;
      }
      if (index >= 0) newClub.gallery.images[index] = data;
      else newClub.gallery.images.push(data);
    } else if (type === 'paragraph') {
      if (!data?.text?.trim()) {
        Toast.fire({ icon: 'warning', title: 'Please enter paragraph text.' });
        return;
      }
      if (index >= 0) {
        newClub.about.paragraphs[index] = data.text;
      } else {
        if (newClub.about.paragraphs.length === 0) {
          newClub.about.paragraphs.push(data.text);
        } else {
          newClub.about.paragraphs[0] = data.text;
        }
      }
    }
    
    setClub(newClub);
    closeModal();
  };

  const handleSave = async () => {
    if (!club) return;
    
    const cleanedClub = { ...club };
    if (cleanedClub.about && cleanedClub.about.paragraphs) {
      cleanedClub.about.paragraphs = cleanedClub.about.paragraphs.filter(p => p && p.trim() !== '');
    }
    
    setIsSaving(true);
    try {
      await onSave(cleanedClub);
      setClub(cleanedClub);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original template state. You still need to click "Save Details" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        const defaultData = {
          ...club,
          hero: {
            title: 'Welcome to the Club',
            subtitle: 'Join us to explore and grow.',
            backgroundImage: '/assets/Images/fecilities/facilities_hero.png',
            showTextContent: true
          },
          about: {
            heading: 'About This Facility',
            paragraphs: ['Our facilities are designed to provide the best environment for students.'],
            image: '/assets/Images/fecilities/facility_1.jpg',
            showSection: true
          },
          activities: {
            heading: 'Key Features',
            items: [
              { title: 'Feature 1', subtitle: 'State of the art', image: '/assets/Images/fecilities/facility_2.jpg' },
              { title: 'Feature 2', subtitle: 'Modern equipment', image: '/assets/Images/fecilities/facility_3.jpg' }
            ],
            showSection: true
          },
          faculty: {
            heading: 'Facility Management',
            subheading: 'Guided by Experts',
            description: 'Our facilities are managed by experienced professionals dedicated to student success.',
            members: [
              { name: 'John Doe', role: 'Facility Manager', image: '/assets/Images/fecilities/life_1.jpg' }
            ],
            showSection: true
          },
          gallery: {
            heading: 'Facility Gallery',
            images: [
              { title: 'View 1', image: '/assets/Images/fecilities/facility_4.jpg' },
              { title: 'View 2', image: '/assets/Images/fecilities/facility_5.jpg' },
              { title: 'View 3', image: '/assets/Images/fecilities/facility_6.jpg' }
            ],
            showSection: true
          }
        };
        setClub(defaultData);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Details to apply.' });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;
  if (!club) return <AdminSkeleton />;

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'about', label: 'About Content', icon: <Info className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities Grid', icon: <Activity className="w-4 h-4" /> },
    { id: 'faculty', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
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

      <div>
        <PageHeader
          title={
            <div className="flex items-center gap-2">
              <button 
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center -ml-2"
                title="Back to Clubs"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span>Edit {club.title || 'Club'} Details</span>
            </div>
          }
          description="Manage the detailed page content for this specific club/facility."
          onSave={handleSave}
          onReset={handleReset}
          onPreview={() => setIsPreviewModalOpen(true)}
          saveText="Save Details"
          isSaving={isSaving}
          isUploading={isUploading}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {isTabLoading ? <TabSkeleton /> : (
            <>
              {/* HERO TAB */}
              {activeTab === 'hero' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="mb-8 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h3 className="text-sm font-bold text-[#1e2869]">Text Content Visibility</h3>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={club.hero.showTextContent !== false && club.hero.showTextContent !== 'false'}
                            onChange={(e) => setClub({ ...club, hero: { ...club.hero, showTextContent: e.target.checked } })}
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${club.hero.showTextContent !== false && club.hero.showTextContent !== 'false' ? 'bg-primary' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${club.hero.showTextContent !== false && club.hero.showTextContent !== 'false' ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {club.hero.showTextContent !== false && club.hero.showTextContent !== 'false' ? 'Visible' : 'Hidden'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Title</label>
                    <input
                      type="text"
                      value={club.hero.title}
                      maxLength={30}
                      onChange={(e) => setClub({ ...club, hero: { ...club.hero, title: e.target.value } })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      placeholder="e.g. KSBM Sports Club: Where Leaders Compete"
                    />
                    <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.hero.title || '').length}/30</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Subtitle</label>
                    <textarea
                      rows="3"
                      value={club.hero.subtitle}
                      maxLength={150}
                      onChange={(e) => setClub({ ...club, hero: { ...club.hero, subtitle: e.target.value } })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                      placeholder="Brief introductory text..."
                    />
                    <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 150</span><span className="text-[10px] text-gray-400 font-medium">{(club.hero.subtitle || '').length}/150</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Image</label>
                    <SingleImageUploader 
                      imageUrl={club.hero.backgroundImage} 
                      onUploadComplete={(url) => setClub({ ...club, hero: { ...club.hero, backgroundImage: url } })}
                      onUploadStateChange={setIsUploading}
                      uploadEndpoint="/upload/facilities"
                      defaultImage="/assets/Images/fecilities/facilities_hero.png"
                      label="Upload Hero Background"
                      deferredUpload={true}
                    />
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6 w-full">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={club.about.showSection !== false}
                          onChange={(e) => setClub({ ...club, about: { ...club.about, showSection: e.target.checked } })}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${club.about.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${club.about.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {club.about.showSection !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Heading</label>
                        <input
                          type="text"
                          value={club.about.heading}
                          maxLength={30}
                          onChange={(e) => setClub({ ...club, about: { ...club.about, heading: e.target.value } })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
                          placeholder="e.g. The Spirit of Competition"
                        />
                        <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.about.heading || '').length}/30</span></div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">Paragraphs</label>
                          {club.about.paragraphs.length < 1 && (
                            <button 
                              onClick={() => openModal('paragraph')}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                            >
                              <Plus className="w-4 h-4" /> Add Paragraph
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {club.about.paragraphs.map((p, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex gap-3 items-start hover:shadow-sm transition-shadow group">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line break-words">{p || 'Empty paragraph'}</p>
                              </div>
                              <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal('paragraph', idx)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => {
                                  confirmAction({
                                    title: 'Delete Paragraph?',
                                    message: 'Are you sure you want to remove this paragraph?',
                                    action: () => {
                                      const newParas = [...club.about.paragraphs];
                                      newParas.splice(idx, 1);
                                      setClub({ ...club, about: { ...club.about, paragraphs: newParas } });
                                    }
                                  });
                                }} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {club.about.paragraphs.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No paragraphs added.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Side Image</label>
                      <SingleImageUploader 
                        imageUrl={club.about.image} 
                        onUploadComplete={(url) => setClub({ ...club, about: { ...club.about, image: url } })}
                        onUploadStateChange={setIsUploading}
                        uploadEndpoint="/upload/facilities"
                        defaultImage="/assets/Images/fecilities/facility_1.jpg"
                        label="Upload About Image"
                        deferredUpload={true}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVITIES TAB */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={club.activities.showSection !== false}
                          onChange={(e) => setClub({ ...club, activities: { ...club.activities, showSection: e.target.checked } })}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${club.activities.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${club.activities.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {club.activities.showSection !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                  <div className="max-w-2xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activities Section Heading</label>
                    <input
                      type="text"
                      value={club.activities.heading}
                      maxLength={30}
                      onChange={(e) => setClub({ ...club, activities: { ...club.activities, heading: e.target.value } })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      placeholder="e.g. THE ART OF EXPRESSION"
                    />
                    <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.activities.heading || '').length}/30</span></div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-semibold text-gray-700">Activity Cards</label>
                      <button 
                        onClick={() => openModal('activity')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Activity
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {club.activities.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          draggable
                          onDragStart={(e) => {
                            setDraggedActivityIdx(idx);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedActivityIdx === null || draggedActivityIdx === idx) return;
                            const newItems = [...club.activities.items];
                            const draggedItem = newItems[draggedActivityIdx];
                            newItems.splice(draggedActivityIdx, 1);
                            newItems.splice(idx, 0, draggedItem);
                            setClub({ ...club, activities: { ...club.activities, items: newItems } });
                            setDraggedActivityIdx(null);
                          }}
                          className={`p-4 border rounded-xl relative group transition-all cursor-move flex items-center gap-4 ${draggedActivityIdx === idx ? 'opacity-50 bg-gray-100 border-dashed border-gray-300' : 'bg-gray-50 border-gray-200 hover:shadow-sm'}`}
                        >
                          <GripHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.title || 'Untitled Activity'}</h4>
                            <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                          </div>
                          <div className="flex shrink-0">
                            <button onClick={() => openModal('activity', idx)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              confirmAction({
                                title: 'Delete Activity?',
                                message: 'Are you sure you want to remove this activity card?',
                                action: () => {
                                  const newItems = [...club.activities.items];
                                  newItems.splice(idx, 1);
                                  setClub({ ...club, activities: { ...club.activities, items: newItems } });
                                }
                              });
                            }} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {club.activities.items.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          No activities added.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FACULTY TAB */}
              {activeTab === 'faculty' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={club.faculty.showSection !== false}
                          onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, showSection: e.target.checked } })}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${club.faculty.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${club.faculty.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {club.faculty.showSection !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subheading (Top)</label>
                      <input
                        type="text"
                        value={club.faculty.subheading}
                        maxLength={30}
                        onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, subheading: e.target.value } })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        placeholder="e.g. Faculty In Charge"
                      />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.faculty.subheading || '').length}/30</span></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Heading</label>
                      <input
                        type="text"
                        value={club.faculty.heading}
                        maxLength={30}
                        onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, heading: e.target.value } })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                        placeholder="e.g. Guide, Mentor, Inspire."
                      />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.faculty.heading || '').length}/30</span></div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description text</label>
                      <textarea
                        rows="2"
                        value={club.faculty.description}
                        maxLength={300}
                        onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, description: e.target.value } })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                      />
                      <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 300</span><span className="text-[10px] text-gray-400 font-medium">{(club.faculty.description || '').length}/300</span></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-semibold text-gray-700">Faculty Members (Max 2)</label>
                      {club.faculty.members.length < 2 && (
                        <button 
                          onClick={() => openModal('faculty')} 
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add Member
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {club.faculty.members.map((member, idx) => (
                        <div 
                          key={idx} 
                          draggable
                          onDragStart={(e) => {
                            setDraggedFacultyIdx(idx);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedFacultyIdx === null || draggedFacultyIdx === idx) return;
                            const newMembers = [...club.faculty.members];
                            const draggedItem = newMembers[draggedFacultyIdx];
                            newMembers.splice(draggedFacultyIdx, 1);
                            newMembers.splice(idx, 0, draggedItem);
                            setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                            setDraggedFacultyIdx(null);
                          }}
                          className={`p-4 border rounded-xl relative group transition-all cursor-move flex items-center gap-4 ${draggedFacultyIdx === idx ? 'opacity-50 bg-gray-100 border-dashed border-gray-300' : 'bg-gray-50 border-gray-200 hover:shadow-sm'}`}
                        >
                          <GripHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{member.name || 'Unnamed Faculty'}</h4>
                            <p className="text-xs text-gray-500 truncate">{member.role}</p>
                          </div>
                          <div className="flex shrink-0">
                            <button onClick={() => openModal('faculty', idx)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              confirmAction({
                                title: 'Delete Faculty Member?',
                                message: 'Are you sure you want to remove this faculty member?',
                                action: () => {
                                  const newMembers = [...club.faculty.members];
                                  newMembers.splice(idx, 1);
                                  setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                                }
                              });
                            }} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {club.faculty.members.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          No faculty added.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={club.gallery.showSection !== false}
                          onChange={(e) => setClub({ ...club, gallery: { ...club.gallery, showSection: e.target.checked } })}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${club.gallery.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${club.gallery.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {club.gallery.showSection !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                  <div className="max-w-2xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gallery Heading</label>
                    <input
                      type="text"
                      value={club.gallery.heading}
                      maxLength={30}
                      onChange={(e) => setClub({ ...club, gallery: { ...club.gallery, heading: e.target.value } })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      placeholder="e.g. Captured in Culture"
                    />
                    <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 30</span><span className="text-[10px] text-gray-400 font-medium">{(club.gallery.heading || '').length}/30</span></div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-semibold text-gray-700">Gallery Images</label>
                      <button 
                        onClick={() => openModal('gallery')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Image
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {club.gallery.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          draggable
                          onDragStart={(e) => {
                            setDraggedGalleryIdx(idx);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedGalleryIdx === null || draggedGalleryIdx === idx) return;
                            
                            const newImgs = [...club.gallery.images];
                            const draggedItem = newImgs[draggedGalleryIdx];
                            newImgs.splice(draggedGalleryIdx, 1);
                            newImgs.splice(idx, 0, draggedItem);
                            
                            setClub({ ...club, gallery: { ...club.gallery, images: newImgs } });
                            setDraggedGalleryIdx(null);
                          }}
                          className={`border rounded-xl relative group transition-all cursor-move overflow-hidden bg-gray-50 aspect-square flex flex-col ${draggedGalleryIdx === idx ? 'opacity-50 border-dashed border-gray-300' : 'border-gray-200 hover:shadow-sm'}`}
                        >
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
                            <button onClick={() => openModal('gallery', idx)} className="p-2 text-white bg-blue-500/80 hover:bg-blue-500 rounded-full transition-colors backdrop-blur-sm">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              confirmAction({
                                title: 'Delete Image?',
                                message: 'Are you sure you want to remove this image from the gallery?',
                                action: () => {
                                  const newImgs = [...club.gallery.images];
                                  newImgs.splice(idx, 1);
                                  setClub({ ...club, gallery: { ...club.gallery, images: newImgs } });
                                }
                              });
                            }} className="p-2 text-white bg-red-500/80 hover:bg-red-500 rounded-full transition-colors backdrop-blur-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded shadow-sm opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                            <GripHorizontal className="w-4 h-4 text-gray-700" />
                          </div>

                          {img.image ? (
                            <img src={img.image} alt={img.title || 'Gallery image'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                              <ImageIcon className="w-8 h-8" />
                              <span className="text-xs font-medium">No Image</span>
                            </div>
                          )}
                          
                          {img.title && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] sm:text-xs p-1.5 truncate text-center z-10">
                              {img.title}
                            </div>
                          )}
                        </div>
                      ))}
                      {club.gallery.images.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          No gallery images added.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AdminModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={
          modalConfig.type === 'activity' ? (modalConfig.index >= 0 ? 'Edit Activity' : 'Add Activity') :
          modalConfig.type === 'faculty' ? (modalConfig.index >= 0 ? 'Edit Faculty Member' : 'Add Faculty Member') :
          modalConfig.type === 'gallery' ? (modalConfig.index >= 0 ? 'Edit Gallery Image' : 'Add Gallery Image') :
          modalConfig.type === 'paragraph' ? (modalConfig.index >= 0 ? 'Edit Paragraph' : 'Add Paragraph') : 'Item Details'
        }
        onSave={saveModal}
      >
        {modalConfig.type === 'activity' && (
          <div className="space-y-4">
            <div>
              <SingleImageUploader 
                imageUrl={modalConfig.data?.image} 
                onUploadComplete={(url) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, image: url } })}
                onUploadStateChange={setIsUploading}
                uploadEndpoint="/upload/facilities"
                defaultImage="/assets/Images/fecilities/facility_2.jpg"
                label="Activity Image *"
                deferredUpload={true}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={modalConfig.data?.title || ''}
                maxLength={50}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, title: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Title (e.g. Mohiniyattam)"
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 50</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.title || '').length}/50</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Subtitle</label>
              <input
                type="text"
                value={modalConfig.data?.subtitle || ''}
                maxLength={100}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, subtitle: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Subtitle (optional)"
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 100</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.subtitle || '').length}/100</span></div>
            </div>
          </div>
        )}

        {modalConfig.type === 'faculty' && (
          <div className="space-y-4">
            <div>
              <SingleImageUploader 
                imageUrl={modalConfig.data?.image} 
                onUploadComplete={(url) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, image: url } })}
                onUploadStateChange={setIsUploading}
                uploadEndpoint="/upload/facilities"
                defaultImage="/assets/Images/fecilities/life_1.jpg"
                label="Profile Image *"
                deferredUpload={true}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={modalConfig.data?.name || ''}
                maxLength={15}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, name: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Name"
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 15</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.name || '').length}/15</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={modalConfig.data?.role || ''}
                maxLength={15}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, role: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Role (e.g. Mentor)"
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 15</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.role || '').length}/15</span></div>
            </div>
          </div>
        )}

        {modalConfig.type === 'gallery' && (
          <div className="space-y-4">
            <div>
              <SingleImageUploader 
                imageUrl={modalConfig.data?.image} 
                onUploadComplete={(url) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, image: url } })}
                onUploadStateChange={setIsUploading}
                uploadEndpoint="/upload/facilities"
                defaultImage="/assets/Images/fecilities/facility_4.jpg"
                label="Upload Image *"
                deferredUpload={true}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image Caption (Optional)</label>
              <input
                type="text"
                value={modalConfig.data?.title || ''}
                maxLength={15}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, title: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Caption (Optional)"
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 15</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.title || '').length}/15</span></div>
            </div>
          </div>
        )}

        {modalConfig.type === 'paragraph' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paragraph Text <span className="text-red-500">*</span></label>
              <textarea
                rows="4"
                maxLength={400}
                value={modalConfig.data?.text || ''}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, text: e.target.value } })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Enter paragraph text here..."
              />
              <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-gray-400 font-medium">Approx. letter limit: 400</span><span className="text-[10px] text-gray-400 font-medium">{(modalConfig.data?.text || '').length}/400</span></div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview - {tabs.find(t => t.id === activeTab)?.label}
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

          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                src={`/facilities-details?clubId=${club?._id || ''}`}
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClubDetailsEditor;
