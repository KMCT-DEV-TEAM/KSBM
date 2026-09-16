"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Eye, X, Monitor, Tablet, Smartphone, CheckCircle2, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageTermsAndConditions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);
  
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', content: '' });
  const [isAddBulletModalOpen, setIsAddBulletModalOpen] = useState(false);
  const [newBulletPoint, setNewBulletPoint] = useState('');

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const defaults = {
    hero: {
      title: 'Terms & Conditions',
      subtitle: 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Terms of Use',
      introParagraph: 'By accessing and using the official website and online portals of KMCT Group of Colleges (KSBM), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our platforms immediately.',
      sections: [
        {
          title: '1. Use of Website Content',
          content: 'All content provided on this website, including course schedules, fee details, academic curricula, faculty profiles, and news updates, is for educational and informational purposes. While we endeavor to maintain up-to-date and accurate information, KSBM reserves the right to modify academic offerings and policies without prior notice.'
        },
        {
          title: '2. User Conduct & Obligations',
          content: 'Users agree to access and use this website solely for lawful purposes. You must not transmit any malicious code, attempt unauthorized access to restricted portals or student information systems, or disrupt normal server operations.'
        },
        {
          title: '3. Intellectual Property Rights',
          content: 'All institutional logos, emblems, written documentation, imagery, and design layouts hosted on this site are registered trademarks or copyrighted assets of KMCT Group of Colleges. Any reproduction or distribution without explicit written consent is prohibited.'
        },
        {
          title: '4. Limitation of Liability',
          content: 'KSBM shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or reliance upon any content published herein.'
        },
        {
          title: '5. Governing Law',
          content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts in Kerala.'
        }
      ],
      bulletPoints: [
        'All website content, course details, and fee structures are subject to periodic review and modification without prior notice.',
        'Unauthorized usage of institutional branding, emblems, or student data is strictly prohibited and subject to legal recourse.',
        'Accessing restricted student or faculty portals requires authorized credentials issued by the institution.',
        'All disputes regarding website usage and institutional policies fall strictly under the jurisdiction of the courts in Kerala.'
      ],
      closingParagraph1: 'KMCT Group of Colleges reserves the right to update or amend these Terms and Conditions at any time. Your continued use of the website following the posting of any modifications constitutes your formal acceptance of the updated guidelines.',
      closingParagraph2: 'If you have any questions or concerns regarding our terms of service, please contact our administrative desk or reach out via our general inquiry channels.'
    }
  };

  const [hero, setHero] = useState(defaults.hero);
  const [mainContent, setMainContent] = useState(defaults.mainContent);

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/terms', fd, { hideLoader: true });
    return data.url;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/terms-and-conditions');
      const data = response.data;
      if (data) {
        if (data.hero) setHero({ ...defaults.hero, ...data.hero });
        if (data.mainContent) {
          const secs = Array.isArray(data.mainContent.sections) && data.mainContent.sections.length > 0
            ? data.mainContent.sections
            : defaults.mainContent.sections;
          const bp = Array.isArray(data.mainContent.bulletPoints) && data.mainContent.bulletPoints.length > 0
            ? data.mainContent.bulletPoints
            : defaults.mainContent.bulletPoints;
          setMainContent({ ...defaults.mainContent, ...data.mainContent, sections: secs, bulletPoints: bp });
        }
      }
    } catch (error) {
      console.error('Failed to fetch terms and conditions settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to load terms and conditions settings' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = { hero, mainContent };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'terms' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-terms-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-terms-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, hero, mainContent]);

  const handleSave = async () => {
    setIsSaving(true);
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

      let payloadHero = { ...hero };
      if (payloadHero.backgroundImage && payloadHero.backgroundImage.file) {
        payloadHero.backgroundImage = await uploadDeferredImage(payloadHero.backgroundImage.file);
      } else if (payloadHero.backgroundImage && payloadHero.backgroundImage.previewUrl) {
        payloadHero.backgroundImage = payloadHero.backgroundImage.previewUrl;
      } else if (typeof payloadHero.backgroundImage === 'object' && payloadHero.backgroundImage.url) {
        payloadHero.backgroundImage = payloadHero.backgroundImage.url;
      }

      const payload = { hero: payloadHero, mainContent };
      await api.put('/cms/terms-and-conditions', payload);
      Toast.fire({ icon: 'success', title: 'Terms & Conditions updated successfully' });
      setHero(payloadHero);
    } catch (error) {
      console.error('Failed to save terms and conditions settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all text, sections, and bullet points for the Terms & Conditions Page to their original standard state. Click "Save Changes" after resetting to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'danger',
      action: async () => {
        setHero(defaults.hero);
        setMainContent(defaults.mainContent);
        Toast.fire({ icon: 'info', title: 'Defaults restored. Click Save Changes to confirm.' });
      }
    });
  };

  const handleImageChange = (data) => {
    if (data.isDeleted) {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setHero({ ...hero, backgroundImage: data.previewUrl });
    } else {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setHero({ ...hero, backgroundImage: data });
    }
  };

  const addSection = () => {
    setIsAddSectionModalOpen(true);
  };

  const handleAddSectionSubmit = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      Toast.fire({ icon: 'error', title: 'Please provide both a Title and Content.' });
      return;
    }
    setMainContent({
      ...mainContent,
      sections: [
        ...(mainContent.sections || []),
        { title: newSection.title.trim(), content: newSection.content.trim() }
      ]
    });
    setNewSection({ title: '', content: '' });
    setIsAddSectionModalOpen(false);
  };

  const updateSection = (index, field, value) => {
    const updated = [...(mainContent.sections || [])];
    updated[index] = { ...updated[index], [field]: value };
    setMainContent({ ...mainContent, sections: updated });
  };

  const removeSection = (index) => {
    const updated = (mainContent.sections || []).filter((_, i) => i !== index);
    setMainContent({ ...mainContent, sections: updated });
  };

  const addBulletPoint = () => {
    setIsAddBulletModalOpen(true);
  };

  const handleAddBulletSubmit = () => {
    if (!newBulletPoint.trim()) {
      Toast.fire({ icon: 'error', title: 'Please enter a bullet point text.' });
      return;
    }
    setMainContent({
      ...mainContent,
      bulletPoints: [...(mainContent.bulletPoints || []), newBulletPoint.trim()]
    });
    setNewBulletPoint('');
    setIsAddBulletModalOpen(false);
  };

  const updateBulletPoint = (index, value) => {
    const updated = [...(mainContent.bulletPoints || [])];
    updated[index] = value;
    setMainContent({ ...mainContent, bulletPoints: updated });
  };

  const removeBulletPoint = (index) => {
    const updated = (mainContent.bulletPoints || []).filter((_, i) => i !== index);
    setMainContent({ ...mainContent, bulletPoints: updated });
  };

  if (isLoading) return <AdminSkeleton />;

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'sections', name: 'Policy Sections & Intro', icon: <FileText className="w-4 h-4" /> },
    { id: 'bulletPoints', name: 'Highlights & Closing Text', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-6">
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
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Manage Terms & Conditions Page"
        description="Customize banner headings, institutional terms of service clauses, policy highlights, and closing guidelines."
        onSave={handleSave}
        onReset={handleResetToDefault}
        onPreview={() => setIsPreviewModalOpen(true)}
        isSaving={isSaving}
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
              <iframe ref={iframeRef} src="/preview/terms" className="w-full h-full border-0" title="Terms & Conditions Preview" />
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
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                  <input
                    type="text"
                    value={hero.title || ''}
                    maxLength={50}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    placeholder="e.g. Terms & Conditions"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{hero.title?.length || 0}/50</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Subtitle / Introductory Description</label>
                  <textarea
                    rows="3"
                    value={hero.subtitle || ''}
                    maxLength={200}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    placeholder="Enter introductory paragraph for the banner..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{hero.subtitle?.length || 0}/200</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Hero Background Image</label>
                  <SingleImageUploader
                    imageUrl={hero.backgroundImage}
                    onUploadComplete={(data) => handleImageChange(data)}
                    deferredUpload={true}
                    defaultImage={defaults.hero.backgroundImage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POLICY SECTIONS & INTRO */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Introductory Settings</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Main Section Heading</label>
                    <input
                      type="text"
                      value={mainContent.heading || ''}
                      maxLength={50}
                      onChange={(e) => setMainContent({ ...mainContent, heading: e.target.value })}
                      placeholder="e.g. Terms of Use"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.heading?.length || 0}/50</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Introductory Paragraph</label>
                    <textarea
                      rows="3"
                      value={mainContent.introParagraph || ''}
                      maxLength={500}
                      onChange={(e) => setMainContent({ ...mainContent, introParagraph: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.introParagraph?.length || 0}/500</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-bold text-[#111836]">Numbered Policy Clauses / Sections</h2>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Policy Section</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {(mainContent.sections || []).map((sec, idx) => (
                    <div key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Clause Heading</label>
                          <input
                            type="text"
                            value={sec.title || ''}
                            maxLength={100}
                            onChange={(e) => updateSection(idx, 'title', e.target.value)}
                            className="w-full bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-bold text-primary"
                          />
                          <div className="text-right text-xs text-gray-400 mt-1">{sec.title?.length || 0}/100</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end"
                          title="Remove Section"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Clause Content</label>
                        <textarea
                          rows="3"
                          value={sec.content || ''}
                          maxLength={1000}
                          onChange={(e) => updateSection(idx, 'content', e.target.value)}
                          className="w-full bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium leading-relaxed"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{sec.content?.length || 0}/1000</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIGHLIGHTS & CLOSING TEXT */}
          {activeTab === 'bulletPoints' && (
            <div className="space-y-6">
              {/* Bullet Points Box */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-bold text-[#111836]">Highlights Bullet Points Box</h2>
                  <button
                    type="button"
                    onClick={addBulletPoint}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Highlight Point</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(mainContent.bulletPoints || []).map((bp, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={bp}
                          maxLength={200}
                          onChange={(e) => updateBulletPoint(idx, e.target.value)}
                          className="w-full bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{bp?.length || 0}/200</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(idx)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove Bullet Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing Text & Statements */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Closing Paragraphs</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 1</label>
                    <textarea
                      rows="3"
                      value={mainContent.closingParagraph1 || ''}
                      maxLength={500}
                      onChange={(e) => setMainContent({ ...mainContent, closingParagraph1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingParagraph1?.length || 0}/500</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 2 (Contact Assistance)</label>
                    <textarea
                      rows="3"
                      value={mainContent.closingParagraph2 || ''}
                      maxLength={500}
                      onChange={(e) => setMainContent({ ...mainContent, closingParagraph2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingParagraph2?.length || 0}/500</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-[#111836]">Add New Policy Section</h3>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="e.g., 6. Refund Policy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-bold text-primary"
                  maxLength={100}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{newSection.title.length}/100</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  placeholder="Enter the comprehensive terms or conditions for this section..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm leading-relaxed"
                  rows="5"
                  maxLength={1000}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{newSection.content.length}/1000</div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSectionSubmit}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Add Section
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Bullet Point Modal */}
      {isAddBulletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-[#111836]">Add New Highlight Point</h3>
              <button
                onClick={() => setIsAddBulletModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bullet Point Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newBulletPoint}
                  onChange={(e) => setNewBulletPoint(e.target.value)}
                  placeholder="Enter the bullet point content..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm leading-relaxed"
                  rows="4"
                  maxLength={200}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{newBulletPoint?.length || 0}/200</div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddBulletModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBulletSubmit}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Add Bullet Point
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageTermsAndConditions;
