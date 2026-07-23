"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ManagementPreview from '../../home/components/ManagementSection';
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

const ManageManagement = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = React.useRef(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/management');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      setDescription(data.description || '');
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching management settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load management settings.' });
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
      await api.put('/cms/management', {
        subheading, heading, description, members
      });
      Toast.fire({ icon: 'success', title: 'Management section saved successfully!' });
    } catch (error) {
      console.error('Error saving management settings:', error);
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
      setSubheading('OUR MANAGEMENT');
      setHeading('The Architects Of Excellence');
      setDescription('Our leadership board combines decades of top-tier industry experience with a profound commitment to academic innovation.');
      setMembers([
        {
          id: '1',
          name: 'Dr. Sarah Mitchell',
          role: 'MANAGING DIRECTOR',
          verticalText: 'DIRECTOR',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          name: 'Dr. Adrian Starlin',
          role: 'CHAIRMAN DIRECTOR',
          verticalText: 'CHAIRMAN',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '3',
          name: 'Dr. Elena Rostova',
          role: 'EXECUTIVE DIRECTOR',
          verticalText: 'EXECUTIVE',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
      ]);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: 'New Member',
        role: 'ROLE',
        verticalText: 'TEXT',
        image: ''
      }
    ]);
  };

  const handleUpdateMember = (id, field, value) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleDeleteMember = async (id) => {
    const memberToDelete = members.find(member => member.id === id);
    const deletedImageUrl = memberToDelete?.image;

    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
    
    try {
      await api.put('/cms/management', {
        subheading, heading, description, members: updatedMembers
      });

      if (deletedImageUrl) {
        try {
          await api.delete('/upload', { data: { fileUrl: deletedImageUrl } });
        } catch (deleteErr) {
          console.error('Failed to delete physical image file:', deleteErr);
        }
      }

      Toast.fire({ icon: 'success', title: 'Member deleted from database.' });
    } catch (error) {
      console.error('Error deleting member:', error);
      Toast.fire({ icon: 'error', title: 'Failed to delete member from database.' });
      setMembers(members); // revert on failure
    }
  };

  
  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        subheading, heading, description, members,
        previewDevice: previewMode
      };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'management' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-management-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-management-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, subheading, heading, description, members]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Management Settings"
        description="Manage the leadership board and management section."
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
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center p-4">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-full ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe 
                ref={iframeRef}
                src="/preview/management"
                className="w-full h-full border-0"
                title="Management Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Header Content</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subheading</label>
              <input
                type="text"
                value={subheading}
                maxLength={30}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. OUR MANAGEMENT"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{subheading.length}/30</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Main Heading</label>
              <input
                type="text"
                value={heading}
                maxLength={40}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. The Architects Of Excellence"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{heading.length}/40</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={description}
                maxLength={150}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Our leadership board combines decades of top-tier industry experience..."
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{description.length}/150</div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1e2869]">Management Members</h3>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={member.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-6 relative group">                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      maxLength={40}
                      onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                      placeholder="e.g. Dr. Sarah Mitchell"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-right mt-1 text-gray-500">{member.name.length}/40</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Role</label>
                    <input
                      type="text"
                      value={member.role}
                      maxLength={40}
                      onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                      placeholder="e.g. MANAGING DIRECTOR"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-right mt-1 text-gray-500">{member.role.length}/40</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Vertical Text</label>
                    <input
                      type="text"
                      value={member.verticalText}
                      maxLength={15}
                      onChange={(e) => handleUpdateMember(member.id, 'verticalText', e.target.value)}
                      placeholder="e.g. DIRECTOR"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-right mt-1 text-gray-500">{member.verticalText.length}/15</div>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Profile Image</label>
                  <LogoUploader
                    currentLogoUrl={member.image || `/assets/Images/Home/management_${index + 1}.jpg`}
                    onUploadSuccess={(url) => handleUpdateMember(member.id, 'image', url)}
                    uploadEndpoint="/upload/home"
                    layout="horizontal"
                    disableDelete={!member.image || member.image === `/assets/Images/Home/management_${index + 1}.jpg`}
                  />
                </div>
              </div>
            ))}
            
            {members.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No management members added yet. Click "Add Member" to create one.
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

export default ManageManagement;

