"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import BannerUploader from './components/BannerUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const ManageHero = () => {
  const iframeRef = useRef(null);
  
  const [pillText, setPillText] = useState({ text: 'ADMISSIONS OPEN 2025-26', isVisible: true });
  const [headingLine1, setHeadingLine1] = useState({ text: 'Empowering Future', isVisible: true });
  const [headingLine2, setHeadingLine2] = useState({ text: 'Business Leaders', isVisible: true });
  const [description, setDescription] = useState({ text: "Unlock your potential with India's leading B-School, where traditional academic rigor meets modern industry innovation. Join a network of global visionaries.", isVisible: true });
  
  const [primaryButton, setPrimaryButton] = useState({ text: 'Apply Now', isVisible: true, link: '#' });
  const [secondaryButton, setSecondaryButton] = useState({ text: 'Download Brochure', isVisible: true, link: '#' });

  const [bannerImages, setBannerImages] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/hero');
      if (data) {
        if (data.pillText) setPillText(typeof data.pillText === 'string' ? { text: data.pillText, isVisible: true } : data.pillText);
        if (data.headingLine1) setHeadingLine1(typeof data.headingLine1 === 'string' ? { text: data.headingLine1, isVisible: true } : data.headingLine1);
        if (data.headingLine2) setHeadingLine2(typeof data.headingLine2 === 'string' ? { text: data.headingLine2, isVisible: true } : data.headingLine2);
        if (data.description) setDescription(typeof data.description === 'string' ? { text: data.description, isVisible: true } : data.description);
        if (data.primaryButton) setPrimaryButton(data.primaryButton);
        if (data.secondaryButton) setSecondaryButton(data.secondaryButton);
        if (data.bannerImages) setBannerImages(data.bannerImages);
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load hero settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/hero', { 
        pillText, 
        headingLine1, 
        headingLine2, 
        description, 
        primaryButton, 
        secondaryButton,
        bannerImages
      }, { hideLoader: true });
      Toast.fire({ icon: 'success', title: 'Hero settings saved successfully!' });
    } catch (error) {
      console.error('Error saving hero settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    Swal.fire({
      title: 'Reset to Defaults?',
      text: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: '#8592A3',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPillText({ text: 'ADMISSIONS OPEN 2025-26', isVisible: true });
        setHeadingLine1({ text: 'Empowering Future', isVisible: true });
        setHeadingLine2({ text: 'Business Leaders', isVisible: true });
        setDescription({ text: "Unlock your potential with India's leading B-School, where traditional academic rigor meets modern industry innovation. Join a network of global visionaries.", isVisible: true });
        setPrimaryButton({ text: 'Apply Now', isVisible: true, link: '#' });
        setSecondaryButton({ text: 'Download Brochure', isVisible: true, link: '#' });
        setBannerImages([
          { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' }
        ]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const previewData = {
    pillText,
    headingLine1,
    headingLine2,
    description,
    primaryButton,
    secondaryButton,
    bannerImages
  };

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      // Small timeout to allow iframe to load if just opened
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'preview-hero-data', payload: previewData },
            '*'
          );
        }
      }, 500);
      
      // Also send immediately in case it's already loaded and data changed
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'preview-hero-data', payload: previewData },
          '*'
        );
      }
    }
  }, [previewData, isPreviewModalOpen]);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto space-y-8">
          <div className="border-b border-gray-100 pb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="border-b border-gray-100 pb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Hero Section Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the main hero banner text and action buttons.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-md font-semibold text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 bg-white text-[#697A8D] px-4 py-2.5 rounded-md font-semibold text-sm border border-[#D9DEE3] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70"
          >
            {isSaving || isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>

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
                src="/preview/hero"
                className="w-full h-full border-0"
                title="Hero Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        
        {/* Banner Images Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Banner Background Images</h3>
          <BannerUploader 
            bannerImages={bannerImages} 
            setBannerImages={setBannerImages} 
            onUploadStateChange={(uploading) => setIsUploading(uploading)}
          />
        </div>

        {/* Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Text Content</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Pill Badge Text</label>
              <input 
                type="text" 
                value={pillText.text}
                onChange={(e) => setPillText({ ...pillText, text: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={pillText.isVisible} onChange={(e) => setPillText({ ...pillText, isVisible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-[#566A7F]">Show Pill Badge</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Heading Line 1 (White Text)</label>
                <input 
                  type="text" 
                  value={headingLine1.text}
                  onChange={(e) => setHeadingLine1({ ...headingLine1, text: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={headingLine1.isVisible} onChange={(e) => setHeadingLine1({ ...headingLine1, isVisible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-semibold text-[#566A7F]">Show Heading Line 1</span>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Heading Line 2 (Blue Text)</label>
                <input 
                  type="text" 
                  value={headingLine2.text}
                  onChange={(e) => setHeadingLine2({ ...headingLine2, text: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={headingLine2.isVisible} onChange={(e) => setHeadingLine2({ ...headingLine2, isVisible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-semibold text-[#566A7F]">Show Heading Line 2</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description</label>
              <textarea 
                value={description.text}
                onChange={(e) => setDescription({ ...description, text: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              ></textarea>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={description.isVisible} onChange={(e) => setDescription({ ...description, isVisible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-[#566A7F]">Show Description</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons Settings */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Action Buttons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Primary Button */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-sm text-[#566A7F] mb-3 border-b pb-2">Primary Button (Apply Now)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Button Text</label>
                  <input 
                    type="text" 
                    value={primaryButton.text}
                    onChange={(e) => setPrimaryButton({ ...primaryButton, text: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Link URL</label>
                  <input 
                    type="text" 
                    value={primaryButton.link}
                    onChange={(e) => setPrimaryButton({ ...primaryButton, link: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={primaryButton.isVisible}
                      onChange={(e) => setPrimaryButton({ ...primaryButton, isVisible: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-[#566A7F]">Show Primary Button</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-sm text-[#566A7F] mb-3 border-b pb-2">Secondary Button (Download Brochure)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Button Text</label>
                  <input 
                    type="text" 
                    value={secondaryButton.text}
                    onChange={(e) => setSecondaryButton({ ...secondaryButton, text: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Link URL</label>
                  <input 
                    type="text" 
                    value={secondaryButton.link}
                    onChange={(e) => setSecondaryButton({ ...secondaryButton, link: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={secondaryButton.isVisible}
                      onChange={(e) => setSecondaryButton({ ...secondaryButton, isVisible: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-[#566A7F]">Show Secondary Button</span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageHero;

