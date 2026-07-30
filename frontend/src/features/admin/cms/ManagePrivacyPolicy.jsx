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

const ManagePrivacyPolicy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  
  // Add Bullet Point Modal State
  const [isAddBulletModalOpen, setIsAddBulletModalOpen] = useState(false);
  const [newBulletPoint, setNewBulletPoint] = useState('');
  
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const defaults = {
    hero: {
      title: 'Privacy Policy',
      subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
      backgroundImage: '/assets/Images/image 73.png'
    },
    mainContent: {
      heading: 'Privacy Policy',
      paragraph1: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website.',
      paragraph2: 'KMCT Group of Colleges reserves the right to modify, update, or discontinue any aspect of the website, including academic programs, admission criteria, fee structures, policies, facilities, and services, at any time without prior notice. The content published should not be considered as a binding commitment, and users are encouraged to verify specific details directly with the institution\'s official representatives before making decisions.',
      paragraph3: 'The institution shall not be liable for any loss or damage, including but not limited to indirect or consequential loss, arising from the use of or reliance on information available on this website. This includes any interruptions, errors, or omissions in the content.',
      paragraph4: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.',
      paragraph5: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.',
      paragraph6: 'By accessing and using this website, users agree to the terms outlined in this disclaimer.',
      bulletPoints: [
        'The information provided on the KMCT Group of Colleges website is for general informational purposes only.',
        'While efforts are made to ensure accuracy, the institution does not guarantee the completeness, reliability, or timeliness of the content.',
        'KMCT Group of Colleges reserves the right to modify or update courses, fees, policies, and other details without prior notice.',
        'Users are advised to verify all information directly with the institution before making any decisions.'
      ],
      closingParagraph1: 'The information provided on this website of KMCT Group of Colleges is intended for general informational purposes only. While the institution strives to ensure that all content is accurate, complete, and up to date, no guarantees or warranties, express or implied, are made regarding the reliability, suitability, or availability of the information, services, or related graphics contained on the website. This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites. All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.',
      closingParagraph2: 'This website may contain links to external websites for additional information or convenience. KMCT Group of Colleges does not have control over the nature, content, and availability of those sites and does not endorse or assume responsibility for any information or services provided by third-party websites.',
      closingBoldText1: 'All intellectual property rights, including text, images, logos, and design elements on this website, are the property of KMCT Group of Colleges unless otherwise stated.',
      closingBoldText2: 'Unauthorized use, reproduction, or distribution of any content is strictly prohibited.'
    }
  };

  const [hero, setHero] = useState(defaults.hero);
  const [mainContent, setMainContent] = useState(defaults.mainContent);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/privacy', fd, { hideLoader: true });
    return data.url;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/privacy-policy');
      const data = response.data;
      if (data) {
        if (data.hero) setHero({ ...defaults.hero, ...data.hero });
        if (data.mainContent) {
          const bp = Array.isArray(data.mainContent.bulletPoints) && data.mainContent.bulletPoints.length > 0
            ? data.mainContent.bulletPoints
            : defaults.mainContent.bulletPoints;
          setMainContent({ ...defaults.mainContent, ...data.mainContent, bulletPoints: bp });
        }
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to load privacy policy settings' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = { hero, mainContent };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'privacy-policy' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-privacy-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-privacy-data', payload: pData }, '*');
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
      await api.put('/cms/privacy-policy', payload);
      Toast.fire({ icon: 'success', title: 'Privacy Policy updated successfully' });
      setHero(payloadHero);
    } catch (error) {
      console.error('Failed to save privacy policy settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all text, bullet points, and headings for the Privacy Policy Page to their original standard state. Click "Save Changes" after resetting to apply.',
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
    { id: 'paragraphs', name: 'Main Body Paragraphs', icon: <FileText className="w-4 h-4" /> },
    { id: 'bulletPoints', name: 'Bullet Points & Closing Text', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

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
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Privacy Policy Settings"
        description="Manage the Privacy Policy page content."
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
              <iframe ref={iframeRef} src="/preview/privacy" className="w-full h-full border-0" title="Privacy Policy Preview" />
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
          {/* TAB 1: HERO SECTION */}
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
                    placeholder="e.g. Privacy Policy"
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

          {/* TAB 2: MAIN BODY PARAGRAPHS */}
          {activeTab === 'paragraphs' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Main Body Paragraphs</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Main Section Heading</label>
                  <input
                    type="text"
                    value={mainContent.heading || ''}
                    maxLength={50}
                    onChange={(e) => setMainContent({ ...mainContent, heading: e.target.value })}
                    placeholder="e.g. Privacy Policy"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.heading?.length || 0}/50</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 1 (General Informational Purpose)</label>
                  <textarea
                    rows="3"
                    value={mainContent.paragraph1 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph1?.length || 0}/1000</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 2 (Modifications & Updates)</label>
                  <textarea
                    rows="3"
                    value={mainContent.paragraph2 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph2?.length || 0}/1000</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 3 (Limitation of Liability)</label>
                  <textarea
                    rows="3"
                    value={mainContent.paragraph3 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph3: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph3?.length || 0}/1000</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 4 (External Links Disclaimer)</label>
                  <textarea
                    rows="3"
                    value={mainContent.paragraph4 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph4: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph4?.length || 0}/1000</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 5 (Intellectual Property Rights)</label>
                  <textarea
                    rows="3"
                    value={mainContent.paragraph5 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph5: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph5?.length || 0}/1000</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 6 (User Acceptance of Terms)</label>
                  <textarea
                    rows="2"
                    value={mainContent.paragraph6 || ''}
                    maxLength={1000}
                    onChange={(e) => setMainContent({ ...mainContent, paragraph6: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{mainContent.paragraph6?.length || 0}/1000</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BULLET POINTS & CLOSING TEXT */}
          {activeTab === 'bulletPoints' && (
            <div className="space-y-6">
              {/* Bullet Points Box */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-bold text-[#111836]">Policy Bullet Points</h2>
                  <button
                    type="button"
                    onClick={addBulletPoint}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Bullet Point</span>
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

              {/* Closing Text & Copyright Notes */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Closing Paragraphs & Copyright Statements</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 1</label>
                    <textarea
                      rows="4"
                      value={mainContent.closingParagraph1 || ''}
                      maxLength={500}
                      onChange={(e) => setMainContent({ ...mainContent, closingParagraph1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingParagraph1?.length || 0}/500</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 2</label>
                    <textarea
                      rows="3"
                      value={mainContent.closingParagraph2 || ''}
                      maxLength={500}
                      onChange={(e) => setMainContent({ ...mainContent, closingParagraph2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingParagraph2?.length || 0}/500</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Statement (Intellectual Property Note)</label>
                    <textarea
                      rows="2"
                      value={mainContent.closingBoldText1 || ''}
                      maxLength={200}
                      onChange={(e) => setMainContent({ ...mainContent, closingBoldText1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingBoldText1?.length || 0}/200</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Closing Statement (Unauthorized Use Notice)</label>
                    <textarea
                      rows="2"
                      value={mainContent.closingBoldText2 || ''}
                      maxLength={200}
                      onChange={(e) => setMainContent({ ...mainContent, closingBoldText2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{mainContent.closingBoldText2?.length || 0}/200</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Bullet Point Modal */}
      {isAddBulletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-[#111836]">Add New Bullet Point</h3>
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
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{newBulletPoint?.length || 0}/500</div>
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

export default ManagePrivacyPolicy;
