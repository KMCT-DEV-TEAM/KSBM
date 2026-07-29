"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import HeroImageUploader from './components/HeroImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import AboutHero from '../../about/components/AboutHero';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageAboutUsHero = () => {
  const [title, setTitle] = useState('About KSBM');
  const [showSection, setShowSection] = useState(true);
  const [subtitle, setSubtitle] = useState('Building Excellence Since 1995');
  const [backgroundImage, setBackgroundImage] = useState('/assets/Images/aboutus/about-hero-bg.jpg');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = {
    title, subtitle, 
    backgroundImage: typeof backgroundImage === 'object' && backgroundImage.file ? URL.createObjectURL(backgroundImage.file) : backgroundImage
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'AboutHero', payload: previewData }, '*');
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
      const { data } = await api.get('/cms/about-us-hero');
      if (data) {
        setShowSection(data.showSection ?? true);
        setTitle(data.title || 'About KSBM');
        setSubtitle(data.subtitle || 'Building Excellence Since 1995');
        setBackgroundImage(data.backgroundImage || '/assets/Images/aboutus/about-hero-bg.jpg');
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
          let finalImageUrl = backgroundImage;
          if (typeof backgroundImage === 'object' && backgroundImage.file) {
            const formData = new FormData();
            formData.append('image', backgroundImage.file);
            const response = await api.post('/upload/aboutus', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              hideLoader: true
            });
            finalImageUrl = response.data.url;
          }

          await api.put('/cms/about-us-hero', { title, subtitle, backgroundImage: finalImageUrl }, { hideLoader: true });
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
        setTitle('About KSBM');
        setSubtitle('Building Excellence Since 1995');
        setBackgroundImage('/assets/Images/aboutus/about-hero-bg.jpg');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="About Us - Hero Section"
        description="Manage the About Us hero banner."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="space-y-8">
          
          <div className="pb-8 border-b border-gray-100">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Background Image</h3>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                Recommended Size: 1920 × 1080 px (16:9)
              </span>
            </div>
            <HeroImageUploader 
              imageUrl={backgroundImage} 
              onUploadComplete={setBackgroundImage}
              onUploadStateChange={setIsUploading}
              label="Drag & drop hero background image, or click to select"
              uploadEndpoint="/upload/aboutus"
              recommendedSize="1920 × 1080 px (16:9 aspect ratio)"
              allowDelete={false}
              deferredUpload={true}
              defaultImage="/assets/Images/aboutus/about-hero-bg.jpg"
            />
          </div>

          <div className="pb-4">
            <h3 className="text-lg font-bold text-[#1e2869] mb-4">Text Content</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Title</label>
                  
</div>
<input 
                  type="text" 
                  maxLength={50}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
<div className="text-right text-xs text-gray-400 mt-1">{title.length}/50 characters</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Subtitle</label>
                  
</div>
<input 
                  type="text" 
                  maxLength={100}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
<div className="text-right text-xs text-gray-400 mt-1">{subtitle.length}/100 characters</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageAboutUsHero;
