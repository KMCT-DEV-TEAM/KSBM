"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import confirmAction from '../../../utils/confirmAction';
import { Plus, Trash2, ShieldCheck, Link2 } from 'lucide-react';
import AddItemModal from './components/AddItemModal';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageCommitteesAndCellsPage = () => {
  const [formData, setFormData] = useState({
    heroHeading: '',
    heroSubtext: '',
    heroBgImage: '',
    committees: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const [newCommittee, setNewCommittee] = useState({ title: '', coordinator: '', designation: '', pdfLink: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/committees-and-cells');
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/committees-and-cells', formData);
      Toast.fire({ icon: 'success', title: 'Settings saved successfully' });
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const addCommittee = () => {
    if (!newCommittee.title || !newCommittee.coordinator) {
      return Toast.fire({ icon: 'warning', title: 'Title and Coordinator are required' });
    }
    setFormData(prev => ({
      ...prev,
      committees: [...prev.committees, newCommittee]
    }));
    setModalConfig({ isOpen: false });
    setNewCommittee({ title: '', coordinator: '', designation: '', pdfLink: '' });
  };

  const removeCommittee = (index) => {
    confirmAction({
      title: 'Remove Committee?',
      text: 'This action cannot be undone.',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(prev => ({
          ...prev,
          committees: prev.committees.filter((_, i) => i !== index)
        }));
      }
    });
  };

  const updateCommittee = (index, field, value) => {
    const updated = [...formData.committees];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, committees: updated }));
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="Committees & Cells"
        subtitle="Manage the hero section and institutional committees"
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Hero Section
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Heading</label>
            <input 
              type="text" 
              value={formData.heroHeading}
              onChange={(e) => handleChange('heroHeading', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Subtext</label>
            <textarea 
              value={formData.heroSubtext}
              onChange={(e) => handleChange('heroSubtext', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm h-24 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Background Image URL</label>
            <input 
              type="text" 
              value={formData.heroBgImage}
              onChange={(e) => handleChange('heroBgImage', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Committees List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Committees
          </h3>
          <button 
            onClick={() => setModalConfig({ isOpen: true, title: 'Add Committee' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Committee
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {formData.committees.map((committee, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-gray-50 flex gap-4">
                <div className="flex-1 space-y-3">
                  <input 
                    type="text" 
                    value={committee.title}
                    onChange={(e) => updateCommittee(idx, 'title', e.target.value)}
                    placeholder="Committee Title"
                    className="w-full p-2 border rounded-lg text-sm font-bold text-gray-800"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={committee.coordinator}
                      onChange={(e) => updateCommittee(idx, 'coordinator', e.target.value)}
                      placeholder="Coordinator Name"
                      className="w-full p-2 border rounded-lg text-sm"
                    />
                    <input 
                      type="text" 
                      value={committee.designation}
                      onChange={(e) => updateCommittee(idx, 'designation', e.target.value)}
                      placeholder="Designation"
                      className="w-full p-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={committee.pdfLink}
                      onChange={(e) => updateCommittee(idx, 'pdfLink', e.target.value)}
                      placeholder="PDF URL (optional)"
                      className="w-full p-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => removeCommittee(idx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg self-start transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {formData.committees.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No committees added yet.</p>
            )}
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Title *</label>
            <input 
              type="text" 
              value={newCommittee.title}
              onChange={(e) => setNewCommittee({...newCommittee, title: e.target.value})}
              className="w-full p-3 border rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Coordinator *</label>
            <input 
              type="text" 
              value={newCommittee.coordinator}
              onChange={(e) => setNewCommittee({...newCommittee, coordinator: e.target.value})}
              className="w-full p-3 border rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Designation</label>
            <input 
              type="text" 
              value={newCommittee.designation}
              onChange={(e) => setNewCommittee({...newCommittee, designation: e.target.value})}
              className="w-full p-3 border rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">PDF Link</label>
            <input 
              type="text" 
              value={newCommittee.pdfLink}
              onChange={(e) => setNewCommittee({...newCommittee, pdfLink: e.target.value})}
              className="w-full p-3 border rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>
          <button 
            onClick={addCommittee}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 mt-2"
          >
            Add Committee
          </button>
        </div>
      </AddItemModal>
    </div>
  );
};

export default ManageCommitteesAndCellsPage;
