"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, Monitor, Tablet, Smartphone, X, Image as ImageIcon, FileText, Edit2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('hero');
  const [deletedImages, setDeletedImages] = useState([]);
  const tabsContainerRef = useRef(null);
  const iframeRef = useRef(null);



  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Content', icon: <FileText className="w-4 h-4" /> }
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
        { title: 'Temple', category: 'Cultural', img: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop' },
        { title: 'Camp Fire', category: 'Cultural', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
        { title: 'Mountain', category: 'Cultural', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
        { title: 'The Night Beauty', category: 'Cultural', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0393b?q=80&w=800&auto=format&fit=crop' },
        { title: 'Graduation', category: 'Cultural', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
        { title: 'Study Boy', category: 'Cultural', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' }
      ]
    }
  });

  useEffect(() => {
    if (iframeRef.current && isPreviewModalOpen) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'preview-gallery-data',
        payload: formData
      }, '*');
    }
  }, [formData, isPreviewModalOpen]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'iframe-ready' && event.data?.source === 'gallery' && isPreviewModalOpen) {
        if (iframeRef.current) {
          iframeRef.current.contentWindow.postMessage({
            type: 'preview-gallery-data',
            payload: formData
          }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formData, isPreviewModalOpen]);

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
          
          for (const imgUrl of deletedImages) {
            try {
              await api.delete('/upload', { data: { fileUrl: imgUrl }, hideLoader: true });
            } catch (err) {
              console.error('Failed to delete physical file:', err);
            }
          }
          setDeletedImages([]);

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
          { title: 'Temple', category: 'Cultural', img: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop' },
          { title: 'Camp Fire', category: 'Cultural', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Mountain', category: 'Cultural', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { title: 'The Night Beauty', category: 'Cultural', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0393b?q=80&w=800&auto=format&fit=crop' },
          { title: 'Graduation', category: 'Cultural', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Study Boy', category: 'Cultural', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    };
    setFormData(defaults);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState({ title: '', category: 'Cultural', img: '' });
  const [editIndex, setEditIndex] = useState(null);

  const openAddModal = () => {
    setModalMode('add');
    setCurrentItem({ title: '', category: 'Cultural', img: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (idx, item) => {
    setModalMode('edit');
    setCurrentItem({ ...item, category: item.category || 'Cultural' });
    setEditIndex(idx);
    setIsModalOpen(true);
  };

  const saveModalItem = () => {
    if (!currentItem.img) {
      Toast.fire({ icon: 'error', title: 'Please upload an image first.' });
      return;
    }
    if (!currentItem.title) {
      Toast.fire({ icon: 'error', title: 'Please enter a title.' });
      return;
    }

    setFormData(prev => {
      const updated = [...(prev.gallery.items || [])];
      if (modalMode === 'add') {
        updated.push({ ...currentItem, type: 'image' });
      } else {
        updated[editIndex] = { ...currentItem, type: 'image' };
      }
      return { ...prev, gallery: { ...prev.gallery, items: updated } };
    });
    setIsModalOpen(false);
  };

  const handleRemoveGalleryItem = (index) => {
    confirmAction({
      title: 'Delete Item?',
      message: 'Are you sure you want to delete this gallery item? It will be permanently removed upon saving.',
      confirmText: 'Yes, delete it',
      variant: 'danger',
      action: async () => {
        const item = formData.gallery.items[index];
        if (item.img && !item.img.startsWith('http') && !item.img.startsWith('blob:')) {
          setDeletedImages(prev => [...prev, item.img]);
        }
        setFormData(prev => ({
          ...prev,
          gallery: {
            ...prev.gallery,
            items: prev.gallery.items.filter((_, i) => i !== index)
          }
        }));
      }
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
      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 relative flex items-center">
        <div 
          ref={tabsContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 px-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all snap-start
                ${activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

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
            <div className={`bg-white shadow-xl h-full mt-auto mx-auto transition-all duration-300 overflow-hidden ${previewMode === 'desktop' ? 'w-full max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px] shrink-0' : 'w-[375px] shrink-0'}`}>
              <iframe ref={iframeRef} src="/preview/gallery" className="w-full h-full border-0" title="Gallery Preview" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hero' && (
        <SectionForm title="Hero Banner Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Page Title</label>
                <textarea rows={2} maxLength={50} value={formData.hero.title} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. KSBM Sports Club" />
                <div className="text-right text-xs text-gray-400">{formData.hero.title?.length || 0}/50 characters</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Subtitle / Introductory Text</label>
                <textarea rows={4} maxLength={150} value={formData.hero.subtitle} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none leading-relaxed" placeholder="Enter introductory descriptive text..." />
                <div className="text-right text-xs text-gray-400">{formData.hero.subtitle?.length || 0}/150 characters</div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Hero Background Image</label>
              <LogoUploader
                label="Banner Background"
                currentImage={formData.hero.backgroundImage}
                uploadEndpoint="/upload/gallery"
                defaultImage="image 53.png"
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, backgroundImage: url } }))}
              />
            </div>
          </div>
        </SectionForm>
      )}

      {activeTab === 'gallery' && (
        <SectionForm title="Gallery Settings & Media Grid">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Gallery Badge</label>
                <input type="text" maxLength={20} value={formData.gallery.badge} onChange={e => setFormData({ ...formData, gallery: { ...formData.gallery, badge: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Gallery" />
                <div className="text-right text-xs text-gray-400">{formData.gallery.badge?.length || 0}/20 characters</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Gallery Section Heading</label>
                <input type="text" maxLength={50} value={formData.gallery.heading} onChange={e => setFormData({ ...formData, gallery: { ...formData.gallery, heading: e.target.value } })} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" placeholder="e.g. Moments Captured in Campus" />
                <div className="text-right text-xs text-gray-400">{formData.gallery.heading?.length || 0}/50 characters</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Gallery Items</h4>
              <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {formData.gallery.items?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm relative group hover:border-primary/40 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase">Item #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveGalleryItem(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-30 transition-colors" title="Move Left"><ChevronLeft className="w-4 h-4" /></button>
                      <button onClick={() => moveGalleryItem(idx, 1)} disabled={idx === (formData.gallery.items?.length - 1)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-30 transition-colors" title="Move Right"><ChevronRight className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-gray-200 mx-1"></div>
                      <button onClick={() => openEditModal(idx, item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit Item"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleRemoveGalleryItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Item"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                      {item.img ? (
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100 text-center">
                      <p className="font-semibold text-gray-800 text-sm truncate" title={item.title}>{item.title || 'Untitled Item'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>  
              {(!formData.gallery.items || formData.gallery.items.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                  <p className="text-sm text-gray-500 font-medium">No gallery items added yet.</p>
                </div>
              )}
          </div>
        </SectionForm>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Add Gallery Item' : 'Edit Gallery Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Item Title</label>
                  <span className="text-xs text-gray-400">{currentItem.title?.length || 0}/50 characters</span>
                </div>
                <input type="text" maxLength={50} value={currentItem.title} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all focus:bg-white" placeholder="e.g. Annual Sports Meet" />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
                <select value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all focus:bg-white">
                  <option value="Cultural">Cultural (General Images)</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Upload Image</label>
                <LogoUploader
                  label="Upload Media"
                  currentImage={currentItem.img}
                  uploadEndpoint="/upload/gallery"
                  onUploadSuccess={(url) => setCurrentItem({...currentItem, img: url})}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
              <button onClick={saveModalItem} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-[#151c48] shadow-md transition-colors">{modalMode === 'add' ? 'Add Item' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGalleryPage;
