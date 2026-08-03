"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import AddItemModal from './components/AddItemModal';
import { FileText, Eye, Monitor, Tablet, Smartphone, X, Plus, Trash2, GripVertical, ShieldCheck, Link2, Edit2, Pencil } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const DraggableCommitteeCard = ({ item, index, onEdit, onDelete }) => {
  const controls = useDragControls();
  
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
        <h4 className="font-bold text-gray-900 truncate">{item.title || 'Untitled'}</h4>
        <p className="text-sm text-gray-500 truncate">{item.coordinator} {item.designation ? `| ${item.designation}` : ''}</p>
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

const ManageCommitteesAndCellsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', fields: [], onSave: () => { }, initialData: null });
  const [formData, setFormData] = useState({
    showHeroSection: true,
    heroHeading: '',
    heroSubtext: '',
    heroBgImage: '',
    showCommitteesSection: true,
    committees: []
  });
  const [heroBgFile, setHeroBgFile] = useState(null);
  const [originalHeroBgImage, setOriginalHeroBgImage] = useState(null);
  const [draggedCommitteeIndex, setDraggedCommitteeIndex] = useState(null);

  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <FileText className="w-4 h-4" /> },
    { id: 'committees', label: 'Committees Manager', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  const handleTabChange = (tabId) => {
    if (tabId === activeTab || isTabLoading) return;
    setIsTabLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTabLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Listen for the iframe telling us it's ready to receive data
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'PREVIEW_READY' && isPreviewModalOpen) {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: formData }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPreviewModalOpen, formData]);

  useEffect(() => {
    if (!isPreviewModalOpen) return;

    // Send data immediately and also poll for a bit to handle iframe load timing
    const sendData = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: formData }, '*');
      }
    };

    // Try immediately
    sendData();

    // Retry for 3 seconds to handle iframe load delay
    const interval = setInterval(sendData, 300);
    const timeout = setTimeout(() => clearInterval(interval), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPreviewModalOpen, formData]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/committees-and-cells');
      if (data) {
        setFormData({
          showHeroSection: data.showHeroSection !== false,
          heroHeading: data.heroHeading || 'Committees & Cells',
          heroSubtext: data.heroSubtext || '',
          heroBgImage: data.heroBgImage || '',
          showCommitteesSection: data.showCommitteesSection !== false,
          committees: data.committees || []
        });
        setOriginalHeroBgImage(data.heroBgImage || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      text: 'Are you sure you want to update the Committees and Cells page? These changes will go live immediately.',
      confirmButtonText: 'Yes, save changes!',
      action: async () => {
        setSaving(true);
        try {
          let finalData = { ...formData };

          if (heroBgFile) {
            const uploadData = new FormData();
            uploadData.append('image', heroBgFile);
            const response = await api.post('/upload/committees', uploadData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              hideLoader: true
            });
            finalData.heroBgImage = response.data.url;
          }

          await api.put('/cms/committees-and-cells', finalData);

          // Deferred delete of old image if it was replaced or removed
          if (originalHeroBgImage && originalHeroBgImage !== finalData.heroBgImage && originalHeroBgImage !== '/assets/Images/committees/default-committees-hero.png') {
            try {
              await api.delete('/upload', { data: { fileUrl: originalHeroBgImage }, hideLoader: true });
            } catch (err) {
              console.error('Failed to delete old image:', err);
            }
          }

          setHeroBgFile(null);
          setOriginalHeroBgImage(finalData.heroBgImage);
          setFormData(finalData);
          Toast.fire({ icon: 'success', title: 'Committees & Cells updated successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to update settings.' });
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      text: 'This will revert fields back to standard values. Click "Save" to apply these changes to the live site.',
      confirmButtonText: 'Yes, reset it!',
      action: async () => {
        setFormData({
          showHeroSection: true,
          heroHeading: 'Committees & Cells',
          heroSubtext: 'Explore the various statutory committees and institutional cells established to ensure transparency, student welfare, academic excellence, and regulatory compliance.',
          heroBgImage: '/assets/Images/image 53.png',
          showCommitteesSection: true,
          committees: []
        });
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
      }
    });
  };


  const openAddModal = () => {
    setModalConfig({
      isOpen: true,
      title: 'Add New Committee',
      fields: [
        { name: 'title', label: 'Committee Title', type: 'text', maxLength: 100, required: true },
        { name: 'coordinator', label: 'Coordinator Name', type: 'text', maxLength: 50, required: true },
        { name: 'designation', label: 'Designation', type: 'text', maxLength: 100, required: false },
        { name: 'pdfLink', label: 'PDF Document', type: 'document', required: false }
      ],
      initialData: null,
      onSave: (data) => {
        setFormData(prev => ({ ...prev, committees: [...prev.committees, data] }));
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const openEditModal = (index, committee) => {
    setModalConfig({
      isOpen: true,
      title: 'Edit Committee',
      fields: [
        { name: 'title', label: 'Committee Title', type: 'text', maxLength: 100, required: true },
        { name: 'coordinator', label: 'Coordinator Name', type: 'text', maxLength: 50, required: true },
        { name: 'designation', label: 'Designation', type: 'text', maxLength: 100, required: false },
        { name: 'pdfLink', label: 'PDF Document', type: 'document', required: false }
      ],
      initialData: committee,
      onSave: (data) => {
        const updated = [...formData.committees];
        updated[index] = data;
        setFormData(prev => ({ ...prev, committees: updated }));
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const removeCommittee = async (index) => {
    await confirmAction({
      title: 'Remove Committee?',
      text: 'Are you sure you want to remove this committee? This cannot be undone.',
      confirmButtonText: 'Yes, remove it!',
      action: async () => {
        const updated = [...formData.committees];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, committees: updated }));
      }
    });
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Tabs Navigation */}
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

      <PageHeader
        title="Manage Committees & Cells"
        description="Customize the hero banner and manage the list of statutory committees."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={saving}
      />

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200 shrink-0">
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
          <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
            <div className={`bg-white shadow-xl transition-all duration-300 h-full ${
              previewMode === 'desktop' ? 'w-full min-w-[1280px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}>
              <iframe
                ref={iframeRef}
                src="/committees-and-cells"
                className="w-full h-full border-0"
                title="Committees Preview"
                onLoad={() => {
                  // After iframe loads, send data immediately
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: formData }, '*');
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isTabLoading ? (
          <motion.div
            key="loading-skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                </div>
              </div>
              <div className="space-y-2 mt-6">
                <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded-md w-full"></div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-6"
          >
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <SectionForm title="Hero Banner">
                {/* Visibility Settings */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">Show or hide the entire Hero Section on the live website.</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.showHeroSection !== false}
                        onChange={(e) => handleChange('showHeroSection', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.showHeroSection !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading</label>
                        <span className="text-xs text-gray-400">{formData.heroHeading?.length || 0}/100</span>
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        value={formData.heroHeading}
                        onChange={(e) => handleChange('heroHeading', e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtext</label>
                        <span className="text-xs text-gray-400">{formData.heroSubtext?.length || 0}/400</span>
                      </div>
                      <textarea
                        maxLength={400}
                        value={formData.heroSubtext}
                        onChange={(e) => handleChange('heroSubtext', e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 min-h-[120px] leading-relaxed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Background Image</label>
                    <LogoUploader
                      currentImage={formData.heroBgImage}
                      onChange={(url, file) => {
                        handleChange('heroBgImage', url);
                        setHeroBgFile(file || null);
                      }}
                      uploadEndpoint="/upload/committees"
                      defaultImage="/assets/Images/committees/default-committees-hero.png"
                      disableDelete={!formData.heroBgImage || formData.heroBgImage === '/assets/Images/committees/default-committees-hero.png'}
                      deferredMode={true}
                    />
                  </div>
                </div>
              </SectionForm>
            )}

            {/* Committees Section */}
            {activeTab === 'committees' && (
              <SectionForm
                title="Committees Manager"
                actionButton={
                  <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50">
                    <Plus className="w-4 h-4" /> Add Committee
                  </button>
                }
              >
                {/* Visibility Settings */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">Show or hide the entire Committees Section on the live website.</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.showCommitteesSection !== false}
                        onChange={(e) => handleChange('showCommitteesSection', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.showCommitteesSection !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>
                <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 md:p-6 min-h-[300px]">
                  {!(formData.committees || []).length ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                      <p>No committees added yet. Click 'Add Committee' to start building the list.</p>
                    </div>
                  ) : (
                    <Reorder.Group 
                      axis="y" 
                      values={formData.committees} 
                      onReorder={(items) => setFormData(prev => ({ ...prev, committees: items }))} 
                      className="space-y-3"
                    >
                      {formData.committees.map((committee, idx) => (
                        <DraggableCommitteeCard 
                          key={committee._id || committee.uuid || idx} 
                          item={committee} 
                          index={idx} 
                          onEdit={(i) => openEditModal(i, committee)} 
                          onDelete={() => removeCommittee(idx)} 
                        />
                      ))}
                    </Reorder.Group>
                  )}
                </div>
              </SectionForm>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddItemModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        fields={modalConfig.fields}
        onSave={modalConfig.onSave}
        initialData={modalConfig.initialData}
      />
    </div>
  );
};

export default ManageCommitteesAndCellsPage;
