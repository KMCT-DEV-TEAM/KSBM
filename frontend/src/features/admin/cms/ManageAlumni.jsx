"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { confirmAction } from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import AdminItemCard from './components/AdminItemCard';
import { Plus, Trash2, GraduationCap, Calendar, Users, Image as ImageIcon, Sparkles } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const defaultAlumniData = {
  hero: {
    title: 'Alumni',
    subtitle: 'Our alumni stand at the forefront of global business, driving innovation through principled leadership and strategic excellence across industries worldwide.',
    backgroundImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
  },
  legacy: {
    subtitle: 'KSBM ALUMNI NETWORK / OUR LEGACY',
    title: 'Legacy of Excellence',
    description1: 'Since our inception, the KMCT School of Business Management has been a beacon of academic brilliance and professional development. Our alumni embody our mission, leading top organizations and shaping global markets across diverse industries.',
    description2: 'With over three decades of history, we take immense pride in having trained thousands of remarkable business leaders. The KMCT Alumni Association is dedicated to fostering lifelong relationships between the institution and its graduates.',
    mainImage: '/assets/Images/image 60.png',
    secondaryImage: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1000&auto=format&fit=crop',
    floatingQuote: '"Shaping the future through principled leadership."',
    stat1Value: '30k+',
    stat1Label: 'Global Alumni',
    stat2Value: '150+',
    stat2Label: 'Industry Leaders'
  },
  events: {
    heading: 'ALUMNI EVENTS',
    items: [
      {
        title: 'Global Alumni Reunion 2024',
        description: 'Join fellow graduates for a weekend of celebration, networking, and keynotes from industry leaders.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
        date: 'December 2024'
      },
      {
        title: 'Med Tech Innovation Summit',
        description: 'An exclusive panel discussing the intersection of healthcare management and AI technology.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
        date: 'October 2024'
      },
      {
        title: 'Annual Alumni Sports Meet',
        description: 'Relive campus memories with friendly cricket and football tournaments at KMCT grounds.',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
        date: 'August 2024'
      },
      {
        title: 'Global Alumni Reunion 2023',
        description: 'A look back at our memorable digital and physical gathering celebrating 20 years of excellence.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
        date: 'December 2023'
      }
    ]
  },
  notableAlumni: {
    subtitle: 'OUR PRIDE',
    heading: 'Notable Alumni',
    items: [
      { name: 'Dr. Arvind Nair', role: 'CEO, Global Corporate', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
      { name: 'Dr. Arvind Nair', role: 'Director of Strategy, Apex', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
      { name: 'Dr. Arvind Nair', role: 'Founder & MD, FinTech Labs', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
      { name: 'Dr. Arvind Nair', role: 'VP Operations, HealthCorp', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' },
      { name: 'Dr. Arvind Nair', role: 'Managing Partner, Ventures', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' }
    ]
  },
  gallery: {
    heading: 'Captured in Events',
    items: [
      { title: 'Graduation', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
      { title: 'Convocation', image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop' },
      { title: 'Celebration', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop' },
      { title: 'Campus Reunion', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
      { title: 'Ceremony', image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  cta: {
    title: 'Join the KMCT Alumni Network',
    subtitle: 'Stay connected with your alma mater, network with fellow peers, and participate in exclusive leadership and mentoring initiatives.',
    buttonText: 'View Details',
    buttonLink: '#register'
  }
};

const ManageAlumni = () => {
  const [data, setData] = useState(defaultAlumniData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await api.get('/cms/alumni-page');
      if (res && res.hero) {
        setData(res);
      } else {
        setData(defaultAlumniData);
      }
    } catch (error) {
      console.warn('Alumni CMS endpoint not found or error, using default layout:', error.message);
      setData(defaultAlumniData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Alumni Page?',
      message: 'Are you sure you want to save all changes to the Alumni Page?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/alumni-page', data);
          Toast.fire({ icon: 'success', title: 'Alumni page saved successfully!' });
        } catch (error) {
          console.error('Error saving alumni page:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save changes.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Default?',
      message: 'This will reset all text, images, and lists to initial defaults.',
      confirmText: 'Yes, reset it!',
      variant: 'warning',
      action: () => {
        setData(defaultAlumniData);
        Toast.fire({ icon: 'info', title: 'Reset to default preview.' });
      }
    });
  };

  // Section Update Helper
  const updateSection = (sectionName, key, value) => {
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [key]: value
      }
    }));
  };

  // Array Handlers
  const addArrayItem = (sectionName, emptyObj) => {
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        items: [...(prev[sectionName].items || []), emptyObj]
      }
    }));
  };

  const updateArrayItem = (sectionName, index, key, value) => {
    setData(prev => {
      const newItems = [...prev[sectionName].items];
      newItems[index] = { ...newItems[index], [key]: value };
      return {
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          items: newItems
        }
      };
    });
  };

  const removeArrayItem = (sectionName, index) => {
    setData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        items: prev[sectionName].items.filter((_, i) => i !== index)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title="Alumni Page Settings"
        description="Manage the Hero section, Legacy of Excellence, Events, Notable Alumni, Gallery, and CTA."
        onSave={handleSave}
        onReset={handleResetToDefault}
        isSaving={isSaving}
        previewUrl="/alumni"
      />

      {/* 1. HERO SECTION */}
      <SectionForm
        title="1. Hero Section"
        description="Customize the full-screen header and banner text."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Heading Title</label>
              <input
                type="text"
                value={data.hero?.title || ''}
                onChange={(e) => updateSection('hero', 'title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
                placeholder="e.g. Alumni"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hero Subtitle</label>
              <textarea
                rows="3"
                value={data.hero?.subtitle || ''}
                onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
                placeholder="Brief intro..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hero Background Image</label>
            <SingleImageUploader
              imageUrl={data.hero?.backgroundImage || ''}
              onUploadComplete={(url) => updateSection('hero', 'backgroundImage', url)}
              onUploadStateChange={setIsUploading}
            />
          </div>
        </div>
      </SectionForm>

      {/* 2. LEGACY OF EXCELLENCE */}
      <SectionForm
        title="2. Legacy of Excellence (2nd Section)"
        description="Manage the dual overlapping images, quotes, and impact numbers."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Small Subtitle</label>
              <input
                type="text"
                value={data.legacy?.subtitle || ''}
                onChange={(e) => updateSection('legacy', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Main Heading</label>
              <input
                type="text"
                value={data.legacy?.title || ''}
                onChange={(e) => updateSection('legacy', 'title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Paragraph 1</label>
              <textarea
                rows="4"
                value={data.legacy?.description1 || ''}
                onChange={(e) => updateSection('legacy', 'description1', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Paragraph 2</label>
              <textarea
                rows="4"
                value={data.legacy?.description2 || ''}
                onChange={(e) => updateSection('legacy', 'description2', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">First Image (Bottom/Left - e.g. image 60)</label>
              <SingleImageUploader
                imageUrl={data.legacy?.mainImage || ''}
                onUploadComplete={(url) => updateSection('legacy', 'mainImage', url)}
                onUploadStateChange={setIsUploading}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Second Image (Top/Right Overlapping)</label>
              <SingleImageUploader
                imageUrl={data.legacy?.secondaryImage || ''}
                onUploadComplete={(url) => updateSection('legacy', 'secondaryImage', url)}
                onUploadStateChange={setIsUploading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Floating Quote Badge Text</label>
              <input
                type="text"
                value={data.legacy?.floatingQuote || ''}
                onChange={(e) => updateSection('legacy', 'floatingQuote', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stat 1 (Value & Label)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={data.legacy?.stat1Value || ''}
                  onChange={(e) => updateSection('legacy', 'stat1Value', e.target.value)}
                  className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder="30k+"
                />
                <input
                  type="text"
                  value={data.legacy?.stat1Label || ''}
                  onChange={(e) => updateSection('legacy', 'stat1Label', e.target.value)}
                  className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder="Global Alumni"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stat 2 (Value & Label)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={data.legacy?.stat2Value || ''}
                  onChange={(e) => updateSection('legacy', 'stat2Value', e.target.value)}
                  className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder="150+"
                />
                <input
                  type="text"
                  value={data.legacy?.stat2Label || ''}
                  onChange={(e) => updateSection('legacy', 'stat2Label', e.target.value)}
                  className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder="Industry Leaders"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionForm>

      {/* 3. ALUMNI EVENTS */}
      <SectionForm
        title="3. Alumni Events"
        description="Manage event cards and reunion gatherings."
        headerAction={
          <button
            type="button"
            onClick={() => addArrayItem('events', { title: 'New Alumni Event', description: 'Event summary details...', date: 'October 2024', image: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        }
      >
        <div className="space-y-6">
          <div className="max-w-md">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Header Title</label>
            <input
              type="text"
              value={data.events?.heading || ''}
              onChange={(e) => updateSection('events', 'heading', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {data.events?.items?.map((item, idx) => (
              <AdminItemCard
                key={idx}
                title={`Event #${idx + 1}`}
                onDelete={() => removeArrayItem('events', idx)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Event Image</label>
                    <SingleImageUploader
                      imageUrl={item.image || ''}
                      onUploadComplete={(url) => updateArrayItem('events', idx, 'image', url)}
                      onUploadStateChange={setIsUploading}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Event Title</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateArrayItem('events', idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date/Tag</label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => updateArrayItem('events', idx, 'date', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
                    <textarea
                      rows="2"
                      value={item.description || ''}
                      onChange={(e) => updateArrayItem('events', idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>
              </AdminItemCard>
            ))}
          </div>
        </div>
      </SectionForm>

      {/* 4. NOTABLE ALUMNI */}
      <SectionForm
        title="4. Notable Alumni (Our Pride)"
        description="Add, update, or remove leadership profiles and distinguished graduates."
        headerAction={
          <button
            type="button"
            onClick={() => addArrayItem('notableAlumni', { name: 'Dr. New Alumni', role: 'Executive Leadership', image: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Profile
          </button>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Subtitle</label>
              <input
                type="text"
                value={data.notableAlumni?.subtitle || ''}
                onChange={(e) => updateSection('notableAlumni', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Heading</label>
              <input
                type="text"
                value={data.notableAlumni?.heading || ''}
                onChange={(e) => updateSection('notableAlumni', 'heading', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {data.notableAlumni?.items?.map((person, idx) => (
              <AdminItemCard
                key={idx}
                title={`Alumni Profile #${idx + 1}`}
                onDelete={() => removeArrayItem('notableAlumni', idx)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Portrait Image</label>
                    <SingleImageUploader
                      imageUrl={person.image || ''}
                      onUploadComplete={(url) => updateArrayItem('notableAlumni', idx, 'image', url)}
                      onUploadStateChange={setIsUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={person.name || ''}
                      onChange={(e) => updateArrayItem('notableAlumni', idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role / Batch</label>
                    <input
                      type="text"
                      value={person.role || ''}
                      onChange={(e) => updateArrayItem('notableAlumni', idx, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>
              </AdminItemCard>
            ))}
          </div>
        </div>
      </SectionForm>

      {/* 5. GALLERY */}
      <SectionForm
        title="5. Captured in Events (Gallery Collage)"
        description="Manage the gallery images that appear inside the collage grid."
        headerAction={
          <button
            type="button"
            onClick={() => addArrayItem('gallery', { title: 'New Event Photo', image: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        }
      >
        <div className="space-y-6">
          <div className="max-w-md">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Gallery Section Heading</label>
            <input
              type="text"
              value={data.gallery?.heading || ''}
              onChange={(e) => updateSection('gallery', 'heading', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {data.gallery?.items?.map((item, idx) => (
              <AdminItemCard
                key={idx}
                title={`Gallery Slot #${idx + 1}`}
                onDelete={() => removeArrayItem('gallery', idx)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Photo Image</label>
                    <SingleImageUploader
                      imageUrl={item.image || ''}
                      onUploadComplete={(url) => updateArrayItem('gallery', idx, 'image', url)}
                      onUploadStateChange={setIsUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Photo Label/Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateArrayItem('gallery', idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                      placeholder="e.g. Graduation"
                    />
                  </div>
                </div>
              </AdminItemCard>
            ))}
          </div>
        </div>
      </SectionForm>

      {/* 6. BOTTOM CTA */}
      <SectionForm
        title="6. Join the KMCT Alumni Network (CTA)"
        description="Customize the bottom call-to-action card and button."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">CTA Heading</label>
              <input
                type="text"
                value={data.cta?.title || ''}
                onChange={(e) => updateSection('cta', 'title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Button Text</label>
                <input
                  type="text"
                  value={data.cta?.buttonText || ''}
                  onChange={(e) => updateSection('cta', 'buttonText', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Button Link</label>
                <input
                  type="text"
                  value={data.cta?.buttonLink || ''}
                  onChange={(e) => updateSection('cta', 'buttonLink', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">CTA Subtitle Description</label>
            <textarea
              rows="2"
              value={data.cta?.subtitle || ''}
              onChange={(e) => updateSection('cta', 'subtitle', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            />
          </div>
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageAlumni;
