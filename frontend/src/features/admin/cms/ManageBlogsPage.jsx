"use client";
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageBlogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    hero: {
      title: 'Insights & Blogs',
      subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
      backgroundImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop'
    },
    blogs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/blogs-page');
      if (data) {
        setFormData({
          hero: data.hero || formData.hero,
          blogs: data.blogs || []
        });
      }
    } catch (error) {
      console.error('Error fetching blogs settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load blogs data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/cms/blogs-page', formData);
      Toast.fire({ icon: 'success', title: 'Blogs page updated successfully' });
    } catch (error) {
      console.error('Error saving blogs page:', error);
      Toast.fire({ icon: 'error', title: 'Failed to update page' });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full pb-16">
      <PageHeader
        title="Manage Blogs Page"
        description="Configure the global Hero Banner and layout for the main Blogs listing page."
        onSave={handleSave}
        isSaving={saving}
        onPreview={() => {}} 
        hasPreview={false} 
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SectionForm title="Hero Banner Configuration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Main Title</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Subtitle/Description</label>
                <textarea
                  value={formData.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[120px] focus:border-primary/50"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Background Image</label>
              <div className="w-full h-[220px]">
                <LogoUploader
                  currentImage={formData.hero.backgroundImage}
                  onImageSelected={(url) => handleHeroChange('backgroundImage', url)}
                />
              </div>
            </div>
          </div>
        </SectionForm>
      </motion.div>
    </div>
  );
};

export default ManageBlogsPage;
