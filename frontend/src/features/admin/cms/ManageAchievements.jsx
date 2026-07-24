"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AdminSkeleton from './components/AdminSkeleton';
import AchievementsPreview from '../../home/components/AchievementsSection';
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

const ManageAchievements = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  const [achievements, setAchievements] = useState([]);
  
  const [showSubheading, setShowSubheading] = useState(true);
  const [showHeading, setShowHeading] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });

  // Modal State
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(-1);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/achievements');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      setAchievements(data.achievements || []);
      setShowSubheading(data.showSubheading ?? true);
      setShowHeading(data.showHeading ?? true);
      setShowAchievements(data.showAchievements ?? true);
    } catch (error) {
      console.error('Error fetching achievements settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load achievements settings.' });
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
          const finalAchievements = await Promise.all(achievements.map(async (item) => {
            let newItem = { ...item };
            if (newItem.imageFile) {
              const url = await uploadFile(newItem.imageFile, '/upload/home');
              newItem.image = url;
              delete newItem.imageFile;
            }
            return newItem;
          }));

          await api.put('/cms/achievements', {
            subheading, heading, achievements: finalAchievements, showSubheading, showHeading, showAchievements
          });
          
          await executeDeletions();
          setAchievements(finalAchievements);
          Toast.fire({ icon: 'success', title: 'Achievements section saved successfully!' });
        } catch (error) {
          console.error('Error saving achievements settings:', error);
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
      setSubheading('College Achievements');
      setHeading('Awards and Achievements');
      setShowSubheading(true);
      setShowHeading(true);
      setShowAchievements(true);
      setAchievements([
        {
          id: Date.now().toString() + '1',
          category: 'Academics',
          date: 'Oct 30, 2024',
          title: 'National Research Excellence Award',
          description: 'Recognizing outstanding contributions to sustainable technology research.',
          image: '/assets/Images/Home/achievement_award.png'
        },
        {
          id: Date.now().toString() + '2',
          category: 'Sports',
          date: 'Oct 25, 2024',
          title: 'Championship Victory in Inter-University League',
          description: 'Our varsity team secures the gold in the regional finals.',
          image: '/assets/Images/Home/achievement_sports.png'
        },
        {
          id: Date.now().toString() + '3',
          category: 'Community',
          date: 'Oct 20, 2024',
          title: 'Social Impact Leadership Award',
          description: 'Honoring our student volunteers for their dedication to local literacy programs.',
          image: '/assets/Images/Home/achievement_poster.png'
        }
      ]);
      achievements.forEach(item => {
        if (item.image) {
          const isDefaultImage = ['/assets/Images/Home/achievement_award.png', '/assets/Images/Home/achievement_sports.png', '/assets/Images/Home/achievement_poster.png'].includes(item.image);
          if (!isDefaultImage) {
            markForDeletion(item.image);
          }
        }
      });
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Modal Handlers
  const openAddAchievementModal = () => {
    setEditingAchievementIndex(-1);
    setCurrentAchievement({ id: `ach-${Date.now()}`, title: '', category: '', date: '', description: '', image: '' });
    setIsAchievementModalOpen(true);
  };

  const openEditAchievementModal = (index) => {
    setEditingAchievementIndex(index);
    setCurrentAchievement({ ...achievements[index] });
    setIsAchievementModalOpen(true);
  };

  const closeAchievementModal = () => {
    setIsAchievementModalOpen(false);
    setCurrentAchievement(null);
  };

  const saveAchievementFromModal = async () => {
    if (!currentAchievement.title?.trim() || !currentAchievement.category?.trim() || !currentAchievement.date?.trim() || !currentAchievement.description?.trim() || !currentAchievement.image) {
      Toast.fire({ icon: 'error', title: 'All fields and image are required' });
      return;
    }

    await confirmAction({
      title: editingAchievementIndex === -1 ? 'Add Achievement?' : 'Update Achievement?',
      message: 'Are you sure you want to save these details?',
      confirmText: 'Yes, save it',
      variant: 'primary',
      action: async () => {
        const newItems = [...achievements];
        if (editingAchievementIndex === -1) {
          newItems.unshift(currentAchievement);
        } else {
          newItems[editingAchievementIndex] = currentAchievement;
        }
        setAchievements(newItems);
        closeAchievementModal();
        Toast.fire({ icon: 'info', title: 'Achievement updated locally. Click Save Changes to apply.' });
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

    const newItems = [...achievements];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setAchievements(newItems);
  };

  const handleDeleteAchievement = async (id) => {
    await confirmAction({
      title: 'Remove Achievement?',
      message: 'Are you sure you want to remove this achievement?',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const achievementToDelete = achievements.find(item => item.id === id || item._id === id);
        if (achievementToDelete && achievementToDelete.image) {
          markForDeletion(achievementToDelete.image);
        }
        
        const updatedAchievements = achievements.filter(item => item.id !== id && item._id !== id);
        setAchievements(updatedAchievements);
        Toast.fire({ icon: 'info', title: 'Achievement removed locally. Click Save Changes to apply.' });
      }
    });
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Achievements Settings"
        description="Manage the achievements displayed on the home page."
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
              <AchievementsPreview previewData={{
                subheading, heading, achievements, showSubheading, showHeading, showAchievements, previewDevice: previewMode
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Add/Edit Modal */}
      {isAchievementModalOpen && currentAchievement && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#566A7F]">
                {editingAchievementIndex === -1 ? 'Add New Achievement' : 'Edit Achievement'}
              </h2>
              <button
                onClick={closeAchievementModal}
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
                    value={currentAchievement.title}
                    onChange={(e) => setCurrentAchievement({...currentAchievement, title: e.target.value})}
                    placeholder="e.g. National Research Excellence Award"
                    maxLength={50}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentAchievement.title?.length || 0} / 50
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Category</label>
                  <input
                    type="text"
                    value={currentAchievement.category}
                    onChange={(e) => setCurrentAchievement({...currentAchievement, category: e.target.value})}
                    placeholder="e.g. Academics"
                    maxLength={20}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentAchievement.category?.length || 0} / 20
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Date</label>
                  <input
                    type="text"
                    value={currentAchievement.date}
                    onChange={(e) => setCurrentAchievement({...currentAchievement, date: e.target.value})}
                    placeholder="e.g. Oct 30, 2024"
                    maxLength={20}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentAchievement.date?.length || 0} / 20
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description</label>
                  <textarea
                    value={currentAchievement.description}
                    onChange={(e) => setCurrentAchievement({...currentAchievement, description: e.target.value})}
                    rows={3}
                    placeholder="Enter description here..."
                    maxLength={250}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentAchievement.description?.length || 0} / 250
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Image</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                    <LogoUploader
                      currentLogoUrl={currentAchievement.image}
                      onUploadSuccess={(url, file) => {
                        if (file) {
                          if (currentAchievement.image) markForDeletion(currentAchievement.image);
                          setCurrentAchievement({...currentAchievement, image: url, imageFile: file});
                        } else if (url === '') {
                          if (currentAchievement.image) markForDeletion(currentAchievement.image);
                          setCurrentAchievement({...currentAchievement, image: '', imageFile: null});
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
                onClick={closeAchievementModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveAchievementFromModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Achievement
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
                placeholder="e.g. College Achievements"
                maxLength={20}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {subheading?.length || 0} / 20
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
                placeholder="e.g. Awards and Achievements"
                maxLength={30}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {heading?.length || 0} / 30
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Builder */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Achievements Items</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showAchievements} onChange={(e) => setShowAchievements(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Achievements Section</span>
              </label>
            </div>
            <button
              onClick={openAddAchievementModal}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((item, index) => (
              <div 
                key={item.id || item._id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-move"
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
                  <div className="absolute top-2 left-2 bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h4 className="font-bold text-[#566A7F] text-sm line-clamp-2">{item.title || '(Unnamed)'}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.date}</p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">{item.description}</p>
                  
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditAchievementModal(index)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(item.id || item._id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {achievements.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No achievements added yet.</p>
                <button
                  onClick={openAddAchievementModal}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Click here to add your first achievement
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

export default ManageAchievements;
