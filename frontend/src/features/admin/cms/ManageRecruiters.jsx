"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2, ArrowUp, ArrowDown, Award, Globe, Briefcase, Tag } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AdminSkeleton from './components/AdminSkeleton';
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

const defaultRecruiterSettings = [
  { id: '1', name: 'Infosys', logo: '/assets/Images/Home/infosys_logo.svg' },
  { id: '2', name: 'Wipro', logo: '/assets/Images/Home/wipro_logo.svg' },
  { id: '3', name: 'Cognizant', logo: '/assets/Images/Home/cognizant_logo.svg' },
  { id: '4', name: 'Google', logo: '/assets/Images/Home/google_logo.svg' },
  { id: '5', name: 'Microsoft', logo: '/assets/Images/Home/microsoft_logo.svg' }
];

const defaultLogoMap = {
  'Infosys': '/assets/Images/Home/infosys_logo.svg',
  'Wipro': '/assets/Images/Home/wipro_logo.svg',
  'Cognizant': '/assets/Images/Home/cognizant_logo.svg',
  'Google': '/assets/Images/Home/google_logo.svg',
  'Microsoft': '/assets/Images/Home/microsoft_logo.svg'
};

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [showRecruiters, setShowRecruiters] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState({ name: '', logo: '', logoFile: null });
  const iframeRef = React.useRef(null);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = { recruiters, showRecruiters };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'recruiters' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-recruiters-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-recruiters-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, recruiters, showRecruiters]);

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
          const finalRecruiters = await Promise.all(recruiters.map(async (item) => {
            let newItem = { ...item };
            if (newItem.logoFile) {
              const url = await uploadFile(newItem.logoFile);
              newItem.logo = url;
              delete newItem.logoFile;
            }
            return newItem;
          }));

          await api.put('/cms/recruiters', {
            recruiters: finalRecruiters, showRecruiters
          });
          
          await executeDeletions();
          setRecruiters(finalRecruiters);
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
      message: 'This will reset all your settings and save them immediately.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        const newDefaults = defaultRecruiterSettings.map(item => ({ ...item, id: Date.now().toString() + Math.random().toString().slice(2, 6) }));
        setRecruiters(newDefaults);
        setShowRecruiters(true);
        
        setIsSaving(true);
        try {
          await api.put('/cms/recruiters', {
            recruiters: newDefaults, showRecruiters: true
          });
          Toast.fire({ icon: 'success', title: 'Settings reset to default and saved.' });
        } catch (error) {
          console.error('Error saving recruiters settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save defaults.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleAddRecruiter = () => {
    setNewRecruiter({ name: '', logo: '', logoFile: null });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = async () => {
    setIsAddModalOpen(false);
  };

  const handleConfirmAddRecruiter = async () => {
    await confirmAction({
      title: 'Add Recruiter?',
      message: `Are you sure you want to add ${newRecruiter.name || 'this company'} to the recruiters list?`,
      confirmText: 'Yes, add it!',
      variant: 'primary',
      action: async () => {
        const addedRecruiter = {
          id: Date.now().toString(),
          name: newRecruiter.name,
          logo: newRecruiter.logo,
          logoFile: newRecruiter.logoFile
        };
        const updatedRecruiters = [...recruiters, addedRecruiter];
        setRecruiters(updatedRecruiters);
        
        Toast.fire({ icon: 'info', title: 'Recruiter added locally. Click Save Changes to apply.' });
        setIsAddModalOpen(false);
      }
    });
  };

  const handleUpdateRecruiter = (id, field, value, file = null) => {
    if (file) {
      const oldItem = recruiters.find(i => (i.id === id || i._id === id));
      if (oldItem && oldItem[field]) markForDeletion(oldItem[field]);
    } else if (value === '') {
      const oldItem = recruiters.find(i => (i.id === id || i._id === id));
      if (oldItem && oldItem[field]) markForDeletion(oldItem[field]);
    }

    setRecruiters(recruiters.map(item => 
      (item.id === id || item._id === id) ? { ...item, [field]: value, [`${field}File`]: file } : item
    ));
  };

  const handleMoveRecruiter = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= recruiters.length) return;
    const updated = [...recruiters];
    const [removed] = updated.splice(index, 1);
    updated.splice(newIndex, 0, removed);
    setRecruiters(updated);
  };

  const handleDeleteRecruiter = async (id, name) => {
    await confirmAction({
      title: 'Remove Recruiter?',
      message: `Are you sure you want to remove ${name || 'this recruiter'}?`,
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const recruiterToDelete = recruiters.find(item => item.id === id || item._id === id);
        if (recruiterToDelete && recruiterToDelete.logo) {
          markForDeletion(recruiterToDelete.logo);
        }

        let updatedRecruiters = recruiters.filter(item => item.id !== id && item._id !== id);
        
        if (updatedRecruiters.length < 5) {
          const missingCount = 5 - updatedRecruiters.length;
          const defaultsToAdd = defaultRecruiterSettings
            .filter(d => !updatedRecruiters.some(r => r.name === d.name))
            .slice(0, missingCount)
            .map(item => ({ ...item, id: Date.now().toString() + Math.random().toString().slice(2, 6) }));
          
          updatedRecruiters = [...updatedRecruiters, ...defaultsToAdd];
        }
        
        setRecruiters(updatedRecruiters);
        Toast.fire({ icon: 'info', title: 'Recruiter removed locally. Click Save Changes to apply.' });
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    // Needed for Firefox
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newRecruiters = [...recruiters];
    const draggedItem = newRecruiters[draggedIndex];
    
    newRecruiters.splice(draggedIndex, 1);
    newRecruiters.splice(targetIndex, 0, draggedItem);
    
    setRecruiters(newRecruiters);
    setDraggedIndex(null);
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Recruiters Settings"
        description="Manage corporate partners and logos."
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
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center items-center">
            <div className={`bg-white shadow-xl h-full transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe 
                ref={iframeRef}
                src="/preview/recruiters"
                className="w-full h-full border-0 min-h-[500px]"
                title="Recruiters Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        
        {/* Recruiters Builder */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Recruiter Cards & Placement Highlights</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showRecruiters} onChange={(e) => setShowRecruiters(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Recruiters Section</span>
              </label>
            </div>
            <button
              onClick={handleAddRecruiter}
              className="flex items-center gap-2 text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Add Recruiter Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recruiters.map((item, idx) => (
              <div 
                key={item.id || item._id || idx} 
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`p-5 border border-gray-200 rounded-xl bg-gray-50 flex flex-col gap-4 relative group hover:border-primary/30 transition-all cursor-move ${draggedIndex === idx ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''}`}
              >
                
                {/* Reorder and Delete Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => handleMoveRecruiter(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors bg-white/80 backdrop-blur-sm rounded border border-gray-200 cursor-pointer shadow-sm"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveRecruiter(idx, 1)}
                    disabled={idx === recruiters.length - 1}
                    className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors bg-white/80 backdrop-blur-sm rounded border border-gray-200 cursor-pointer shadow-sm"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRecruiter(item.id || item._id, item.name)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white/80 backdrop-blur-sm hover:bg-red-50 rounded border border-gray-200 cursor-pointer ml-1 shadow-sm"
                    title="Remove Recruiter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Top: Logo Upload & Image */}
                <div className="w-full shrink-0 flex flex-col">
                  <LogoUploader
                    currentLogoUrl={item.logo || defaultLogoMap[item.name] || 'https://via.placeholder.com/300x150?text=No+Logo'}
                    onUploadSuccess={(url, file) => handleUpdateRecruiter(item.id || item._id, 'logo', url, file)}
                    uploadEndpoint="/upload/home"
                    deferredMode={true}
                    disableDelete={true}
                  />
                </div>

                {/* Bottom: Company Name */}
                <div className="w-full mt-2">
                  <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={item.name}
                    maxLength={20}
                    onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'name', e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-xs text-right mt-1 text-gray-500">{(item.name || '').length}/20</div>
                </div>

              </div>
            ))}
            
            {recruiters.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                No recruiters added yet. Click "Add Recruiter Card" to create one.
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1e2869]">Add New Recruiter</h3>
              <button onClick={handleCloseAddModal} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newRecruiter.name}
                  maxLength={20}
                  onChange={(e) => setNewRecruiter({ ...newRecruiter, name: e.target.value })}
                  placeholder="e.g. Amazon"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <div className="text-xs text-right mt-1 text-gray-500">{(newRecruiter.name || '').length}/20</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Logo <span className="text-red-500">*</span></label>
                <LogoUploader
                  currentLogoUrl={newRecruiter.logo}
                  onUploadSuccess={(url, file) => setNewRecruiter({ ...newRecruiter, logo: url, logoFile: file })}
                  uploadEndpoint="/upload/home"
                  layout="vertical"
                  deferredMode={true}
                  disableDelete={true}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={handleCloseAddModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddRecruiter}
                disabled={!newRecruiter.name.trim() || !newRecruiter.logo}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Add Recruiter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecruiters;
