"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

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
  const [backgroundColor, setBackgroundColor] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        if (data.backgroundColor) setBackgroundColor(data.backgroundColor);
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
            heading, subtext, buttonText, buttonLink, backgroundColor
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
        setBackgroundColor('#2A3256');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Apply CTA Section"
        description="Manage the call to action banner on the About Us page."
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Heading</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Background Color (Hex)</label>
            <div className="flex gap-2">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-12 cursor-pointer border border-[#D9DEE3] rounded-md p-1 bg-white" />
              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8">
          <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subtext</label>
          <textarea value={subtext} onChange={(e) => setSubtext(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
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
