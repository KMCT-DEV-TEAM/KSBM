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
import { FileText, Info, LayoutTemplate, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';

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

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <FileText className="w-4 h-4" /> },
    { id: 'info', label: 'Grievance Info', icon: <Info className="w-4 h-4" /> },
    { id: 'form', label: 'Form Section', icon: <LayoutTemplate className="w-4 h-4" /> }
  ];

  const defaults = {
    hero: {
      title: 'Grievance Form',
      subtitle: 'Submit your concerns securely through our Grievance Portal. Whether your grievance is related to academics, administration, facilities, or campus services, your feedback is handled with confidentiality, fairness, and transparency. Our dedicated grievance cells ensure every concern is reviewed promptly to foster a safe, supportive, and student-centric learning environment.',
      backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop'
    },
    infoSection: {
      title: 'Grievance Redressal',
      description: 'Our Grievance Redressal System is committed to fostering a safe, inclusive, and respectful campus environment where every student, faculty member, and staff member can voice their concerns with confidence. Through a transparent, fair, and confidential grievance resolution process, we ensure that issues related to academics, administration, campus facilities, student welfare, workplace conduct, and other institutional matters are addressed promptly and impartially. Managed by dedicated grievance committees, the system encourages open communication, accountability, and timely resolution while upholding the principles of integrity, equality, and justice. By listening to every concern and taking meaningful action, we strive to strengthen trust, enhance campus well-being, and create a supportive learning environment for the entire academic community.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop'
    },
    formSection: {
      backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/cms/grievance-page', formData);
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

  const handleCellOptionChange = (idx, value) => {
    const newOptions = [...formData.formSection.cellOptions];
    newOptions[idx] = value;
    handleChange('formSection', 'cellOptions', newOptions);
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full pb-16">
      <PageHeader 
        title="Manage Grievance Page"
        description="Customize the grievance page hero banner, informational text, and form configurations."
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
              <iframe src="/grievance" className="w-full h-full border-0" title="Grievance Preview" />
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
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                    <input 
                      type="text" 
                      value={formData.infoSection.title}
                      onChange={(e) => handleChange('infoSection', 'title', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea 
                      value={formData.infoSection.description}
                      onChange={(e) => handleChange('infoSection', 'description', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 min-h-[200px] leading-relaxed" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Side Image</label>
                  <LogoUploader
                    currentImage={formData.infoSection.image}
                    onImageSelected={(url) => handleChange('infoSection', 'image', url)}
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
                    <LogoUploader
                      currentImage={formData.formSection.backgroundImage}
                      onImageSelected={(url) => handleChange('formSection', 'backgroundImage', url)}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grievance Cell Checkbox Options</label>
                  <p className="text-xs text-gray-400 mb-2">Edit the exact labels that appear for the 6 cell selection checkboxes on the form.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.formSection.cellOptions.map((opt, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-medium uppercase ml-1">Option {idx + 1}</label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleCellOptionChange(idx, e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50"
                        />
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
