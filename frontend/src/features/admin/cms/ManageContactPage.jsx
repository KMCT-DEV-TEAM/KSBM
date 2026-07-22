"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, X, Monitor, Tablet, Smartphone, Phone, Mail, MapPin, CheckCircle2, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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

const ManageContactPage = () => {
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
    title: 'Stay Connected. \nStart Your Journey With KSBM.',
    subtitle: 'Reach out to our admissions office, placement cell, or general inquiry desk. We are here to answer your questions and guide you toward a transformative management education experience.',
    badge: 'CONTACT INFORMATION',
    backgroundImage: '/assets/Images/image 73.png'
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
      const payload = { hero, contactBox };
      await api.put('/cms/contact-page', payload);
      Toast.fire({ icon: 'success', title: 'Contact Page updated successfully' });
    } catch (error) {
      console.error('Failed to save contact page settings', error);
      Toast.fire({ icon: 'error', title: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
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
          backgroundImage: '/assets/Images/image 73.png'
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

  if (isLoading) return <Loader />;

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'contactBox', name: 'Contact Info Box', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Manage Contact Page"
        description="Customize headings, background imagery, and contact details displayed on the Contact Us page."
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Badge Text (Divider Label)</label>
                <input
                  type="text"
                  value={hero.badge || ''}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                  placeholder="e.g. CONTACT INFORMATION"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                <textarea
                  rows="2"
                  value={hero.title || ''}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  placeholder="e.g. Stay Connected. \nStart Your Journey With KSBM."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Subtitle</label>
                <textarea
                  rows="3"
                  value={hero.subtitle || ''}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Enter introductory paragraph..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Background Image</label>
                <LogoUploader
                  value={hero.backgroundImage}
                  onChange={(url) => setHero({ ...hero, backgroundImage: url })}
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Small Top Badge</label>
                <input
                  type="text"
                  value={contactBox.badge || ''}
                  onChange={(e) => setContactBox({ ...contactBox, badge: e.target.value })}
                  placeholder="e.g. CONTACT US"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Card Main Title</label>
                <input
                  type="text"
                  value={contactBox.title || ''}
                  onChange={(e) => setContactBox({ ...contactBox, title: e.target.value })}
                  placeholder="e.g. Start Your Journey"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 mb-1">Card Introductory Description</label>
                <textarea
                  rows="2"
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
      </div>

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-800 text-base">Contact Page Preview</span>
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
                href="/contact"
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
                src="/contact"
                title="Live Contact Page Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContactPage;
