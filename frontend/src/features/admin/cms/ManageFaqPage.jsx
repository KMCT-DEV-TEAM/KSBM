"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';

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

  const [formData, setFormData] = useState({
    hero: {
      title: 'Everything You Need to Know',
      subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Need More Information?',
      faqs: []
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/faq');
      if (res.data) {
        setFormData({
          hero: { ...formData.hero, ...(res.data.hero || {}) },
          mainContent: { ...formData.mainContent, ...(res.data.mainContent || {}) }
        });
      }
    } catch (err) {
      console.error('Error loading FAQ settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setSaving(true);
        try {
          await api.put('/cms/faq', formData, { hideLoader: true });
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
    setFormData(defaults);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      mainContent: {
        ...prev.mainContent,
        faqs: [
          ...(prev.mainContent.faqs || []),
          { question: '', answer: '' }
        ]
      }
    }));
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
    <div className="space-y-6 w-full">
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center items-end">
            <div className={`bg-white shadow-xl w-full h-full mt-auto transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe src="/faq" className="w-full h-full border-0" title="FAQ Preview" />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="Hero Banner Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Page Title</label>
              <input type="text" value={formData.hero.title} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Everything You Need to Know" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Subtitle / Introductory Text</label>
              <textarea rows={4} value={formData.hero.subtitle} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" placeholder="Enter introductory descriptive text..." />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Hero Background Image</label>
            <LogoUploader
              label="Banner Background"
              currentImage={formData.hero.backgroundImage}
              onImageSelected={(url) => setFormData({ ...formData, hero: { ...formData.hero, backgroundImage: url } })}
            />
          </div>
        </div>
      </SectionForm>

      <SectionForm title="Accordion FAQs List">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.mainContent.heading} onChange={e => setFormData({ ...formData, mainContent: { ...formData.mainContent, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Need More Information?" />
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={handleAddFaq} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {formData.mainContent.faqs?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50/50 relative group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Question #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveFaq(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveFaq(idx, 1)} disabled={idx === (formData.mainContent.faqs?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => handleRemoveFaq(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Question Title</label>
                    <input type="text" value={item.question} onChange={e => handleUpdateFaq(idx, 'question', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Detailed Answer</label>
                    <textarea rows={3} value={item.answer} onChange={e => handleUpdateFaq(idx, 'answer', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                  </div>
                </div>
              </div>
            ))}
            
            {(!formData.mainContent.faqs || formData.mainContent.faqs.length === 0) && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                <p className="text-sm text-gray-500 font-medium">No FAQ items added yet.</p>
              </div>
            )}
          </div>
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageFaqPage;
