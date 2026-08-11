"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, Monitor, Tablet, Smartphone, X, Image as ImageIcon, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageFaqPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const [isAddFaqModalOpen, setIsAddFaqModalOpen] = useState(false);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const defaults = {
    hero: {
      title: 'Everything You Need to Know',
      subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Need More Information?',
      faqs: [
        {
          question: 'What MBA programs are offered at KMCT College of MBA?',
          answer: 'MBA program offers industry-relevant specializations such as Finance, Marketing, Human Resource Management, Operations Management, Business Analytics, and International Business.'
        }
      ]
    }
  };

  const [formData, setFormData] = useState(defaults);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'mainContent', label: 'FAQ Content', icon: <FileText className="w-4 h-4" /> }
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/faq', fd, {
      hideLoader: true
    });
    return data.url;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/faq');
      if (res.data) {
        setFormData({
          hero: { ...defaults.hero, ...(res.data.hero || {}) },
          mainContent: { ...defaults.mainContent, ...(res.data.mainContent || {}) }
        });
      }
    } catch (err) {
      console.error('Error loading FAQ settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  // Sync preview data
  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = { hero: formData.hero, mainContent: formData.mainContent };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'faq' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-faq-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-faq-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, formData]);

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
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

          let payload = {
            hero: { ...formData.hero },
            mainContent: { ...formData.mainContent }
          };

          if (payload.hero.backgroundImage && payload.hero.backgroundImage.file) {
            payload.hero.backgroundImage = await uploadDeferredImage(payload.hero.backgroundImage.file);
          } else if (payload.hero.backgroundImage && payload.hero.backgroundImage.previewUrl) {
            payload.hero.backgroundImage = payload.hero.backgroundImage.previewUrl;
          } else if (typeof payload.hero.backgroundImage === 'object' && payload.hero.backgroundImage.url) {
             payload.hero.backgroundImage = payload.hero.backgroundImage.url;
          }

          await api.put('/cms/faq', payload, { hideLoader: true });
          setFormData(payload);
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
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all text and FAQs to their original standard state. You still need to click "Save Changes" to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'danger',
      action: async () => {
        setFormData(defaults);
        Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
      }
    });
  };

  const handleImageChange = (section, field, data) => {
    if (data.isDeleted) {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: data.previewUrl } }));
    } else {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: data } }));
    }
  };

  const handleAddFaq = () => {
    setNewFaq({ question: '', answer: '' });
    setIsAddFaqModalOpen(true);
  };

  const submitNewFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      Toast.fire({ icon: 'error', title: 'Please fill both question and answer' });
      return;
    }
    
    setIsAddingFaq(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        mainContent: {
          ...prev.mainContent,
          faqs: [
            ...(prev.mainContent.faqs || []),
            newFaq
          ]
        }
      }));
      setIsAddFaqModalOpen(false);
      setNewFaq({ question: '', answer: '' });
      setIsAddingFaq(false);
    }, 500);
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      mainContent: {
        ...prev.mainContent,
        faqs: prev.mainContent.faqs.filter((_, i) => i !== index)
      }
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.mainContent.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, mainContent: { ...prev.mainContent, faqs: updated } };
    });
  };

  const moveFaq = (index, direction) => {
    setFormData(prev => {
      const updated = [...(prev.mainContent.faqs || [])];
      const target = index + direction;
      if (target < 0 || target >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      return { ...prev, mainContent: { ...prev.mainContent, faqs: updated } };
    });
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="w-full space-y-6">
      {/* Tabs Navigation */}
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
        title="Manage FAQ Page" 
        description="Customize banner headings and interactive accordion FAQs displayed on the website." 
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
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe ref={iframeRef} src="/preview/faq" className="w-full h-full border-0" title="FAQ Preview" />
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
          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Hero Section Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-800 mb-0">Page Title</label>
                      <span className="text-xs text-gray-400">{formData.hero.title?.length || 0}/50</span>
                    </div>
                    <input 
                      type="text" 
                      maxLength={50}
                      value={formData.hero.title || ''} 
                      onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                      placeholder="e.g. Everything You Need to Know" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-800 mb-0">Subtitle / Introductory Text</label>
                      <span className="text-xs text-gray-400">{formData.hero.subtitle?.length || 0}/200</span>
                    </div>
                    <textarea 
                      rows={4} 
                      maxLength={200}
                      value={formData.hero.subtitle || ''} 
                      onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                      placeholder="Enter introductory descriptive text..." 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Hero Background Image</label>
                  <SingleImageUploader
                    imageUrl={formData.hero.backgroundImage}
                    onUploadComplete={(data) => handleImageChange('hero', 'backgroundImage', data)}
                    deferredUpload={true}
                    defaultImage={defaults.hero.backgroundImage}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mainContent' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Accordion FAQs List</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center max-w-md mb-1">
                    <label className="block text-sm font-medium text-gray-800 mb-0">Section Heading</label>
                    <span className="text-xs text-gray-400">{formData.mainContent.heading?.length || 0}/50</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={50}
                    value={formData.mainContent.heading || ''} 
                    onChange={e => setFormData({ ...formData, mainContent: { ...formData.mainContent, heading: e.target.value } })} 
                    className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                    placeholder="e.g. Need More Information?" 
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-600">
                    Questions ({formData.mainContent.faqs?.length || 0})
                  </div>
                  <button 
                    onClick={handleAddFaq} 
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.mainContent.faqs?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-500 uppercase">Question #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveFaq(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => moveFaq(idx, 1)} disabled={idx === (formData.mainContent.faqs?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                          <button onClick={() => handleRemoveFaq(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-0">Question Title</label>
                            <span className="text-[10px] text-gray-400">{item.question?.length || 0}/150</span>
                          </div>
                          <input 
                            type="text" 
                            maxLength={150}
                            value={item.question || ''} 
                            onChange={e => handleUpdateFaq(idx, 'question', e.target.value)} 
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-0">Detailed Answer</label>
                            <span className="text-[10px] text-gray-400">{item.answer?.length || 0}/1000</span>
                          </div>
                          <textarea 
                            rows={3} 
                            maxLength={1000}
                            value={item.answer || ''} 
                            onChange={e => handleUpdateFaq(idx, 'answer', e.target.value)} 
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium leading-relaxed" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.mainContent.faqs || formData.mainContent.faqs.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-500 font-medium">No FAQ items added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isAddFaqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Add New FAQ</h3>
                <button
                  onClick={() => setIsAddFaqModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-0">Question Title</label>
                    <span className="text-[10px] text-gray-400">{newFaq.question?.length || 0}/150</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={150}
                    value={newFaq.question} 
                    onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium" 
                    placeholder="Enter question here..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-0">Detailed Answer</label>
                    <span className="text-[10px] text-gray-400">{newFaq.answer?.length || 0}/1000</span>
                  </div>
                  <textarea 
                    rows={4} 
                    maxLength={1000}
                    value={newFaq.answer} 
                    onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium leading-relaxed" 
                    placeholder="Enter detailed answer here..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setIsAddFaqModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitNewFaq}
                  disabled={isAddingFaq}
                  className="flex items-center justify-center min-w-[120px] px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {isAddingFaq ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isAddingFaq ? 'Adding...' : 'Add FAQ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageFaqPage;
