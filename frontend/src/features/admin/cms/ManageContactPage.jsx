"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, Eye, X, Monitor, Tablet, Smartphone, Phone, Mail, MapPin, CheckCircle2, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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

const ManageContactPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = React.useRef(null);
  const iframeRef = React.useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [hero, setHero] = useState({
    title: 'Stay Connected. \nStart Your Journey With KSBM.',
    subtitle: 'Reach out to our admissions office, placement cell, or general inquiry desk. We are here to answer your questions and guide you toward a transformative management education experience.',
    badge: 'CONTACT INFORMATION',
    backgroundImage: '/assets/Images/contact/contact_hero.png'
  });

  const [contactBox, setContactBox] = useState({
    badge: 'CONTACT US',
    title: 'Start Your Journey',
    subtitle: 'Whether you are seeking admission to our flagship management programs or exploring corporate collaboration, our doors are always open to support your ambitions.',
    phoneLabel: 'Call us for inquiry',
    phoneNumber: '+91 495 2211 444',
    phoneSecondary: '/ +1 (212) 555-0198',
    emailLabel: 'Email anytime',
    emailPrimary: 'admissions@ksbm.ac.in',
    emailSecondary: 'solutions@lumina.com',
    addressLabel: 'Visit Our Office',
    addressText: 'KMCT Hills, Mampara, Pazhur P.O., Kuttippuram, Kerala - 679571',
    bottomBadgeText: 'Admissions Open 2025–27',
    bottomBadgeDesk: 'KSBM Desk'
  });

  const [imagesToDelete, setImagesToDelete] = useState([]);

  const uploadDeferredImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload/contact', fd, {
      hideLoader: true
    });
    return data.url;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/contact-page');
      const data = response.data;
      if (data.hero) setHero(data.hero);
      if (data.contactBox) setContactBox(data.contactBox);
    } catch (error) {
      console.error('Failed to fetch contact page settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to load contact page settings' });
    } finally {
      setIsLoading(false);
    }
  };

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

      let finalHero = { ...hero };

      if (finalHero.backgroundImage && finalHero.backgroundImage.file) {
        finalHero.backgroundImage = await uploadDeferredImage(finalHero.backgroundImage.file);
      } else if (finalHero.backgroundImage && finalHero.backgroundImage.previewUrl) {
        finalHero.backgroundImage = finalHero.backgroundImage.previewUrl;
      } else if (typeof finalHero.backgroundImage === 'object' && finalHero.backgroundImage.url) {
        finalHero.backgroundImage = finalHero.backgroundImage.url;
      }

      const payload = { hero: finalHero, contactBox };
      await api.put('/cms/contact-page', payload);
      
      setHero(finalHero);
      Toast.fire({ icon: 'success', title: 'Contact Page updated successfully' });
    } catch (error) {
      console.error('Failed to save contact page settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (data) => {
    if (data.isDeleted) {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.includes('contact_hero.png') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setHero({ ...hero, backgroundImage: data.previewUrl });
    } else {
      if (data.oldUrl && !data.oldUrl.includes('default') && !data.oldUrl.includes('contact_hero.png') && !data.oldUrl.startsWith('blob:')) {
        setImagesToDelete(prev => [...prev, data.oldUrl]);
      }
      setHero({ ...hero, backgroundImage: data });
    }
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all text, images, and labels for the Contact Page to their original standard state. You still need to click "Save Changes" to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'danger',
      action: async () => {
        setHero({
          title: 'Stay Connected. \nStart Your Journey With KSBM.',
          subtitle: 'Reach out to our admissions office, placement cell, or general inquiry desk. We are here to answer your questions and guide you toward a transformative management education experience.',
          badge: 'CONTACT INFORMATION',
          backgroundImage: '/assets/Images/contact/contact_hero.png'
        });

        setContactBox({
          badge: 'CONTACT US',
          title: 'Start Your Journey',
          subtitle: 'Whether you are seeking admission to our flagship management programs or exploring corporate collaboration, our doors are always open to support your ambitions.',
          phoneLabel: 'Call us for inquiry',
          phoneNumber: '+91 495 2211 444',
          phoneSecondary: '/ +1 (212) 555-0198',
          emailLabel: 'Email anytime',
          emailPrimary: 'admissions@ksbm.ac.in',
          emailSecondary: 'solutions@lumina.com',
          addressLabel: 'Visit Our Office',
          addressText: 'KMCT Hills, Mampara, Pazhur P.O., Kuttippuram, Kerala - 679571',
          bottomBadgeText: 'Admissions Open 2025–27',
          bottomBadgeDesk: 'KSBM Desk'
        });

        Toast.fire({ icon: 'info', title: 'Defaults restored. Click Save Changes to confirm.' });
      }
    });
  };

  useEffect(() => {
    if (iframeRef.current && isPreviewModalOpen) {
      const timer = setTimeout(() => {
        iframeRef.current.contentWindow.postMessage({
          type: 'preview-contact-data',
          payload: { hero, contactBox }
        }, '*');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hero, contactBox, isPreviewModalOpen]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'iframe-ready' && event.data?.source === 'contact') {
        if (iframeRef.current) {
          iframeRef.current.contentWindow.postMessage({
            type: 'preview-contact-data',
            payload: { hero, contactBox }
          }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hero, contactBox]);

  if (isLoading) return <AdminSkeleton />;

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'contactBox', name: 'Contact Info Box', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Standard Scrollable Tabs Navigation Bar */}
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
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Manage Contact Page"
        description="Customize headings, background imagery, and contact details displayed on the Contact Us page."
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
              <iframe ref={iframeRef} src="/preview/contact" className="w-full h-full border-0" title="Contact Preview" />
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Badge Text (Divider Label)</label>
                  <span className="text-xs text-gray-400">{hero.badge?.length || 0}/30</span>
                </div>
                <input
                  type="text"
                  maxLength={30}
                  value={hero.badge || ''}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                  placeholder="e.g. CONTACT INFORMATION"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Title</label>
                  <span className="text-xs text-gray-400">{hero.title?.length || 0}/100</span>
                </div>
                <textarea
                  rows="2"
                  maxLength={100}
                  value={hero.title || ''}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  placeholder="e.g. Stay Connected. \nStart Your Journey With KSBM."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Subtitle</label>
                  <span className="text-xs text-gray-400">{hero.subtitle?.length || 0}/200</span>
                </div>
                <textarea
                  rows="3"
                  maxLength={200}
                  value={hero.subtitle || ''}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Enter introductory paragraph..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Background Image</label>
                <SingleImageUploader
                  imageUrl={hero.backgroundImage}
                  onUploadComplete={(data) => handleImageChange(data)}
                  deferredUpload={true}
                  defaultImage="/assets/Images/contact/contact_hero.png"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT BOX & DETAILS */}
        {activeTab === 'contactBox' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111836] border-b pb-4">Contact Info Box Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Small Top Badge</label>
                  <span className="text-xs text-gray-400">{contactBox.badge?.length || 0}/30</span>
                </div>
                <input
                  type="text"
                  maxLength={30}
                  value={contactBox.badge || ''}
                  onChange={(e) => setContactBox({ ...contactBox, badge: e.target.value })}
                  placeholder="e.g. CONTACT US"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Card Main Title</label>
                  <span className="text-xs text-gray-400">{contactBox.title?.length || 0}/50</span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={contactBox.title || ''}
                  onChange={(e) => setContactBox({ ...contactBox, title: e.target.value })}
                  placeholder="e.g. Start Your Journey"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-800">Card Introductory Description</label>
                  <span className="text-xs text-gray-400">{contactBox.subtitle?.length || 0}/300</span>
                </div>
                <textarea
                  rows="2"
                  maxLength={300}
                  value={contactBox.subtitle || ''}
                  onChange={(e) => setContactBox({ ...contactBox, subtitle: e.target.value })}
                  placeholder="Enter details text..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Sub-group: Phone */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-[#111836]">
                <Phone className="w-4 h-4 text-primary" /> Phone Contact Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Label</label>
                  <input
                    type="text"
                    value={contactBox.phoneLabel || ''}
                    onChange={(e) => setContactBox({ ...contactBox, phoneLabel: e.target.value })}
                    placeholder="e.g. Call us for inquiry"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Primary Number</label>
                  <input
                    type="text"
                    value={contactBox.phoneNumber || ''}
                    onChange={(e) => setContactBox({ ...contactBox, phoneNumber: e.target.value })}
                    placeholder="e.g. +91 495 2211 444"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Secondary / Alternate</label>
                  <input
                    type="text"
                    value={contactBox.phoneSecondary || ''}
                    onChange={(e) => setContactBox({ ...contactBox, phoneSecondary: e.target.value })}
                    placeholder="e.g. / +1 (212) 555-0198"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Sub-group: Email */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-[#111836]">
                <Mail className="w-4 h-4 text-primary" /> Email Contact Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Label</label>
                  <input
                    type="text"
                    value={contactBox.emailLabel || ''}
                    onChange={(e) => setContactBox({ ...contactBox, emailLabel: e.target.value })}
                    placeholder="e.g. Email anytime"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Primary Email</label>
                  <input
                    type="text"
                    value={contactBox.emailPrimary || ''}
                    onChange={(e) => setContactBox({ ...contactBox, emailPrimary: e.target.value })}
                    placeholder="e.g. admissions@ksbm.ac.in"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Secondary Email</label>
                  <input
                    type="text"
                    value={contactBox.emailSecondary || ''}
                    onChange={(e) => setContactBox({ ...contactBox, emailSecondary: e.target.value })}
                    placeholder="e.g. solutions@lumina.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Sub-group: Address */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-[#111836]">
                <MapPin className="w-4 h-4 text-primary" /> Office Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Address Label</label>
                  <input
                    type="text"
                    value={contactBox.addressLabel || ''}
                    onChange={(e) => setContactBox({ ...contactBox, addressLabel: e.target.value })}
                    placeholder="e.g. Visit Our Office"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Physical Address</label>
                  <textarea
                    rows="2"
                    value={contactBox.addressText || ''}
                    onChange={(e) => setContactBox({ ...contactBox, addressText: e.target.value })}
                    placeholder="e.g. KMCT Hills, Mampara, Pazhur P.O., Kuttippuram, Kerala - 679571"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Sub-group: Footer Badges */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-[#111836]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bottom Card Footer Badges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Admissions Status Text</label>
                  <input
                    type="text"
                    value={contactBox.bottomBadgeText || ''}
                    onChange={(e) => setContactBox({ ...contactBox, bottomBadgeText: e.target.value })}
                    placeholder="e.g. Admissions Open 2025–27"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Right Desk Label</label>
                  <input
                    type="text"
                    value={contactBox.bottomBadgeDesk || ''}
                    onChange={(e) => setContactBox({ ...contactBox, bottomBadgeDesk: e.target.value })}
                    placeholder="e.g. KSBM Desk"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageContactPage;
