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

const ManageEventsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const defaults = {
    hero: {
      title: 'THE SPIRIT OF CULTURE',
      subtitle: 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life, fostering creativity, leadership, and lifelong memories.',
      backgroundImage: '/assets/Images/Group 250.png'
    },
    upcomingEvents: {
      heading: 'THE UPCOMING EVENTS',
      events: [
        {
          title: 'CELEBRITY VISIT',
          description: 'Join us for an exclusive evening with renowned personalities. Experience an inspiring session filled with insights, interactions, and memorable moments.',
          date: '12',
          month: 'OCT',
          img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
        }
      ]
    },
    highlightedPrograms: {
      heading: 'THE HIGHLIGHTED PROGRAMS',
      images: [
        { img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop', alt: 'Program 1' }
      ]
    },
    essenceOfCulture: {
      heading: 'THE ESSENCE OF CULTURE',
      items: [
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop', category: 'Concert' }
      ]
    },
    stayConnected: {
      heading: 'STAY CONNECTED',
      posters: [
        { img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop' }
      ]
    },
    momentsCaptured: {
      heading: 'MOMENTS CAPTURED',
      images: [
        { img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop' }
      ]
    },
    footerGraphic: '/assets/Images/Group 339.png'
  };

  const [formData, setFormData] = useState(defaults);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/events-page');
      if (res.data) {
        setFormData(prev => {
          const d = res.data;
          return {
            hero: { ...prev.hero, ...(d.hero || {}) },
            upcomingEvents: { 
              ...prev.upcomingEvents, 
              ...(d.upcomingEvents || {}),
              events: d.upcomingEvents?.events?.length > 0 ? d.upcomingEvents.events : prev.upcomingEvents.events
            },
            highlightedPrograms: { 
              ...prev.highlightedPrograms, 
              ...(d.highlightedPrograms || {}),
              images: d.highlightedPrograms?.images?.length > 0 ? d.highlightedPrograms.images : prev.highlightedPrograms.images
            },
            essenceOfCulture: { 
              ...prev.essenceOfCulture, 
              ...(d.essenceOfCulture || {}),
              items: d.essenceOfCulture?.items?.length > 0 ? d.essenceOfCulture.items : prev.essenceOfCulture.items
            },
            stayConnected: { 
              ...prev.stayConnected, 
              ...(d.stayConnected || {}),
              posters: d.stayConnected?.posters?.length > 0 ? d.stayConnected.posters : prev.stayConnected.posters
            },
            momentsCaptured: { 
              ...prev.momentsCaptured, 
              ...(d.momentsCaptured || {}),
              images: d.momentsCaptured?.images?.length > 0 ? d.momentsCaptured.images : prev.momentsCaptured.images
            }
          };
        });
      }
    } catch (err) {
      console.error('Error loading Events Page settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the Events website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setSaving(true);
        try {
          await api.put('/cms/events-page', formData, { hideLoader: true });
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
    setFormData(defaults);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  // Helper arrays/functions for repetitive CRUD arrays
  const handleUpdateArray = (section, key, index, field, value) => {
    setFormData(prev => {
      const arr = [...(prev[section][key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [key]: arr } };
    });
  };

  const handleAddArrayItem = (section, key, emptyItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: [...(prev[section][key] || []), emptyItem]
      }
    }));
  };

  const handleRemoveArrayItem = (section, key, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: prev[section][key].filter((_, i) => i !== index)
      }
    }));
  };

  const handleMoveArrayItem = (section, key, index, direction) => {
    setFormData(prev => {
      const arr = [...(prev[section][key] || [])];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[target];
      arr[target] = temp;
      return { ...prev, [section]: { ...prev[section], [key]: arr } };
    });
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Manage Events Page" 
        description="Customize the cinematic events landing page including the hero, upcoming events, and photo collages."
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
              <iframe src="/events" className="w-full h-full border-0" title="Events Preview" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <SectionForm title="Hero Banner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Page Title</label>
              <input type="text" value={formData.hero.title} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Subtitle</label>
              <textarea rows={4} value={formData.hero.subtitle} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" />
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

      {/* Upcoming Events */}
      <SectionForm title="Upcoming Events">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.upcomingEvents.heading} onChange={e => setFormData({ ...formData, upcomingEvents: { ...formData.upcomingEvents, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={() => handleAddArrayItem('upcomingEvents', 'events', { title: '', description: '', date: '', month: '', img: '' })} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          <div className="space-y-4">
            {formData.upcomingEvents.events?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50/50 relative group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Event #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleMoveArrayItem('upcomingEvents', 'events', idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleMoveArrayItem('upcomingEvents', 'events', idx, 1)} disabled={idx === (formData.upcomingEvents.events?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => handleRemoveArrayItem('upcomingEvents', 'events', idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-1/3 shrink-0">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block">Event Poster/Image</label>
                    <LogoUploader
                      label="Upload Poster"
                      currentImage={item.img}
                      onImageSelected={(url) => handleUpdateArray('upcomingEvents', 'events', idx, 'img', url)}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Event Title</label>
                      <input type="text" value={item.title} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'title', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. CELEBRITY VISIT" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Event Description</label>
                      <textarea rows={3} value={item.description} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'description', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Date</label>
                        <input type="text" value={item.date} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'date', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. 12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Month</label>
                        <input type="text" value={item.month} onChange={e => handleUpdateArray('upcomingEvents', 'events', idx, 'month', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. OCT" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionForm>

      {/* Highlighted Programs Carousel */}
      <SectionForm title="Highlighted Programs (3D Carousel)">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.highlightedPrograms.heading} onChange={e => setFormData({ ...formData, highlightedPrograms: { ...formData.highlightedPrograms, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={() => handleAddArrayItem('highlightedPrograms', 'images', { img: '', alt: '' })} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.highlightedPrograms.images?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Image #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('highlightedPrograms', 'images', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <LogoUploader
                  currentImage={item.img}
                  onImageSelected={(url) => handleUpdateArray('highlightedPrograms', 'images', idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionForm>
      
      {/* Essence of Culture */}
      <SectionForm title="Essence of Culture (Photo Collage)">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.essenceOfCulture.heading} onChange={e => setFormData({ ...formData, essenceOfCulture: { ...formData.essenceOfCulture, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={() => handleAddArrayItem('essenceOfCulture', 'items', { img: '', category: '' })} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.essenceOfCulture.items?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('essenceOfCulture', 'items', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <input type="text" value={item.category} onChange={e => handleUpdateArray('essenceOfCulture', 'items', idx, 'category', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="Category (e.g. Dance)" />
                <LogoUploader
                  currentImage={item.img}
                  onImageSelected={(url) => handleUpdateArray('essenceOfCulture', 'items', idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionForm>
      
      {/* Stay Connected */}
      <SectionForm title="Stay Connected (Posters)">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.stayConnected.heading} onChange={e => setFormData({ ...formData, stayConnected: { ...formData.stayConnected, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleAddArrayItem('stayConnected', 'posters', { img: '' })} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Poster
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.stayConnected.posters?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Poster #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('stayConnected', 'posters', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <LogoUploader
                  currentImage={item.img}
                  onImageSelected={(url) => handleUpdateArray('stayConnected', 'posters', idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionForm>
      
      {/* Moments Captured */}
      <SectionForm title="Moments Captured (Masonry Grid)">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Section Heading</label>
            <input type="text" value={formData.momentsCaptured.heading} onChange={e => setFormData({ ...formData, momentsCaptured: { ...formData.momentsCaptured, heading: e.target.value } })} className="w-full max-w-md p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleAddArrayItem('momentsCaptured', 'images', { img: '' })} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Moment
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.momentsCaptured.images?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-md border border-gray-200 bg-gray-50 relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Moment #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('momentsCaptured', 'images', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <LogoUploader
                  currentImage={item.img}
                  onImageSelected={(url) => handleUpdateArray('momentsCaptured', 'images', idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionForm>

      {/* Custom Footer Graphic */}
      <SectionForm title="Custom Footer Graphic">
        <div className="space-y-4">
          <label className="text-xs font-semibold text-gray-500">Footer Banner Image</label>
          <div className="p-4 rounded-md border border-gray-200 bg-gray-50 max-w-sm">
            <LogoUploader
              currentImage={formData.footerGraphic}
              onImageSelected={(url) => setFormData({ ...formData, footerGraphic: url })}
            />
          </div>
        </div>
      </SectionForm>

    </div>
  );
};

export default ManageEventsPage;
