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

const ManagePrivacyPolicy = () => {
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
    title: 'Privacy Policy',
    subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
    backgroundImage: '/assets/Images/image 73.png'
  });

  const [mainContent, setMainContent] = useState({
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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/privacy-policy');
      const data = response.data;
      if (data) {
        if (data.hero) setHero({ ...hero, ...data.hero });
        if (data.mainContent) {
          const bp = Array.isArray(data.mainContent.bulletPoints) && data.mainContent.bulletPoints.length > 0
            ? data.mainContent.bulletPoints
            : mainContent.bulletPoints;
          setMainContent({ ...mainContent, ...data.mainContent, bulletPoints: bp });
        }
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to load privacy policy settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { hero, mainContent };
      await api.put('/cms/privacy-policy', payload);
      Toast.fire({ icon: 'success', title: 'Privacy Policy updated successfully' });
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
        setHero({
          title: 'Privacy Policy',
          subtitle: 'Browse our FAQs to learn more about admissions, course structure, eligibility, placement assistance, scholarships, and campus facilities before you apply.',
          backgroundImage: '/assets/Images/image 73.png'
        });

        setMainContent({
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
        });

        Toast.fire({ icon: 'info', title: 'Defaults restored. Click Save Changes to confirm.' });
      }
    });
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
    { id: 'paragraphs', name: 'Main Body Paragraphs', icon: <FileText className="w-4 h-4" /> },
    { id: 'bulletPoints', name: 'Bullet Points & Closing Text', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Manage Privacy Policy Page"
        description="Customize hero banner headings, institutional disclaimers, policy guidelines, and copyright notices displayed on the Privacy Policy page."
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
                  placeholder="e.g. Privacy Policy"
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
                  onChange={(e) => setMainContent({ ...mainContent, heading: e.target.value })}
                  placeholder="e.g. Privacy Policy"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 1 (General Informational Purpose)</label>
                <textarea
                  rows="3"
                  value={mainContent.paragraph1 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 2 (Modifications & Updates)</label>
                <textarea
                  rows="3"
                  value={mainContent.paragraph2 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 3 (Limitation of Liability)</label>
                <textarea
                  rows="3"
                  value={mainContent.paragraph3 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph3: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 4 (External Links Disclaimer)</label>
                <textarea
                  rows="3"
                  value={mainContent.paragraph4 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph4: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 5 (Intellectual Property Rights)</label>
                <textarea
                  rows="3"
                  value={mainContent.paragraph5 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph5: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Paragraph 6 (User Acceptance of Terms)</label>
                <textarea
                  rows="2"
                  value={mainContent.paragraph6 || ''}
                  onChange={(e) => setMainContent({ ...mainContent, paragraph6: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BULLET POINTS & CLOSING TEXT */}
        {activeTab === 'bulletPoints' && (
          <div className="space-y-8">
            {/* Bullet Points Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-[#111836]">Policy Bullet Points</h2>
                <button
                  type="button"
                  onClick={addBulletPoint}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-xl font-semibold text-sm"
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

            {/* Closing Text & Copyright Notes */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Closing Paragraphs & Copyright Statements</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 1</label>
                  <textarea
                    rows="4"
                    value={mainContent.closingParagraph1 || ''}
                    onChange={(e) => setMainContent({ ...mainContent, closingParagraph1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Closing Summary Paragraph 2</label>
                  <textarea
                    rows="3"
                    value={mainContent.closingParagraph2 || ''}
                    onChange={(e) => setMainContent({ ...mainContent, closingParagraph2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Closing Statement (Intellectual Property Note)</label>
                  <textarea
                    rows="2"
                    value={mainContent.closingBoldText1 || ''}
                    onChange={(e) => setMainContent({ ...mainContent, closingBoldText1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Closing Statement (Unauthorized Use Notice)</label>
                  <textarea
                    rows="2"
                    value={mainContent.closingBoldText2 || ''}
                    onChange={(e) => setMainContent({ ...mainContent, closingBoldText2: e.target.value })}
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
              <span className="font-bold text-gray-800 text-base">Privacy Policy Preview</span>
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
                href="/privacy-policy"
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
                src="/privacy-policy"
                title="Live Privacy Policy Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrivacyPolicy;
