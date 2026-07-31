"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import { uploadDeferredImage } from './utils/uploadHelper';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import AdminItemCard from './components/AdminItemCard';
import AdminModal from './components/AdminModal';
import { Pencil } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const getDefaultImage = (title) => {
  if (title === 'Cultural Club') return 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2070&auto=format&fit=crop';
  if (title === 'Sports Club') return '/assets/Images/fecilities/sports.jpg';
  if (title === 'Health Club') return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop';
  return '';
};

const ManageClubs = () => {
  const [clubs, setClubs] = useState({ heading: '', description: '', items: [], showSection: true });
  const [deletedImages, setDeletedImages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, index: -1, data: null });

  const iframeRef = React.useRef(null);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      const payload = {
        type: 'LIVE_PREVIEW_UPDATE',
        data: { clubs },
        activeTab: 'clubs'
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
  }, [isPreviewModalOpen, clubs]);

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
          // Process fully deleted clubs
          for (const url of deletedImages) {
            try {
              if (url && !url.startsWith('http')) {
                await api.delete('/upload', { data: { fileUrl: url }, hideLoader: true });
              }
            } catch (err) { console.warn(err); }
          }

          // Process deferred uploads inside clubs.items
          const processedItems = await Promise.all(clubs.items.map(async (item) => {
            const finalImageUrl = await uploadDeferredImage(item.image, '/upload/facilities');
            return {
              ...item,
              image: finalImageUrl
            };
          }));

          const payload = {
            ...clubs,
            items: processedItems
          };

          await api.put('/cms/facilities-page', { clubs: payload });

          setClubs(payload);
          setDeletedImages([]);
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
            { title: 'Sports Club', image: '/assets/Images/fecilities/sports.jpg' },
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

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItemIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const newItems = [...clubs.items];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    setClubs({ ...clubs, items: newItems });
  };

  const openModal = (index = -1) => {
    const initialData = index >= 0 ? { ...clubs.items[index] } : { title: '', description: '', image: '' };
    setModalConfig({ isOpen: true, index, data: initialData });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, index: -1, data: null });
  };

  const saveModal = () => {
    const { index, data } = modalConfig;
    const newItems = [...clubs.items];

    if (index >= 0) newItems[index] = data;
    else newItems.push(data);

    setClubs({ ...clubs, items: newItems });
    closeModal();
  };

  const removeItem = async (index) => {
    await confirmAction({
      title: 'Remove Club?',
      message: 'Are you sure you want to remove this club?',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const item = clubs.items[index];
        const oldUrl = typeof item.image === 'object' ? item.image.oldUrl : item.image;

        // Add oldUrl to deletedImages if it's valid and not default
        if (oldUrl && typeof oldUrl === 'string' && !oldUrl.startsWith('http') && oldUrl !== getDefaultImage(item.title)) {
          setDeletedImages(prev => [...prev, oldUrl]);
        }

        const newItems = [...clubs.items];
        newItems.splice(index, 1);
        setClubs({ ...clubs, items: newItems });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

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
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
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

      <SectionForm
        title="Text Content"
        description="Main heading and description for the clubs section"
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={clubs.showSection !== false}
                onChange={(e) => setClubs({ ...clubs, showSection: e.target.checked })}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${clubs.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${clubs.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {clubs.showSection !== false ? 'Visible' : 'Hidden'}
            </span>
          </label>
        </div>
        <div className="space-y-6">
          <div className="max-w-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Heading</label>
            <input
              type="text"
              maxLength={50}
              value={clubs.heading}
              onChange={(e) => setClubs({ ...clubs, heading: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{(clubs.heading || '').length}/50 characters</div>
          </div>
          <div className="max-w-3xl">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Description</label>
            <textarea
              rows="3"
              maxLength={300}
              value={clubs.description}
              onChange={(e) => setClubs({ ...clubs, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{(clubs.description || '').length}/300 characters</div>
          </div>
        </div>
      </SectionForm>

      <SectionForm
        title="Clubs List"
        description="Add and manage the clubs featured in this section"
        actionButton={
          <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
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
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className="cursor-move"
            >
              <div className="flex gap-4 items-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">No Image</div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex gap-2">
                <button
                  onClick={() => openModal(idx)}
                  className="flex-1 inline-flex items-center justify-center text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-primary/20"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Edit Details
                </button>
                {item._id ? (
                  <Link
                    href={`/admin/cms/facilities/clubs/${item._id}`}
                    className="flex-1 inline-flex items-center justify-center text-white bg-primary hover:bg-[#151c48] shadow-sm px-3 py-1.5 rounded-md font-semibold text-xs transition-all"
                  >
                    Manage Page
                  </Link>
                ) : (
                  <div className="flex-1 text-center text-[10px] font-semibold text-amber-600 bg-amber-50 py-1.5 rounded-md border border-amber-100 flex items-center justify-center">
                    Save to manage page
                  </div>
                )}
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

      <AdminModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.index >= 0 ? 'Edit Club' : 'Add Club'}
        onSave={saveModal}
        isSaveDisabled={
          !modalConfig.data?.title?.trim() ||
          !modalConfig.data?.description?.trim() ||
          !modalConfig.data?.image
        }
      >
        <div className="space-y-4">
          <SingleImageUploader
            imageUrl={modalConfig.data?.image}
            defaultImage={getDefaultImage(modalConfig.data?.title)}
            uploadEndpoint="/upload/facilities"
            deferredUpload={true}
            onUploadComplete={(url) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, image: url } })}
            onUploadStateChange={setIsUploading}
            label="Upload Club Image *"
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Club Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              maxLength={50}
              value={modalConfig.data?.title || ''}
              onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, title: e.target.value } })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Sports Club"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description <span className="text-red-500">*</span></label>
            <textarea
              rows="3"
              maxLength={150}
              value={modalConfig.data?.description || ''}
              onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, description: e.target.value } })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Club overview displayed on card hover..."
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default ManageClubs;
