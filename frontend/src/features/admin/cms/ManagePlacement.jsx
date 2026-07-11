import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import PlacementSection from '../../home/components/PlacementSection';

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
      setShowStats(data.showStats ?? true);
    } catch (error) {
      console.error('Error fetching placement settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load placement settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/placement', {
        subheading, heading, description,
        stat1Value, stat1Label, stat2Value, stat2Label,
        showSubheading, showHeading, showDescription, showStats
      });
      Toast.fire({ icon: 'success', title: 'Placement section saved successfully!' });
    } catch (error) {
      console.error('Error saving placement settings:', error);
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
      setShowStats(true);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Placement Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the text and statistics on the Placement Highlights section.</p>
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
              <Loader2 className="w-4 h-4 animate-spin text-white" />
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
              <PlacementSection previewData={{
                subheading, heading, description,
                stat1Value, stat1Label, stat2Value, stat2Label,
                showSubheading, showHeading, showDescription, showStats,
                previewDevice: previewMode
              }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">

        {/* Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Text Content</h3>
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
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Placement Highlights"
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
                placeholder="e.g. Building Careers That Matter"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Our dedicated Placement Cell equips students..."
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Statistics Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#566A7F]">Statistics Settings</h3>
            <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
              <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-semibold text-gray-500">Show Statistics Section</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-[#566A7F] mb-3 text-sm">Statistic 1 (Left)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] mb-1">Value (e.g. 99%)</label>
                  <input
                    type="text"
                    value={stat1Value}
                    onChange={(e) => setStat1Value(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] mb-1">Label (e.g. Placement Rate)</label>
                  <input
                    type="text"
                    value={stat1Label}
                    onChange={(e) => setStat1Label(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-[#566A7F] mb-3 text-sm">Statistic 2 (Right)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] mb-1">Value (e.g. 12 LPA)</label>
                  <input
                    type="text"
                    value={stat2Value}
                    onChange={(e) => setStat2Value(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#566A7F] mb-1">Label (e.g. Highest Package)</label>
                  <input
                    type="text"
                    value={stat2Label}
                    onChange={(e) => setStat2Label(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
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

export default ManagePlacement;
