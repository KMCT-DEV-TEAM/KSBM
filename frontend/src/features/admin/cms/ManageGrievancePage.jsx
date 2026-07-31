"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import { FileText, Info, LayoutTemplate, Eye, Monitor, Tablet, Smartphone, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageGrievancePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <FileText className="w-4 h-4" /> },
    { id: 'info', label: 'Grievance Info', icon: <Info className="w-4 h-4" /> },
    { id: 'form', label: 'Form Section', icon: <LayoutTemplate className="w-4 h-4" /> }
  ];

  const defaults = {
    hero: {
      title: 'Grievance Form',
      subtitle: 'Submit your concerns securely through our Grievance Portal. Whether your grievance is related to academics, administration, facilities, or campus services, your feedback is handled with confidentiality, fairness, and transparency. Our dedicated grievance cells ensure every concern is reviewed promptly to foster a safe, supportive, and student-centric learning environment.',
      backgroundImage: '/assets/Images/grievance/grievance_hero.jpg'
    },
    infoSection: {
      title: 'Grievance Redressal',
      description: 'Our Grievance Redressal System is committed to fostering a safe, inclusive, and respectful campus environment where every student, faculty member, and staff member can voice their concerns with confidence. Through a transparent, fair, and confidential grievance resolution process, we ensure that issues related to academics, administration, campus facilities, student welfare, workplace conduct, and other institutional matters are addressed promptly and impartially. Managed by dedicated grievance committees, the system encourages open communication, accountability, and timely resolution while upholding the principles of integrity, equality, and justice. By listening to every concern and taking meaningful action, we strive to strengthen trust, enhance campus well-being, and create a supportive learning environment for the entire academic community.',
      image: '/assets/Images/grievance/grievance_info.jpg'
    },
    formSection: {
      backgroundImage: '/assets/Images/grievance/grievance_form.jpg',
      cellOptions: [
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell"
      ]
    }
  };

  const [formData, setFormData] = useState(defaults);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/grievance', fd, {
      hideLoader: true
    });
    return data.url;
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await api.get('/cms/grievance-page');
        if (data) {
          setFormData({
            hero: data.hero || defaults.hero,
            infoSection: data.infoSection || defaults.infoSection,
            formSection: data.formSection || defaults.formSection,
          });
        }
      } catch (error) {
        console.error('Error fetching grievance page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        activeTab,
        previewDevice: previewMode,
        ...formData
      };
      
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'grievance' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-grievance-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-grievance-data', payload: pData }, '*');
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

      // Shallow clone top-level sections to preserve File objects during update
      let payload = {
        hero: { ...formData.hero },
        infoSection: { ...formData.infoSection },
        formSection: { ...formData.formSection }
      };

      const processImage = async (section, field) => {
        const val = payload[section][field];
        if (val && val.file) {
          const url = await uploadDeferredImage(val.file);
          payload[section][field] = url;
        } else if (val && val.previewUrl) {
          payload[section][field] = val.previewUrl;
        }
      };

      await processImage('hero', 'backgroundImage');
      await processImage('infoSection', 'image');
      await processImage('formSection', 'backgroundImage');

      await api.put('/cms/grievance-page', payload);
      setFormData(payload);
      Toast.fire({ icon: 'success', title: 'Grievance page updated successfully!' });
    } catch (error) {
      console.error('Error updating grievance page:', error);
      Toast.fire({ icon: 'error', title: 'Failed to update grievance page.' });
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

  const handleImageChange = (section, field, data) => {
    if (data.isDeleted) {
      if (data.oldUrl && !data.oldUrl.includes('default')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      handleChange(section, field, data.previewUrl);
    } else {
      if (data.oldUrl && !data.oldUrl.includes('default')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      handleChange(section, field, data);
    }
  };

  const handleCellOptionChange = (idx, value) => {
    const newOptions = [...formData.formSection.cellOptions];
    newOptions[idx] = value;
    handleChange('formSection', 'cellOptions', newOptions);
  };

  const handleAddCellOption = () => {
    const newOptions = [...formData.formSection.cellOptions, "New Option"];
    handleChange('formSection', 'cellOptions', newOptions);
  };

  const handleDeleteCellOption = (idx) => {
    const newOptions = [...formData.formSection.cellOptions];
    newOptions.splice(idx, 1);
    handleChange('formSection', 'cellOptions', newOptions);
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
        title="Manage Grievance Page" 
        description="Customize the hero banner, informative text sections, and the form layout for the Grievance portal."
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
              <iframe ref={iframeRef} src="/preview/grievance" className="w-full h-full border-0" title="Grievance Preview" />
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
            <SectionForm title="Hero Banner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                      <span className="text-xs text-gray-400">{formData.hero.title?.length || 0}/50</span>
                    </div>
                    <input 
                      type="text" 
                      maxLength={50}
                      value={formData.hero.title}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtitle</label>
                      <span className="text-xs text-gray-400">{formData.hero.subtitle?.length || 0}/400</span>
                    </div>
                    <textarea 
                      maxLength={400}
                      value={formData.hero.subtitle}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 min-h-[120px] leading-relaxed" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Background Image</label>
                  <SingleImageUploader
                    imageUrl={formData.hero.backgroundImage}
                    onUploadComplete={(data) => handleImageChange('hero', 'backgroundImage', data)}
                    deferredUpload={true}
                    defaultImage={defaults.hero.backgroundImage}
                  />
                </div>
              </div>
            </SectionForm>
          )}

          {/* Info Section */}
          {activeTab === 'info' && (
            <SectionForm title="Grievance Redressal Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                      <span className="text-xs text-gray-400">{formData.infoSection.title?.length || 0}/50</span>
                    </div>
                    <input 
                      type="text" 
                      maxLength={50}
                      value={formData.infoSection.title}
                      onChange={(e) => handleChange('infoSection', 'title', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                      <span className="text-xs text-gray-400">{formData.infoSection.description?.length || 0}/1000</span>
                    </div>
                    <textarea 
                      maxLength={1000}
                      value={formData.infoSection.description}
                      onChange={(e) => handleChange('infoSection', 'description', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 min-h-[200px] leading-relaxed" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Side Image</label>
                  <SingleImageUploader
                    imageUrl={formData.infoSection.image}
                    onUploadComplete={(data) => handleImageChange('infoSection', 'image', data)}
                    deferredUpload={true}
                    defaultImage={defaults.infoSection.image}
                  />
                </div>
              </div>
            </SectionForm>
          )}

          {/* Form Section */}
          {activeTab === 'form' && (
            <SectionForm title="Form Section Configuration">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Form Background Image</label>
                  <div className="w-full max-w-md">
                    <SingleImageUploader
                      imageUrl={formData.formSection.backgroundImage}
                      onUploadComplete={(data) => handleImageChange('formSection', 'backgroundImage', data)}
                      deferredUpload={true}
                      defaultImage={defaults.formSection.backgroundImage}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grievance Cell Checkbox Options</label>
                      <p className="text-xs text-gray-400 mb-2">Edit, add, or remove the exact labels that appear for the cell selection checkboxes on the form.</p>
                    </div>
                    <button 
                      onClick={handleAddCellOption}
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Option
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.formSection.cellOptions.map((opt, idx) => (
                      <div key={idx} className="relative space-y-1 group">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-[10px] text-gray-400 font-medium uppercase">Option {idx + 1}</label>
                          <span className="text-[10px] text-gray-400">{opt?.length || 0}/50</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={50}
                            value={opt}
                            onChange={(e) => handleCellOptionChange(idx, e.target.value)}
                            className="w-full p-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50"
                          />
                          <button
                            onClick={() => handleDeleteCellOption(idx)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionForm>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageGrievancePage;
