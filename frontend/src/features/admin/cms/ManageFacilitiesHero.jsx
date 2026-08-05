"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import { uploadDeferredImage } from './utils/uploadHelper';
import HeroImageUploader from './components/HeroImageUploader';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageFacilitiesHero = () => {
  const [hero, setHero] = useState({ heading: '', subtext: '', backgroundImage: '', showSection: true, showTextContent: true });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      const payload = {
        type: 'LIVE_PREVIEW_UPDATE',
        data: { hero },
        activeTab: 'hero'
      };
      
      const sendUpdate = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(payload, '*');
        }
      };

      sendUpdate();

      const handleMessage = (e) => {
        if (e.data?.type === 'iframe-ready') {
          sendUpdate();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPreviewModalOpen, hero]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/facilities-page');
      if (data && data.hero) setHero({ showTextContent: true, ...data.hero, showTextContent: data.hero.showTextContent !== false && data.hero.showTextContent !== 'false' });
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
      message: 'Are you sure you want to save these changes?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const finalImageUrl = await uploadDeferredImage(hero.backgroundImage, '/upload/facilities');
          const payload = { ...hero, backgroundImage: finalImageUrl };

          await api.put('/cms/facilities-page', { hero: payload });
          setHero(payload);
          Toast.fire({ icon: 'success', title: 'Hero settings saved successfully!' });
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
      message: 'This will reset your settings to original state. You still need to click "Save Changes".',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setHero({
          heading: 'Institutional Resources',
          subtext: 'Our campus offers state-of-the-art facilities, modern classrooms, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.',
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
          showTextContent: true
        });
        Toast.fire({ icon: 'info', title: 'Settings reset to default.' });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="w-full pb-12">
      <PageHeader
        title="Facilities Hero Settings"
        description="Manage the banner text and background image for the Facilities page."
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
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Monitor className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Tablet className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                src="/facilities"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="Text Content & Background">
        <div className="mb-8 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-[#1e2869]">Text Content Visibility</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={hero.showTextContent !== false && hero.showTextContent !== 'false'}
                  onChange={(e) => setHero({ ...hero, showTextContent: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${hero.showTextContent !== false && hero.showTextContent !== 'false' ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hero.showTextContent !== false && hero.showTextContent !== 'false' ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {hero.showTextContent !== false && hero.showTextContent !== 'false' ? 'Visible' : 'Hidden'}
              </span>
            </label>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Heading</label>
            <input
              type="text"
              maxLength={30}
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{(hero.heading || '').length}/30 characters</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Subtext</label>
            <textarea
              rows="3"
              maxLength={200}
              value={hero.subtext}
              onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{(hero.subtext || '').length}/200 characters</div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-sm font-semibold text-gray-700">Background Image</label>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                Recommended Size: 1920 × 1080 px (16:9)
              </span>
            </div>
            <HeroImageUploader 
              imageUrl={hero.backgroundImage} 
              onUploadComplete={(url) => setHero({ ...hero, backgroundImage: url })}
              onUploadStateChange={setIsUploading}
              label="Drag & drop hero background image, or click to select"
              uploadEndpoint="/upload/facilities"
              recommendedSize="1920 × 1080 px (16:9 aspect ratio)"
              defaultImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              deferredUpload={true}
              allowDelete={true}
            />
          </div>
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageFacilitiesHero;
