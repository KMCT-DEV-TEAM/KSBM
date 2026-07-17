"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageAboutUsHero = () => {
  const [title, setTitle] = useState('About KSBM');
  const [subtitle, setSubtitle] = useState('Building Excellence Since 1995');
  const [backgroundImage, setBackgroundImage] = useState('/assets/Images/about-hero-bg.jpg');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/about-us-hero');
      if (data) {
        setTitle(data.title || 'About KSBM');
        setSubtitle(data.subtitle || 'Building Excellence Since 1995');
        setBackgroundImage(data.backgroundImage || '/assets/Images/about-hero-bg.jpg');
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
          await api.put('/cms/about-us-hero', { title, subtitle, backgroundImage }, { hideLoader: true });
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
        setBackgroundImage('/assets/Images/about-hero-bg.jpg');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">About Us - Hero Section</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the About Us hero banner.</p>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          
          <div className="pb-8 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#566A7F] mb-4">Background Image</h3>
            <SingleImageUploader 
              imageUrl={backgroundImage} 
              onUploadComplete={setBackgroundImage}
              onUploadStateChange={setIsUploading}
              label="Drag & drop background image, or click to select"
            />
          </div>

          <div className="pb-4">
            <h3 className="text-lg font-bold text-[#566A7F] mb-4">Text Content</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageAboutUsHero;
