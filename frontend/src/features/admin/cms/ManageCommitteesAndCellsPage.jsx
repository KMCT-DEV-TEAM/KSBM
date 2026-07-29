"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import AddItemModal from './components/AddItemModal';
import { FileText, Eye, Monitor, Tablet, Smartphone, X, Plus, Trash2, GripVertical, ShieldCheck, Link2, Edit2 } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageCommitteesAndCellsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', fields: [], onSave: () => { }, initialData: null });
  const [formData, setFormData] = useState({
    heroHeading: '',
    heroSubtext: '',
    heroBgImage: '',
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

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', data: formData }, '*');
    }
  }, [isPreviewModalOpen, formData]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/committees-and-cells');
      if (data) {
        setFormData({
          heroHeading: data.heroHeading || 'Committees & Cells',
          heroSubtext: data.heroSubtext || '',
          heroBgImage: data.heroBgImage || '',
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
          heroHeading: 'Committees & Cells',
          heroSubtext: 'Explore the various statutory committees and institutional cells established to ensure transparency, student welfare, academic excellence, and regulatory compliance.',
          heroBgImage: '/assets/Images/image 53.png',
          committees: []
        });
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
      }
    });
  };

  const handleCommitteeChange = (index, field, value) => {
    const updated = [...formData.committees];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, committees: updated }));
  };

  const moveCommittee = (index, direction) => {
    const updated = [...formData.committees];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setFormData(prev => ({ ...prev, committees: updated }));
  };

  // Drag-and-drop handlers for committees
  const handleCommitteeDragStart = (e, index) => {
    setDraggedCommitteeIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };
  const handleCommitteeDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleCommitteeDrop = (e, targetIndex) => {
    e.preventDefault();
    if (e.target) e.target.style.opacity = '1';
    if (draggedCommitteeIndex === null || draggedCommitteeIndex === targetIndex) return;
    const updated = [...formData.committees];
    const draggedItem = updated[draggedCommitteeIndex];
    updated.splice(draggedCommitteeIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setFormData(prev => ({ ...prev, committees: updated }));
    setDraggedCommitteeIndex(null);
  };
  const handleCommitteeDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedCommitteeIndex(null);
  };

  const openAddModal = () => {
    setModalConfig({
      isOpen: true,
      title: 'Add New Committee',
      fields: [
        { name: 'title', label: 'Committee Title', type: 'text', maxLength: 100, required: true },
        { name: 'coordinator', label: 'Coordinator Name', type: 'text', maxLength: 50, required: true },
        { name: 'designation', label: 'Designation', type: 'text', maxLength: 100, required: false },
        { name: 'pdfLink', label: 'PDF Link', type: 'text', maxLength: 300, required: false }
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
        { name: 'pdfLink', label: 'PDF Link', type: 'text', maxLength: 300, required: false }
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center items-end">
            <div className={`bg-white shadow-xl w-full h-full mt-auto transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src="/committees-and-cells"
                className="w-full h-full border-0"
                title="Committees Preview"
                onLoad={() => {
                  if (iframeRef.current) {
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
                <div className="space-y-4">
                  {formData.committees.map((committee, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleCommitteeDragStart(e, idx)}
                      onDragOver={handleCommitteeDragOver}
                      onDrop={(e) => handleCommitteeDrop(e, idx)}
                      onDragEnd={handleCommitteeDragEnd}
                      className={`bg-white border rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200 group ${draggedCommitteeIndex === idx ? 'border-primary shadow-lg scale-[1.02]' : 'border-gray-100'}`}
                    >
                      <div className="flex items-center mt-3 text-gray-400 hover:text-gray-600 cursor-move" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Committee Title</label>
                          </div>
                          <h4 className="text-sm font-bold text-gray-800">{committee.title || 'Untitled'}</h4>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coordinator Name</label>
                          </div>
                          <p className="text-sm text-gray-700">{committee.coordinator || 'None'}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Designation</label>
                          </div>
                          <p className="text-sm text-gray-600">{committee.designation || 'None'}</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PDF Document URL</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Link2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-blue-500 truncate max-w-[200px]">{committee.pdfLink || 'No PDF Link'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => openEditModal(idx, committee)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 hover:scale-90 hover:opacity-80 rounded-lg transition-all duration-200"
                          title="Edit Committee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => removeCommittee(idx)}
                          className="p-2 text-red-400 hover:bg-red-500/10 hover:scale-90 hover:opacity-80 rounded-lg transition-all duration-200"
                          title="Remove Committee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.committees.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No committees added yet. Click 'Add Committee' to start building the list.</p>
                    </div>
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
