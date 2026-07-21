"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Plus, Trash2, ArrowUp, ArrowDown, Award, Globe, Briefcase, Tag } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Loader from '../../../components/Loader';
import RecruitersPreview from '../../home/components/RecruitersSection';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

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
  { id: '1', name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', category: 'IT & Tech', package: '18.5 LPA Highest', badge: 'Day-1 Recruiter', website: 'https://www.infosys.com/careers' },
  { id: '2', name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', category: 'IT & Tech', package: '16.0 LPA CTC', badge: 'Global Partner', website: 'https://careers.wipro.com' },
  { id: '3', name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', category: 'Consulting & Finance', package: '20.0 LPA CTC', badge: 'Super Dream', website: 'https://careers.cognizant.com' },
  { id: '4', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', category: 'Core & Strategy', package: '28.0 LPA Highest', badge: 'Top Global Recruiter', website: 'https://careers.google.com' },
  { id: '5', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', category: 'IT & Tech', package: '25.0 LPA CTC', badge: 'Super Dream', website: 'https://careers.microsoft.com' }
];

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
        setRecruiters(defaultRecruiterSettings.map(item => ({ ...item, id: Date.now().toString() + Math.random().toString().slice(2, 6) })));
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
        logo: '',
        category: 'IT & Tech',
        package: '15.0 LPA CTC',
        badge: 'Global Partner',
        website: 'https://www.google.com'
      }
    ]);
  };

  const handleUpdateRecruiter = (id, field, value) => {
    setRecruiters(recruiters.map(item => 
      (item.id === id || item._id === id) ? { ...item, [field]: value } : item
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
      <PageHeader
        title="Recruiters Settings"
        description="Manage corporate partners, placement statistics, categories, and packages."
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

          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <RecruitersPreview previewData={{
                recruiters, showRecruiters
              }} />
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
              className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Recruiter Card
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {recruiters.map((item, idx) => (
              <div key={item.id || item._id || idx} className="p-5 border border-gray-200 rounded-xl bg-gray-50 flex flex-col md:flex-row gap-6 relative group hover:border-primary/30 transition-all">
                
                {/* Reorder and Delete Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveRecruiter(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors bg-white rounded border border-gray-200 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveRecruiter(idx, 1)}
                    disabled={idx === recruiters.length - 1}
                    className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors bg-white rounded border border-gray-200 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRecruiter(item.id || item._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 rounded border border-gray-200 cursor-pointer ml-1"
                    title="Remove Recruiter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Left: Logo Upload */}
                <div className="w-full md:w-36 shrink-0 flex flex-col items-center">
                  <LogoUploader
                    currentLogoUrl={item.logo || 'https://via.placeholder.com/300x150?text=No+Logo'}
                    onUploadSuccess={(url) => handleUpdateRecruiter(item.id || item._id, 'logo', url)}
                  />
                </div>

                {/* Right: Fields Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 md:pt-0">
                  <div>
                    <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'name', e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Category
                    </label>
                    <select
                      value={item.category || 'IT & Tech'}
                      onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'category', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="IT & Tech">IT & Tech</option>
                      <option value="Consulting & Finance">Consulting & Finance</option>
                      <option value="Operations & Strategy">Operations & Strategy</option>
                      <option value="Core & Analytics">Core & Analytics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Package / CTC Highlight
                    </label>
                    <input
                      type="text"
                      value={item.package || ''}
                      onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'package', e.target.value)}
                      placeholder="e.g. 24 LPA Highest"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-blue-600" /> Placement Badge
                    </label>
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'badge', e.target.value)}
                      placeholder="e.g. Super Dream"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block text-xs font-bold text-[#566A7F] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" /> Official Website / Careers URL
                    </label>
                    <input
                      type="url"
                      value={item.website || ''}
                      onChange={(e) => handleUpdateRecruiter(item.id || item._id, 'website', e.target.value)}
                      placeholder="https://careers.google.com"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
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
    </div>
  );
};

export default ManageRecruiters;
