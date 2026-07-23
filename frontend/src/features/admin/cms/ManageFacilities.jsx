"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2, Edit2, GripHorizontal } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import ConfirmationModal from '../../../components/ConfirmationModal';
import FacilitiesSection from '../../home/components/FacilitiesSection';
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

const ManageFacilities = () => {
  const [subheading, setSubheading] = useState('');
  const [showSubheading, setShowSubheading] = useState(true);

  const [heading, setHeading] = useState('');
  const [showHeading, setShowHeading] = useState(true);

  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(true);

  const [facilitiesList, setFacilitiesList] = useState([]);
  const [showFacilities, setShowFacilities] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  // Facility Modal State
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      const payload = {
        subheading, heading, description, facilitiesList,
        showSubheading, showHeading, showDescription, showFacilities
      };
      
      const sendUpdate = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'preview-facilities-data',
            payload
          }, '*');
        }
      };

      sendUpdate();

      const handleMessage = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'facilities') {
          sendUpdate();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPreviewModalOpen, subheading, heading, description, facilitiesList, showSubheading, showHeading, showDescription, showFacilities]);
  const [editingFacilityIndex, setEditingFacilityIndex] = useState(-1);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [draggedFacilityIndex, setDraggedFacilityIndex] = useState(null);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger', targetIndex: null });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/facilities');
      setSubheading(data.subheading || '');
      setShowSubheading(data.showSubheading ?? true);

      setHeading(data.heading || '');
      setShowHeading(data.showHeading ?? true);

      setDescription(data.description || '');
      setShowDescription(data.showDescription ?? true);

      let fetchedList = data.facilitiesList || [];
      if (fetchedList.length < 6) {
        const defaultFacilities = [
          { title: 'Smart Classrooms', image: '/assets/Images/Home/facility_1.jpg' },
          { title: 'Digital Library', image: '/assets/Images/Home/facility_2.jpg' },
          { title: 'Seminar Hall', image: '/assets/Images/Home/facility_3.jpg' },
          { title: 'Innovation Lab', image: '/assets/Images/Home/facility_4.jpg' },
          { title: 'Auditorium', image: '/assets/Images/Home/facility_5.jpg' },
          { title: 'Sports & Fitness', image: '/assets/Images/Home/facility_6.jpg' }
        ];
        const missingDefaults = defaultFacilities.filter(
          def => !fetchedList.some(fac => fac.title === def.title)
        );
        while (fetchedList.length < 6 && missingDefaults.length > 0) {
          fetchedList.push(missingDefaults.shift());
        }
      }
      setFacilitiesList(fetchedList);
      setShowFacilities(data.showFacilities ?? true);
    } catch (error) {
      console.error('Error fetching facilities settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load facilities settings.' });
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
          await api.put('/cms/facilities', {
            subheading, heading, description, facilitiesList,
            showSubheading, showHeading, showDescription, showFacilities
          });
          Toast.fire({ icon: 'success', title: 'Facilities section saved successfully!' });
        } catch (error) {
          console.error('Error saving facilities settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const openAddFacilityModal = () => {
    setEditingFacilityIndex(-1);
    setCurrentFacility({ title: '', image: '' });
    setIsFacilityModalOpen(true);
  };

  const openEditFacilityModal = (index) => {
    setEditingFacilityIndex(index);
    setCurrentFacility({ ...facilitiesList[index] });
    setIsFacilityModalOpen(true);
  };

  const closeFacilityModal = () => {
    setIsFacilityModalOpen(false);
    setCurrentFacility(null);
  };

  const saveFacilityFromModal = async () => {
    if (!currentFacility.title) {
      Toast.fire({ icon: 'error', title: 'Title is required' });
      return;
    }
    await confirmAction({
      title: editingFacilityIndex === -1 ? 'Add Facility?' : 'Update Facility?',
      message: 'Are you sure you want to save these changes to the facility?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        const newList = [...facilitiesList];
        
        const defaultImage = editingFacilityIndex >= 0 && editingFacilityIndex < 6 
          ? `/assets/Images/Home/facility_${editingFacilityIndex + 1}.jpg` 
          : '';
        const finalImage = currentFacility.image || defaultImage;
        const facilityToSave = { ...currentFacility, image: finalImage };

        if (editingFacilityIndex === -1) {
          newList.push(facilityToSave);
        } else {
          newList[editingFacilityIndex] = facilityToSave;
        }
        setFacilitiesList(newList);
        closeFacilityModal();
      }
    });
  };

  const confirmRemoveFacility = (index) => {
    setConfirmModal({
      isOpen: true,
      action: 'remove_facility',
      title: 'Remove Facility?',
      message: 'Are you sure you want to remove this facility? This cannot be undone unless you cancel without saving.',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      targetIndex: index
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setSubheading('College Facilities');
        setShowSubheading(true);
        setHeading('Institutional Resources');
        setShowHeading(true);
        setDescription('Our state-of-the-art campus offers modern classrooms, advanced learning resources, and vibrant student spaces that create an inspiring environment for academic excellence and professional growth.');
        setShowDescription(true);
        setFacilitiesList([
          { title: 'Smart Classrooms', image: '/assets/Images/Home/facility_1.jpg' },
          { title: 'Digital Library', image: '/assets/Images/Home/facility_2.jpg' },
          { title: 'Seminar Hall', image: '/assets/Images/Home/facility_3.jpg' },
          { title: 'Innovation Lab', image: '/assets/Images/Home/facility_4.jpg' },
          { title: 'Auditorium', image: '/assets/Images/Home/facility_5.jpg' },
          { title: 'Sports & Fitness', image: '/assets/Images/Home/facility_6.jpg' }
        ]);
        setShowFacilities(true);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'remove_facility') {
      const targetFacility = facilitiesList[confirmModal.targetIndex];
      
      // Physically delete the image file if it exists
      if (targetFacility && targetFacility.image) {
        try {
          await api.delete('/upload', { data: { fileUrl: targetFacility.image }, hideLoader: true });
        } catch (error) {
          console.error('Failed to delete physical facility image:', error);
        }
      }

      let updated = facilitiesList.filter((_, i) => i !== confirmModal.targetIndex);
      
      if (updated.length < 6) {
        const defaultFacilities = [
          { title: 'Smart Classrooms', image: '/assets/Images/Home/facility_1.jpg' },
          { title: 'Digital Library', image: '/assets/Images/Home/facility_2.jpg' },
          { title: 'Seminar Hall', image: '/assets/Images/Home/facility_3.jpg' },
          { title: 'Innovation Lab', image: '/assets/Images/Home/facility_4.jpg' },
          { title: 'Auditorium', image: '/assets/Images/Home/facility_5.jpg' },
          { title: 'Sports & Fitness', image: '/assets/Images/Home/facility_6.jpg' }
        ];
        
        const missingDefaults = defaultFacilities.filter(
          def => !updated.some(fac => fac.title === def.title)
        );
        
        while (updated.length < 6 && missingDefaults.length > 0) {
          updated.push(missingDefaults.shift());
        }
      }

      setFacilitiesList(updated);
    }
      setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleDragStart = (e, index) => {
    setDraggedFacilityIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedFacilityIndex === null || draggedFacilityIndex === index) return;
    
    const newList = [...facilitiesList];
    const draggedItem = newList[draggedFacilityIndex];
    
    newList.splice(draggedFacilityIndex, 1);
    newList.splice(index, 0, draggedItem);
    
    setFacilitiesList(newList);
    setDraggedFacilityIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedFacilityIndex(null);
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Facilities Settings"
        description="Manage the text and images on the College Facilities section."
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
              <iframe 
                ref={iframeRef}
                src="/preview/facilities"
                className="w-full h-full border-0"
                title="Facilities Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">

        {/* Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Text Content</h3>
          <div className="grid grid-cols-1 gap-6">
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
                maxLength={30}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. College Facilities"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{subheading.length}/30</div>
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
                maxLength={40}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Institutional Resources"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{heading.length}/40</div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Description</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showDescription} onChange={(e) => setShowDescription(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <textarea
                value={description}
                maxLength={150}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Our state-of-the-art campus offers modern classrooms..."
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{description.length}/150</div>
            </div>
          </div>
        </div>

        {/* Facilities List Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Facilities List</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showFacilities} onChange={(e) => setShowFacilities(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Facilities Grid</span>
              </label>
            </div>
            <button
              onClick={openAddFacilityModal}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Facility
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilitiesList.map((facility, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-grab active:cursor-grabbing relative ${draggedFacilityIndex === index ? 'opacity-50 border-primary border-dashed bg-primary/5' : 'border-gray-200'}`}
              >
                {/* Drag Handle Icon */}
                <div className="absolute top-2 left-2 z-10 bg-white/80 p-1.5 rounded-md text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-grab">
                  <GripHorizontal className="w-4 h-4" />
                </div>

                {/* Facility Header Image / Placeholder */}
                <div className="h-32 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {facility.image ? (
                    <img src={facility.image} alt={facility.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest font-semibold">
                      No Image
                    </div>
                  )}
                </div>

                {/* Facility Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-[#566A7F] text-lg mb-1">{facility.title || '(Untitled Facility)'}</h4>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditFacilityModal(index)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => confirmRemoveFacility(index)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {facilitiesList.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No facilities added yet.</p>
                <button
                  onClick={openAddFacilityModal}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Click here to add your first facility
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Facility Add/Edit Modal */}
      {isFacilityModalOpen && currentFacility && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#1e2869]">
                {editingFacilityIndex === -1 ? 'Add New Facility' : 'Edit Facility'}
              </h2>
              <button
                onClick={closeFacilityModal}
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
                    value={currentFacility.title}
                    maxLength={25}
                    onChange={(e) => setCurrentFacility({ ...currentFacility, title: e.target.value })}
                    placeholder="e.g. Smart Classrooms"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-xs text-right mt-1 text-gray-500">{(currentFacility.title || '').length}/25</div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Facility Image</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                    {(() => {
                      const isDefaultCard = editingFacilityIndex >= 0 && editingFacilityIndex < 6;
                      const defaultImage = isDefaultCard 
                        ? `/assets/Images/Home/facility_${editingFacilityIndex + 1}.jpg` 
                        : '';
                      return (
                        <LogoUploader
                          currentLogoUrl={currentFacility.image || defaultImage}
                          onUploadSuccess={(url) => setCurrentFacility({ ...currentFacility, image: url })}
                          uploadEndpoint="/upload/home"
                          disableDelete={!currentFacility.image || (isDefaultCard ? currentFacility.image === defaultImage : true)}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeFacilityModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveFacilityFromModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Facility
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ManageFacilities;

