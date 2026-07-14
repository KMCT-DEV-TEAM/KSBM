"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Loader from '../../../components/Loader';
import RecruitersPreview from '../../home/components/RecruitersSection';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';

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

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [showRecruiters, setShowRecruiters] = useState(true);

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
      const { data } = await api.get('/cms/recruiters');
      setRecruiters(data.recruiters || []);
      setShowRecruiters(data.showRecruiters ?? true);
    } catch (error) {
      console.error('Error fetching recruiters settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load recruiters settings.' });
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
      await api.put('/cms/recruiters', {
        recruiters, showRecruiters
      });
      Toast.fire({ icon: 'success', title: 'Recruiters section saved successfully!' });
    } catch (error) {
      console.error('Error saving recruiters settings:', error);
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
      setShowRecruiters(true);
      setRecruiters([
        {
          id: Date.now().toString() + '1',
          name: 'Infosys',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
        },
        {
          id: Date.now().toString() + '2',
          name: 'Wipro',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
        },
        {
          id: Date.now().toString() + '3',
          name: 'Cognizant',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg'
        },
        {
          id: Date.now().toString() + '4',
          name: 'Google',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
        },
        {
          id: Date.now().toString() + '5',
          name: 'Microsoft',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
        }
      ]);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleAddRecruiter = () => {
    setRecruiters([
      ...recruiters,
      {
        id: Date.now().toString(),
        name: 'New Company',
        logo: ''
      }
    ]);
  };

  const handleUpdateRecruiter = (id, field, value) => {
    setRecruiters(recruiters.map(item => 
      (item.id === id || item._id === id) ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteRecruiter = async (id) => {
    const updatedRecruiters = recruiters.filter(item => item.id !== id && item._id !== id);
    setRecruiters(updatedRecruiters);
    
    try {
      await api.put('/cms/recruiters', {
        recruiters: updatedRecruiters, showRecruiters
      });
      Toast.fire({ icon: 'success', title: 'Recruiter deleted from database.' });
    } catch (error) {
      console.error('Error deleting recruiter:', error);
      Toast.fire({ icon: 'error', title: 'Failed to delete recruiter from database.' });
      setRecruiters(recruiters); // revert on failure
    }
  };

  if (isLoading) {
    return <Loader theme="light" text="Loading Settings..." />;
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Recruiters Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the recruiter logos displayed on the home page.</p>
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
              <RecruitersPreview previewData={{
                recruiters, showRecruiters
              }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        
        {/* Recruiters Builder */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#566A7F]">Recruiter Logos</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showRecruiters} onChange={(e) => setShowRecruiters(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Recruiters Section</span>
              </label>
            </div>
            <button
              onClick={handleAddRecruiter}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Recruiter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruiters.map((item) => (
              <div key={item.id || item._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex gap-4 relative group">
                <button
                  onClick={() => handleDeleteRecruiter(item.id || item._id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Recruiter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-32 shrink-0">
                  <LogoUploader
                    currentLogoUrl={item.logo || 'https://via.placeholder.com/300x150?text=No+Logo'}
                    onUploadSuccess={(url) => handleUpdateRecruiter(item.id || item._id, 'logo', url)}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'name', e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            ))}
            
            {recruiters.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No recruiters added yet. Click "Add Recruiter" to create one.
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

export default ManageRecruiters;
