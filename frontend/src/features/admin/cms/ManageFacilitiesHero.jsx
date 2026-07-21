"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import FacilitiesHero from '../../facilities/components/FacilitiesHero';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
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
  const [hero, setHero] = useState({ heading: '', subtext: '', backgroundImage: '' });
  
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
      const { data } = await api.get('/cms/facilities-page');
      if (data && data.hero) setHero(data.hero);
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
          await api.put('/cms/facilities-page', { hero });
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
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
        });
        Toast.fire({ icon: 'info', title: 'Settings reset to default.' });
      }
    });
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <FacilitiesHero data={hero} />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="Text Content & Background">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Heading</label>
            <input
              type="text"
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Subtext</label>
            <textarea
              rows="3"
              value={hero.subtext}
              onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Image</label>
            <SingleImageUploader 
              imageUrl={hero.backgroundImage} 
              onUploadComplete={(url) => setHero({ ...hero, backgroundImage: url })}
              onUploadStateChange={setIsUploading}
              label="Upload Background Image"
            />
          </div>
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageFacilitiesHero;
