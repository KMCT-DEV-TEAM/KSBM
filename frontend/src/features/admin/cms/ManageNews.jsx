"use client";
import React, { useState, useEffect } from 'react';
import { Save, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AdminSkeleton from './components/AdminSkeleton';
import NewsSectionPreview from '../../home/components/NewsSection';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { useDeferredUpload } from '../../../hooks/useDeferredUpload';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const ManageNews = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  const [articles, setArticles] = useState([]);
  
  const [showSubheading, setShowSubheading] = useState(true);
  const [showHeading, setShowHeading] = useState(true);
  const [showSection, setShowSection] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });

  // Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleIndex, setEditingArticleIndex] = useState(-1);
  const [currentArticle, setCurrentArticle] = useState(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/news');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      
      const fetchedFeatured = data.featuredArticle || null;
      const fetchedSide = data.sideArticles || [];
      const combined = [];
      if (fetchedFeatured) combined.push(fetchedFeatured);
      combined.push(...fetchedSide);
      
      const combinedWithIds = combined.map((item, index) => ({
        ...item,
        id: item.id || item._id || `news-${Date.now()}-${index}`
      }));
      setArticles(combinedWithIds);

      setShowSubheading(data.showSubheading ?? true);
      setShowHeading(data.showHeading ?? true);
      setShowSection(data.showSection ?? true);
    } catch (error) {
      console.error('Error fetching News settings:', error);
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
          const finalArticles = await Promise.all(articles.map(async (item) => {
            let newItem = { ...item };
            if (newItem.imageFile) {
              const url = await uploadFile(newItem.imageFile, '/upload/home');
              newItem.image = url;
              delete newItem.imageFile;
            }
            return newItem;
          }));

          const featuredArticle = finalArticles.length > 0 ? finalArticles[0] : null;
          const sideArticles = finalArticles.length > 1 ? finalArticles.slice(1) : [];

          await api.put('/cms/news', {
            subheading, heading, featuredArticle, sideArticles,
            showSubheading, showHeading, showSection
          }, { hideLoader: true });
          
          await executeDeletions();
          setArticles(finalArticles);
          Toast.fire({ icon: 'success', title: 'News settings saved successfully!' });
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
        const defaults = {
          subheading: 'News and Events',
          heading: 'Latest From KSBM',
          featuredArticle: {
            tag: 'FEATURED',
            date: 'OCTOBER 24, 2024',
            title: 'KSBM National Business Summit 2024: Navigating the AI Frontier',
            description: 'Over 50 industry experts converged at KSBM to discuss the transformative power of AI in modern business management.',
            image: '/assets/Images/Home/news_featured.jpg'
          },
          sideArticles: [
            { date: 'OCTOBER 15, 2024', title: 'KSBM Students Win National HR Conclave 2024', image: '/assets/Images/Home/news_side_1.jpg' },
            { date: 'OCTOBER 08, 2024', title: "Inauguration of the 'Innovate KSBM' Incubation Lab", image: '/assets/Images/Home/news_side_2.jpg' },
            { date: 'SEPTEMBER 28, 2024', title: 'New Global Faculty Partnership with Zurich School of Finance', image: '/assets/Images/Home/news_side_3.jpg' },
            { date: 'AUGUST 12, 2024', title: 'Annual Alumni Meet 2024: Bridging Generations', image: '/assets/Images/Home/news_side_4.jpg' }
          ],
          showSubheading: true,
          showHeading: true,
          showSection: true,
        };

        const defaultImages = [defaults.featuredArticle.image, ...defaults.sideArticles.map(a => a.image)];
        
        articles.forEach(item => {
          if (item.image && !defaultImages.includes(item.image)) {
            markForDeletion(item.image);
          }
        });

        const combinedWithIds = [defaults.featuredArticle, ...defaults.sideArticles].map((item, index) => ({
          ...item,
          id: `news-default-${Date.now()}-${index}`
        }));

        setSubheading(defaults.subheading);
        setHeading(defaults.heading);
        setArticles(combinedWithIds);
        setShowSubheading(defaults.showSubheading);
        setShowHeading(defaults.showHeading);
        setShowSection(defaults.showSection);
        
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Modal Handlers
  const openAddArticleModal = () => {
    setEditingArticleIndex(-1);
    setCurrentArticle({ id: `news-${Date.now()}`, tag: '', title: '', date: '', description: '', image: '' });
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (index) => {
    setEditingArticleIndex(index);
    setCurrentArticle({ ...articles[index] });
    setIsArticleModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsArticleModalOpen(false);
    setCurrentArticle(null);
  };

  const saveArticleFromModal = async () => {
    if (!currentArticle.title?.trim() || !currentArticle.date?.trim() || !currentArticle.image) {
      Toast.fire({ icon: 'error', title: 'Title, Date, and Image are required' });
      return;
    }

    await confirmAction({
      title: editingArticleIndex === -1 ? 'Add Article?' : 'Update Article?',
      message: 'Are you sure you want to save these details?',
      confirmText: 'Yes, save it',
      variant: 'primary',
      action: async () => {
        const newItems = [...articles];
        if (editingArticleIndex === -1) {
          newItems.push(currentArticle);
        } else {
          newItems[editingArticleIndex] = currentArticle;
        }
        setArticles(newItems);
        closeArticleModal();
        Toast.fire({ icon: 'info', title: 'Article updated locally. Click Save Changes to apply.' });
      }
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (dragIndex === dropIndex) return;

    const newItems = [...articles];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setArticles(newItems);
  };

  const handleDeleteArticle = async (id) => {
    await confirmAction({
      title: 'Remove Article?',
      message: 'Are you sure you want to remove this article?',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const articleToDelete = articles.find(item => item.id === id || item._id === id);
        if (articleToDelete && articleToDelete.image) {
          markForDeletion(articleToDelete.image);
        }
        
        const updatedArticles = articles.filter(item => item.id !== id && item._id !== id);
        setArticles(updatedArticles);
        Toast.fire({ icon: 'info', title: 'Article removed locally. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="News & Events Settings"
        description="Manage the featured and side articles displayed on the home page."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <NewsSectionPreview previewData={{
                subheading, 
                heading, 
                featuredArticle: articles.length > 0 ? articles[0] : null, 
                sideArticles: articles.length > 1 ? articles.slice(1) : [], 
                showSubheading, 
                showHeading, 
                showSection, 
                previewDevice: previewMode
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Article Add/Edit Modal */}
      {isArticleModalOpen && currentArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#566A7F]">
                {editingArticleIndex === -1 ? 'Add New Article' : 'Edit Article'}
              </h2>
              <button
                onClick={closeArticleModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title</label>
                  <input
                    type="text"
                    value={currentArticle.title}
                    onChange={(e) => setCurrentArticle({...currentArticle, title: e.target.value})}
                    placeholder="e.g. KSBM National Business Summit 2024"
                    maxLength={100}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentArticle.title?.length || 0} / 100
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Tag (Optional)</label>
                  <input
                    type="text"
                    value={currentArticle.tag || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, tag: e.target.value})}
                    placeholder="e.g. FEATURED"
                    maxLength={20}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentArticle.tag?.length || 0} / 20
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Date</label>
                  <input
                    type="text"
                    value={currentArticle.date}
                    onChange={(e) => setCurrentArticle({...currentArticle, date: e.target.value})}
                    placeholder="e.g. OCTOBER 24, 2024"
                    maxLength={30}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentArticle.date?.length || 0} / 30
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description (Optional)</label>
                  <textarea
                    value={currentArticle.description || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, description: e.target.value})}
                    rows={3}
                    placeholder="Enter description here (used mainly for featured article)..."
                    maxLength={400}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentArticle.description?.length || 0} / 400
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Image</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                    <LogoUploader
                      currentLogoUrl={currentArticle.image}
                      onUploadSuccess={(url, file) => {
                        if (file) {
                          if (currentArticle.image) markForDeletion(currentArticle.image);
                          setCurrentArticle({...currentArticle, image: url, imageFile: file});
                        } else if (url === '') {
                          if (currentArticle.image) markForDeletion(currentArticle.image);
                          setCurrentArticle({...currentArticle, image: '', imageFile: null});
                        }
                      }}
                      deferredMode={true}
                      disableDelete={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeArticleModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveArticleFromModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        
        {/* Header Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Header Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Subheading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showSubheading} onChange={(e) => setShowSubheading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. News and Events"
                maxLength={30}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {subheading?.length || 0} / 30
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Main Heading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showHeading} onChange={(e) => setShowHeading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Latest From KSBM"
                maxLength={40}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {heading?.length || 0} / 40
              </div>
            </div>
          </div>
        </div>

        {/* Articles Builder */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">News Articles</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showSection} onChange={(e) => setShowSection(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Section Entirely</span>
              </label>
            </div>
            <button
              onClick={openAddArticleModal}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Article
            </button>
          </div>

          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg border border-blue-100 mb-6 flex items-start gap-3">
            <div className="mt-0.5">ℹ️</div>
            <div>
              <span className="font-bold">Did you know?</span> You can drag and drop articles to reorder them! The <strong>very first article</strong> in this list will automatically become the large Featured Article on the website.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((item, index) => (
              <div 
                key={item.id || item._id} 
                className={`bg-white border ${index === 0 ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-gray-200 shadow-sm hover:shadow-md'} rounded-xl overflow-hidden transition-all group flex flex-col cursor-move`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="h-40 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest font-semibold">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded cursor-move shadow-sm group-hover:bg-white transition-colors">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className={`absolute top-2 left-2 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${index === 0 ? 'bg-primary' : 'bg-black/60'}`}>
                    {index === 0 ? 'Featured Article' : 'Side Article'}
                  </div>
                  {item.tag && (
                    <div className="absolute bottom-2 left-2 bg-white/90 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {item.tag}
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h4 className="font-bold text-[#566A7F] text-sm line-clamp-2">{item.title || '(Unnamed)'}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.date}</p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 flex-1 mt-1">{item.description}</p>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditArticleModal(index)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(item.id || item._id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {articles.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No articles added yet.</p>
                <button
                  onClick={openAddArticleModal}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Click here to add your first article
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        isSubmitting={isSaving}
      />
    </div>
  );
};

export default ManageNews;
