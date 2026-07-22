"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, X, Monitor, Tablet, Smartphone, CheckCircle2, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import Loader from '../../../components/Loader';
import confirmAction from '../../../utils/confirmAction';
import LogoUploader from './components/LogoUploader';
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
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = React.useRef(null);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [hero, setHero] = useState({
    title: 'Terms & Conditions',
    subtitle: 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.',
    backgroundImage: '/assets/Images/image 73.png'
  });

  const [mainContent, setMainContent] = useState({
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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/terms-and-conditions');
      const data = response.data;
      if (data) {
        if (data.hero) setHero({ ...hero, ...data.hero });
        if (data.mainContent) {
          const secs = Array.isArray(data.mainContent.sections) && data.mainContent.sections.length > 0
            ? data.mainContent.sections
            : mainContent.sections;
          const bp = Array.isArray(data.mainContent.bulletPoints) && data.mainContent.bulletPoints.length > 0
            ? data.mainContent.bulletPoints
            : mainContent.bulletPoints;
          setMainContent({ ...mainContent, ...data.mainContent, sections: secs, bulletPoints: bp });
        }
      }
    } catch (error) {
      console.error('Failed to fetch terms and conditions settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to load terms and conditions settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { hero, mainContent };
      await api.put('/cms/terms-and-conditions', payload);
      Toast.fire({ icon: 'success', title: 'Terms & Conditions updated successfully' });
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
        setHero({
          title: 'Terms & Conditions',
          subtitle: 'Please review our institutional terms of service, website usage agreement, and general guidelines governing access to KMCT School of Business Management platforms.',
          backgroundImage: '/assets/Images/image 73.png'
        });

        setMainContent({
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
        });

        Toast.fire({ icon: 'info', title: 'Defaults restored. Click Save Changes to confirm.' });
      }
    });
  };

  const addSection = () => {
    setMainContent({
      ...mainContent,
      sections: [
        ...(mainContent.sections || []),
        { title: `${(mainContent.sections || []).length + 1}. New Policy Clause`, content: 'Enter clause details...' }
      ]
    });
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
    setMainContent({
      ...mainContent,
      bulletPoints: [...(mainContent.bulletPoints || []), 'New guideline point']
    });
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

  if (isLoading) return <Loader />;

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'sections', name: 'Policy Sections & Intro', icon: <FileText className="w-4 h-4" /> },
    { id: 'bulletPoints', name: 'Highlights & Closing Text', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Manage Terms & Conditions Page"
        description="Customize banner headings, institutional terms of service clauses, policy highlights, and closing guidelines."
        onSave={handleSave}
        onReset={handleResetToDefault}
        onPreview={() => setIsPreviewModalOpen(true)}
        isSaving={isSaving}
      />

      {/* Standard Scrollable Tabs Navigation Bar */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

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
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div>
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
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  placeholder="e.g. Terms & Conditions"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Subtitle / Introductory Description</label>
                <textarea
                  rows="3"
                  value={hero.subtitle || ''}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Enter introductory paragraph for the banner..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Hero Background Image</label>
                <LogoUploader
                  label="Upload Hero Background"
                  currentLogo={hero.backgroundImage}
                  onUploadSuccess={(url) => setHero({ ...hero, backgroundImage: url })}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POLICY SECTIONS & INTRO */}
        {activeTab === 'sections' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Introductory Settings</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Main Section Heading</label>
                  <input
                    type="text"
                    value={mainContent.heading || ''}
                    onChange={(e) => setMainContent({ ...mainContent, heading: e.target.value })}
                    placeholder="e.g. Terms of Use"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Introductory Paragraph</label>
                  <textarea
                    rows="3"
                    value={mainContent.introParagraph || ''}
                    onChange={(e) => setMainContent({ ...mainContent, introParagraph: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-[#111836]">Numbered Policy Clauses / Sections</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-xl font-semibold text-sm"
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
                          onChange={(e) => updateSection(idx, 'title', e.target.value)}
                          className="w-full bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-bold text-primary"
                        />
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
                        onChange={(e) => updateSection(idx, 'content', e.target.value)}
                        className="w-full bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HIGHLIGHTS & CLOSING TEXT */}
        {activeTab === 'bulletPoints' && (
          <div className="space-y-8">
            {/* Bullet Points Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-[#111836]">Highlights Bullet Points Box</h2>
                <button
                  type="button"
                  onClick={addBulletPoint}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-xl font-semibold text-sm"
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
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => updateBulletPoint(idx, e.target.value)}
                      className="flex-1 bg-white px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                    />
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
                    onChange={(e) => setMainContent({ ...mainContent, closingParagraph1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 2 (Contact Assistance)</label>
                  <textarea
                    rows="3"
                    value={mainContent.closingParagraph2 || ''}
                    onChange={(e) => setMainContent({ ...mainContent, closingParagraph2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-800 text-base">Terms & Conditions Preview</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full">Live Interactive</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'tablet' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 font-semibold hover:underline px-3 py-1.5 rounded-lg bg-blue-50"
              >
                Open in New Tab ↗
              </a>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
            <div
              className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
                previewDevice === 'desktop'
                  ? 'w-full h-full rounded-none'
                  : previewDevice === 'tablet'
                    ? 'w-[768px] h-[90%] rounded-3xl border-[12px] border-gray-800'
                    : 'w-[375px] h-[90%] rounded-[3rem] border-[14px] border-gray-800 shadow-2xl'
              }`}
            >
              <iframe
                src="/terms-and-conditions"
                title="Live Terms and Conditions Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTermsAndConditions;
