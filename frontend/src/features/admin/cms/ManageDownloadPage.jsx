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
import { FileText, Eye, Monitor, Tablet, Smartphone, X, Plus, Trash2, GripVertical, FileStack } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageDownloadPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ title: '', category: 'Academic', fileUrl: '' });
  const tabsContainerRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <FileText className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents Manager', icon: <FileStack className="w-4 h-4" /> }
  ];

  const categories = ['Academic', 'Compliance', 'Administration'];

  const defaults = {
    hero: {
      title: 'Download',
      subtitle: 'Access all essential academic documents in one convenient location. Download application forms, brochures, academic regulations, examination guidelines, fee structures, and other important resources. Stay informed with the latest documents to support your academic journey and campus experience.',
      backgroundImage: '/assets/Images/image 53.png'
    },
    documents: [
      { title: 'Minutes of council', category: 'Academic', fileUrl: '#' },
      { title: 'Minutes of council', category: 'Academic', fileUrl: '#' },
      { title: 'Minutes of council', category: 'Academic', fileUrl: '#' },
    ]
  };

  const [formData, setFormData] = useState(defaults);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/download-page');
        if (data) {
          setFormData({
            hero: data.hero || defaults.hero,
            documents: data.documents && data.documents.length > 0 ? data.documents : defaults.documents,
          });
        }
      } catch (error) {
        console.error('Error fetching download page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/cms/download-page', formData);
      Toast.fire({ icon: 'success', title: 'Download page updated successfully!' });
    } catch (error) {
      console.error('Error updating download page:', error);
      Toast.fire({ icon: 'error', title: 'Failed to update download page.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      text: 'This will revert all fields back to their original placeholder values. You still need to click "Save" to apply these changes to the live site.',
      confirmButtonText: 'Yes, reset it!',
      action: async () => {
        setFormData(defaults);
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
      }
    });
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocs = [...formData.documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const openAddModal = () => {
    setNewDocument({ title: '', category: 'Academic', fileUrl: '' });
    setIsAddModalOpen(true);
  };

  const handleAddDocumentSubmit = () => {
    if (!newDocument.title || !newDocument.fileUrl) {
      Toast.fire({ icon: 'error', title: 'Please provide both a Title and a File URL.' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
    setIsAddModalOpen(false);
  };

  const removeDocument = async (index) => {
    await confirmAction({
      title: 'Remove Document?',
      text: 'Are you sure you want to remove this document from the library? This cannot be undone.',
      confirmButtonText: 'Yes, remove it!',
      action: async () => {
        const newDocs = [...formData.documents];
        newDocs.splice(index, 1);
        setFormData(prev => ({ ...prev, documents: newDocs }));
      }
    });
  };

  const moveDocument = (index, direction) => {
    const newDocs = [...formData.documents];
    const target = index + direction;
    if (target < 0 || target >= newDocs.length) return;
    [newDocs[index], newDocs[target]] = [newDocs[target], newDocs[index]];
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full pb-16">
      <PageHeader
        title="Manage Download Page"
        description="Customize the download page hero banner and manage downloadable documents."
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
              <iframe src="/download" className="w-full h-full border-0" title="Download Preview" />
            </div>
          </div>
        </div>
      )}

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
              onClick={() => setActiveTab(tab.id)}
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

      <AnimatePresence mode="wait">
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
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      value={formData.hero.title}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtitle</label>
                    <textarea
                      value={formData.hero.subtitle}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 min-h-[120px] leading-relaxed"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Background Image</label>
                  <LogoUploader
                    currentImage={formData.hero.backgroundImage}
                    onImageSelected={(url) => handleChange('hero', 'backgroundImage', url)}
                    uploadEndpoint="/upload/home"
                  />
                </div>
              </div>
            </SectionForm>
          )}

          {/* Documents Section */}
          {activeTab === 'documents' && (
            <SectionForm 
              title="Documents Library" 
              actionButton={
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add Document
                </button>
              }
            >
              <div className="space-y-4">
                {formData.documents.map((doc, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col gap-1 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveDocument(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                      <button onClick={() => moveDocument(idx, 1)} disabled={idx === formData.documents.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Title</label>
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => handleDocumentChange(idx, 'title', e.target.value)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                          placeholder="e.g. Minutes of council"
                        />
                      </div>

                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                        <select
                          value={doc.category}
                          onChange={(e) => handleDocumentChange(idx, 'category', e.target.value)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                        >
                          {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-5 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">File URL</label>
                        <input
                          type="text"
                          value={doc.fileUrl}
                          onChange={(e) => handleDocumentChange(idx, 'fileUrl', e.target.value)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                          placeholder="Enter file URL (e.g. PDF link)"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeDocument(idx)}
                      className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors mt-5"
                      title="Remove Document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {formData.documents.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FileStack className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No documents added yet. Click 'Add Document' to start building your library.</p>
                  </div>
                )}
              </div>
            </SectionForm>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#111836]">Add New Document</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Title</label>
                <input 
                  type="text" 
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" 
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                <select 
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">File URL</label>
                <input 
                  type="text" 
                  value={newDocument.fileUrl}
                  onChange={(e) => setNewDocument({...newDocument, fileUrl: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" 
                  placeholder="Enter link to PDF or file"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDocumentSubmit}
                className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Add Document
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ManageDownloadPage;
