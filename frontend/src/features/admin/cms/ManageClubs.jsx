"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import ClubsSection from '../../facilities/components/ClubsSection';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import AdminItemCard from './components/AdminItemCard';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageClubs = () => {
  const [clubs, setClubs] = useState({ heading: '', description: '', items: [] });
  
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
      if (data && data.clubs) {
        setClubs(data.clubs);
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
      message: 'Are you sure you want to save these changes?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/facilities-page', { clubs });
          Toast.fire({ icon: 'success', title: 'Clubs settings saved successfully!' });
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
        setClubs({
          heading: 'Clubs And Association',
          description: 'Extracurricular activities at KSBM encompass academic clubs, professional societies, and cultural organizations that play an instrumental role in shaping holistic development.',
          items: [
            { title: 'Cultural Club', image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2070&auto=format&fit=crop' },
            { title: 'Sports Club', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop' },
            { title: 'Health Club', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }
          ]
        });
        Toast.fire({ icon: 'info', title: 'Settings reset to default.' });
      }
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...clubs.items];
    newItems[index][field] = value;
    setClubs({ ...clubs, items: newItems });
  };

  const addItem = () => {
    setClubs({ ...clubs, items: [...clubs.items, { title: '', description: '', image: '' }] });
  };

  const removeItem = (index) => {
    const newItems = [...clubs.items];
    newItems.splice(index, 1);
    setClubs({ ...clubs, items: newItems });
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Clubs & Association Settings"
        description="Manage the clubs grid section."
        onSave={handleSave}
        onReset={handleResetToDefault}
        onPreview={() => setIsPreviewModalOpen(true)}
        isSaving={isSaving}
        isUploading={isUploading}
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
              <ClubsSection data={clubs} />
            </div>
          </div>
        </div>
      )}

      <SectionForm
        title="Text Content"
        description="Main heading and description for the clubs section"
      >
        <div className="space-y-6">
          <div className="max-w-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Heading</label>
            <input
              type="text"
              value={clubs.heading}
              onChange={(e) => setClubs({ ...clubs, heading: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div className="max-w-3xl">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Description</label>
            <textarea
              rows="3"
              value={clubs.description}
              onChange={(e) => setClubs({ ...clubs, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            />
          </div>
        </div>
      </SectionForm>

      <SectionForm
        title="Clubs List"
        description="Add and manage the clubs featured in this section"
        actionButton={
          <button onClick={addItem} className="text-sm font-semibold text-primary flex items-center bg-primary/10 px-3.5 py-2 rounded-lg hover:bg-primary/20 transition-colors">
            <Plus className="w-4 h-4 mr-1.5" /> Add Club
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs.items.map((item, idx) => (
            <AdminItemCard
              key={idx}
              title={item.title || `Club #${idx + 1}`}
              onDelete={() => removeItem(idx)}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Club Name</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Sports Club"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Short Description</label>
                  <textarea
                    rows="2"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Club overview displayed on card hover..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image</label>
                  <SingleImageUploader 
                    imageUrl={item.image} 
                    onUploadComplete={(url) => handleItemChange(idx, 'image', url)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Club Image"
                  />
                </div>

                <div className="pt-3 border-t border-gray-200/60">
                  {item._id ? (
                    <Link 
                      href={`/admin/cms/facilities/clubs/${item._id}`}
                      className="inline-flex items-center justify-center w-full bg-[#f8f9fa] border border-[#d9dee3] text-[#697a8d] hover:bg-primary/10 hover:text-primary hover:border-primary/20 px-4 py-2 rounded-md font-semibold text-sm transition-colors"
                    >
                      Manage Page Details
                    </Link>
                  ) : (
                    <div className="text-center text-xs font-semibold text-amber-600 bg-amber-50 py-2 rounded-md border border-amber-100">
                      Save changes to manage details
                    </div>
                  )}
                </div>
              </div>
            </AdminItemCard>
          ))}
          {clubs.items.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 font-medium">
              No clubs added yet. Click "Add Club" to get started.
            </div>
          )}
        </div>
      </SectionForm>
    </div>
  );
};

export default ManageClubs;
