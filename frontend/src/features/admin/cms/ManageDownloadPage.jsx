"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SingleImageUploader from './components/SingleImageUploader';
import SingleDocumentUploader from './components/SingleDocumentUploader';
import confirmAction from '../../../utils/confirmAction';
import { FileText, Eye, Monitor, Tablet, Smartphone, X, Plus, Trash2, GripVertical, FileStack, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

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
  const iframeRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <ImageIcon className="w-4 h-4" /> },
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
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/downloads', fd, { hideLoader: true });
    return data.url;
  };

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

  // Sync preview data
  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = { hero: formData.hero, documents: formData.documents };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'download' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-download-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-download-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, formData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (imagesToDelete.length > 0) {
        for (const url of imagesToDelete) {
          try {
            await api.delete('/upload', { data: { fileUrl: url }, hideLoader: true });
          } catch (e) {
            console.warn('Failed to delete image:', url);
          }
        }
        setImagesToDelete([]);
      }

      let payloadHero = { ...formData.hero };
      if (payloadHero.backgroundImage && payloadHero.backgroundImage.file) {
        payloadHero.backgroundImage = await uploadDeferredImage(payloadHero.backgroundImage.file);
      } else if (payloadHero.backgroundImage && payloadHero.backgroundImage.previewUrl) {
        payloadHero.backgroundImage = payloadHero.backgroundImage.previewUrl;
      } else if (typeof payloadHero.backgroundImage === 'object' && payloadHero.backgroundImage.url) {
        payloadHero.backgroundImage = payloadHero.backgroundImage.url;
      }

      const uploadDeferredFile = async (fileObj) => {
        const fileData = new FormData();
        fileData.append('image', fileObj); // matching backend expectations
        const res = await api.post('/upload/downloads', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          hideLoader: true
        });
        return res.data.url;
      };

      let finalDocuments = [];
      for (const doc of formData.documents) {
        let finalFileUrl = doc.fileUrl;
        if (doc.fileUrl && doc.fileUrl.file) {
          finalFileUrl = await uploadDeferredFile(doc.fileUrl.file);
        } else if (doc.fileUrl && doc.fileUrl.previewUrl) {
          finalFileUrl = doc.fileUrl.previewUrl;
        } else if (typeof doc.fileUrl === 'object' && doc.fileUrl.url) {
          finalFileUrl = doc.fileUrl.url;
        }
        finalDocuments.push({ ...doc, fileUrl: finalFileUrl });
      }

      const payload = { hero: payloadHero, documents: finalDocuments };
      await api.put('/cms/download-page', payload);
      Toast.fire({ icon: 'success', title: 'Download page updated successfully!' });
      setFormData({ ...formData, hero: payloadHero, documents: finalDocuments });
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

  const handleImageChange = (data) => {
    if (data.isDeleted) {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setFormData(prev => ({ ...prev, hero: { ...prev.hero, backgroundImage: data.previewUrl } }));
    } else {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setFormData(prev => ({ ...prev, hero: { ...prev.hero, backgroundImage: data } }));
    }
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
    let finalValue = value;
    if (field === 'fileUrl' && value && typeof value === 'object') {
      if (value.isDeleted) {
        if (value.oldUrl && !value.oldUrl.startsWith('blob:') && !value.oldUrl.startsWith('http')) {
          setImagesToDelete(prev => [...prev, value.oldUrl]);
        }
        finalValue = value.previewUrl;
      } else {
        if (value.oldUrl && !value.oldUrl.startsWith('blob:') && !value.oldUrl.startsWith('http')) {
          setImagesToDelete(prev => [...prev, value.oldUrl]);
        }
        finalValue = value;
      }
    }
    const newDocs = [...formData.documents];
    newDocs[index] = { ...newDocs[index], [field]: finalValue };
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const openAddModal = () => {
    setNewDocument({ title: '', category: 'Academic', fileUrl: '' });
    setIsAddModalOpen(true);
  };

  const handleAddDocumentSubmit = () => {
    if (!newDocument.title || (!newDocument.fileUrl && !newDocument.fileUrl?.previewUrl && !newDocument.fileUrl?.file)) {
      Toast.fire({ icon: 'error', title: 'Please provide both a Title and a Document File.' });
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
    <div className="w-full space-y-6">
      {/* Standard Scrollable Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 relative flex items-center">
        <div 
          ref={tabsContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 px-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all snap-start
                ${activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PageHeader 
        title="Downloads Page Settings"
        description="Manage all downloadable resources."
        onSave={handleSave}
        onReset={handleResetToDefault}
        onPreview={() => setIsPreviewModalOpen(true)}
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
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe ref={iframeRef} src="/preview/downloads" className="w-full h-full border-0" title="Downloads Preview" />
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
          className="w-full space-y-6"
        >
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Hero Section Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.hero.title || ''}
                      maxLength={50}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      placeholder="e.g. Download"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{formData.hero.title?.length || 0}/50</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Subtitle / Introductory Text</label>
                    <textarea
                      rows="4"
                      value={formData.hero.subtitle || ''}
                      maxLength={300}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                      placeholder="Enter introductory paragraph..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium leading-relaxed"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{formData.hero.subtitle?.length || 0}/300</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Background Image</label>
                  <SingleImageUploader
                    imageUrl={formData.hero.backgroundImage}
                    onUploadComplete={(data) => handleImageChange(data)}
                    deferredUpload={true}
                    defaultImage={defaults.hero.backgroundImage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-[#111836]">Documents Library</h2>
                <button 
                  onClick={openAddModal} 
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Document</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.documents || []).map((doc, idx) => (
                  <div key={idx} className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col gap-1 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveDocument(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                      <button onClick={() => moveDocument(idx, 1)} disabled={idx === formData.documents.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Document Title</label>
                        <input
                          type="text"
                          value={doc.title || ''}
                          maxLength={100}
                          onChange={(e) => handleDocumentChange(idx, 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                          placeholder="e.g. Minutes of council"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{doc.title?.length || 0}/100</div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                        <select
                          value={doc.category || ''}
                          onChange={(e) => handleDocumentChange(idx, 'category', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                        >
                          {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Document File</label>
                        <div className="h-full">
                          <SingleDocumentUploader
                            fileUrl={doc.fileUrl}
                            onUploadComplete={(data) => handleDocumentChange(idx, 'fileUrl', data)}
                            deferredUpload={true}
                            defaultFile=""
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeDocument(idx)}
                      className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors mt-6"
                      title="Remove Document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {(!formData.documents || formData.documents.length === 0) && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FileStack className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm font-medium">No documents added yet. Click 'Add Document' to start building your library.</p>
                  </div>
                )}
              </div>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Document Title</label>
                <input 
                  type="text" 
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
                <select 
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Document File</label>
                <SingleDocumentUploader
                  fileUrl={newDocument.fileUrl}
                  onUploadComplete={(data) => {
                    if (data && typeof data === 'object') {
                      setNewDocument({...newDocument, fileUrl: data.isDeleted ? data.previewUrl : data});
                    } else {
                      setNewDocument({...newDocument, fileUrl: data});
                    }
                  }}
                  deferredUpload={true}
                  defaultFile=""
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDocumentSubmit}
                className="px-5 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
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
