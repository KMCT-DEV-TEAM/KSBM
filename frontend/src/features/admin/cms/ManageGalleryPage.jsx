"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageGalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const [formData, setFormData] = useState({
    hero: {
      title: 'KSBM Sports Club:\nWhere Leaders Compete',
      subtitle: 'Forging the next generation of global leaders through the crucible of competitive sports.',
      backgroundImage: '/assets/Images/image 53.png'
    },
    gallery: {
      heading: 'Moments Captured in Campus',
      badge: 'Gallery',
      items: [
        { title: 'Temple', type: 'image', img: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop' },
        { title: 'Camp Fire', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
        { title: 'Mountain', type: 'video', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
        { title: 'The Night Beauty', type: 'image', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0393b?q=80&w=800&auto=format&fit=crop' },
        { title: 'Graduation', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
        { title: 'Study Boy', type: 'image', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' }
      ]
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/gallery-page');
      if (res.data) {
        setFormData(prev => {
          const fetchedGallery = res.data.gallery || {};
          return {
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            gallery: { 
              ...prev.gallery, 
              ...fetchedGallery,
              items: fetchedGallery.items?.length > 0 ? fetchedGallery.items : prev.gallery.items
            }
          };
        });
      }
    } catch (err) {
      console.error('Error loading Gallery Page settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setSaving(true);
        try {
          await api.put('/cms/gallery-page', formData, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    const defaults = {
      hero: {
        title: 'KSBM Sports Club:\nWhere Leaders Compete',
        subtitle: 'Forging the next generation of global leaders through the crucible of competitive sports.',
        backgroundImage: '/assets/Images/image 53.png'
      },
      gallery: {
        heading: 'Moments Captured in Campus',
        badge: 'Gallery',
        items: [
          { title: 'Temple', type: 'image', img: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop' },
          { title: 'Camp Fire', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Mountain', type: 'video', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { title: 'The Night Beauty', type: 'image', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0393b?q=80&w=800&auto=format&fit=crop' },
          { title: 'Graduation', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Study Boy', type: 'image', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    };
    setFormData(defaults);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: [
          ...(prev.gallery.items || []),
          { title: '', type: 'image', img: '' }
        ]
      }
    }));
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateGalleryItem = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.gallery.items || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gallery: { ...prev.gallery, items: updated } };
    });
  };

  const moveGalleryItem = (index, direction) => {
    setFormData(prev => {
      const updated = [...(prev.gallery.items || [])];
      const target = index + direction;
      if (target < 0 || target >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      return { ...prev, gallery: { ...prev.gallery, items: updated } };
    });
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Manage Gallery Page" 
        description="Customize hero headings and gallery media grid displayed on the website."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={saving}
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center items-end">
            <div className={`bg-white shadow-xl w-full h-full mt-auto transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe src="/gallery" className="w-full h-full border-0" title="Gallery Preview" />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="Hero Banner Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Page Title</label>
              <textarea rows={2} value={formData.hero.title} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. KSBM Sports Club" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Subtitle / Introductory Text</label>
              <textarea rows={4} value={formData.hero.subtitle} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" placeholder="Enter introductory descriptive text..." />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Hero Background Image</label>
            <LogoUploader
              label="Banner Background"
              currentImage={formData.hero.backgroundImage}
              onImageSelected={(url) => setFormData({ ...formData, hero: { ...formData.hero, backgroundImage: url } })}
            />
          </div>
        </div>
      </SectionForm>

      <SectionForm title="Gallery Settings & Media Grid">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Gallery Badge</label>
              <input type="text" value={formData.gallery.badge} onChange={e => setFormData({ ...formData, gallery: { ...formData.gallery, badge: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Gallery" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Gallery Section Heading</label>
              <input type="text" value={formData.gallery.heading} onChange={e => setFormData({ ...formData, gallery: { ...formData.gallery, heading: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Moments Captured in Campus" />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Gallery Items</h4>
            <button onClick={addGalleryItem} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.gallery.items?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50/50 relative group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveGalleryItem(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveGalleryItem(idx, 1)} disabled={idx === (formData.gallery.items?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => removeGalleryItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-1/3 shrink-0">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block">Item Media</label>
                    <LogoUploader
                      label="Upload Media"
                      currentImage={item.img}
                      onImageSelected={(url) => updateGalleryItem(idx, 'img', url)}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Item Title</label>
                      <input type="text" value={item.title} onChange={e => updateGalleryItem(idx, 'title', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Annual Sports Meet" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Media Category</label>
                      <select value={item.type} onChange={e => updateGalleryItem(idx, 'type', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none">
                        <option value="image">Image (Cultural / General)</option>
                        <option value="video">Video (Sports / Moving Image)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!formData.gallery.items || formData.gallery.items.length === 0) && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                <p className="text-sm text-gray-500 font-medium">No gallery items added yet.</p>
              </div>
            )}
          </div>
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageGalleryPage;
