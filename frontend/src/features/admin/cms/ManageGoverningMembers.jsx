"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { uploadDeferredImage } from './utils/uploadHelper';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageGoverningMembers = () => {
  const [members, setMembers] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', title: '', image: '/assets/Images/image 31.png' });

  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = {
    previewType: 'members',
    members: members.map(m => ({
      ...m,
      image: typeof m.image === 'object' && m.image?.previewUrl ? m.image.previewUrl : m.image
    }))
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'GoverningBody', payload: previewData }, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [previewData, isPreviewModalOpen]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/governing-body');
      if (data && data.members) {
        setMembers(data.members);
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
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const newMembers = await Promise.all(members.map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/aboutus')
          })));

          await api.put('/cms/governing-body', { 
            members: newMembers 
          }, { hideLoader: true });
          
          setMembers(newMembers);
          
          Toast.fire({ icon: 'success', title: 'Members saved successfully!' });
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
        setMembers([
          { name: "Dr. Navas K M", title: "Managing Trustee", image: "/assets/Images/image 31.png" }
        ]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };
  
  const handleAddMemberSubmit = () => {
    if (!newMember.name || !newMember.title) {
      Toast.fire({ icon: 'warning', title: 'Please fill name and title fields' });
      return;
    }
    setMembers([...members, newMember]);
    setNewMember({ name: '', title: '', image: '/assets/Images/image 31.png' });
    setIsAddModalOpen(false);
  };

  const removeMember = async (index) => {
    await confirmAction({
      title: 'Remove Member?',
      message: 'Are you sure you want to remove this member? This action cannot be undone.',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        const member = members[index];
        if (member.image && !member.image.startsWith('blob:') && !member.image.startsWith('http') && member.image !== '/assets/Images/image 31.png') {
          try {
            const filename = member.image.split('/').pop();
            await api.delete(`/upload/aboutus/${filename}`);
          } catch (error) {
            console.error('Failed to delete old image:', error);
          }
        }
        setMembers(members.filter((_, i) => i !== index));
        Toast.fire({ icon: 'success', title: 'Member removed' });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full relative">
      <PageHeader
        title="Governing Body Members"
        description="Manage the members displayed in the Governing Body section."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        {/* Members Section */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1e2869]">Governing Body Members</h3>
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative group">
                <button 
                  onClick={() => removeMember(index)} 
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded-md transition-all border border-transparent hover:border-red-500 z-10 bg-white shadow-sm"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-10">
                  <div>
                    <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Name</label>
                      
</div>
<input type="text" maxLength={50} value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
<div className="text-right text-xs text-gray-400 mt-1">{member.name.length}/50 characters</div>
                  </div>
                  <div>
                    <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Title</label>
                      
</div>
<input type="text" maxLength={50} value={member.title} onChange={(e) => updateMember(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
<div className="text-right text-xs text-gray-400 mt-1">{member.title.length}/50 characters</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Member Image</label>
                    <SingleImageUploader 
                      imageUrl={member.image} 
                      uploadEndpoint="/upload/aboutus"
                      defaultImage="/assets/Images/image 31.png"
                      onUploadComplete={(urlObj) => updateMember(index, 'image', urlObj)}
                      onUploadStateChange={setIsUploading}
                      label="Upload Profile Image"
                      deferredUpload={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {members.length === 0 && <p className="text-gray-500 text-sm italic mt-4">No members added yet.</p>}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1e2869]">Add New Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Name</label>
                  
</div>
<input 
                  type="text" 
                  maxLength={50}
                  value={newMember.name} 
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. Dr. John Doe" 
                />
<div className="text-right text-xs text-gray-400 mt-1">{newMember.name.length}/50 characters</div>
              </div>
              <div>
                <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Title</label>
                  
</div>
<input 
                  type="text" 
                  maxLength={50}
                  value={newMember.title} 
                  onChange={(e) => setNewMember({ ...newMember, title: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. CHAIRMAN" 
                />
<div className="text-right text-xs text-gray-400 mt-1">{newMember.title.length}/50 characters</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Member Image</label>
                <SingleImageUploader 
                  imageUrl={newMember.image} 
                  uploadEndpoint="/upload/aboutus"
                  defaultImage="/assets/Images/image 31.png"
                  onUploadComplete={(urlObj) => setNewMember({...newMember, image: urlObj})}
                  onUploadStateChange={setIsUploading}
                  label="Upload Profile Image"
                  deferredUpload={true}
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMemberSubmit}
                disabled={isUploading || !newMember.name || !newMember.title}
                className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-[#151c48] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>
          </div>
        </div>
      )}

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
                src="/preview/cms"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGoverningMembers;
