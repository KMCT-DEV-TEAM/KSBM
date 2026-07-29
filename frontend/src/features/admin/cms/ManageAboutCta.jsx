"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import AboutCtaSection from '../../about/components/AboutCtaSection';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageAboutCta = () => {
  const [heading, setHeading] = useState('');
  const [subtext, setSubtext] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = { heading, subtext, buttonText, buttonLink };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'AboutCtaSection', payload: previewData }, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [previewData, isPreviewModalOpen]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/about-us-cta');
      if (data) {
        if (data.heading) setHeading(data.heading);
        if (data.subtext) setSubtext(data.subtext);
        if (data.buttonText) setButtonText(data.buttonText);
        if (data.buttonLink) setButtonLink(data.buttonLink);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/about-us-cta', { 
            heading, subtext, buttonText, buttonLink
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setHeading('Begin Your Leadership Journey at KSBM');
        setSubtext('Applications for the academic year 2024-25 are now open. Secure your seat in the cohort of the future.');
        setButtonText('Apply Now Online');
        setButtonLink('/apply');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Apply CTA Section"
        description="Manage the call to action banner on the About Us page."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>
            
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewMode === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src="/preview/cms"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Heading</label>
              <span className="text-xs text-gray-500">{heading.length}/50</span>
            </div>
            <input type="text" maxLength={50} value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Subtext</label>
            <span className="text-xs text-gray-500">{subtext.length}/150</span>
          </div>
          <textarea value={subtext} maxLength={150} onChange={(e) => setSubtext(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Button Text</label>
            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Button Link</label>
            <input type="text" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageAboutCta;
