"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Loader from '../../../components/Loader';
import AchievementsPreview from '../../home/components/AchievementsSection';
import LogoUploader from './components/LogoUploader';

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
    setIsSaving(true);
    try {
      await api.put('/cms/achievements', {
        subheading, heading, achievements, showSubheading, showHeading, showAchievements
      });
      Toast.fire({ icon: 'success', title: 'Achievements section saved successfully!' });
    } catch (error) {
      console.error('Error saving achievements settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setConfirmModal({
      isOpen: true,
      action: 'reset',
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary'
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'reset') {
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
          image: '/assets/Images/achievement_award.png'
        },
        {
          id: Date.now().toString() + '2',
          category: 'Sports',
          date: 'Oct 25, 2024',
          title: 'Championship Victory in Inter-University League',
          description: 'Our varsity team secures the gold in the regional finals.',
          image: '/assets/Images/achievement_sports.png'
        },
        {
          id: Date.now().toString() + '3',
          category: 'Community',
          date: 'Oct 20, 2024',
          title: 'Social Impact Leadership Award',
          description: 'Honoring our student volunteers for their dedication to local literacy programs.',
          image: '/assets/Images/achievement_poster.png'
        }
      ]);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleAddAchievement = () => {
    setAchievements([
      ...achievements,
      {
        id: Date.now().toString(),
        title: 'New Achievement',
        category: 'Category',
        date: 'Date',
        description: 'Short description...',
        image: ''
      }
    ]);
  };

  const handleUpdateAchievement = (id, field, value) => {
    setAchievements(achievements.map(item => 
      (item.id === id || item._id === id) ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteAchievement = async (id) => {
    const updatedAchievements = achievements.filter(item => item.id !== id && item._id !== id);
    setAchievements(updatedAchievements);
    
    try {
      await api.put('/cms/achievements', {
        subheading, heading, achievements: updatedAchievements, showSubheading, showHeading, showAchievements
      });
      Toast.fire({ icon: 'success', title: 'Achievement deleted from database.' });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      Toast.fire({ icon: 'error', title: 'Failed to delete achievement from database.' });
      setAchievements(achievements); // revert on failure
    }
  };

  if (isLoading) {
    return <Loader theme="light" text="Loading Settings..." />;
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Achievements Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the achievements displayed on the home page.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-md font-semibold text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 bg-white text-[#697A8D] px-4 py-2.5 rounded-md font-semibold text-sm border border-[#D9DEE3] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

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
                subheading, heading, achievements, showSubheading, showHeading, showAchievements
              }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        
        {/* Header Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Header Content</h3>
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
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Achievements Builder */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#566A7F]">Achievements Items</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showAchievements} onChange={(e) => setShowAchievements(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Achievements Section</span>
              </label>
            </div>
            <button
              onClick={handleAddAchievement}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>

          <div className="space-y-4">
            {achievements.map((item, index) => (
              <div key={item.id || item._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-6 relative group">
                <button
                  onClick={() => handleDeleteAchievement(item.id || item._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Achievement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-4 w-full md:w-48 shrink-0">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Image</label>
                    <LogoUploader
                      currentLogoUrl={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      onUploadSuccess={(url) => handleUpdateAchievement(item.id || item._id, 'image', url)}
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateAchievement(item.id || item._id, 'title', e.target.value)}
                      placeholder="e.g. National Research Excellence Award"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleUpdateAchievement(item.id || item._id, 'category', e.target.value)}
                      placeholder="e.g. Academics"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Date</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleUpdateAchievement(item.id || item._id, 'date', e.target.value)}
                      placeholder="e.g. Oct 30, 2024"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdateAchievement(item.id || item._id, 'description', e.target.value)}
                      rows={3}
                      placeholder="Enter description here..."
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {achievements.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No achievements added yet. Click "Add Achievement" to create one.
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
