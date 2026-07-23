"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2, Edit2, GripHorizontal } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import ConfirmationModal from '../../../components/ConfirmationModal';
import PlacementSection from '../../home/components/PlacementSection';
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

const ManagePlacement = () => {
  const [subheading, setSubheading] = useState('');
  const [showSubheading, setShowSubheading] = useState(true);

  const [heading, setHeading] = useState('');
  const [showHeading, setShowHeading] = useState(true);

  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(true);

  const [stat1Value, setStat1Value] = useState('');
  const [stat1Label, setStat1Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [showStats, setShowStats] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [statistics, setStatistics] = useState([]);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [currentStat, setCurrentStat] = useState({ value: '', label: '' });
  const [editStatIndex, setEditStatIndex] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/placement');
      setSubheading(data.subheading || '');
      setShowSubheading(data.showSubheading ?? true);
      
      setHeading(data.heading || '');
      setShowHeading(data.showHeading ?? true);
      
      setDescription(data.description || '');
      setShowDescription(data.showDescription ?? true);

      setStat1Value(data.stat1Value || '');
      setStat1Label(data.stat1Label || '');
      setStat2Value(data.stat2Value || '');
      setStat2Label(data.stat2Label || '');
      setStatistics(data.statistics || (data.stat1Value || data.stat2Value ? [{value: data.stat1Value, label: data.stat1Label}, {value: data.stat2Value, label: data.stat2Label}].filter(s => s.value) : []));
      setShowStats(data.showStats ?? true);
    } catch (error) {
      console.error('Error fetching placement settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load placement settings.' });
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
      await api.put('/cms/placement', {
        subheading, heading, description,
        stat1Value, stat1Label, stat2Value, stat2Label, statistics,
        showSubheading, showHeading, showDescription, showStats
      });
      Toast.fire({ icon: 'success', title: 'Placement section saved successfully!' });
    } catch (error) {
      console.error('Error saving placement settings:', error);
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
      setSubheading('Placement Highlights');
      setShowSubheading(true);
      setHeading('Building Careers That Matter');
      setShowHeading(true);
      setDescription('Our dedicated Placement Cell equips students with the skills, confidence, and industry exposure needed to excel in the corporate world. Through strategic industry partnerships, career guidance, and recruitment opportunities, we help transform academic potential into professional success.');
      setShowDescription(true);
      setStat1Value('99%');
      setStat1Label('Placement Rate');
      setStat2Value('12 LPA');
      setStat2Label('Highest Package');
      setStatistics([
        { value: '99%', label: 'Placement Rate' },
        { value: '12 LPA', label: 'Highest Package' }
      ]);
      setShowStats(true);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const openAddStatModal = () => {
    setCurrentStat({ value: '', label: '' });
    setEditStatIndex(null);
    setIsStatModalOpen(true);
  };

  const openEditStatModal = (index, stat) => {
    setCurrentStat({ ...stat });
    setEditStatIndex(index);
    setIsStatModalOpen(true);
  };

  const handleSaveStatistic = () => {
    if (editStatIndex === null && statistics.length >= 4) return;
    if (currentStat.value && currentStat.label) {
      confirmAction({
        title: editStatIndex !== null ? 'Update Statistic?' : 'Add Statistic?',
        message: `Are you sure you want to ${editStatIndex !== null ? 'update' : 'add'} this statistic?`,
        confirmText: `Yes, ${editStatIndex !== null ? 'update' : 'add'} it!`,
        variant: 'primary',
        action: () => {
          if (editStatIndex !== null) {
            const newStats = [...statistics];
            newStats[editStatIndex] = currentStat;
            setStatistics(newStats);
          } else {
            setStatistics([...statistics, currentStat]);
          }
          setCurrentStat({ value: '', label: '' });
          setEditStatIndex(null);
          setIsStatModalOpen(false);
          Toast.fire({ icon: 'success', title: `Statistic ${editStatIndex !== null ? 'updated' : 'added'} locally.` });
        }
      });
    }
  };

  const handleRemoveStatistic = (index) => {
    confirmAction({
      title: 'Remove Statistic?',
      message: 'Are you sure you want to remove this statistic?',
      confirmText: 'Yes, remove it!',
      variant: 'danger',
      action: () => {
        const newStats = [...statistics];
        newStats.splice(index, 1);
        setStatistics(newStats);
        Toast.fire({ icon: 'success', title: 'Statistic removed locally.' });
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newStats = [...statistics];
    const draggedItem = newStats[draggedItemIndex];
    
    newStats.splice(draggedItemIndex, 1);
    newStats.splice(index, 0, draggedItem);
    
    setStatistics(newStats);
    setDraggedItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Placement Settings"
        description="Manage the text and statistics on the Placement Highlights section."
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
              <PlacementSection previewData={{
                subheading, heading, description,
                stat1Value, stat1Label, stat2Value, stat2Label, statistics,
                showSubheading, showHeading, showDescription, showStats,
                previewDevice: previewMode
              }} />
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
                maxLength={50}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Placement Highlights"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{subheading.length}/50 letters</p>
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
                maxLength={100}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Building Careers That Matter"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{heading.length}/100 letters</p>
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
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Our dedicated Placement Cell equips students..."
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/500 letters</p>
            </div>
          </div>
        </div>

        {/* Statistics Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1e2869]">Statistics Settings</h3>
            <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
              <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-semibold text-gray-500">Show Statistics Section</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics.map((stat, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-5 rounded-xl border relative group flex flex-col justify-center items-center text-center shadow-sm cursor-grab active:cursor-grabbing transition-all ${draggedItemIndex === index ? 'opacity-50 border-primary border-dashed bg-primary/5' : 'bg-gray-50 border-gray-100 hover:border-gray-300'}`}
              >
                <div className="absolute top-2 left-2 text-gray-300 group-hover:text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripHorizontal className="w-5 h-5" />
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditStatModal(index, stat)}
                    className="p-1.5 bg-white text-blue-500 rounded-md shadow-sm hover:bg-blue-50"
                    title="Edit Statistic"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRemoveStatistic(index)}
                    className="p-1.5 bg-white text-red-500 rounded-md shadow-sm hover:bg-red-50"
                    title="Remove Statistic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-3xl text-[#1e2869] mb-1 font-serif">{stat.value}</h4>
                <p className="text-xs font-semibold text-[#566A7F] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
            
            {statistics.length < 4 && (
              <div 
                onClick={openAddStatModal}
                className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-sm text-[#1e2869]">Add New Statistic</span>
                <p className="text-xs text-gray-400 mt-1 text-center">Max 4 statistics allowed</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Add/Edit Statistic Modal */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1e2869]">{editStatIndex !== null ? 'Edit Statistic' : 'Add New Statistic'}</h3>
              <button 
                onClick={() => setIsStatModalOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Value (e.g. 50+)</label>
                <input
                  type="text"
                  value={currentStat.value}
                  maxLength={10}
                  onChange={(e) => setCurrentStat({ ...currentStat, value: e.target.value })}
                  placeholder="Enter value"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5 text-right">{currentStat.value?.length || 0}/10 letters</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Label (e.g. Companies Visited)</label>
                <input
                  type="text"
                  value={currentStat.label}
                  maxLength={20}
                  onChange={(e) => setCurrentStat({ ...currentStat, label: e.target.value })}
                  placeholder="Enter label"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5 text-right">{currentStat.label?.length || 0}/20 letters</p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsStatModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatistic}
                disabled={!currentStat.value || !currentStat.label}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> Save Statistic
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

export default ManagePlacement;

