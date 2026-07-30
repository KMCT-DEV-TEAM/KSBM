"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Pencil, X, Eye, Monitor, Smartphone, Tablet, FileText, Image as ImageIcon, LayoutTemplate, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { uploadDeferredImage } from './utils/uploadHelper';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import AdminModal from './components/AdminModal';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const defaultBlogsData = {
  hero: {
    title: 'Insights & Blogs',
    subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
    backgroundImage: '/assets/Images/blogs/hero-bg.jpg'
  },
  blogs: []
};

const ManageBlogsPage = () => {
  const [data, setData] = useState(defaultBlogsData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [activeTab, setActiveTab] = useState('hero');
  const iframeRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({});

  // Details View State
  const [editingDetailsIndex, setEditingDetailsIndex] = useState(null);
  const [editingDetailsData, setEditingDetailsData] = useState(null);

  const tabs = [
    { id: 'hero', label: 'Hero Configuration', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'blogs', label: 'Blog Articles', icon: <FileText className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await api.get('/cms/blogs-page');
      if (res && res.hero) {
        if (res.blogs && Array.isArray(res.blogs)) {
          res.blogs = res.blogs.map(item => ({ 
            ...item, 
            uuid: `blog-${Math.random().toString(36).substr(2, 9)}` 
          }));
        }
        setData(res);
      } else {
        setData(defaultBlogsData);
      }
    } catch (error) {
      console.warn('Blogs CMS endpoint not found or error, using default layout:', error.message);
      setData(defaultBlogsData);
    } finally {
      setIsLoading(false);
    }
  };

  const isDefaultImage = (url) => {
    if (!url) return true;
    return url.includes('unsplash.com') || url.includes('/assets/Images/');
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to publish these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          if (imagesToDelete.length > 0) {
            await Promise.allSettled(
              imagesToDelete
                .filter(url => !isDefaultImage(url))
                .map(async (url) => {
                  try {
                    const filename = url.split('/').pop();
                    await api.delete(`/upload/blogs/${filename}`);
                  } catch (e) {
                    console.error('Failed to delete image:', url, e);
                  }
                })
            );
            setImagesToDelete([]);
          }

          // Process deferred uploads
          const newHeroBgImage = await uploadDeferredImage(data.hero?.backgroundImage, '/upload/blogs');

          const newBlogs = await Promise.all((data.blogs || []).map(async (blog) => {
            const newImage = await uploadDeferredImage(blog.image, '/upload/blogs');
            const newSections = await Promise.all((blog.sections || []).map(async (sec) => ({
              ...sec,
              inlineImage: await uploadDeferredImage(sec.inlineImage, '/upload/blogs')
            })));
            return {
              ...blog,
              image: newImage,
              sections: newSections
            };
          }));

          const cleanData = JSON.parse(JSON.stringify({ ...data, hero: { ...data.hero, backgroundImage: newHeroBgImage }, blogs: newBlogs }));
          if (cleanData.blogs) {
            cleanData.blogs = cleanData.blogs.map(b => {
              const { uuid, _id, ...rest } = b;
              return rest;
            });
          }

          await api.put('/cms/blogs-page', cleanData);
          Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
        } catch (error) {
          console.error('Error saving blogs page settings:', error);
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
        setData(defaultBlogsData);
        setImagesToDelete([]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const handleDataChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Reordering
  const handleReorderBlogs = (newOrder) => {
    setData(prev => ({
      ...prev,
      blogs: newOrder
    }));
  };

  // Modal Handlers
  const openModal = (mode, index = null) => {
    setModalMode(mode);
    setCurrentItemIndex(index);
    if (mode === 'edit-card' && index !== null) {
      setCurrentItem({ ...data.blogs[index] });
    } else {
      setCurrentItem({
        uuid: Math.random().toString(36).substr(2, 9),
        title: '',
        category: 'NEW BLOG',
        filterCategory: 'All Topics',
        excerpt: '',
        lead: 'Welcome to our new blog post. In this article, we explore the exciting new trends shaping the future of education and industry.',
        image: '/assets/Images/blogs/default-card.jpg',
        readTime: '5 min read',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: 'KSBM Faculty',
        sections: [
          {
            id: `sec-${Date.now()}`,
            title: 'Introduction',
            content: 'Start writing your article here...',
            isQuote: false,
            inlineImage: ''
          }
        ],
        relatedArticles: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem({});
    setCurrentItemIndex(null);
  };

  const queueForDeletion = (img) => {
    if (!img) return;
    const url = typeof img === 'object' ? img.oldUrl : img;
    if (url && typeof url === 'string' && !url.startsWith('blob:') && !url.startsWith('http') && !isDefaultImage(url)) {
      setImagesToDelete(prev => [...prev, url]);
    }
  };

  const saveModalItem = () => {
    if (!currentItem.title || !currentItem.image) {
      Toast.fire({ icon: 'warning', title: 'Title and Cover Image are required' });
      return;
    }

    const newData = { ...data };
    
    if (modalMode === 'add' || modalMode === 'add-card') {
      newData.blogs = [...(newData.blogs || []), currentItem];
    } else {
      const oldImage = newData.blogs[currentItemIndex].image;
      if (oldImage && oldImage !== currentItem.image) queueForDeletion(oldImage);
      newData.blogs[currentItemIndex] = currentItem;
    }

    setData(newData);
    closeModal();
    Toast.fire({ icon: 'success', title: 'Item saved temporarily. Click Save Changes to publish.' });
  };

  const deleteItem = async (index) => {
    await confirmAction({
      title: 'Delete Item?',
      message: 'Are you sure you want to remove this item? You still need to click "Save Changes" to publish this removal.',
      confirmText: 'Yes, delete it!',
      variant: 'danger',
      action: async () => {
        const itemToDelete = data.blogs[index];
        
        queueForDeletion(itemToDelete.image);
        if (itemToDelete.sections) {
          itemToDelete.sections.forEach(sec => queueForDeletion(sec.inlineImage));
        }
        
        const newData = { ...data };
        newData.blogs.splice(index, 1);
        setData(newData);
        Toast.fire({ icon: 'success', title: 'Item removed temporarily.' });
      }
    });
  };

  const handleAddSection = () => {
    setCurrentItem(prev => ({
      ...prev,
      sections: [
        ...(prev.sections || []), 
        { id: `sec-${Date.now()}`, title: '', content: '', isQuote: false, inlineImage: '' }
      ]
    }));
  };

  const handleUpdateSection = (idx, field, value) => {
    setCurrentItem(prev => {
      const newSections = [...(prev.sections || [])];
      newSections[idx] = { ...newSections[idx], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const handleRemoveSection = (idx) => {
    setCurrentItem(prev => {
      const sectionToRemove = prev.sections[idx];
      queueForDeletion(sectionToRemove.inlineImage);
      return {
        ...prev,
        sections: prev.sections.filter((_, i) => i !== idx)
      };
    });
  };

  const openDetails = (index) => {
    setEditingDetailsIndex(index);
    setEditingDetailsData(JSON.parse(JSON.stringify(data.blogs[index])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveDetails = () => {
    const newData = { ...data };
    newData.blogs[editingDetailsIndex] = editingDetailsData;
    setData(newData);
    setEditingDetailsIndex(null);
    setEditingDetailsData(null);
    Toast.fire({ icon: 'success', title: 'Details saved temporarily. Click Save Changes to publish.' });
  };

  const cancelDetails = () => {
    setEditingDetailsIndex(null);
    setEditingDetailsData(null);
  };

  const handleDetailsUpdateSection = (idx, field, value) => {
    setEditingDetailsData(prev => {
      const newSections = [...(prev.sections || [])];
      newSections[idx] = { ...newSections[idx], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const handleDetailsRemoveSection = (idx) => {
    setEditingDetailsData(prev => {
      const sectionToRemove = prev.sections[idx];
      queueForDeletion(sectionToRemove.inlineImage);
      return {
        ...prev,
        sections: prev.sections.filter((_, i) => i !== idx)
      };
    });
  };

  const handleDetailsAddSection = () => {
    setEditingDetailsData(prev => ({
      ...prev,
      sections: [
        ...(prev.sections || []), 
        { id: `sec-${Date.now()}`, title: '', content: '', isQuote: false, inlineImage: '' }
      ]
    }));
  };

  // Preview Synchronization
  useEffect(() => {
    if (isPreviewModalOpen) {
      const sanitizedBlogs = (data.blogs || []).map(b => ({
        ...b,
        image: typeof b.image === 'object' ? (b.image.previewUrl || b.image.oldUrl) : b.image,
        sections: (b.sections || []).map(s => ({
          ...s,
          inlineImage: typeof s.inlineImage === 'object' ? (s.inlineImage.previewUrl || s.inlineImage.oldUrl) : s.inlineImage
        }))
      }));
      const sanitizedHero = {
        ...data.hero,
        backgroundImage: typeof data.hero?.backgroundImage === 'object' ? (data.hero.backgroundImage.previewUrl || data.hero.backgroundImage.oldUrl) : data.hero?.backgroundImage
      };
      
      const pData = {
        activeTab,
        previewDevice: previewMode,
        hero: sanitizedHero,
        blogs: sanitizedBlogs
      };
      
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'blogs' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-blogs-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-blogs-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, activeTab, data]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="w-full pb-12 space-y-8">
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>
            
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewMode === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src="/blogs?preview=true"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

      {editingDetailsIndex !== null && editingDetailsData ? (
        <div className="w-full max-w-[1200px] mx-auto space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Editing Details: {editingDetailsData.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Manage the content layout of this blog post.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={cancelDetails}
                className="flex items-center justify-center gap-2 flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Blogs
              </button>
              <button 
                onClick={saveDetails}
                className="flex-1 md:flex-none px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-[#111836] transition-colors shadow-md shadow-primary/20"
              >
                Apply Details
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-600">Top Lead Paragraph</label>
              <span className="text-xs text-gray-400">{editingDetailsData?.lead?.length || 0}/300</span>
            </div>
            <textarea
              maxLength={300}
              value={editingDetailsData?.lead || ''}
              onChange={(e) => setEditingDetailsData({ ...editingDetailsData, lead: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
              placeholder="Appears at the very top of the article details..."
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Article Content Sections</h3>
                <p className="text-sm text-gray-500">Build the body of the article by adding paragraphs, quotes, and images.</p>
              </div>
              <button 
                onClick={handleDetailsAddSection}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#111836] transition-colors shadow-md shadow-primary/20"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>

            <div className="space-y-10">
              {(editingDetailsData?.sections || []).map((sec, idx) => (
                <div key={sec.id} className="relative p-6 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 shadow-sm">
                    {idx + 1}
                  </div>
                  <button 
                    onClick={() => handleDetailsRemoveSection(idx)}
                    className="absolute top-4 right-4 p-2 text-red-500 bg-white hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-lg transition-colors shadow-sm"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pr-12 mt-2">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700">
                          <input 
                            type="checkbox" 
                            checked={sec.isQuote} 
                            onChange={(e) => handleDetailsUpdateSection(idx, 'isQuote', e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          Format as Blockquote
                        </label>
                      </div>
                      
                      {!sec.isQuote && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Section Title (Optional)</label>
                          <input
                            type="text"
                            value={sec.title || ''}
                            onChange={(e) => handleDetailsUpdateSection(idx, 'title', e.target.value)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                            placeholder="E.g. The Evolution of Tech"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content / Text</label>
                        <textarea
                          value={sec.content || ''}
                          onChange={(e) => handleDetailsUpdateSection(idx, 'content', e.target.value)}
                          className={`w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[160px] shadow-sm ${sec.isQuote ? 'italic text-lg text-primary/80 font-serif' : ''}`}
                          placeholder="Enter paragraph text..."
                        />
                      </div>
                    </div>
                    
                    {!sec.isQuote && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inline Image (Optional)</label>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[calc(100%-24px)] flex flex-col justify-center">
                          <SingleImageUploader 
                            imageUrl={sec.inlineImage || ''} 
                            uploadEndpoint="/upload/blogs"
                            deferredUpload={true}
                            onUploadComplete={(urlObj) => handleDetailsUpdateSection(idx, 'inlineImage', urlObj)}
                            onUploadStateChange={setIsUploading}
                            label="Upload Inline Image"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(editingDetailsData?.sections || []).length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-sm">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No sections added yet.</p>
                  <p className="mt-1">Click "Add Section" to start writing your blog post.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <PageHeader
            title="Blogs Page Settings"
            description="Manage the Hero section and all individual Blog Articles."
            onPreview={() => setIsPreviewModalOpen(true)}
            onReset={handleResetToDefault}
            onSave={handleSave}
            isSaving={isSaving || isUploading}
          />

      {/* This is empty since we moved isPreviewModalOpen into the return block above */}

      <AnimatePresence mode="wait">
        {activeTab === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SectionForm title="Hero Configuration">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Title</label>
                      <span className="text-[10px] text-gray-400">{data.hero.title?.length || 0}/50</span>
                    </div>
                    <input
                      type="text"
                      maxLength={50}
                      value={data.hero.title}
                      onChange={(e) => handleDataChange('hero', 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtitle</label>
                      <span className="text-[10px] text-gray-400">{data.hero.subtitle?.length || 0}/300</span>
                    </div>
                    <textarea
                      maxLength={300}
                      value={data.hero.subtitle}
                      onChange={(e) => handleDataChange('hero', 'subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Background Image</label>
                  <SingleImageUploader 
                    imageUrl={data.hero.backgroundImage}
                    uploadEndpoint="/upload/blogs"
                    defaultImage="/assets/Images/blogs/hero-bg.jpg"
                    deferredUpload={true}
                    onUploadComplete={(urlObj) => handleDataChange('hero', 'backgroundImage', urlObj)}
                    onUploadStateChange={setIsUploading}
                    label="Upload Hero Background"
                  />
                </div>
              </div>
            </SectionForm>
          </motion.div>
        )}

        {activeTab === 'blogs' && (
          <motion.div
            key="blogs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1e2869]">Blog Articles</h3>
                  <p className="text-sm text-gray-500">Drag to reorder. These articles appear in the grid.</p>
                </div>
                <button
                  onClick={() => openModal('add-card')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#111836] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              </div>

              {(data.blogs || []).length > 0 ? (
                <Reorder.Group 
                  axis="y" 
                  values={data.blogs || []} 
                  onReorder={handleReorderBlogs}
                  className="space-y-4"
                >
                  {data.blogs.map((item, index) => (
                    <DraggableListItem 
                      key={item.uuid} 
                      item={item} 
                      index={index}
                      onEditCard={() => openModal('edit-card', index)}
                      onEditDetails={() => openDetails(index)}
                      onDelete={() => deleteItem(index)}
                    />
                  ))}
                </Reorder.Group>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <LayoutTemplate className="w-12 h-12 mb-3 opacity-20" />
                  <p>No articles found. Add one!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'add-card' ? 'Add New Article' : 'Edit Article Card'}
        onSave={saveModalItem}
        isSaving={isUploading}
      >
        <div className="space-y-6 pb-8">
          {(modalMode === 'add-card' || modalMode === 'edit-card') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-500">Article Title</label>
                  <span className="text-[10px] text-gray-400">{currentItem?.title?.length || 0}/100</span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={currentItem?.title || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                  placeholder="E.g. The Future of AI"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-500">Badge Label</label>
                    <span className="text-[10px] text-gray-400">{currentItem?.category?.length || 0}/30</span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={currentItem?.category || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Filter Topic</label>
                  <select
                    value={currentItem?.filterCategory || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, filterCategory: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                  >
                    <option value="All Topics">All Topics</option>
                    <option value="Career Advice">Career Advice</option>
                    <option value="Industry Trends">Industry Trends</option>
                    <option value="Skill Development">Skill Development</option>
                    <option value="Student Success">Student Success</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-500">Read Time</label>
                    <span className="text-[10px] text-gray-400">{currentItem?.readTime?.length || 0}/20</span>
                  </div>
                  <input
                    type="text"
                    maxLength={20}
                    value={currentItem?.readTime || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, readTime: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-500">Author</label>
                    <span className="text-[10px] text-gray-400">{currentItem?.author?.length || 0}/50</span>
                  </div>
                  <input
                    type="text"
                    maxLength={50}
                    value={currentItem?.author || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, author: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-500">Card Excerpt</label>
                  <span className="text-[10px] text-gray-400">{currentItem?.excerpt?.length || 0}/150</span>
                </div>
                <textarea
                  maxLength={150}
                  value={currentItem?.excerpt || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, excerpt: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[80px]"
                  placeholder="Short description for the blog card..."
                />
              </div>

              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Cover Image</label>
                <SingleImageUploader 
                  imageUrl={currentItem?.image || ''} 
                  uploadEndpoint="/upload/blogs"
                  defaultImage="/assets/Images/blogs/default-card.jpg"
                  deferredUpload={true}
                  onUploadComplete={(urlObj) => setCurrentItem(prev => ({ ...prev, image: urlObj }))}
                  onUploadStateChange={setIsUploading}
                  label="Upload Cover Image"
                />
              </div>
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
};

// Extracted Draggable List Item Component
const DraggableListItem = ({ item, index, onEditCard, onEditDetails, onDelete }) => {
  const controls = useDragControls();

  let displayImg = '/assets/Images/blogs/default-card.jpg';
  if (item?.image) {
    if (typeof item.image === 'string') displayImg = item.image;
    else if (item.image.previewUrl) displayImg = item.image.previewUrl;
  }

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm group hover:border-primary/30 transition-colors"
    >
      <div 
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg touch-none"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
        {item.image ? (
          <img src={displayImg} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">{item.title}</h4>
        <p className="text-sm text-gray-500 truncate">{item.category} • {item.author}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={onEditDetails}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded hover:bg-primary hover:text-white transition-colors"
          title="Manage Details Page"
        >
          <FileText className="w-3.5 h-3.5" /> Manage Details
        </button>
        <button 
          onClick={onEditCard}
          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Edit Card"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
};

export default ManageBlogsPage;
