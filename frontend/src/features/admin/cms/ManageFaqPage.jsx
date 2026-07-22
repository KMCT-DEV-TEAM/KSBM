"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, AlertCircle, RefreshCw, Smartphone, Monitor, Tablet, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../../../api/axios';
import LogoUploader from '../components/LogoUploader';

const ManageFaqPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const [formData, setFormData] = useState({
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
        },
        {
          question: 'What the eligibility criteria of mba admission ?',
          answer: 'Candidates must hold a recognized Bachelor\'s Degree in any discipline with a minimum 50% aggregate marks (45% for reserved categories) and possess a valid score in CAT, CMAT, KMAT, or equivalent national/state entrance exams.'
        },
        {
          question: 'Does the college provide placement assistance?',
          answer: 'Yes, KSBM has a dedicated Corporate Relations and Placement Cell that maintains active corporate tie-ups, conducts pre-placement training, resume building, and arranges campus recruitment drives with top multinational and national companies.'
        }
      ]
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
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
      setStatusMsg({ type: 'error', text: 'Failed to load FAQ settings from server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      await api.put('/cms/faq', formData);
      setStatusMsg({ type: 'success', text: 'FAQ page updated successfully!' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Error saving FAQ settings:', err);
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      mainContent: {
        ...prev.mainContent,
        faqs: [
          ...(prev.mainContent.faqs || []),
          { question: 'New Question', answer: 'Enter detailed answer text here...' }
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
      return {
        ...prev,
        mainContent: { ...prev.mainContent, faqs: updated }
      };
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
      return {
        ...prev,
        mainContent: { ...prev.mainContent, faqs: updated }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage FAQ Page</h1>
          <p className="text-sm text-gray-500 mt-1">Customize banner headings and interactive accordion FAQs displayed on the website.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Page</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      <AnimatePresence>
        {statusMsg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
              statusMsg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 font-medium text-sm transition-colors relative cursor-pointer ${
            activeTab === 'hero' ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Hero Banner
          {activeTab === 'hero' && (
            <motion.div layoutId="faqTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 font-medium text-sm transition-colors relative cursor-pointer ${
            activeTab === 'faqs' ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Accordion FAQs List ({formData.mainContent?.faqs?.length || 0})
          {activeTab === 'faqs' && (
            <motion.div layoutId="faqTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Hero Banner */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Hero Section Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={formData.hero?.title || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="e.g. Everything You Need to Know"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Introductory Text</label>
                <textarea
                  rows={4}
                  value={formData.hero?.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
                  placeholder="Enter introductory descriptive text..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
              <LogoUploader
                label="Banner Background"
                currentImage={formData.hero?.backgroundImage || '/assets/Images/image 73.png'}
                onImageSelected={(url) => setFormData({ ...formData, hero: { ...formData.hero, backgroundImage: url } })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Accordion FAQs List */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage and reorder questions inside the accordion view.</p>
            </div>

            <button
              onClick={handleAddFaq}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-xl text-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <input
              type="text"
              value={formData.mainContent?.heading || ''}
              onChange={(e) => setFormData({ ...formData, mainContent: { ...formData.mainContent, heading: e.target.value } })}
              className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              placeholder="e.g. Need More Information?"
            />
          </div>

          <div className="space-y-4">
            {formData.mainContent?.faqs?.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4 relative group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    Question #{idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFaq(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFaq(idx, 1)}
                      disabled={idx === (formData.mainContent?.faqs?.length - 1)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2 cursor-pointer"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question Title</label>
                    <input
                      type="text"
                      value={item.question || ''}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter question text..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Detailed Answer</label>
                    <textarea
                      rows={3}
                      value={item.answer || ''}
                      onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                      placeholder="Enter comprehensive answer description..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {(!formData.mainContent?.faqs || formData.mainContent.faqs.length === 0) && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-gray-500 font-medium">No FAQ items added yet.</p>
                <button
                  onClick={handleAddFaq}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Click to add your first question</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800 text-sm">Live Page Preview: /faq</span>
                  <div className="flex items-center bg-gray-200/80 p-1 rounded-lg gap-1">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${previewDevice === 'tablet' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                      title="Tablet View"
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

              <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
                <div
                  className={`bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 h-full ${
                    previewDevice === 'desktop'
                      ? 'w-full'
                      : previewDevice === 'tablet'
                      ? 'w-[768px]'
                      : 'w-[375px]'
                  }`}
                >
                  <iframe
                    src="/faq"
                    className="w-full h-full border-0"
                    title="FAQ Preview"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageFaqPage;
